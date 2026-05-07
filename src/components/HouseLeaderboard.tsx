import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "./ui/card";
import { Trophy } from "lucide-react";

interface House {
  id: string;
  name: string;
  emoji: string;
  color: string;
  total_points: number;
}

interface Props {
  branchId?: string | null;
  title?: string;
}

export function HouseLeaderboard({ branchId, title = "House Leaderboard" }: Props) {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!branchId) { setLoading(false); return; }
    load();
    const channel = supabase
      .channel(`houses-${branchId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "houses", filter: `branch_id=eq.${branchId}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  async function load() {
    const { data } = await (supabase as any)
      .from("houses")
      .select("id, name, emoji, color, total_points")
      .eq("branch_id", branchId)
      .order("total_points", { ascending: false });
    setHouses(data || []);
    setLoading(false);
  }

  if (!branchId || loading) return null;
  if (houses.length === 0) return null;

  const max = Math.max(1, ...houses.map(h => h.total_points));

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-foreground">{title}</h3>
        </div>
        <div className="space-y-2">
          {houses.map((h, i) => (
            <div key={h.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-muted-foreground w-4">{i + 1}.</span>
                  <span>{h.emoji}</span>
                  <span className="text-foreground">{h.name}</span>
                </div>
                <span className="font-black text-primary">{h.total_points} pts</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(h.total_points / max) * 100}%`, backgroundColor: h.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}