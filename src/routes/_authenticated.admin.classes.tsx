import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { classes, subjects, addClass, removeClass, addSubject, removeSubject, type ClassInfo } from "../lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Plus, Trash2, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/classes")({
  component: AdminClasses,
});

function AdminClasses() {
  const [, setTick] = useState(0);
  const rerender = () => setTick(t => t + 1);

  const [newClassName, setNewClassName] = useState("");
  const [newSections, setNewSections] = useState("A");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectClass, setNewSubjectClass] = useState("");

  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    const secs = newSections.split(",").map(s => s.trim()).filter(Boolean);
    addClass(newClassName.trim(), secs.length ? secs : ["A"]);
    setNewClassName("");
    setNewSections("A");
    rerender();
  };

  const handleRemoveClass = (id: string) => {
    removeClass(id);
    rerender();
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim() || !newSubjectClass) return;
    addSubject(newSubjectName.trim(), newSubjectClass, 35, 1);
    setNewSubjectName("");
    setNewSubjectClass("");
    rerender();
  };

  const handleRemoveSubject = (id: string) => {
    removeSubject(id);
    rerender();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Classes & Subjects</h1>
        <p className="text-sm text-muted-foreground">Manage school structure</p>
      </div>

      {/* Add Class */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Add Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Class Name</Label>
              <Input placeholder="e.g. 10A" value={newClassName} onChange={e => setNewClassName(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs">Sections (comma-separated)</Label>
              <Input placeholder="A, B" value={newSections} onChange={e => setNewSections(e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <Button onClick={handleAddClass} className="rounded-xl" disabled={!newClassName.trim()}>
            <Plus className="h-4 w-4 mr-1" /> Add Class
          </Button>
        </CardContent>
      </Card>

      {/* Class List */}
      <div className="space-y-2">
        {classes.map((cls) => {
          const classSubjects = subjects.filter(s => s.className === cls.name);
          return (
            <Card key={cls.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏫</span>
                    <span className="font-bold text-card-foreground">{cls.name}</span>
                    {cls.sections.map(s => (
                      <Badge key={s} variant="secondary" className="text-[10px]">Sec {s}</Badge>
                    ))}
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

      {/* Add Subject */}
      <Card className="border-2 border-secondary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Add Subject</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Subject Name</Label>
              <Input placeholder="e.g. Physics" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs">For Class</Label>
              <select value={newSubjectClass} onChange={e => setNewSubjectClass(e.target.value)} className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm">
                <option value="">Select class</option>
                {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <Button onClick={handleAddSubject} variant="secondary" className="rounded-xl" disabled={!newSubjectName.trim() || !newSubjectClass}>
            <Plus className="h-4 w-4 mr-1" /> Add Subject
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
