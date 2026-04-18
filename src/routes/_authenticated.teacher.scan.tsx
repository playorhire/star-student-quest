import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Camera,
  CheckCircle,
  XCircle,
  RotateCcw,
  Edit,
  FileText,
} from "lucide-react";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/_authenticated/teacher/scan")({
  component: TeacherScan,
});

type ScanStep = "scanning" | "student-found" | "confirmed";
type Mode = "scan" | "manual";

function TeacherScan() {
  const { user } = useAuth();

  const [mode, setMode] = useState<Mode>("scan");
  const [step, setStep] = useState<ScanStep>("scanning");

  const [student, setStudent] = useState<any>(null);
  const [subjectsForClass, setSubjectsForClass] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [marks, setMarks] = useState("");
  const [calculatedPoints, setCalculatedPoints] = useState(0);

  const [manualQR, setManualQR] = useState("");
  const [studentsForClasses, setStudentsForClasses] = useState<any[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<any>(null);

  // 🔹 Load teacher students
  useEffect(() => {
    const load = async () => {
      const { data: teacher } = await supabase
        .from("teachers")
        .select("id, teacher_classes(class_id)")
        .eq("user_id", user?.id ?? "")
        .single();

      if (!teacher) return;

      const classIds = teacher.teacher_classes.map((c: any) => c.class_id);

      const { data: students } = await supabase
        .from("students")
        .select("*")
        .in("class_id", classIds);

      setStudentsForClasses(students || []);
    };

    load();
  }, [user]);

  // 🔹 Load student + subjects + transactions
  const loadStudentData = async (studentData: any) => {
    setStudent(studentData);

    const { data: subs } = await supabase
      .from("subjects")
      .select("id, name, point_rules(passing_marks, multiplier)")
      .eq("class_id", studentData.class_id);

    setSubjectsForClass(subs || []);

    const { data: tx } = await supabase
      .from("point_transactions")
      .select("*")
      .eq("student_id", studentData.id)
      .order("created_at", { ascending: false });

    setTransactions(tx || []);
    setStep("student-found");
  };

  // 🔹 QR handler
  const handleQRResult = useCallback(async (decodedText: string) => {
    const { data } = await supabase
      .from("students")
      .select("*")
      .eq("qr_code", decodedText)
      .single();

    if (data) loadStudentData(data);
  }, []);

  // 🔹 Marks calculation
  const getRule = () => {
    const sub = subjectsForClass.find((s) => s.id === selectedSubjectId);
    const r = sub?.point_rules?.[0];
    return r
      ? {
          passing: r.passing_marks,
          multiplier: Number(r.multiplier),
        }
      : null;
  };

  const handleMarksChange = (val: string) => {
    setMarks(val);
    const num = parseInt(val);
    const rule = getRule();

    if (rule && num >= rule.passing) {
      setCalculatedPoints((num - rule.passing) * rule.multiplier);
    } else {
      setCalculatedPoints(0);
    }
  };

  // 🔥 Assign / Update
  const handleConfirm = async () => {
    if (!student || !selectedSubjectId) return;

    const rule = getRule();
    if (!rule) return;

    const { data: teacher } = await supabase
      .from("teachers")
      .select("id")
      .eq("user_id", user?.id ?? "")
      .single();

    const payload = {
      student_id: student.id,
      teacher_id: teacher.id,
      subject_id: selectedSubjectId,
      marks_entered: parseInt(marks),
      passing_marks: rule.passing,
      multiplier: rule.multiplier,
      points_awarded: calculatedPoints,
    };

    if (isEditing && selectedTransactionId) {
      await supabase
        .from("point_transactions")
        .update(payload)
        .eq("id", selectedTransactionId);
    } else {
      await supabase.from("point_transactions").insert(payload);
    }

    confetti();
    setStep("confirmed");
    setIsEditing(false);
  };

  // 🔹 Select old transaction
  const handleTransactionSelect = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    setSelectedTransactionId(id);
    setSelectedSubjectId(tx.subject_id);
    setMarks(String(tx.marks_entered));
    setCalculatedPoints(tx.points_awarded);
    setIsEditing(true);
  };

  const handleReset = () => {
    setStep("scanning");
    setStudent(null);
    setSelectedSubjectId("");
    setMarks("");
    setCalculatedPoints(0);
    setIsEditing(false);
    setSelectedTransactionId(null);
  };

  const selectedRule = getRule();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assign Points</h1>

      {/* Mode Switch */}
      <Button
        onClick={() => {
          setMode(mode === "scan" ? "manual" : "scan");
          handleReset();
        }}
      >
        {mode === "scan" ? "Manual Mode" : "Scan Mode"}
      </Button>

      {/* Manual Select */}
      {mode === "manual" && step === "scanning" && (
        <Select onValueChange={(id) => {
          const s = studentsForClasses.find((x) => x.id === id);
          if (s) loadStudentData(s);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select Student" />
          </SelectTrigger>
          <SelectContent>
            {studentsForClasses.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Student */}
      {student && step === "student-found" && (
        <>
          <Card>
            <CardContent>
              <h2>{student.name}</h2>
              <p>Total: {student.total_points}</p>
            </CardContent>
          </Card>

          {/* Previous Transactions */}
          {transactions.length > 0 && (
            <Select onValueChange={handleTransactionSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Edit previous record" />
              </SelectTrigger>
              <SelectContent>
                {transactions.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.points_awarded} pts (Marks {t.marks_entered})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Subject */}
          <Select
            value={selectedSubjectId}
            onValueChange={(v) => setSelectedSubjectId(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjectsForClass.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Marks */}
          <Input
            type="number"
            value={marks}
            onChange={(e) => handleMarksChange(e.target.value)}
          />

          {/* Points */}
          {marks && (
            <div>
              {calculatedPoints > 0 ? (
                <div>+{calculatedPoints} points</div>
              ) : (
                <div>No points</div>
              )}
            </div>
          )}

          <Button onClick={handleConfirm}>
            {isEditing ? "Update Points" : "Assign Points"}
          </Button>

          <Button onClick={handleReset}>Reset</Button>
        </>
      )}

      {step === "confirmed" && (
        <div>
          <h2>✅ Points Saved</h2>
          <Button onClick={handleReset}>Next</Button>
        </div>
      )}
    </div>
  );
}

export default TeacherScan;