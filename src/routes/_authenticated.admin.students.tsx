import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { students, classes, addStudent, removeStudent } from "../lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Plus, Trash2, Upload, CheckCircle } from "lucide-react";
import Papa from "papaparse";

export const Route = createFileRoute("/_authenticated/admin/students")({
  component: AdminStudents,
});

function AdminStudents() {
  const [, setTick] = useState(0);
  const rerender = () => setTick(t => t + 1);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [cls, setCls] = useState("");
  const [section, setSection] = useState("");
  const [csvResult, setCsvResult] = useState<{ count: number } | null>(null);
  const [filterClass, setFilterClass] = useState("");

  const handleAdd = () => {
    if (!name.trim() || !roll.trim() || !cls) return;
    addStudent(name.trim(), roll.trim(), cls, section || "A");
    setName(""); setRoll(""); setCls(""); setSection("");
    rerender();
  };

  const handleRemove = (id: string) => {
    removeStudent(id);
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
          const n = row.name || row.Name || row.student_name || "";
          const r = row.roll || row.Roll || row.roll_number || row.rollNumber || "";
          const c = row.class || row.Class || row.className || "";
          const s = row.section || row.Section || "A";
          if (n.trim() && r.trim() && c.trim()) {
            addStudent(n.trim(), r.trim(), c.trim(), s.trim());
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

  const filtered = filterClass ? students.filter(s => s.className === filterClass) : students;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Students</h1>
        <p className="text-sm text-muted-foreground">{students.length} total students</p>
      </div>

      {/* CSV Import */}
      <Card className="border-2 border-accent/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-card-foreground">Import from CSV</div>
              <div className="text-[10px] text-muted-foreground">Columns: name, roll, class, section</div>
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

      {/* Add Student */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Add Student</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Name</Label>
              <Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs">Roll Number</Label>
              <Input placeholder="101" value={roll} onChange={e => setRoll(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs">Class</Label>
              <select value={cls} onChange={e => setCls(e.target.value)} className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm">
                <option value="">Select</option>
                {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs">Section</Label>
              <Input placeholder="A" value={section} onChange={e => setSection(e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <Button onClick={handleAdd} className="rounded-xl" disabled={!name.trim() || !roll.trim() || !cls}>
            <Plus className="h-4 w-4 mr-1" /> Add Student
          </Button>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Button variant={filterClass === "" ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setFilterClass("")}>All</Button>
        {classes.map(c => (
          <Button key={c.id} variant={filterClass === c.name ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setFilterClass(c.name)}>{c.name}</Button>
        ))}
      </div>

      {/* Student List */}
      <div className="space-y-2">
        {filtered.map((s) => (
          <Card key={s.id} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-lg">{s.avatarEmoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-card-foreground truncate">{s.name}</div>
                <div className="text-xs text-muted-foreground">Roll #{s.rollNumber} • {s.className} ({s.section})</div>
              </div>
              <div className="text-right mr-2">
                <div className="font-black text-primary text-sm">{s.totalPoints}</div>
                <div className="text-[10px] text-muted-foreground">pts</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemove(s.id)} className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
