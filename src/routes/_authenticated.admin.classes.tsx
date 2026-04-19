import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Plus, Trash2, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/classes")({
  component: AdminClasses,
});

interface ClassRow { id: string; name: string; }
interface SubjectRow { id: string; name: string; class_id: string; }

function AdminClasses() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectClassId, setNewSubjectClassId] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const [c, s] = await Promise.all([
      supabase.from("classes").select("id, name").order("name"),
      supabase.from("subjects").select("id, name, class_id").order("name"),
    ]);
    setClasses(c.data || []);
    setSubjects(s.data || []);
  }

  async function handleAddClass() {
    if (!newClassName.trim()) return;
    await supabase.from("classes").insert({ name: newClassName.trim() });
    setNewClassName("");
    load();
  }

  async function handleRemoveClass(id: string) {
    await supabase.from("classes").delete().eq("id", id);
    load();
  }

  async function handleAddSubject() {
    if (!newSubjectName.trim() || !newSubjectClassId) return;
    const { data } = await supabase.from("subjects").insert({ name: newSubjectName.trim(), class_id: newSubjectClassId }).select().single();
    if (data) {
      // Also create a default point rule
      await supabase.from("point_rules").insert({
        subject_id: data.id,
        passing_marks: 35,
        multiplier: 1.0,
        min_marks: 0,
        max_marks: 100,
      });
    }
    setNewSubjectName("");
    setNewSubjectClassId("");
    load();
  }

  async function handleRemoveSubject(id: string) {
    await supabase.from("subjects").delete().eq("id", id);
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Classes & Subjects</h1>
        <p className="text-sm text-muted-foreground">Manage school structure</p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Add Class</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Class Name</Label>
            <Input placeholder="e.g. 10A" value={newClassName} onChange={e => setNewClassName(e.target.value)} className="rounded-xl" />
          </div>
          <Button onClick={handleAddClass} className="rounded-xl" disabled={!newClassName.trim()}>
            <Plus className="h-4 w-4 mr-1" /> Add Class
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {classes.map(cls => {
          const classSubjects = subjects.filter(s => s.class_id === cls.id);
          return (
            <Card key={cls.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏫</span>
                    <span className="font-bold text-card-foreground">{cls.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveClass(cls.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {classSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {classSubjects.map(sub => (
                      <Badge key={sub.id} variant="outline" className="text-[10px] gap-1">
                        <BookOpen className="h-3 w-3" /> {sub.name}
                        <button onClick={() => handleRemoveSubject(sub.id)} className="ml-1 text-destructive hover:text-destructive">×</button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-2 border-secondary/20">
        <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Add Subject</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Subject Name</Label>
              <Input placeholder="e.g. Physics" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs">For Class</Label>
              <select value={newSubjectClassId} onChange={e => setNewSubjectClassId(e.target.value)} className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm">
                <option value="">Select class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <Button onClick={handleAddSubject} variant="secondary" className="rounded-xl" disabled={!newSubjectName.trim() || !newSubjectClassId}>
            <Plus className="h-4 w-4 mr-1" /> Add Subject
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
