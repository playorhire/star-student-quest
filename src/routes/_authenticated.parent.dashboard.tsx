import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { LinkedChildrenManager } from "@/components/LinkedChildrenManager";

export const Route = createFileRoute("/_authenticated/parent/dashboard")({
  component: ParentDashboard,
});

interface ChildData {
  id: string;
  name: string;
  total_points: number;
  avatar_emoji: string;
  class_name: string;
  class_id: string;
  roll_number: string;
  branch_name: string;
  school_name: string;
}

interface TeacherOption {
  id: string;
  name: string;
  user_id: string | null;
  subject_name: string;
}

interface Transaction {
  id: string;
  points_awarded: number;
  marks_entered: number;
  created_at: string;
  subjects: { name: string } | null;
  students: { name: string } | null;
}

function ParentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState<ChildData[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | "all">("all");
  const [recentActivity, setRecentActivity] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickerChild, setPickerChild] = useState<ChildData | null>(null);
  const [pickerTeachers, setPickerTeachers] = useState<TeacherOption[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);

  async function openTeacherPicker(child: ChildData) {
    setPickerChild(child);
    setPickerLoading(true);
    setPickerTeachers([]);
    const { data } = await supabase
      .from("teacher_assignments")
      .select("teachers(id, name, user_id), subjects(name)")
      .eq("class_id", child.class_id);
    const opts: TeacherOption[] = (data || [])
      .map((row: any) => ({
        id: row.teachers?.id,
        name: row.teachers?.name || "Teacher",
        user_id: row.teachers?.user_id || null,
        subject_name: row.subjects?.name || "",
      }))
      .filter((t: TeacherOption) => t.id);
    // dedupe teachers, combine subjects
    const map = new Map<string, TeacherOption>();
    for (const t of opts) {
      const existing = map.get(t.id);
      if (existing) {
        existing.subject_name = existing.subject_name
          ? `${existing.subject_name}, ${t.subject_name}`
          : t.subject_name;
      } else {
        map.set(t.id, { ...t });
      }
    }
    setPickerTeachers([...map.values()]);
    setPickerLoading(false);
  }

  function startConversation(teacher: TeacherOption) {
    if (!teacher.user_id) return;
    setPickerChild(null);
    navigate({ to: "/parent/messages", search: { with: teacher.user_id, name: teacher.name } as any });
  }

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  useEffect(() => {
    if (!children.length) return;
    loadActivity();
  }, [selectedChildId, children]);

  async function loadData() {
    const { data, error } = await (supabase as any).rpc("get_my_linked_children");
    if (!error && data) {
      setChildren(
        (data as any[]).map((s) => ({
          id: s.id,
          name: s.name,
          total_points: s.total_points,
          avatar_emoji: s.avatar_emoji,
          class_name: s.class_name || "",
          class_id: s.class_id,
          roll_number: s.roll_number,
          branch_name: s.branch_name || "",
          school_name: s.school_name || "",
        }))
      );
    }
    setLoading(false);
  }

  async function loadActivity() {
    const ids = selectedChildId === "all" ? children.map(c => c.id) : [selectedChildId];
    if (!ids.length) return;
    const { data: txns } = await supabase
      .from("point_transactions")
      .select("id, points_awarded, marks_entered, created_at, subjects(name), students(name)")
      .in("student_id", ids)
      .order("created_at", { ascending: false })
      .limit(10);
    if (txns) setRecentActivity(txns as any);
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">👨‍👩‍👧</div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-foreground">My Children</h2>
        <p className="text-muted-foreground text-sm">Track your children's progress</p>
      </div>

      {children.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3">
          <div className="text-4xl">👶</div>
          <p className="text-muted-foreground">No children linked to your account yet.</p>
          <p className="text-xs text-muted-foreground">Search by your child's name and roll number to link them.</p>
          <LinkedChildrenManager compact onChange={() => loadData()} />
        </div>
      ) : (
        <>
          {children.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedChildId("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${
                  selectedChildId === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border"
                }`}
              >
                All
              </button>
              {children.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChildId(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors flex items-center gap-1 ${
                    selectedChildId === c.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border"
                  }`}
                >
                  <span>{c.avatar_emoji}</span>
                  <span>{c.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-3">
            {children
              .filter(c => selectedChildId === "all" || c.id === selectedChildId)
              .map(child => (
                <div key={child.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{child.avatar_emoji}</div>
                    <div className="flex-1">
                      <div className="font-bold text-foreground">{child.name}</div>
                      <div className="text-xs text-muted-foreground">{child.class_name} • Roll #{child.roll_number}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {child.school_name}{child.branch_name ? ` — ${child.branch_name}` : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-primary">{child.total_points}</div>
                      <div className="text-[10px] text-muted-foreground">points</div>
                    </div>
                  </div>
                  <button
                    onClick={() => openTeacherPicker(child)}
                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-background hover:border-primary hover:text-primary px-3 py-2 text-xs font-bold text-foreground transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message a Teacher
                  </button>
                </div>
              ))}
          </div>

          <div className="pt-2">
            <LinkedChildrenManager compact onChange={() => loadData()} />
          </div>
        </>
      )}

      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">
          Recent Activity{selectedChildId !== "all" && children.find(c => c.id === selectedChildId) ? ` — ${children.find(c => c.id === selectedChildId)!.name}` : ""}
        </h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <div className="space-y-2">
            {recentActivity.map(tx => (
              <div key={tx.id} className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">{(tx.students as any)?.name}</div>
                  <div className="text-xs text-muted-foreground">{(tx.subjects as any)?.name} • {tx.marks_entered} marks</div>
                </div>
                <div className="text-sm font-bold text-primary">+{tx.points_awarded} pts</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pickerChild && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={() => setPickerChild(null)}>
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-4 space-y-3" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-foreground">Message a Teacher</div>
                <div className="text-xs text-muted-foreground">For {pickerChild.name}</div>
              </div>
              <button onClick={() => setPickerChild(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            {pickerLoading ? (
              <div className="text-center py-6 text-2xl animate-bounce">👩‍🏫</div>
            ) : pickerTeachers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No teachers assigned to this class yet.</p>
            ) : (
              <div className="space-y-2">
                {pickerTeachers.map(t => (
                  <button
                    key={t.id}
                    onClick={() => startConversation(t)}
                    disabled={!t.user_id}
                    className="w-full flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-left hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-2xl">👩‍🏫</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{t.subject_name || "Activity/Quiz"}</div>
                    </div>
                    {!t.user_id && <span className="text-[10px] text-muted-foreground">No account</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
