import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Users2, Plus, Trash2, Pencil, Loader2, X, User, Phone, Mail, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export const Route = createFileRoute("/_authenticated/branch-admin/parents")({
  component: BranchAdminParents,
});

interface ParentRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  user_id: string | null;
  created_at: string;
  linked_students?: StudentLink[];
}

interface StudentLink {
  student_id: string;
  students: {
    id: string;
    name: string;
    roll_number: string;
    classes: {
      name: string;
    } | null;
  } | null;
}

interface StudentRow {
  id: string;
  name: string;
  roll_number: string;
  classes: {
    name: string;
  } | null;
}

function BranchAdminParents() {
  const { user } = useAuth();
  const [parents, setParents] = useState<ParentRow[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parent form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ParentRow | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    studentIds: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (user?.branchId) loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      // First get students in this branch
      const { data: studentsData, error: studentsError } = await (supabase as any)
        .from("students")
        .select("id, name, roll_number, classes(name)")
        .eq("branch_id", user!.branchId)
        .order("name");

      if (studentsError) throw studentsError;

      // Try RPC first (if migration has been applied)
      const { data: parentsData, error: parentsError } = await (supabase as any)
        .rpc('get_parents_for_branch_admin', { p_branch_id: user!.branchId });

      if (!parentsError && parentsData) {
        // RPC worked, use the data directly
        setParents(parentsData);
      } else {
        // Fallback: Use existing "Authenticated can view parents" policy
        console.log('Using fallback query for parents access');
        
        const { data: parentsList, error: parentsListError } = await (supabase as any)
          .from("parents")
          .select("id, user_id, name, email, phone, created_at")
          .order("name");
        
        if (parentsListError) throw parentsListError;
        
        // Get parent-student links for students in this branch
        const studentIds = studentsData?.map((s: any) => s.id) || [];
        const { data: linksData, error: linksError } = await (supabase as any)
          .from("parent_student_links")
          .select("parent_user_id, student_id, students(id, name, roll_number, classes(name))")
          .in("student_id", studentIds);

        if (linksError) {
          console.log('Links query failed, continuing without linked students:', linksError);
          // Set parents without linked students
          setParents((parentsList || []).map((parent: any) => ({
            ...parent,
            linked_students: []
          })));
        } else {
          // Combine parents with their linked students
          const parentsWithLinks = (parentsList || []).map((parent: any) => ({
            ...parent,
            linked_students: (linksData || []).filter((link: any) => link.parent_user_id === parent.user_id)
          }));
          setParents(parentsWithLinks);
        }
      }
      
      setStudents(studentsData || []);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || isSubmittingRef.current) return;
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setSubmitting(true);
    isSubmittingRef.current = true;

    try {
      if (editing) {
        // Update existing parent
        const { error: updateError } = await (supabase as any)
          .from("parents")
          .update({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || null,
          })
          .eq("id", editing.id);

        if (updateError) throw updateError;
        toast.success("Parent updated");
      } else {
        // Create new parent with auth user
        const res = await supabase.functions.invoke("create-user", {
          body: {
            email: form.email.trim(),
            password: form.password,
            role: "parent",
            tenant_role: "parent",
            school_id: user!.schoolId,
            branch_id: user!.branchId,
            meta: {
              name: form.name.trim(),
              phone: form.phone.trim() || null,
              studentIds: form.studentIds,
            },
          },
        });

        console.log("Edge function response:", res);
        if (res.error || res.data?.error) {
          toast.error(res.data?.error || res.error?.message || "Failed to create parent account");
          setSubmitting(false);
          isSubmittingRef.current = false;
          return;
        }
        toast.success("Parent created");
      }

      setShowForm(false);
      setEditing(null);
      setForm({ name: "", email: "", password: "", phone: "", studentIds: [] });
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
      isSubmittingRef.current = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this parent? This will also remove their account and all student links.")) return;
    
    try {
      const { error } = await (supabase as any).from("parents").delete().eq("id", id);
      if (error) throw error;
      toast.success("Parent deleted");
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  function openEdit(parent: ParentRow) {
    setEditing(parent);
    setForm({
      name: parent.name,
      email: parent.email,
      password: "",
      phone: parent.phone || "",
      studentIds: parent.linked_students?.map(ls => ls.student_id) || [],
    });
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button onClick={loadData} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Parents</h1>
          <p className="text-muted-foreground">Manage parent accounts and student links</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Parent
        </Button>
      </div>

      <div className="grid gap-4">
        {parents.map((parent) => (
          <Card key={parent.id} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">👨‍👩‍👧</div>
                  <div>
                    <h3 className="font-semibold">{parent.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Mail className="h-3 w-3" />
                      {parent.email}
                    </div>
                    {parent.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" />
                        {parent.phone}
                      </div>
                    )}
                    {parent.linked_students && parent.linked_students.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground mb-1">Linked Students:</div>
                        <div className="flex flex-wrap gap-1">
                          {parent.linked_students.map((link) => (
                            <Badge key={link.student_id} variant="secondary" className="text-xs">
                              {link.students?.name} ({link.students?.roll_number})
                              {link.students?.classes && ` - ${link.students.classes.name}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {parent.user_id && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Has Account
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(parent)}
                    className="gap-1"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(parent.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {parents.length === 0 && (
          <Card className="p-8 text-center">
            <Users2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No parents yet</h3>
            <p className="text-muted-foreground mb-4">Add your first parent to get started</p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Parent
            </Button>
          </Card>
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Parent" : "Add Parent"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Parent name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="parent@email.com"
                required
                disabled={!!editing}
              />
              {editing && (
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              )}
            </div>
            {!editing && (
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Create password"
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone number (optional)"
              />
            </div>
            {!editing && (
              <div>
                <Label>Link Students (optional)</Label>
                <div className="space-y-2">
                  {students.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-2 border rounded-md">
                      No students available in this branch
                    </div>
                  ) : (
                    <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`student-${student.id}`}
                            checked={form.studentIds.includes(student.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setForm({ ...form, studentIds: [...form.studentIds, student.id] });
                              } else {
                                setForm({ ...form, studentIds: form.studentIds.filter(id => id !== student.id) });
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <label 
                            htmlFor={`student-${student.id}`} 
                            className="text-sm cursor-pointer flex-1"
                          >
                            {student.name} ({student.roll_number})
                            {student.classes && ` - ${student.classes.name}`}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  {form.studentIds.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {form.studentIds.length} student(s) selected
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
