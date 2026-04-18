import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { MessageSquare, X } from "lucide-react";

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
  const [children, setChildren] = useState<ChildData[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | "all">("all");
  const [recentActivity, setRecentActivity] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  useEffect(() => {
    if (!children.length) return;
    loadActivity();
  }, [selectedChildId, children]);

  async function loadData() {
    const { data: links } = await supabase
      .from("parent_student_links")
      .select("student_id")
      .eq("parent_user_id", user!.id);

    if (!links?.length) {
      setLoading(false);
      return;
    }

    const studentIds = links.map(l => l.student_id);

    const { data: studentsData } = await supabase
      .from("students")
      .select("id, name, total_points, avatar_emoji, roll_number, class_id, classes(name)")
      .in("id", studentIds);

    if (studentsData) {
      setChildren(studentsData.map((s: any) => ({
        id: s.id,
        name: s.name,
        total_points: s.total_points,
        avatar_emoji: s.avatar_emoji,
        class_name: s.classes?.name || "",
        class_id: s.class_id,
        roll_number: s.roll_number,
      })));
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
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="text-4xl mb-3">👶</div>
          <p className="text-muted-foreground">No children linked to your account yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Ask the school admin to link your child.</p>
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
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-primary">{child.total_points}</div>
                      <div className="text-[10px] text-muted-foreground">points</div>
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  );
}
