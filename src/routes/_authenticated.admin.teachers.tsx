import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { teachers, classes, addTeacher, removeTeacher } from "../lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Plus, Trash2, Upload, CheckCircle } from "lucide-react";
import Papa from "papaparse";

export const Route = createFileRoute("/_authenticated/admin/teachers")({
  component: AdminTeachers,
});

function AdminTeachers() {
  const [, setTick] = useState(0);
  const rerender = () => setTick(t => t + 1);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [csvResult, setCsvResult] = useState<{ count: number } | null>(null);

  const handleAdd = () => {
    if (!name.trim() || !email.trim()) return;
    addTeacher(name.trim(), email.trim(), [], []);
    setName("");
    setEmail("");
    rerender();
  };

  const handleRemove = (id: string) => {
    removeTeacher(id);
    rerender();
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let count = 0;
        for (const row of results.data as Record<string, string>[]) {
          const n = row.name || row.Name || row.teacher_name || "";
          const em = row.email || row.Email || "";
          if (n.trim()) {
            addTeacher(n.trim(), em.trim(), [], []);
            count++;
          }
        }
        setCsvResult({ count });
        rerender();
        setTimeout(() => setCsvResult(null), 3000);
      },
    });
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Teachers</h1>
        <p className="text-sm text-muted-foreground">Manage teacher accounts</p>
      </div>

      {/* CSV Import */}
      <Card className="border-2 border-accent/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-card-foreground">Import from CSV</div>
              <div className="text-[10px] text-muted-foreground">Columns: name, email</div>
            </div>
            <div className="flex items-center gap-2">
              {csvResult && (
                <Badge className="bg-success/10 text-success border-0 gap-1">
                  <CheckCircle className="h-3 w-3" /> {csvResult.count} imported
                </Badge>
              )}
              <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} className="hidden" />
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1" /> Upload CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Teacher */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Add Teacher</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Name</Label>
              <Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input placeholder="email@school.edu" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <Button onClick={handleAdd} className="rounded-xl" disabled={!name.trim() || !email.trim()}>
            <Plus className="h-4 w-4 mr-1" /> Add Teacher
          </Button>
        </CardContent>
      </Card>

      {/* Teacher List */}
      <div className="space-y-2">
        {teachers.map((t) => (
          <Card key={t.id} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">👩‍🏫</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-card-foreground truncate">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.email}</div>
                {t.assignedClasses.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {t.assignedClasses.map(c => <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>)}
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemove(t.id)} className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
