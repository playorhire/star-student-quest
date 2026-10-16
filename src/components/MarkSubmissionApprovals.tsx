import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Submission = { id: string; student_id: string; subject_id: string; result_type: string; marks_entered: number; evidence_path: string; ocr_text: string | null; created_at: string; students: { name: string; roll_number: string } | null; subjects: { name: string } | null };

export function MarkSubmissionApprovals() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from("student_mark_submissions")
      .select("id, student_id, subject_id, result_type, marks_entered, evidence_path, ocr_text, created_at, students(name, roll_number), subjects(name)")
      .eq("status", "pending").order("created_at", { ascending: true });
    if (error) { toast.error("Couldn't load mark submissions", { description: error.message }); setLoading(false); return; }
    const items = (data ?? []) as Submission[];
    setRows(items);
    const signed = await Promise.all(items.map(async (item) => {
      const { data: result } = await supabase.storage.from("student-documents").createSignedUrl(item.evidence_path, 300);
      return [item.id, result?.signedUrl ?? ""] as const;
    }));
    setUrls(Object.fromEntries(signed));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function review(row: Submission, decision: "approved" | "rejected") {
    setBusy(row.id);
    const { error } = await (supabase as any).rpc("review_student_mark", { p_submission_id: row.id, p_decision: decision });
    setBusy(null);
    if (error) { toast.error("Review failed", { description: error.message }); return; }
    toast.success(decision === "approved" ? "Marks approved and points awarded" : "Submission rejected");
    await load();
  }

  return <div className="space-y-4">
    <div><h1 className="text-2xl font-black">Points approval</h1><p className="text-sm text-muted-foreground">Review student mark photos and approve scores before points are added.</p></div>
    {loading ? <p className="text-sm text-muted-foreground">Loading submissions…</p> : rows.length === 0 ? <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">No pending mark submissions.</CardContent></Card> : rows.map((row) => <Card key={row.id}><CardContent className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-2"><div><p className="font-bold">{row.students?.name || "Student"} · #{row.students?.roll_number}</p><p className="text-sm text-muted-foreground">{row.subjects?.name} · {row.result_type}</p></div><span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Pending</span></div>
      {urls[row.id] && <a href={urls[row.id]} target="_blank" rel="noreferrer"><img src={urls[row.id]} alt="Student result evidence" className="max-h-72 w-full rounded-lg border object-contain" /></a>}
      <p className="text-sm">Student confirmed score: <strong>{row.marks_entered}</strong></p>
      {row.ocr_text && <details className="text-xs text-muted-foreground"><summary>OCR text</summary><p className="mt-1 whitespace-pre-wrap">{row.ocr_text}</p></details>}
      <p className="text-xs text-muted-foreground">Submitted {new Date(row.created_at).toLocaleString()}</p>
      <div className="flex gap-2"><Button onClick={() => void review(row, "approved")} disabled={busy === row.id}>{busy === row.id ? "Saving…" : "Approve and award points"}</Button><Button variant="outline" onClick={() => void review(row, "rejected")} disabled={busy === row.id}>Reject</Button></div>
    </CardContent></Card>)}
  </div>;
}
