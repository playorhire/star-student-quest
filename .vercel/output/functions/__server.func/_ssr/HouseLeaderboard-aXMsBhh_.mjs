import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase, C as Card, a as CardContent } from "./router-WWTDPtlD.mjs";
import { g as Trophy } from "../_libs/lucide-react.mjs";
function HouseLeaderboard({ branchId, title = "House Leaderboard" }) {
  const [houses, setHouses] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!branchId) {
      setLoading(false);
      return;
    }
    load();
    const channel = supabase.channel(`houses-${branchId}`).on("postgres_changes", { event: "*", schema: "public", table: "houses", filter: `branch_id=eq.${branchId}` }, () => load()).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [branchId]);
  async function load() {
    const { data } = await supabase.from("houses").select("id, name, emoji, color, total_points").eq("branch_id", branchId).order("total_points", { ascending: false });
    setHouses(data || []);
    setLoading(false);
  }
  if (!branchId || loading) return null;
  if (houses.length === 0) return null;
  const max = Math.max(1, ...houses.map((h) => h.total_points));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-foreground", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: houses.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground w-4", children: [
            i + 1,
            "."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: h.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: h.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-primary", children: [
          h.total_points,
          " pts"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full transition-all",
          style: { width: `${h.total_points / max * 100}%`, backgroundColor: h.color }
        }
      ) })
    ] }, h.id)) })
  ] }) });
}
export {
  HouseLeaderboard as H
};
