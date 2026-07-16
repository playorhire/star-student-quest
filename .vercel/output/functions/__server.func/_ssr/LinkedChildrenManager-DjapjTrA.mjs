import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAuth, s as supabase, B as Button, I as Input } from "./router-OBc8LoFd.mjs";
import { L as Label } from "./label-Ccl7j--t.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { z as Plus, ad as Link2, a7 as LoaderCircle, W as Search, X, T as Trash2 } from "../_libs/lucide-react.mjs";
function LinkedChildrenManager({ compact = false, onChange }) {
  const { user } = useAuth();
  const [children, setChildren] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [searchName, setSearchName] = reactExports.useState("");
  const [searchRoll, setSearchRoll] = reactExports.useState("");
  const [searching, setSearching] = reactExports.useState(false);
  const [results, setResults] = reactExports.useState(null);
  const [linkingId, setLinkingId] = reactExports.useState(null);
  const [removingId, setRemovingId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (user) load();
  }, [user]);
  async function load() {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_my_linked_children");
    if (error) {
      toast.error("Failed to load children");
    } else {
      const list = data || [];
      setChildren(list);
      onChange?.(list);
    }
    setLoading(false);
  }
  async function handleSearch(e) {
    e.preventDefault();
    if (!searchName.trim() || !searchRoll.trim()) {
      toast.error("Enter both name and roll number");
      return;
    }
    setSearching(true);
    setResults(null);
    const { data, error } = await supabase.rpc("search_student_for_parent", {
      p_name: searchName.trim(),
      p_roll: searchRoll.trim()
    });
    setSearching(false);
    if (error) {
      toast.error(error.message || "Search failed");
      return;
    }
    setResults(data || []);
  }
  async function handleLink(student) {
    if (!user) return;
    setLinkingId(student.id);
    const { error } = await supabase.from("parent_student_links").insert({ parent_user_id: user.id, student_id: student.id });
    setLinkingId(null);
    if (error) {
      toast.error(error.message || "Failed to link student");
      return;
    }
    toast.success(`${student.name} linked`);
    setResults(
      (r) => r ? r.map((s) => s.id === student.id ? { ...s, already_linked: true } : s) : r
    );
    load();
  }
  async function handleRemove(child) {
    if (!user) return;
    if (!confirm(`Unlink ${child.name} from your account?`)) return;
    setRemovingId(child.id);
    const { error } = await supabase.from("parent_student_links").delete().eq("parent_user_id", user.id).eq("student_id", child.id);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    !compact && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-foreground", children: "Linked Children" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add or remove children linked to your account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setShowAdd((v) => !v), className: "gap-1 rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Add"
      ] })
    ] }),
    compact && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setShowAdd((v) => !v), className: "gap-1 rounded-xl w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4" }),
      " Link a child"
    ] }),
    showAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-3 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearch, className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Student name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: searchName,
                onChange: (e) => setSearchName(e.target.value),
                placeholder: "Full name",
                className: "rounded-xl h-9",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Roll number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: searchRoll,
                onChange: (e) => setSearchRoll(e.target.value),
                placeholder: "Roll #",
                className: "rounded-xl h-9",
                required: true
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "sm", disabled: searching, className: "gap-1 rounded-xl flex-1", children: [
            searching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }),
            "Search"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", variant: "outline", onClick: resetSearch, className: "rounded-xl", children: "Clear" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", variant: "ghost", onClick: () => {
            setShowAdd(false);
            resetSearch();
          }, className: "rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] })
      ] }),
      results !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-3", children: "No student found with that name and roll number." }) : results.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border bg-background p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: r.avatar_emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-foreground truncate", children: r.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground truncate", children: [
            "Roll #",
            r.roll_number,
            " • ",
            r.class_name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground truncate", children: [
            r.school_name,
            r.branch_name ? ` — ${r.branch_name}` : ""
          ] })
        ] }),
        r.already_linked ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Linked" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => handleLink(r),
            disabled: linkingId === r.id,
            className: "gap-1 rounded-xl h-8",
            children: [
              linkingId === r.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
              "Link"
            ]
          }
        )
      ] }, r.id)) })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : children.length === 0 ? !compact && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-3", children: 'No children linked. Use "Add" to link one.' }) : !compact && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: children.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border bg-background p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: c.avatar_emoji }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-foreground truncate", children: c.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground truncate", children: [
          "Roll #",
          c.roll_number,
          " • ",
          c.class_name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground truncate", children: [
          c.school_name,
          c.branch_name ? ` — ${c.branch_name}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: () => handleRemove(c),
          disabled: removingId === c.id,
          className: "gap-1 rounded-xl h-8 text-destructive hover:text-destructive",
          children: removingId === c.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
        }
      )
    ] }, c.id)) })
  ] });
}
export {
  LinkedChildrenManager as L
};
