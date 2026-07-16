import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase, C as Card, b as CardHeader, c as CardTitle, a as CardContent, I as Input, B as Button } from "./router-WWTDPtlD.mjs";
import { L as Label } from "./label-DtSqJuKJ.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-f2JQFkZf.mjs";
import { h as Gift, z as Plus, F as Pencil, T as Trash2 } from "../_libs/lucide-react.mjs";
function RewardsManager({ branchId }) {
  const [rewards, setRewards] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [emoji, setEmoji] = reactExports.useState("🎁");
  const [description, setDescription] = reactExports.useState("");
  const [pointCost, setPointCost] = reactExports.useState("");
  const [stock, setStock] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("Items");
  const [editing, setEditing] = reactExports.useState(null);
  const [editError, setEditError] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    load();
  }, [branchId]);
  async function load() {
    let query = supabase.from("rewards").select("*").order("point_cost");
    if (branchId) {
      query.eq("branch_id", branchId);
    }
    const { data } = await query;
    setRewards(data || []);
  }
  async function handleAdd() {
    if (!name.trim() || !pointCost) return;
    setLoading(true);
    setError("");
    const { error: err } = await supabase.from("rewards").insert({
      name: name.trim(),
      emoji: emoji.trim() || "🎁",
      description: description.trim() || null,
      point_cost: parseInt(pointCost, 10),
      stock: parseInt(stock || "0", 10),
      category: category.trim() || "Items"
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setName("");
    setEmoji("🎁");
    setDescription("");
    setPointCost("");
    setStock("");
    setCategory("Items");
    load();
  }
  async function handleDelete(id) {
    await supabase.from("rewards").delete().eq("id", id);
    load();
  }
  async function handleSaveEdit() {
    if (!editing) return;
    setSaving(true);
    setEditError("");
    const { error: err } = await supabase.from("rewards").update({
      name: editing.name.trim(),
      emoji: editing.emoji.trim() || "🎁",
      description: editing.description?.trim() || null,
      point_cost: editing.point_cost,
      stock: editing.stock,
      category: editing.category.trim() || "Items"
    }).eq("id", editing.id);
    setSaving(false);
    if (err) {
      setEditError(err.message);
      return;
    }
    setEditing(null);
    load();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4" }),
        " Add Reward"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[80px_1fr] gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Emoji" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: emoji, onChange: (e) => setEmoji(e.target.value), className: "rounded-xl text-center text-xl", maxLength: 4 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Reward name", value: name, onChange: (e) => setName(e.target.value), className: "rounded-xl" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Short description", value: description, onChange: (e) => setDescription(e.target.value), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Points" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", placeholder: "100", value: pointCost, onChange: (e) => setPointCost(e.target.value), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", placeholder: "10", value: stock, onChange: (e) => setStock(e.target.value), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Items", value: category, onChange: (e) => setCategory(e.target.value), className: "rounded-xl" })
          ] })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleAdd, className: "rounded-xl", disabled: !name.trim() || !pointCost || loading, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          " ",
          loading ? "Adding..." : "Add Reward"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      rewards.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: r.emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-card-foreground truncate", children: r.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: r.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-primary mt-0.5", children: [
            r.point_cost,
            " pts • ",
            r.stock,
            " in stock"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => setEditing(r), className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(r.id), className: "h-8 w-8 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }) }, r.id)),
      rewards.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No rewards yet" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (open) => !open && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Reward" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[80px_1fr] gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Emoji" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.emoji, onChange: (e) => setEditing({ ...editing, emoji: e.target.value }), className: "rounded-xl text-center text-xl", maxLength: 4 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.name, onChange: (e) => setEditing({ ...editing, name: e.target.value }), className: "rounded-xl" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.description || "", onChange: (e) => setEditing({ ...editing, description: e.target.value }), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Points" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: editing.point_cost, onChange: (e) => setEditing({ ...editing, point_cost: parseInt(e.target.value || "0", 10) }), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: editing.stock, onChange: (e) => setEditing({ ...editing, stock: parseInt(e.target.value || "0", 10) }), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.category, onChange: (e) => setEditing({ ...editing, category: e.target.value }), className: "rounded-xl" })
          ] })
        ] }),
        editError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: editError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSaveEdit, className: "rounded-xl w-full", disabled: !editing.name.trim() || saving, children: saving ? "Saving..." : "Save Changes" })
      ] })
    ] }) })
  ] });
}
export {
  RewardsManager as R
};
