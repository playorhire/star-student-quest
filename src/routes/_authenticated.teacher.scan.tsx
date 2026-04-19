import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/_authenticated/teacher/scan")({
  component: TeacherScan,
});

type ScanStep = "scanning" | "student-found" | "confirmed";

function TeacherScan() {
  const { user } = useAuth();

  const [step, setStep] = useState<ScanStep>("scanning");
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [student, setStudent] = useState<any>(null);
  const [subjectsForClass, setSubjectsForClass] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [marks, setMarks] = useState("");
  const [calculatedPoints, setCalculatedPoints] = useState(0);

  const [studentsForClasses, setStudentsForClasses] = useState<any[]>([]);
  const [manualCode, setManualCode] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  // Load teacher + their assigned class students
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data: teacher } = await supabase
        .from("teachers")
        .select("id, teacher_assignments(class_id)")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!teacher) return;
      setTeacherId(teacher.id);

      const classIds = (teacher.teacher_assignments ?? []).map((c: any) => c.class_id);
      if (classIds.length === 0) {
        setStudentsForClasses([]);
        return;
      }

      const { data: students } = await supabase
        .from("students")
        .select("*")
        .in("class_id", classIds);

      setStudentsForClasses(students || []);
    };
    load();
  }, [user]);

  const loadStudentData = useCallback(async (studentData: any) => {
    setStudent(studentData);

    const { data: subs } = await supabase
      .from("subjects")
      .select("id, name, point_rules(passing_marks, multiplier)")
      .eq("class_id", studentData.class_id);
    setSubjectsForClass(subs || []);

    const { data: tx } = await supabase
      .from("point_transactions")
      .select("*, subjects(name)")
      .eq("student_id", studentData.id)
      .order("created_at", { ascending: false });
    setTransactions(tx || []);
    setStep("student-found");
  }, []);

  // Realtime: refresh student total + transactions when they change
  useEffect(() => {
    if (!student?.id) return;
    const channel = supabase
      .channel(`scan-student-${student.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "students", filter: `id=eq.${student.id}` },
        (payload) => { if (payload.new) setStudent((s: any) => ({ ...s, ...payload.new })); })
      .on("postgres_changes", { event: "*", schema: "public", table: "point_transactions", filter: `student_id=eq.${student.id}` },
        async () => {
          const { data: tx } = await supabase
            .from("point_transactions")
            .select("*, subjects(name)")
            .eq("student_id", student.id)
            .order("created_at", { ascending: false });
          setTransactions(tx || []);
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [student?.id]);

  const getRule = () => {
    const sub = subjectsForClass.find((s) => s.id === selectedSubjectId);
    const r = sub?.point_rules?.[0];
    return r ? { passing: r.passing_marks, multiplier: Number(r.multiplier) } : null;
  };

  const handleMarksChange = (val: string) => {
    setMarks(val);
    const num = parseInt(val);
    const rule = getRule();
    if (rule && !isNaN(num) && num >= rule.passing) {
      setCalculatedPoints((num - rule.passing) * rule.multiplier);
    } else {
      setCalculatedPoints(0);
    }
  };

  const handleConfirm = async () => {
    if (!student || !selectedSubjectId || !teacherId) {
      toast.error("Select a subject first");
      return;
    }
    const rule = getRule();
    if (!rule) { toast.error("No point rule for this subject"); return; }

    const payload = {
      student_id: student.id,
      teacher_id: teacherId,
      subject_id: selectedSubjectId,
      marks_entered: parseInt(marks),
      passing_marks: rule.passing,
      multiplier: rule.multiplier,
      points_awarded: calculatedPoints,
    };

    if (isEditing && selectedTransactionId) {
      const { error } = await supabase.from("point_transactions").update(payload).eq("id", selectedTransactionId);
      if (error) { toast.error(error.message); return; }
      toast.success("Points updated");
    } else {
      const { error } = await supabase.from("point_transactions").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success(`+${calculatedPoints} points awarded`);
    }

    confetti();
    setStep("confirmed");
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this points record? Student total will be adjusted.")) return;
    const { error } = await supabase.from("point_transactions").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Record deleted");
    if (selectedTransactionId === id) {
      setSelectedTransactionId(null);
      setIsEditing(false);
      setMarks("");
      setSelectedSubjectId("");
      setCalculatedPoints(0);
    }
  };

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Assign Points</h1>

      {step === "scanning" && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Select a student from your classes</p>
              <Select onValueChange={(id) => {
                const s = studentsForClasses.find((x) => x.id === id);
                if (s) loadStudentData(s);
              }}>
                <SelectTrigger><SelectValue placeholder="Select Student" /></SelectTrigger>
                <SelectContent>
                  {studentsForClasses.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.avatar_emoji} {s.name} (#{s.roll_number})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {studentsForClasses.length === 0 && (
                <p className="text-xs text-muted-foreground">No students assigned to your classes yet.</p>
              )}
            </div>

            <div className="relative flex items-center gap-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Enter student code manually (if QR can't be scanned)</p>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. A1B2C3"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  maxLength={12}
                  className="tracking-widest font-mono uppercase"
                />
                <Button onClick={handleManualLookup} disabled={!manualCode.trim()}>Find</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {student && step === "student-found" && (
        <>
          <Card className="border-2 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="text-3xl">{student.avatar_emoji}</div>
              <div className="flex-1">
                <h2 className="font-bold text-card-foreground">{student.name}</h2>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </div>
              <div className="text-2xl font-black text-primary">{student.total_points}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="text-sm font-semibold text-card-foreground">{isEditing ? "Editing record" : "New record"}</div>

              <Select value={selectedSubjectId} onValueChange={(v) => setSelectedSubjectId(v)}>
                <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                <SelectContent>
                  {subjectsForClass.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Marks"
                value={marks}
                onChange={(e) => handleMarksChange(e.target.value)}
              />

              {marks && (
                <div className={`text-sm font-bold ${calculatedPoints > 0 ? "text-primary" : "text-muted-foreground"}`}>
                  {calculatedPoints > 0 ? `+${calculatedPoints} points` : "No points (below passing)"}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleConfirm} className="flex-1">
                  {isEditing ? "Update" : "Assign"}
                </Button>
                {isEditing && (
                  <Button variant="outline" onClick={() => { setIsEditing(false); setSelectedTransactionId(null); setMarks(""); setSelectedSubjectId(""); setCalculatedPoints(0); }}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {transactions.length > 0 && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="text-sm font-semibold text-card-foreground mb-2">Previous records</div>
                {transactions.map((t) => (
                  <div key={t.id} className={`flex items-center gap-2 p-2 rounded-lg border ${selectedTransactionId === t.id ? "border-primary bg-primary/5" : "border-border"}`}>
                    <button onClick={() => handleTransactionSelect(t.id)} className="flex-1 text-left">
                      <div className="text-sm font-medium text-card-foreground">{t.subjects?.name || "Subject"} • +{t.points_awarded} pts</div>
                      <div className="text-xs text-muted-foreground">{t.marks_entered} marks • {new Date(t.created_at).toLocaleDateString()}</div>
                    </button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(t.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Button variant="outline" onClick={handleReset} className="w-full">Pick another student</Button>
        </>
      )}

      {step === "confirmed" && (
        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <div className="text-4xl">✅</div>
            <h2 className="font-bold text-card-foreground">Points Saved</h2>
            <Button onClick={handleReset} className="w-full">Next Student</Button>
            <Button variant="outline" onClick={() => setStep("student-found")} className="w-full">Back to {student?.name}</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TeacherScan;
