import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
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
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
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

  const [cameraOptions, setCameraOptions] = useState<any[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [cameraFacingMode, setCameraFacingMode] = useState<"environment" | "user">("environment");
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isScannerLoading, setIsScannerLoading] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const scannerRef = useRef<HTMLDivElement | null>(null);
  const scannerInstanceRef = useRef<Html5Qrcode | null>(null);
  const scanLockRef = useRef(false);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const extractLookupTokens = useCallback((value: string) => {
    const raw = value.trim();
    if (!raw) return [];

    const tokens = new Set<string>([raw]);

    // Some QR generators encode URL-safe payloads.
    try {
      const decoded = decodeURIComponent(raw);
      if (decoded) tokens.add(decoded.trim());
    } catch {
      // ignore malformed URI payload
    }

    // Support QR payloads like URLs where code is in path/query.
    const looksLikeUrl = /^https?:\/\//i.test(raw);
    if (looksLikeUrl) {
      try {
        const url = new URL(raw);
        const queryCode =
          url.searchParams.get("code") ||
          url.searchParams.get("student_code") ||
          url.searchParams.get("qr_code");
        if (queryCode) tokens.add(queryCode.trim());

        const segments = url.pathname.split("/").filter(Boolean);
        const last = segments[segments.length - 1];
        if (last) tokens.add(last.trim());
      } catch {
        // ignore invalid URL
      }
    }

    // Support JSON payload QR values.
    if (raw.startsWith("{") && raw.endsWith("}")) {
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const possibleCode =
          parsed.qr_code || parsed.student_code || parsed.code || parsed.studentCode || parsed.qrCode;
        if (typeof possibleCode === "string" && possibleCode.trim()) {
          tokens.add(possibleCode.trim());
        }
      } catch {
        // ignore non-JSON content
      }
    }

    return Array.from(tokens).filter(Boolean);
  }, []);

  const findStudentFromCode = useCallback(async (input: string) => {
    const candidates = extractLookupTokens(input);
    if (candidates.length === 0) return null;

    const { data: qrMatches, error: qrError } = await supabase
      .from("students")
      .select("*")
      .in("qr_code", candidates)
      .limit(1);

    if (!qrError && qrMatches && qrMatches.length > 0) {
      return qrMatches[0];
    }

    const upperCandidates = Array.from(new Set(candidates.map((value) => value.toUpperCase())));
    const { data: codeMatches, error: codeError } = await supabase
      .from("students")
      .select("*")
      .in("student_code", upperCandidates)
      .limit(1);

    if (codeError) {
      throw codeError;
    }

    return codeMatches?.[0] ?? null;
  }, [extractLookupTokens]);

  // Load teacher + their assigned class students
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data: teacher } = await supabase
        .from("teachers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!teacher) {
        setStudentsForClasses([]);
        return;
      }
      setTeacherId(teacher.id);

      const { data: assignments } = await supabase
        .from("teacher_assignments")
        .select("class_id")
        .eq("teacher_id", teacher.id);

      const classIds = (assignments ?? []).map((a: any) => a.class_id);
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
      .select("id, name, point_rules(passing_marks, multiplier, min_marks, max_marks)")
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
    const r = sub?.point_rules;
    return r ? { passing: Number(r.passing_marks), multiplier: Number(r.multiplier), min: Number(r.min_marks), max: Number(r.max_marks) } : null;
  };

  const handleMarksChange = (val: string) => {
    setMarks(val);
    const num = parseInt(val, 10);
    const rule = getRule();
    if (rule && !isNaN(num)) {
      const points = Math.floor((num - rule.passing) * rule.multiplier);
      setCalculatedPoints(points > 0 ? points : 0);
    } else {
      setCalculatedPoints(0);
    }
  };

  const handleConfirm = async () => {
    if (!student) {
      toast.error("Select a student first");
      return;
    }
    if (!selectedSubjectId) {
      toast.error("Select a subject first");
      return;
    }
    if (!marks.trim()) {
      toast.error("Enter the student's marks");
      return;
    }
    const score = parseInt(marks, 10);
    if (isNaN(score)) {
      toast.error("Enter a valid numeric mark");
      return;
    }

    const rule = getRule();
    if (!rule) {
      toast.error("This subject doesn't have a point rule configured yet");
      return;
    }
    if (score < rule.min || score > rule.max) {
      toast.error(`Marks must be between ${rule.min} and ${rule.max}`);
      return;
    }

    const points = Math.floor((score - rule.passing) * rule.multiplier);
    const payload = {
      student_id: student.id,
      teacher_id: teacherId as string,
      subject_id: selectedSubjectId,
      marks_entered: score,
      passing_marks: rule.passing,
      multiplier: rule.multiplier,
      points_awarded: points > 0 ? points : 0,
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

    await loadStudentData(student);
    confetti();
    setStep("confirmed");
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (!student) return;
    if (!confirm("Delete this points record? Student total will be adjusted.")) return;
    const deletedTx = transactions.find((tx) => tx.id === id);
    const { error } = await supabase.from("point_transactions").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Record deleted");

    if (deletedTx) {
      const pointsRemoved = Number(deletedTx.points_awarded ?? 0);
      setStudent((current: any) => current ? { ...current, total_points: Number(current.total_points ?? 0) - pointsRemoved } : current);
      setTransactions((current: any[]) => current.filter((tx) => tx.id !== id));
    }

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
    setManualCode("");
    scanLockRef.current = false;
  };

  const handleManualLookup = async () => {
    const code = manualCode.trim();
    if (!code) return;
    let data = null;
    try {
      data = await findStudentFromCode(code);
    } catch (error: any) {
      toast.error(error?.message || "Unable to fetch student details");
      return;
    }
    if (!data) {
      toast.error("No student found with that code");
      return;
    }
    loadStudentData(data);
  };

  const playScanBeep = useCallback(() => {
    try {
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(900, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.16, audioCtx.currentTime);
      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.14);
      oscillator.onended = () => {
        audioCtx.close().catch(() => undefined);
      };
    } catch {
      // Audio API may be blocked in some browsers, ignore.
    }
  }, []);

  const stopScanner = useCallback(async () => {
    if (!scannerInstanceRef.current) return;
    try {
      await scannerInstanceRef.current.stop();
    } catch {
      // ignore
    }
    try {
      scannerInstanceRef.current.clear();
    } catch {
      // ignore
    }
    if (scannerRef.current) {
      scannerRef.current.innerHTML = "";
    }
    scannerInstanceRef.current = null;
  }, []);

  useEffect(() => {
    if (step !== "scanning") return;
    if (!scannerRef.current) return;

    // Always clear previous scanner and DOM
    scanLockRef.current = false;
    if (scannerInstanceRef.current) {
      Promise.resolve(scannerInstanceRef.current.clear()).catch(() => undefined);
      scannerInstanceRef.current = null;
    }
    if (scannerRef.current) {
      scannerRef.current.innerHTML = "";
    }

    const elementId = "html5qr-scanner";
    const scanner = new Html5Qrcode(elementId, { verbose: false });
    scannerInstanceRef.current = scanner;
    let active = true;

    const initScanner = async () => {
      setScannerError(null);
      setIsScannerLoading(true);

      try {
        let cameras: Array<{ id: string; label?: string }> = [];
        try {
          cameras = await Html5Qrcode.getCameras();
        } catch {
          cameras = [];
        }
        if (!active) return;

        const formatted = cameras.map((camera) => ({
          id: camera.id,
          label: camera.label || `Camera ${camera.id}`,
        }));
        setCameraOptions(formatted);

        // Always prefer the first back/rear/environment camera if multiple exist
        let preferredCamera = null;
        if (selectedCameraId) {
          preferredCamera = formatted.find((camera) => camera.id === selectedCameraId);
        } else {
          // Find all back/rear/environment cameras
          const backCameras = formatted.filter((camera) =>
            /rear|back|environment/.test(camera.label.toLowerCase())
          );
          preferredCamera = backCameras.length > 0 ? backCameras[0] : formatted[0];
        }

        const cameraConfig = preferredCamera
          ? { deviceId: { exact: preferredCamera.id } }
          : { facingMode: { ideal: cameraFacingMode } };

        if (!selectedCameraId && preferredCamera?.id) {
          setSelectedCameraId(preferredCamera.id);
        }

        await scanner.start(cameraConfig, {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.2,
          disableFlip: false,
        }, async (decodedText) => {
          try {
            // Always reset scan lock for new scan
            if (scanLockRef.current) return;
            scanLockRef.current = true;
            const scannedCode = decodedText.trim();
            console.log("🔍 Scanned QR code:", scannedCode);
            if (!scannedCode) {
              scanLockRef.current = false;
              return;
            }
            let studentRow = null;
            try {
              studentRow = await findStudentFromCode(scannedCode);
            } catch (e) {
              console.error("❌ Error fetching student by scan value:", e);
            }
            if (!studentRow) {
              scanLockRef.current = false;
              console.error("❌ No student found");
              toast.error("No student found for scanned QR code");
              return;
            }
            console.log("🎵 Playing beep...");
            playScanBeep();
            setScanSuccess(true);
            setTimeout(() => setScanSuccess(false), 1200);
            setScannerError(null);
            if (scannerInstanceRef.current) {
              await scannerInstanceRef.current.stop().catch(() => undefined);
              Promise.resolve(scannerInstanceRef.current.clear()).catch(() => undefined);
              scannerInstanceRef.current = null;
            }
            await loadStudentData(studentRow);
            console.log("✅ Setting step to student-found");
          } catch (err) {
            console.error("❌ Unexpected error in scan callback:", err);
            scanLockRef.current = false;
          }
        }, () => undefined);
        setIsScannerLoading(false);
      } catch (error: any) {
        if (!active) return;
        setScannerError(error?.message || "Please allow camera permissions or try a different device.");
        setIsScannerLoading(false);
      }
    };

    initScanner();

    return () => {
      active = false;
      scanLockRef.current = false;
      if (scannerInstanceRef.current) {
        Promise.resolve(scannerInstanceRef.current.clear()).catch(() => undefined);
        scannerInstanceRef.current = null;
      }
      if (scannerRef.current) {
        scannerRef.current.innerHTML = "";
      }
    };
  }, [step, selectedCameraId, cameraFacingMode, findStudentFromCode, loadStudentData, playScanBeep]);

  useEffect(() => {
    if (step !== "scanning") {
      stopScanner();
    }
  }, [step, stopScanner]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Assign Points</h1>
        <p className="text-muted-foreground">Scan QR codes or select students to award points</p>
        {step === "scanning" && (
          <div className="text-sm text-muted-foreground">
            {studentsForClasses.length > 0
              ? `${studentsForClasses.length} student${studentsForClasses.length !== 1 ? "s" : ""} loaded from your assigned classes`
              : "Loading students for your assigned classes..."}
          </div>
        )}
      </div>

      {step === "scanning" && (
        <div className="space-y-6">
          <Card className="border-2 border-dashed border-primary/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12l3-3m-3 3l-3-3m-3 7h2.01M12 12v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Ready to Scan</h3>
                  <p className="text-sm text-muted-foreground">Choose how you'd like to find a student</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h4 className="font-medium">Select from your class</h4>
                </div>
                <Select onValueChange={(id) => {
                  const s = studentsForClasses.find((x) => x.id === id);
                  if (s) loadStudentData(s);
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {studentsForClasses.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center gap-2">
                          <span>{s.avatar_emoji}</span>
                          <span>{s.name}</span>
                          <span className="text-muted-foreground">#{s.roll_number}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {studentsForClasses.length === 0 && (
                  <div className="text-center py-4 space-y-2">
                    <p className="text-sm text-muted-foreground">No students assigned to your classes yet.</p>
                    <p className="text-xs text-muted-foreground">
                      Contact an admin to assign you to a class in <span className="font-semibold">Admin → Teachers</span>.
                    </p>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12l3-3m-3 3l-3-3m-3 7h2.01M12 12v4" />
                  </svg>
                  <h4 className="font-medium">Scan Student QR</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 items-end">
                    {/* Camera selection dropdown: only show if more than one camera and not auto-selecting back camera */}
                    {cameraOptions.length > 1 && cameraFacingMode !== "environment" ? (
                      <div className="min-w-[220px] space-y-2">
                        <p className="text-sm font-medium">Select camera</p>
                        <Select value={selectedCameraId} onValueChange={(value) => setSelectedCameraId(value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose camera..." />
                          </SelectTrigger>
                          <SelectContent>
                            {cameraOptions.map((camera) => (
                              <SelectItem key={camera.id} value={camera.id}>{camera.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null}

                    {/* Show info if only one camera or auto-selected back camera */}
                    {cameraOptions.length === 1 || cameraFacingMode === "environment" ? (
                      <div className="text-xs text-muted-foreground min-w-[220px] py-2">
                        Using main back camera
                      </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={cameraFacingMode === "environment" ? "secondary" : "outline"}
                        onClick={() => {
                          setCameraFacingMode("environment");
                          setSelectedCameraId("");
                        }}
                        disabled={cameraOptions.length === 1}
                      >
                        Back
                      </Button>
                      <Button
                        variant={cameraFacingMode === "user" ? "secondary" : "outline"}
                        onClick={() => {
                          setCameraFacingMode("user");
                          setSelectedCameraId("");
                        }}
                        disabled={cameraOptions.length === 1}
                      >
                        Front
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <div
                      id="html5qr-scanner"
                      ref={scannerRef}
                      className={`rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-[320px] border-2 border-dashed ${scanSuccess ? "border-emerald-400 bg-emerald-50/60 dark:bg-emerald-900/30 animate-pulse" : "border-gray-300 dark:border-gray-600"}`}
                    />
                    {scanSuccess && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-emerald-500/10 p-4 shadow-lg">
                          <svg className="h-16 w-16 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center">
                    {isScannerLoading ? (
                      <p className="text-sm text-muted-foreground">Starting camera... please allow access.</p>
                    ) : scannerError ? (
                      <div className="space-y-2">
                        <p className="text-sm text-rose-500">{scannerError}</p>
                        <Button variant="outline" onClick={() => setSelectedCameraId("")}>Retry Camera</Button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Position the student QR code within the camera view. Scan will happen automatically.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h4 className="font-medium">Enter Code Manually</h4>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. A1B2C3"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    maxLength={12}
                    className="tracking-widest font-mono uppercase text-center"
                  />
                  <Button onClick={handleManualLookup} disabled={!manualCode.trim()}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {student && step === "student-found" && (
        <>
          <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <Avatar className={scanSuccess ? "ring-4 ring-emerald-300" : ""}>
                    {student.photo_url ? (
                      <AvatarImage src={student.photo_url} alt={student.name} />
                    ) : (
                      <AvatarFallback>{student.avatar_emoji || "🎓"}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Student scanned</p>
                    <h2 className="text-2xl font-bold text-card-foreground">{student.name}</h2>
                    <p className="text-sm text-muted-foreground">#{student.roll_number} • Class {student.classes?.name}</p>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-3xl font-black text-primary">{student.total_points}</div>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold">{isEditing ? "Edit Points Record" : "Award Points"}</h3>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Subject</label>
                <Select value={selectedSubjectId} onValueChange={(v) => { setSelectedSubjectId(v); setCalculatedPoints(0); setMarks(""); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose subject..." />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectsForClass.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSubjectId && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Marks Scored</label>
                    {(() => {
                      const rule = getRule();
                      return rule ? (
                        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          Range: {rule.min}–{rule.max} • Pass: {rule.passing} • ×{rule.multiplier}
                        </div>
                      ) : (
                        <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded">
                          No rule configured
                        </div>
                      );
                    })()}
                  </div>
                  <Input
                    type="number"
                    min={getRule()?.min ?? 0}
                    max={getRule()?.max ?? 100}
                    placeholder="Enter marks..."
                    value={marks}
                    onChange={(e) => handleMarksChange(e.target.value)}
                    className="text-center text-lg font-mono"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Enter the marks this student scored for this subject
                  </p>
                </div>
              )}

              {marks && selectedSubjectId && (() => {
                const rule = getRule();
                const score = parseInt(marks, 10);
                const outOfRange = rule && !isNaN(score) && (score < rule.min || score > rule.max);
                return (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Points Calculation</span>
                      <div className={`text-lg font-bold ${calculatedPoints > 0 ? "text-green-600" : "text-muted-foreground"}`}>
                        {calculatedPoints > 0 ? `+${calculatedPoints} points` : "No points"}
                      </div>
                    </div>
                    {rule && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Formula: (marks - passing) × multiplier</div>
                        <div>({score} - {rule.passing}) × {rule.multiplier} = {calculatedPoints > 0 ? calculatedPoints : 0} points</div>
                      </div>
                    )}
                    {outOfRange && (
                      <div className="text-sm text-amber-700 bg-amber-50 dark:bg-amber-950 p-2 rounded border border-amber-200 dark:border-amber-800">
                        ⚠️ Marks must be between {rule?.min} and {rule?.max}
                      </div>
                    )}
                    {!rule && (
                      <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded border border-red-200 dark:border-red-800">
                        ❌ No point rule configured for this subject
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex gap-3">
                <Button
                  onClick={handleConfirm}
                  className="flex-1"
                  disabled={!selectedSubjectId || !marks || (() => {
                    const rule = getRule();
                    const score = parseInt(marks, 10);
                    return rule ? (isNaN(score) || score < rule.min || score > rule.max) : false;
                  })()}
                >
                  {isEditing ? "Update Record" : "Award Points"}
                </Button>
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedTransactionId(null);
                      setMarks("");
                      setSelectedSubjectId("");
                      setCalculatedPoints(0);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {transactions.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold">Recent Records</h3>
                </div>
                <div className="space-y-2">
                  {transactions.slice(0, 5).map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTransactionId === t.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleTransactionSelect(t.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{t.subjects?.name || "Subject"}</div>
                          <div className="text-xs text-muted-foreground">
                            {t.marks_entered} marks • {new Date(t.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${t.points_awarded > 0 ? "text-green-600" : "text-muted-foreground"}`}>
                            +{t.points_awarded}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(t.id);
                            }}
                            className="h-6 w-6 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Button variant="outline" onClick={handleReset} className="w-full">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Choose Different Student
          </Button>
        </>
      )}

      {step === "confirmed" && (
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">Points Awarded!</h2>
              <p className="text-green-700 dark:text-green-300">
                {student?.name} has been awarded {calculatedPoints} points
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleReset} className="flex-1 bg-green-600 hover:bg-green-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12l3-3m-3 3l-3-3m-3 7h2.01M12 12v4" />
                </svg>
                Next Student
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep("student-found")}
                className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Back to {student?.name}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TeacherScan;
