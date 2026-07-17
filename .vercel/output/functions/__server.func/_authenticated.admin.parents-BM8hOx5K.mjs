import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { s as supabase, C as Card, b as CardHeader, c as CardTitle, a as CardContent, I as Input, B as Button } from "./_ssr/router-DuskeiVN.mjs";
import { L as Label } from "./_ssr/label-TEKU4-jV.mjs";
import { B as Badge } from "./_ssr/badge-BDzIIcyg.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./_ssr/dialog-CsPHMyaH.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { K as KeyRound, ad as Link2, z as Plus, F as Pencil, T as Trash2 } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/radix-ui__react-avatar.mjs";
import "./_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "./_libs/use-sync-external-store.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__react-presence.mjs";
function AdminParents() {
  const [parents, setParents] = reactExports.useState([]);
  const [students, setStudents] = reactExports.useState([]);
  const [links, setLinks] = reactExports.useState([]);
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [studentIds, setStudentIds] = reactExports.useState([]);
  const [studentSearch, setStudentSearch] = reactExports.useState("");
  const [selectedStudentToAdd, setSelectedStudentToAdd] = reactExports.useState("");
  const [creating, setCreating] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [editParent, setEditParent] = reactExports.useState(null);
  const [eName, setEName] = reactExports.useState("");
  const [eEmail, setEEmail] = reactExports.useState("");
  const [ePhone, setEPhone] = reactExports.useState("");
  const [eStudentIds, setEStudentIds] = reactExports.useState([]);
  const [editStudentSearch, setEditStudentSearch] = reactExports.useState("");
  const [selectedEditStudentToAdd, setSelectedEditStudentToAdd] = reactExports.useState("");
  const [ePassword, setEPassword] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [editError, setEditError] = reactExports.useState("");
  reactExports.useEffect(() => {
    load();
  }, []);
  async function getFunctionErrorMessage(error2, fallback) {
    if (!error2) return fallback;
    const context = error2.context;
    if (context?.json) {
      try {
        const body = await context.json();
        if (body?.error) return String(body.error);
      } catch {
      }
    }
    if (context?.text) {
      try {
        const text = await context.text();
        if (text) return text;
      } catch {
      }
    }
    return error2.message || fallback;
  }
  async function load() {
    const [p, s, l] = await Promise.all([supabase.from("parents").select("*").order("name"), supabase.from("students").select("id, name, roll_number").order("name"), supabase.from("parent_student_links").select("parent_user_id, student_id, students(name, roll_number)")]);
    setParents(p.data || []);
    setStudents(s.data || []);
    setLinks(l.data || []);
  }
  async function handleAdd() {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await supabase.functions.invoke("create-user", {
        body: {
          email: email.trim(),
          password,
          role: "parent",
          meta: {
            name: name.trim(),
            phone: phone.trim() || null,
            studentIds
          }
        }
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setStudentIds([]);
      setStudentSearch("");
      setSelectedStudentToAdd("");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }
  async function handleRemove(p) {
    await supabase.from("parent_student_links").delete().eq("parent_user_id", p.user_id);
    await supabase.from("parents").delete().eq("id", p.id);
    load();
  }
  function openEdit(p) {
    setEditParent(p);
    setEName(p.name);
    setEEmail(p.email);
    setEPhone(p.phone || "");
    setEPassword("");
    const existingIds = links.filter((l) => l.parent_user_id === p.user_id).map((l) => l.student_id);
    setEStudentIds(existingIds);
    setEditStudentSearch("");
    setSelectedEditStudentToAdd("");
    setEditError("");
  }
  const filteredStudentsForAdd = students.filter((s) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.trim().toLowerCase();
    return s.name.toLowerCase().includes(q) || s.roll_number.toLowerCase().includes(q);
  });
  const filteredStudentsForEdit = students.filter((s) => {
    if (!editStudentSearch.trim()) return true;
    const q = editStudentSearch.trim().toLowerCase();
    return s.name.toLowerCase().includes(q) || s.roll_number.toLowerCase().includes(q);
  });
  const selectedStudentsForAdd = students.filter((s) => studentIds.includes(s.id));
  const selectedStudentsForEdit = students.filter((s) => eStudentIds.includes(s.id));
  async function handleSaveEdit() {
    if (!editParent) return;
    if (ePassword && ePassword.length < 6) {
      setEditError("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      const {
        error: error2
      } = await supabase.from("parents").update({
        name: eName.trim(),
        email: eEmail.trim(),
        phone: ePhone.trim() || null
      }).eq("id", editParent.id);
      if (error2) throw error2;
      await supabase.from("parent_student_links").delete().eq("parent_user_id", editParent.user_id);
      if (eStudentIds.length > 0) {
        await supabase.from("parent_student_links").insert(eStudentIds.map((id) => ({
          parent_user_id: editParent.user_id,
          student_id: id
        })));
      }
      if (ePassword || eEmail.trim() !== editParent.email) {
        const body = {
          targetUserId: editParent.user_id
        };
        if (eEmail.trim() !== editParent.email) body.email = eEmail.trim();
        if (ePassword) body.password = ePassword;
        const res = await supabase.functions.invoke("admin-update-user", {
          body
        });
        if (res.error) {
          throw new Error(await getFunctionErrorMessage(res.error, "Failed to update login details"));
        }
        if (res.data?.error) throw new Error(res.data.error);
      }
      setEditParent(null);
      load();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "Parents" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Create parent accounts and link to students" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-bold", children: "Add Parent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Full name", value: name, onChange: (e) => setName(e.target.value), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "parent@example.com", value: email, onChange: (e) => setEmail(e.target.value), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "+1 555 0100", value: phone, onChange: (e) => setPhone(e.target.value), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3 w-3" }),
              " Password"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", placeholder: "Min 6 chars", value: password, onChange: (e) => setPassword(e.target.value), className: "rounded-xl" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3 w-3" }),
            " Link Children (optional)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: studentSearch, onChange: (e) => setStudentSearch(e.target.value), placeholder: "Search by student name or roll number", className: "rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: selectedStudentToAdd, onChange: (e) => setSelectedStudentToAdd(e.target.value), className: "flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select student" }),
                filteredStudentsForAdd.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: s.id, children: [
                  s.name,
                  " (#",
                  s.roll_number,
                  ")"
                ] }, s.id))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => {
                if (!selectedStudentToAdd) return;
                setStudentIds((prev) => prev.includes(selectedStudentToAdd) ? prev : [...prev, selectedStudentToAdd]);
                setSelectedStudentToAdd("");
              }, children: "Add" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-input p-2 space-y-1 min-h-12", children: selectedStudentsForAdd.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No children linked yet." }) : selectedStudentsForAdd.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-muted/40 px-2 py-1 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                s.name,
                " (#",
                s.roll_number,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "text-xs text-destructive", onClick: () => setStudentIds((prev) => prev.filter((id) => id !== s.id)), children: "Remove" })
            ] }, s.id)) })
          ] })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleAdd, className: "rounded-xl", disabled: !name.trim() || !email.trim() || !password.trim() || creating, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          " ",
          creating ? "Creating..." : "Add Parent"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      parents.map((p) => {
        const childLinks = links.filter((l) => l.parent_user_id === p.user_id);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-lg", children: "👨‍👩‍👧" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-card-foreground truncate", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
              p.email,
              p.phone ? ` • ${p.phone}` : ""
            ] }),
            childLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-primary mt-0.5", children: [
              "Linked: ",
              childLinks.map((l) => l.students?.name).filter(Boolean).join(", ")
            ] })
          ] }),
          childLinks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] border-muted text-muted-foreground", children: "No Child" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => openEdit(p), className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleRemove(p), className: "h-8 w-8 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] }) }, p.id);
      }),
      parents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No parents yet" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editParent, onOpenChange: (open) => !open && setEditParent(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Parent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: eName, onChange: (e) => setEName(e.target.value), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: eEmail, onChange: (e) => setEEmail(e.target.value), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: ePhone, onChange: (e) => setEPhone(e.target.value), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Linked Children" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editStudentSearch, onChange: (e) => setEditStudentSearch(e.target.value), placeholder: "Search by student name or roll number", className: "rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: selectedEditStudentToAdd, onChange: (e) => setSelectedEditStudentToAdd(e.target.value), className: "flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select student" }),
                filteredStudentsForEdit.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: s.id, children: [
                  s.name,
                  " (#",
                  s.roll_number,
                  ")"
                ] }, s.id))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => {
                if (!selectedEditStudentToAdd) return;
                setEStudentIds((prev) => prev.includes(selectedEditStudentToAdd) ? prev : [...prev, selectedEditStudentToAdd]);
                setSelectedEditStudentToAdd("");
              }, children: "Add" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-input p-2 space-y-1 min-h-12", children: selectedStudentsForEdit.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No children linked yet." }) : selectedStudentsForEdit.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-muted/40 px-2 py-1 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                s.name,
                " (#",
                s.roll_number,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "text-xs text-destructive", onClick: () => setEStudentIds((prev) => prev.filter((id) => id !== s.id)), children: "Remove" })
            ] }, s.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3 w-3" }),
            " New Password (leave blank to keep current)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: ePassword, onChange: (e) => setEPassword(e.target.value), className: "rounded-xl", placeholder: "Min 6 characters" })
        ] }),
        editError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: editError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSaveEdit, className: "rounded-xl w-full", disabled: !eName.trim() || !eEmail.trim() || saving, children: saving ? "Saving..." : "Save Changes" })
      ] })
    ] }) })
  ] });
}
export {
  AdminParents as component
};
