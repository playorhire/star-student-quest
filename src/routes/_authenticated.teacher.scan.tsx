import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Camera, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/_authenticated/teacher/scan")({
  component: TeacherScan,
});

type ScanStep = "scanning" | "student-found" | "confirmed";

interface FoundStudent {
  id: string; name: string; roll_number: string; total_points: number; avatar_emoji: string; class_id: string; classes: { name: string } | null;
}

interface SubjectWithRule {
  id: string; name: string; class_id: string;
  point_rules: { passing_marks: number; multiplier: number }[] | null;
}

function TeacherScan() {
  const { user } = useAuth();
  const [step, setStep] = useState<ScanStep>("scanning");
  const [student, setStudent] = useState<FoundStudent | null>(null);
  const [subjectsForClass, setSubjectsForClass] = useState<SubjectWithRule[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [marks, setMarks] = useState("");
  const [calculatedPoints, setCalculatedPoints] = useState(0);
  const [manualQR, setManualQR] = useState("");
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<any>(null);

  const handleQRResult = useCallback(async (decodedText: string) => {
    const { data } = await supabase
      .from("students")
      .select("id, name, roll_number, total_points, avatar_emoji, class_id, classes(name)")
      .eq("qr_code", decodedText)
      .single();

    if (data) {
      setStudent(data as any);
      // Load subjects for this class
      const { data: subs } = await supabase
        .from("subjects")
        .select("id, name, class_id, point_rules(passing_marks, multiplier)")
        .eq("class_id", data.class_id);
      setSubjectsForClass(subs as any || []);
      setStep("student-found");
      if (html5QrRef.current) { try { html5QrRef.current.stop(); } catch {} }
    }
  }, []);

  useEffect(() => {
    if (step !== "scanning" || !scannerRef.current) return;
    let scanner: any = null;
    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        scanner = new Html5Qrcode("qr-reader");
        html5QrRef.current = scanner;
        await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, (decodedText: string) => handleQRResult(decodedText), () => {});
      } catch {}
    };
    startScanner();
    return () => { if (scanner) { try { scanner.stop(); } catch {} } };
  }, [step, handleQRResult]);

  const getSelectedRule = () => {
    const sub = subjectsForClass.find(s => s.id === selectedSubjectId);
    const rule = sub?.point_rules?.[0];
    return rule ? { passingMarks: rule.passing_marks, multiplier: Number(rule.multiplier), name: sub?.name || "" } : null;
  };

  const handleMarksChange = (value: string) => {
    setMarks(value);
    const numMarks = parseInt(value);
    const rule = getSelectedRule();
    if (rule && !isNaN(numMarks) && numMarks >= rule.passingMarks) {
      setCalculatedPoints(Math.floor((numMarks - rule.passingMarks) * rule.multiplier));
    } else {
      setCalculatedPoints(0);
    }
  };

  const handleConfirm = async () => {
    if (!student || !selectedSubjectId || calculatedPoints <= 0) return;
    const rule = getSelectedRule();
    if (!rule) return;

    // Get teacher record
    const { data: teacher } = await supabase
      .from("teachers")
      .select("id")
      .eq("user_id", user?.id ?? "")
      .single();

    if (!teacher) return;

    await supabase.from("point_transactions").insert({
      student_id: student.id,
      teacher_id: teacher.id,
      subject_id: selectedSubjectId,
      marks_entered: parseInt(marks),
      passing_marks: rule.passingMarks,
      multiplier: rule.multiplier,
      points_awarded: calculatedPoints,
    });

    setStep("confirmed");
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ["#8b5cf6", "#f97316", "#ec4899", "#22c55e"] });
  };

  const handleReset = () => {
    setStep("scanning"); setStudent(null); setSelectedSubjectId(""); setMarks(""); setCalculatedPoints(0); setManualQR(""); setSubjectsForClass([]);
  };

  const selectedRule = getSelectedRule();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Scan QR Code</h1>
        <p className="text-sm text-muted-foreground">Scan a student's QR to assign points</p>
      </div>

      {step === "scanning" && (
        <div className="space-y-4">
          <Card className="overflow-hidden border-2 border-primary/20">
            <div id="qr-reader" ref={scannerRef} className="w-full" />
            <CardContent className="p-4 text-center">
              <Camera className="mx-auto h-8 w-8 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Point camera at student QR code</p>
            </CardContent>
          </Card>
          <div className="text-center text-xs text-muted-foreground">or enter QR code manually</div>
          <div className="flex gap-2">
            <Input placeholder="Enter QR code" value={manualQR} onChange={e => setManualQR(e.target.value)} className="rounded-xl" />
            <Button onClick={() => handleQRResult(manualQR.trim())} className="rounded-xl" disabled={!manualQR.trim()}>Look up</Button>
          </div>
        </div>
      )}

      {step === "student-found" && student && (
        <div className="space-y-4">
          <Card className="border-2 border-green-500/30 bg-green-500/5">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="text-4xl">{student.avatar_emoji}</div>
              <div>
                <div className="font-bold text-lg text-card-foreground">{student.name}</div>
                <div className="text-sm text-muted-foreground">Roll #{student.roll_number} • Class {student.classes?.name}</div>
                <div className="text-sm font-semibold text-primary">{student.total_points} points</div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Select Subject</label>
            <Select onValueChange={v => { setSelectedSubjectId(v); setMarks(""); setCalculatedPoints(0); }} value={selectedSubjectId}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choose a subject" /></SelectTrigger>
              <SelectContent>
                {subjectsForClass.map(s => {
                  const r = s.point_rules?.[0];
                  return <SelectItem key={s.id} value={s.id}>{s.name} {r ? `(Pass: ${r.passing_marks}, ×${r.multiplier})` : ""}</SelectItem>;
                })}
              </SelectContent>
            </Select>
          </div>
          {selectedSubjectId && selectedRule && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Enter Marks</label>
              <Input type="number" placeholder="Enter marks obtained" value={marks} onChange={e => handleMarksChange(e.target.value)} className="rounded-xl text-lg font-bold" min="0" max="100" />
              {marks && (
                <Card className={`border-2 ${calculatedPoints > 0 ? "border-green-500/30 bg-green-500/5" : "border-destructive/30 bg-destructive/5"}`}>
                  <CardContent className="p-4 text-center">
                    {calculatedPoints > 0 ? (
                      <>
                        <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                        <div className="text-sm text-muted-foreground">({marks} - {selectedRule.passingMarks}) × {selectedRule.multiplier}</div>
                        <div className="text-3xl font-black text-green-600">+{calculatedPoints} pts</div>
                      </>
                    ) : (
                      <>
                        <XCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
                        <div className="text-sm text-muted-foreground">Marks below passing ({selectedRule.passingMarks})</div>
                        <div className="text-lg font-bold text-destructive">No points awarded</div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
              {calculatedPoints > 0 && (
                <Button onClick={handleConfirm} className="w-full rounded-xl h-12 text-base font-bold">✨ Assign {calculatedPoints} Points</Button>
              )}
            </div>
          )}
          <Button variant="ghost" onClick={handleReset} className="w-full"><RotateCcw className="h-4 w-4 mr-2" /> Scan Another Student</Button>
        </div>
      )}

      {step === "confirmed" && student && (
        <div className="text-center space-y-6 py-8">
          <div className="text-6xl">🎉</div>
          <div>
            <h2 className="text-2xl font-black text-foreground">Points Assigned!</h2>
            <p className="text-muted-foreground mt-1">{student.name} received <span className="font-bold text-primary">+{calculatedPoints}</span> points</p>
            <p className="text-sm text-muted-foreground">{selectedRule?.name} • {marks} marks</p>
          </div>
          <Button onClick={handleReset} className="rounded-xl h-12 px-8 text-base font-bold"><RotateCcw className="h-4 w-4 mr-2" /> Scan Next Student</Button>
        </div>
      )}
    </div>
  );
}
