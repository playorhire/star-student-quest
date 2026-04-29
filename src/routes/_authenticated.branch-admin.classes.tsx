import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { BookOpen, Plus, Trash2, Pencil, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/branch-admin/classes")({
  component: BranchAdminClasses,
});

interface ClassRow { id: string; name: string; }
interface SubjectRow { id: string; name: string; class_id: string; }

function BranchAdminClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Class form
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRow | null>(null);
  const [className, setClassName] = useState("");
  const [classSubmitting, setClassSubmitting] = useState(false);

  // Subject form
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectRow | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [subjectClassId, setSubjectClassId] = useState("");
  const [subjectSubmitting, setSubjectSubmitting] = useState(false);

  useEffect(() => {
    if (user?.schoolId) load();
  }, [user]);

  async function load() {
    setLoading(true);
    const [c, s] = await Promise.all([
      (supabase as any).from("classes").select("id, name").eq("school_id", user!.schoolId).eq("branch_id", user!.branchId).order("name"),
      (supabase as any).from("subjects").select("id, name, class_id").eq("school_id", user!.schoolId).eq("branch_id", user!.branchId).order("name"),
    ]);
    setClasses(c.data || []);
    setSubjects(s.data || []);
    setLoading(false);
  }

  // Class handlers
  function openCreateClass() {
    setEditingClass(null);
    setClassName("");
    setShowClassForm(true);
  }

  function openEditClass(cls: ClassRow) {
    setEditingClass(cls);
    setClassName(cls.name);
    setShowClassForm(true);
  }

  async function handleSaveClass(e: React.FormEvent) {
    e.preventDefault();
    if (!className.trim()) { toast.error("Class name is required"); return; }
    setClassSubmitting(true);

    if (editingClass) {
      const { error } = await (supabase as any).from("classes").update({ name: className.trim() }).eq("id", editingClass.id);
      if (error) toast.error(error.message);
      else toast.success("Class updated");
    } else {
      const { error } = await (supabase as any).from("classes").insert({ name: className.trim(), school_id: user!.schoolId, branch_id: user!.branchId });
      if (error) toast.error(error.message);
      else toast.success("Class created");
    }

    setClassSubmitting(false);
    setShowClassForm(false);
    setEditingClass(null);
    setClassName("");
    load();
  }

  async function handleDeleteClass(id: string) {
    if (!confirm("Delete this class? All linked subjects will also be removed.")) return;
    const { error } = await (supabase as any).from("classes").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Class deleted");
    load();
  }

  // Subject handlers
  function openCreateSubject() {
    setEditingSubject(null);
    setSubjectName("");
    setSubjectClassId("");
    setShowSubjectForm(true);
  }

  function openEditSubject(sub: SubjectRow) {
    setEditingSubject(sub);
    setSubjectName(sub.name);
    setSubjectClassId(sub.class_id);
    setShowSubjectForm(true);
  }

  async function handleSaveSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectName.trim() || !subjectClassId) { toast.error("Subject name and class are required"); return; }
    setSubjectSubmitting(true);

    if (editingSubject) {
      const { error } = await (supabase as any).from("subjects").update({ name: subjectName.trim(), class_id: subjectClassId }).eq("id", editingSubject.id);
      if (error) toast.error(error.message);
      else toast.success("Subject updated");
    } else {
      const { data, error } = await (supabase as any).from("subjects").insert({ name: subjectName.trim(), class_id: subjectClassId, school_id: user!.schoolId, branch_id: user!.branchId }).select().single();
      if (error) {
        toast.error(error.message);
      } else if (data) {
        await (supabase as any).from("point_rules").insert({
          subject_id: data.id,
          passing_marks: 35,
          multiplier: 1.0,
          min_marks: 0,
          max_marks: 100,
          school_id: user!.schoolId,
          branch_id: user!.branchId,
        });
        toast.success("Subject created");
      }
    }

    setSubjectSubmitting(false);
    setShowSubjectForm(false);
    setEditingSubject(null);
    setSubjectName("");
    setSubjectClassId("");
    load();
  }

  async function handleDeleteSubject(id: string) {
    if (!confirm("Delete this subject?")) return;
    const { error } = await (supabase as any).from("subjects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Subject deleted");
    load();
  }

  const allowedRoles = ["branch_admin", "school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Classes & Subjects</h1>
          <p className="text-sm text-muted-foreground">Manage school structure</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={openCreateSubject}>
            <Plus className="h-4 w-4 mr-1" /> Subject
          </Button>
          <Button size="sm" onClick={openCreateClass}>
            <Plus className="h-4 w-4 mr-1" /> Class
          </Button>
        </div>
      </div>

      {/* Class Form */}
      {showClassForm && (
        <Card className="border-2 border-primary/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{editingClass ? "Edit Class" : "New Class"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowClassForm(false)}><X className="h-4 w-4" /></Button>
            </div>
            <form onSubmit={handleSaveClass} className="flex gap-2">
              <Input placeholder="Class Name (e.g. 10A)" value={className} onChange={e => setClassName(e.target.value)} className="flex-1" />
              <Button type="submit" disabled={classSubmitting}>
                {classSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                {editingClass ? "Update" : "Create"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Subject Form */}
      {showSubjectForm && (
        <Card className="border-2 border-secondary/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{editingSubject ? "Edit Subject" : "New Subject"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSubjectForm(false)}><X className="h-4 w-4" /></Button>
            </div>
            <form onSubmit={handleSaveSubject} className="flex gap-2">
              <Input placeholder="Subject Name" value={subjectName} onChange={e => setSubjectName(e.target.value)} className="flex-1" />
              <select value={subjectClassId} onChange={e => setSubjectClassId(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <Button type="submit" disabled={subjectSubmitting}>
                {subjectSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                {editingSubject ? "Update" : "Create"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-3">
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
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditClass(cls)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteClass(cls.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {classSubjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {classSubjects.map(sub => (
                        <Badge key={sub.id} variant="outline" className="text-[10px] gap-1">
                          <BookOpen className="h-3 w-3" /> {sub.name}
                          <button onClick={() => openEditSubject(sub)} className="ml-1 text-muted-foreground hover:text-foreground"><Pencil className="h-3 w-3" /></button>
                          <button onClick={() => handleDeleteSubject(sub.id)} className="ml-1 text-destructive hover:text-destructive"><X className="h-3 w-3" /></button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {classes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No classes found. Click Add Class to create one.</div>
          )}
        </div>
      )}
    </div>
  );
}
