import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { FileText, ExternalLink, Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const BUCKET = "student-documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const TYPES = ["Quiz", "Test", "Certificate", "Mark sheet"] as const;
type DocumentType = (typeof TYPES)[number];
type Subject = { id: string; name: string };
type StoredDocument = { name: string; id: string; created_at: string | null; metadata: { size?: number; mimetype?: string } | null };

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
      const { data: classSubjects } = await supabase.from("subjects").select("id, name").eq("class_id", data.class_id).order("name");
      if (active) { setSubjects(classSubjects ?? []); setSubjectId(classSubjects?.[0]?.id ?? ""); }
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

  const typeFor = (name: string) => TYPES.find((item) => name.startsWith(`${item.toLowerCase().replaceAll(" ", "-")}-`)) ?? "Document";
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
    <Card><CardContent className="space-y-4 p-4">
      <label className="text-sm font-semibold">Document type</label>
      <Select value={type} onValueChange={(value) => setType(value as DocumentType)}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
      </Select>
      {(type === "Quiz" || type === "Test") && <>
        <label className="text-sm font-semibold">Subject</label>
        <Select value={subjectId} onValueChange={setSubjectId}>
          <SelectTrigger><SelectValue placeholder="Choose a subject" /></SelectTrigger>
          <SelectContent>{subjects.map((subject) => <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>)}</SelectContent>
        </Select>
      </>}
      <p className="text-xs text-muted-foreground">Uploads remaining in this period: {remaining()}</p>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm font-semibold text-primary hover:bg-primary/10">
        <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Choose a file"}
        <input className="sr-only" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" disabled={uploading || !studentId || ((type === "Quiz" || type === "Test") && (!subjectId || subjects.length === 0)) || remaining() === 0} onChange={(event) => { void upload(event.target.files?.[0]); event.currentTarget.value = ""; }} />
      </label>
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
