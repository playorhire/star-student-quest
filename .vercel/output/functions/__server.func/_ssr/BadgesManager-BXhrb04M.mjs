import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase, C as Card, b as CardHeader, c as CardTitle, a as CardContent, I as Input, B as Button } from "./router-DuskeiVN.mjs";
import { L as Label } from "./label-TEKU4-jV.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CsPHMyaH.mjs";
import { x as Medal, z as Plus, F as Pencil, T as Trash2 } from "../_libs/lucide-react.mjs";
function BadgesManager() {
  const [badges, setBadges] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [emoji, setEmoji] = reactExports.useState("🏅");
  const [requiredPoints, setRequiredPoints] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [editing, setEditing] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [editError, setEditError] = reactExports.useState("");
  reactExports.useEffect(() => {
    load();
  }, []);
  async function load() {
    const { data } = await supabase.from("badges").select("*").order("required_points");
    setBadges(data || []);
  }
  async function handleAdd() {
    const minPoints = parseInt(requiredPoints, 10);
    if (!name.trim() || Number.isNaN(minPoints) || minPoints < 0) return;
    setLoading(true);
    setError("");
    const { error: insertError } = await supabase.from("badges").insert({
      name: name.trim(),
      emoji: emoji.trim() || "🏅",
      required_points: minPoints,
      description: description.trim() || null
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setName("");
    setEmoji("🏅");
    setRequiredPoints("");
    setDescription("");
    load();
  }
  async function handleDelete(id) {
    await supabase.from("badges").delete().eq("id", id);
    load();
  }
  async function handleSaveEdit() {
    if (!editing) return;
    if (!editing.name.trim() || editing.required_points < 0) return;
    setSaving(true);
    setEditError("");
    const { error: updateError } = await supabase.from("badges").update({
      name: editing.name.trim(),
      emoji: editing.emoji.trim() || "🏅",
      required_points: editing.required_points,
      description: editing.description?.trim() || null
    }).eq("id", editing.id);
    setSaving(false);
    if (updateError) {
      setEditError(updateError.message);
      return;
    }
    setEditing(null);
    load();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Medal, { className: "h-4 w-4" }),
        " Add Badge"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[80px_1fr] gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Emoji" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: emoji,
                onChange: (e) => setEmoji(e.target.value),
                className: "rounded-xl text-center text-xl",
                maxLength: 4
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Badge name",
                value: name,
                onChange: (e) => setName(e.target.value),
                className: "rounded-xl"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Required Points" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: "0",
                placeholder: "100",
                value: requiredPoints,
                onChange: (e) => setRequiredPoints(e.target.value),
                className: "rounded-xl"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Optional description",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                className: "rounded-xl"
              }
            )
          ] })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleAdd, className: "rounded-xl", disabled: !name.trim() || !requiredPoints || loading, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          " ",
          loading ? "Adding..." : "Add Badge"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      badges.map((badge) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: badge.emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-card-foreground truncate", children: badge.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: badge.description || "No description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-primary mt-0.5", children: [
            badge.required_points,
            " pts required"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => setEditing(badge), className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(badge.id), className: "h-8 w-8 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }) }, badge.id)),
      badges.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No badges yet" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (open) => !open && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Badge" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[80px_1fr] gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Emoji" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editing.emoji,
                onChange: (e) => setEditing({ ...editing, emoji: e.target.value }),
                className: "rounded-xl text-center text-xl",
                maxLength: 4
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editing.name,
                onChange: (e) => setEditing({ ...editing, name: e.target.value }),
                className: "rounded-xl"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Required Points" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: "0",
                value: editing.required_points,
                onChange: (e) => setEditing({ ...editing, required_points: parseInt(e.target.value || "0", 10) }),
                className: "rounded-xl"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editing.description || "",
                onChange: (e) => setEditing({ ...editing, description: e.target.value }),
                className: "rounded-xl"
              }
            )
          ] })
        ] }),
        editError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: editError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSaveEdit, className: "rounded-xl w-full", disabled: !editing.name.trim() || saving, children: saving ? "Saving..." : "Save Changes" })
      ] })
    ] }) })
  ] });
}
export {
  BadgesManager as B
};
