import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { FileText, ExternalLink, Upload, Trash2, Camera, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const BUCKET = "student-documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const TYPES = ["Quiz", "Test", "Certificate", "Mark sheet"] as const;
type DocumentType = (typeof TYPES)[number];
type Subject = { id: string; name: string; document_type: string };
type StoredDocument = { name: string; id: string; created_at: string | null; metadata: { size?: number; mimetype?: string } | null };

/** Upscale and normalize phone photos before OCR; small, low-contrast handwriting
 * is otherwise easily mistaken for lines of random letters. */
async function prepareOcrImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(2, 2400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Could not prepare image");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const gray = pixels.data[i] * 0.299 + pixels.data[i + 1] * 0.587 + pixels.data[i + 2] * 0.114;
      const enhanced = Math.max(0, Math.min(255, (gray - 145) * 1.7 + 145));
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = enhanced;
    }
    context.putImageData(pixels, 0, 0);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not encode image")), "image/png"));
  } finally { bitmap.close(); }
}

export const Route = createFileRoute("/_authenticated/student/documents")({ component: StudentDocuments });

function StudentDocuments() {
  const { user } = useAuth();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [type, setType] = useState<DocumentType>(TYPES[0]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultType, setResultType] = useState<"Quiz" | "Test" | "Mark sheet">("Quiz");
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [detectedText, setDetectedText] = useState("");
  const [score, setScore] = useState("");
  const [scanning, setScanning] = useState(false);
  const [submittingMark, setSubmittingMark] = useState(false);

  const loadDocuments = useCallback(async (id: string) => {
    const { data, error } = await supabase.storage.from(BUCKET).list(id, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (error) { toast.error("Couldn't load your documents"); return; }
    setDocuments((data ?? []).filter((item) => item.id).map((item) => ({ ...item, id: item.id!, metadata: item.metadata as StoredDocument["metadata"] })));
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    (async () => {
      const { data, error } = await supabase.from("students").select("id, class_id").eq("user_id", user.id).single();
      if (error || !data) { toast.error("Couldn't find your student profile"); setLoading(false); return; }
      if (!active) return;
      setStudentId(data.id);
      const { data: classSubjects } = await supabase.from("subjects").select("id, name, document_type").eq("class_id", data.class_id).order("name");
      if (active) { setSubjects(classSubjects ?? []); setSubjectId(""); }
      await loadDocuments(data.id);
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [user?.id, loadDocuments]);

  async function upload(file?: File) {
    if (!file || !studentId) return;
    const needsSubject = type === "Quiz" || type === "Test";
    if (needsSubject && !subjectId) { toast.error("Choose a subject first"); return; }
    const typeKey = type === "Test result" ? "test" : type.toLowerCase().replaceAll(" ", "-");
    const now = new Date();
    const quotaStart = type === "Quiz" ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - ((now.getUTCDay() + 6) % 7)))
      : type === "Test" || type === "Certificate" ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
      : new Date(now.getTime());
    if (type === "Mark sheet") quotaStart.setUTCMonth(quotaStart.getUTCMonth() - 3);
    const duplicate = documents.some((doc) => doc.created_at && new Date(doc.created_at) >= quotaStart &&
      (type === "Quiz" || type === "Test"
        ? doc.name.startsWith(`${typeKey}-${subjectId}--`)
        : doc.name.startsWith(`${typeKey}--`) || (type === "Certificate" && doc.name.startsWith("certificate-")) || (type === "Mark sheet" && doc.name.startsWith("mark-sheet-"))));
    if (duplicate) {
      toast.error(type === "Quiz" ? "You have already uploaded a quiz for this subject this week" : type === "Test" ? "You have already uploaded a test for this subject this month" : type === "Certificate" ? "You have already uploaded a certificate this month" : "You have already uploaded a mark sheet in the last 3 months");
      return;
    }
    if (file.size > MAX_FILE_SIZE) { toast.error("Choose a file smaller than 10 MB"); return; }
    if (!(["application/pdf", "image/jpeg", "image/png", "image/webp"] as string[]).includes(file.type)) {
      toast.error("Upload a PDF, JPG, PNG, or WEBP file"); return;
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${studentId}/${typeKey}${needsSubject ? `-${subjectId}` : ""}--${crypto.randomUUID()}--${safeName}`;
    setUploading(true);
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
    setUploading(false);
    if (error) { toast.error("Upload failed", { description: error.message }); return; }
    toast.success(`${type} uploaded`);
    await loadDocuments(studentId);
  }

  async function openDocument(name: string) {
    if (!studentId) return;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(`${studentId}/${name}`, 60);
    if (error || !data) { toast.error("Couldn't open this document"); return; }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function deleteDocument(name: string) {
    if (!studentId) return;
    const { error } = await supabase.storage.from(BUCKET).remove([`${studentId}/${name}`]);
    if (error) { toast.error("Couldn't delete this document"); return; }
    toast.success("Document deleted");
    await loadDocuments(studentId);
  }

  async function scanMark(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("OCR needs an image. Choose or take a photo of the result."); return; }
    if (file.size > MAX_FILE_SIZE) { toast.error("Choose an image smaller than 10 MB"); return; }
    setSubmissionFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDetectedText("");
    setScore("");
    setScanning(true);
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      let data;
      try {
        await worker.setParameters({ tessedit_pageseg_mode: "7", tessedit_char_whitelist: "0123456789./", preserve_interword_spaces: "0" });
        ({ data } = await worker.recognize(await prepareOcrImage(file)));
      }
      finally { await worker.terminate(); }
      setDetectedText(data.text);
      const scoreMatch = data.text.match(/(?:marks?|score|obtained)\s*[:=\-]?\s*(\d{1,3})/i) || data.text.match(/(\d{1,3})\s*\/\s*\d{1,3}/);
      if (scoreMatch) setScore(scoreMatch[1]);
      toast.success(scoreMatch ? "Score detected. Please verify it." : "Scan complete. Enter your score below.");
    } catch (error) {
      console.error("OCR scan failed", error);
      toast.error("Could not read this image. You can still enter the score manually.");
    } finally { setScanning(false); }
  }

  async function submitMark() {
    if (!studentId || !submissionFile || !subjectId || !score) { toast.error("Choose a subject, photo, and score"); return; }
    const marks = Number(score);
    if (!Number.isInteger(marks) || marks < 0) { toast.error("Enter a whole-number score"); return; }
    setSubmittingMark(true);
    const ext = submissionFile.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "jpg";
    const path = `${studentId}/mark-submissions/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, submissionFile, { contentType: submissionFile.type, upsert: false });
    if (uploadError) { toast.error("Photo upload failed", { description: uploadError.message }); setSubmittingMark(false); return; }
    const { error } = await (supabase as any).rpc("submit_student_mark", { p_subject_id: subjectId, p_result_type: resultType, p_marks_entered: marks, p_evidence_path: path, p_ocr_text: detectedText || null });
    setSubmittingMark(false);
    if (error) { toast.error("Submission failed", { description: error.message }); await supabase.storage.from(BUCKET).remove([path]); return; }
    toast.success("Score sent for teacher and superadmin approval");
    setSubmissionFile(null); setPreviewUrl(null); setDetectedText(""); setScore("");
  }

  const typeFor = (name: string) => TYPES.find((item) => name.startsWith(`${item.toLowerCase().replaceAll(" ", "-")}-`)) ?? "Document";
  const availableSubjects = subjects.filter((subject) => subject.document_type === type);
  const displayName = (name: string) => (name.includes("--") ? name.split("--").slice(2).join("--") : name.replace(/^[a-z-]+-[0-9a-f-]+-/i, "")).replaceAll("_", " ");
  const remaining = () => {
    const now = new Date();
    const start = type === "Quiz" ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - ((now.getUTCDay() + 6) % 7)))
      : type === "Test" || type === "Certificate" ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
      : new Date(now.getTime());
    if (type === "Mark sheet") start.setUTCMonth(start.getUTCMonth() - 3);
    const used = documents.some((doc) => doc.created_at && new Date(doc.created_at) >= start &&
      ((type === "Quiz" || type === "Test") ? doc.name.startsWith(`${type.toLowerCase()}-${subjectId}--`) : doc.name.startsWith(`${type.toLowerCase().replaceAll(" ", "-")}--`) || (type === "Certificate" && doc.name.startsWith("certificate-")) || (type === "Mark sheet" && doc.name.startsWith("mark-sheet-"))));
    return used ? 0 : 1;
  };

  return <div className="space-y-5">
    <div>
      <h1 className="text-xl font-black text-foreground">My Achievements</h1>
      <p className="mt-1 text-sm text-muted-foreground">Upload one quiz per subject each week, one test per subject and one certificate each month, and one mark sheet every three months.</p>
    </div>
    <Card><CardContent className="space-y-3 p-4">
      <div><h2 className="font-bold">Scan marks for points</h2><p className="text-xs text-muted-foreground">Take a clear photo of your quiz, test, or marksheet. Check the detected score before submitting it for approval.</p></div>
      <Select value={resultType} onValueChange={(value) => setResultType(value as typeof resultType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(["Quiz", "Test", "Mark sheet"] as const).map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
      <Select value={subjectId} onValueChange={setSubjectId}><SelectTrigger><SelectValue placeholder="Choose subject" /></SelectTrigger><SelectContent>{subjects.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>)}</SelectContent></Select>
      {submissionFile && <p className="text-xs text-muted-foreground">{submissionFile.name}</p>}
      {previewUrl && submissionFile && <img src={previewUrl} alt="Mark photo preview" className="mx-auto max-h-56 rounded-lg border object-contain" />}
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3 text-sm font-semibold text-primary hover:bg-primary/10"><Camera className="h-4 w-4" /> {scanning ? "Scanning image…" : "Take or choose a photo to scan"}<input className="sr-only" type="file" accept="image/*" capture="environment" disabled={scanning || submittingMark} onChange={(event) => { void scanMark(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>
      <label className="text-sm font-semibold">Score detected (check and correct it)</label><Input type="number" min="0" step="1" value={score} onChange={(event) => setScore(event.target.value)} placeholder={scanning ? "Scanning…" : "Enter score"} />
      {detectedText && <details className="text-xs text-muted-foreground"><summary>See scanned text</summary><p className="mt-1 whitespace-pre-wrap">{detectedText}</p></details>}
      <Button className="w-full" disabled={submittingMark || scanning || !submissionFile || !subjectId || !score} onClick={() => void submitMark()}>{submittingMark ? "Submitting…" : "Submit for points approval"}</Button>
      <p className="text-xs text-muted-foreground">Points are added only after a teacher or superadmin approves your score and photo.</p>
    </CardContent></Card>
    <Card><CardContent className="space-y-4 p-4">
      <label className="text-sm font-semibold">Document type</label>
      <Select value={type} onValueChange={(value) => { setType(value as DocumentType); setSubjectId(""); }}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
      </Select>
      {(type === "Quiz" || type === "Test") && <>
        <label className="text-sm font-semibold">Subject</label>
        <Select value={subjectId} onValueChange={setSubjectId}>
          <SelectTrigger><SelectValue placeholder="Choose a subject" /></SelectTrigger>
          <SelectContent>{availableSubjects.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>)}</SelectContent>
        </Select>
        {availableSubjects.length === 0 && <p className="text-xs text-muted-foreground">No subjects are configured for {type}.</p>}
      </>}
      <p className="text-xs text-muted-foreground">Uploads remaining in this period: {remaining()}</p>
      {previewUrl && <img src={previewUrl} alt="Selected marks photo preview" className="mx-auto max-h-64 rounded-lg border object-contain" />}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm font-semibold text-primary hover:bg-primary/10">
          <Camera className="h-4 w-4" /> Take a photo
          <input className="sr-only" type="file" accept="image/*" capture="environment" disabled={uploading || !studentId || ((type === "Quiz" || type === "Test") && (!subjectId || availableSubjects.length === 0)) || remaining() === 0} onChange={(event) => { const file = event.target.files?.[0]; if (file) { setPreviewUrl(URL.createObjectURL(file)); void upload(file); } event.currentTarget.value = ""; }} />
        </label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm font-semibold text-primary hover:bg-primary/10">
          <ImagePlus className="h-4 w-4" /> Choose a photo or file
          <input className="sr-only" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" disabled={uploading || !studentId || ((type === "Quiz" || type === "Test") && (!subjectId || availableSubjects.length === 0)) || remaining() === 0} onChange={(event) => { const file = event.target.files?.[0]; if (file?.type.startsWith("image/")) setPreviewUrl(URL.createObjectURL(file)); else setPreviewUrl(null); void upload(file); event.currentTarget.value = ""; }} />
        </label>
      </div>
      <p className="text-xs text-muted-foreground">PDF, JPG, PNG, or WEBP · up to 10 MB</p>
    </CardContent></Card>
    <section className="space-y-2">
      <h2 className="text-base font-bold">Uploaded documents</h2>
      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : documents.length === 0 ? <p className="text-sm text-muted-foreground">No documents uploaded yet.</p> : documents.map((doc) => (
        <Card key={doc.id}><CardContent className="flex items-center gap-3 p-3">
          <FileText className="h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{displayName(doc.name)}</p><p className="text-xs text-muted-foreground">{typeFor(doc.name)} · {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "Uploaded"}</p></div>
          <Button variant="ghost" size="icon" aria-label="Open document" onClick={() => void openDocument(doc.name)}><ExternalLink className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" aria-label="Delete document" onClick={() => void deleteDocument(doc.name)}><Trash2 className="h-4 w-4" /></Button>
        </CardContent></Card>
      ))}
    </section>
  </div>;
}
