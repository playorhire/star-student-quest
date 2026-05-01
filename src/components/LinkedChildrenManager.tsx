import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, Plus, Search, Trash2, Link2, X } from "lucide-react";
import { toast } from "sonner";

export interface LinkedChild {
  id: string;
  name: string;
  roll_number: string;
  avatar_emoji: string;
  total_points: number;
  class_id: string | null;
  class_name: string;
  branch_name: string;
  school_name: string;
}

interface SearchResult {
  id: string;
  name: string;
  roll_number: string;
  avatar_emoji: string;
  class_name: string;
  branch_name: string;
  school_name: string;
  already_linked: boolean;
}

interface Props {
  compact?: boolean;
  onChange?: (children: LinkedChild[]) => void;
}

export function LinkedChildrenManager({ compact = false, onChange }: Props) {
  const { user } = useAuth();
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchRoll, setSearchRoll] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function load() {
    setLoading(true);
    const { data, error } = await (supabase as any).rpc("get_my_linked_children");
    if (error) {
      toast.error("Failed to load children");
    } else {
      const list = (data || []) as LinkedChild[];
      setChildren(list);
      onChange?.(list);
    }
    setLoading(false);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchName.trim() || !searchRoll.trim()) {
      toast.error("Enter both name and roll number");
      return;
    }
    setSearching(true);
    setResults(null);
    const { data, error } = await (supabase as any).rpc("search_student_for_parent", {
      p_name: searchName.trim(),
      p_roll: searchRoll.trim(),
    });
    setSearching(false);
    if (error) {
      toast.error(error.message || "Search failed");
      return;
    }
    setResults((data || []) as SearchResult[]);
  }

  async function handleLink(student: SearchResult) {
    if (!user) return;
    setLinkingId(student.id);
    const { error } = await (supabase as any)
      .from("parent_student_links")
      .insert({ parent_user_id: user.id, student_id: student.id });
    setLinkingId(null);
    if (error) {
      toast.error(error.message || "Failed to link student");
      return;
    }
    toast.success(`${student.name} linked`);
    setResults((r) =>
      r ? r.map((s) => (s.id === student.id ? { ...s, already_linked: true } : s)) : r
    );
    load();
  }

  async function handleRemove(child: LinkedChild) {
    if (!user) return;
    if (!confirm(`Unlink ${child.name} from your account?`)) return;
    setRemovingId(child.id);
    const { error } = await (supabase as any)
      .from("parent_student_links")
      .delete()
      .eq("parent_user_id", user.id)
      .eq("student_id", child.id);
    setRemovingId(null);
    if (error) {
      toast.error(error.message || "Failed to unlink");
      return;
    }
    toast.success("Unlinked");
    load();
  }

  function resetSearch() {
    setSearchName("");
    setSearchRoll("");
    setResults(null);
  }

  return (
    <div className="space-y-3">
      {!compact && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Linked Children</h3>
            <p className="text-xs text-muted-foreground">Add or remove children linked to your account</p>
          </div>
          <Button size="sm" onClick={() => setShowAdd((v) => !v)} className="gap-1 rounded-xl">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      )}

      {compact && (
        <Button size="sm" variant="outline" onClick={() => setShowAdd((v) => !v)} className="gap-1 rounded-xl w-full">
          <Link2 className="h-4 w-4" /> Link a child
        </Button>
      )}

      {showAdd && (
        <div className="rounded-2xl border border-border bg-card p-3 space-y-3">
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Student name</Label>
                <Input
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Full name"
                  className="rounded-xl h-9"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Roll number</Label>
                <Input
                  value={searchRoll}
                  onChange={(e) => setSearchRoll(e.target.value)}
                  placeholder="Roll #"
                  className="rounded-xl h-9"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={searching} className="gap-1 rounded-xl flex-1">
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={resetSearch} className="rounded-xl">
                Clear
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => { setShowAdd(false); resetSearch(); }} className="rounded-xl">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {results !== null && (
            <div className="space-y-2">
              {results.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-3">
                  No student found with that name and roll number.
                </p>
              ) : (
                results.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 rounded-xl border border-border bg-background p-2">
                    <div className="text-2xl">{r.avatar_emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-foreground truncate">{r.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        Roll #{r.roll_number} • {r.class_name}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {r.school_name}{r.branch_name ? ` — ${r.branch_name}` : ""}
                      </div>
                    </div>
                    {r.already_linked ? (
                      <span className="text-[10px] text-muted-foreground">Linked</span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleLink(r)}
                        disabled={linkingId === r.id}
                        className="gap-1 rounded-xl h-8"
                      >
                        {linkingId === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                        Link
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : children.length === 0 ? (
        !compact && (
          <p className="text-xs text-muted-foreground text-center py-3">
            No children linked. Use "Add" to link one.
          </p>
        )
      ) : (
        !compact && (
          <div className="space-y-2">
            {children.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                <div className="text-2xl">{c.avatar_emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-foreground truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    Roll #{c.roll_number} • {c.class_name}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {c.school_name}{c.branch_name ? ` — ${c.branch_name}` : ""}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(c)}
                  disabled={removingId === c.id}
                  className="gap-1 rounded-xl h-8 text-destructive hover:text-destructive"
                >
                  {removingId === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                </Button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}