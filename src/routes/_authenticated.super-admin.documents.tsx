import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, FileText, RefreshCw, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

const BUCKET = "student-documents";
type StoredDocument = { name: string; id: string; created_at: string | null; metadata: { size?: number; mimetype?: string } | null };

export const Route = createFileRoute("/_authenticated/super-admin/documents")({ component: SuperAdminDocuments });

function SuperAdminDocuments() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("");
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredStudents = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (needle ? students.filter((s) => [s.name, s.roll_number, s.email, s.schools?.name, s.classes?.name]
      .filter(Boolean).some((value) => String(value).toLowerCase().includes(needle))) : students);
  }, [students, search]);
  const selected = students.find((s) => s.id === studentId);

  async function loadStudents() {
    const { data, error } = await (supabase as any).from("students")
      .select("id, name, email, roll_number, schools:schools!students_school_id_fkey(name), classes:classes!students_class_id_fkey(name)")
      .order("name");
    if (error) toast.error(error.message || "Could not load students");
    else setStudents(data || []);
  }

  async function loadDocuments(id: string) {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list(id, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (error) {
      toast.error("Couldn't load student documents", { description: error.message });
      setDocuments([]);
    } else {
      setDocuments((data ?? []).filter((item) => item.id).map((item) => ({ ...item, id: item.id!, metadata: item.metadata as StoredDocument["metadata"] })));
    }
    setLoading(false);
  }

  useEffect(() => { if (user?.role === "super_admin") void loadStudents(); }, [user]);
  useEffect(() => { if (studentId) void loadDocuments(studentId); else setDocuments([]); }, [studentId]);

  async function openDocument(name: string) {
    if (!studentId) return;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(`${studentId}/${name}`, 60);
    if (error || !data) { toast.error("Couldn't open this document", { description: error?.message }); return; }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  const typeFor = (name: string) => {
    if (name.startsWith("certificate-")) return "Certificate";
    if (name.startsWith("test-result-")) return "Test result";
    if (name.startsWith("mark-sheet-")) return "Mark sheet";
    return "Document";
  };
  const displayName = (name: string) => name.replace(/^[a-z-]+-[0-9a-f-]+-/i, "").replaceAll("_", " ");

  if (!user || user.role !== "super_admin") return <div className="py-20 text-center font-semibold">Access denied</div>;

  return <div className="space-y-5">
    <div className="flex items-start justify-between gap-3">
      <div><h1 className="text-2xl font-black">Student Documents</h1><p className="text-sm text-muted-foreground">View certificates, test results, and mark sheets uploaded by students.</p></div>
      <Button variant="outline" size="sm" onClick={() => { void loadStudents(); if (studentId) void loadDocuments(studentId); }} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</Button>
    </div>
    <Card><CardContent className="space-y-3 p-4">
      <Label htmlFor="document-student-search">Find a student</Label>
      <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input id="document-student-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, roll number, school or class" className="pl-9" /></div>
      <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
        <option value="">Select a student ({filteredStudents.length})</option>
        {filteredStudents.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.schools?.name || "No school"} · #{s.roll_number || "—"}</option>)}
      </select>
    </CardContent></Card>

    {selected && <section className="space-y-3">
      <div><h2 className="font-bold">{selected.name}</h2><p className="text-xs text-muted-foreground">{selected.schools?.name || "No school"} · {selected.classes?.name || "No class"} · #{selected.roll_number || "—"}</p></div>
      {loading ? <p className="text-sm text-muted-foreground">Loading documents…</p> : documents.length === 0 ? <Card><CardContent className="p-5 text-center text-sm text-muted-foreground">No documents uploaded yet.</CardContent></Card> : documents.map((doc) => <Card key={doc.id}><CardContent className="flex items-center gap-3 p-3">
        <FileText className="h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{displayName(doc.name)}</p><p className="text-xs text-muted-foreground">{typeFor(doc.name)} · {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "Uploaded"}{typeof doc.metadata?.size === "number" ? ` · ${(doc.metadata.size / 1024 / 1024).toFixed(1)} MB` : ""}</p></div>
        <Button variant="ghost" size="icon" aria-label="Open document" onClick={() => void openDocument(doc.name)}><ExternalLink className="h-4 w-4" /></Button>
      </CardContent></Card>)}
    </section>}
  </div>;
}
