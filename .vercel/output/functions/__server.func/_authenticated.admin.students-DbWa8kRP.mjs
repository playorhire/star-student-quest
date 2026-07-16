import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { s as supabase, C as Card, a as CardContent, B as Button, b as CardHeader, c as CardTitle, I as Input } from "./_ssr/router-OBc8LoFd.mjs";
import { L as Label } from "./_ssr/label-Ccl7j--t.mjs";
import { B as Badge } from "./_ssr/badge-jnHTbLud.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./_ssr/dialog-BX2IkkIR.mjs";
import { P as Papa } from "./_libs/papaparse.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { R as CircleCheckBig, af as Upload, K as KeyRound, z as Plus, F as Pencil, T as Trash2 } from "./_libs/lucide-react.mjs";
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
function AdminStudents() {
  const [students, setStudents] = reactExports.useState([]);
  const [classes, setClasses] = reactExports.useState([]);
  const fileRef = reactExports.useRef(null);
  const [name, setName] = reactExports.useState("");
  const [roll, setRoll] = reactExports.useState("");
  const [classId, setClassId] = reactExports.useState("");
  const [section, setSection] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [csvResult, setCsvResult] = reactExports.useState(null);
  const [filterClassId, setFilterClassId] = reactExports.useState("");
  const [creating, setCreating] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [editStudent, setEditStudent] = reactExports.useState(null);
  const [editName, setEditName] = reactExports.useState("");
  const [editRoll, setEditRoll] = reactExports.useState("");
  const [editClassId, setEditClassId] = reactExports.useState("");
  const [editSection, setEditSection] = reactExports.useState("");
  const [editEmoji, setEditEmoji] = reactExports.useState("");
  const [editEmail, setEditEmail] = reactExports.useState("");
  const [editPassword, setEditPassword] = reactExports.useState("");
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
    const [s, c] = await Promise.all([supabase.from("students").select("id, name, roll_number, section, total_points, avatar_emoji, class_id, user_id, classes(name)").order("name"), supabase.from("classes").select("id, name").order("name")]);
    setStudents(s.data || []);
    setClasses(c.data || []);
  }
  async function handleAdd() {
    if (!name.trim() || !roll.trim() || !classId) return;
    setCreating(true);
    setError("");
    try {
      const {
        data: student,
        error: insertErr
      } = await supabase.from("students").insert({
        name: name.trim(),
        roll_number: roll.trim(),
        class_id: classId,
        section: section || "A"
      }).select("id").single();
      if (insertErr) throw insertErr;
      if (email.trim() && password.trim()) {
        const res = await supabase.functions.invoke("create-user", {
          body: {
            email: email.trim(),
            password,
            role: "student",
            meta: {
              studentId: student.id
            }
          }
        });
        if (res.data?.error) throw new Error(res.data.error);
      }
      setName("");
      setRoll("");
      setClassId("");
      setSection("");
      setEmail("");
      setPassword("");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }
  async function handleRemove(id) {
    await supabase.from("students").delete().eq("id", id);
    load();
  }
  function openEdit(s) {
    setEditStudent(s);
    setEditName(s.name);
    setEditRoll(s.roll_number);
    setEditClassId(s.class_id);
    setEditSection(s.section);
    setEditEmoji(s.avatar_emoji);
    setEditEmail("");
    setEditPassword("");
    setEditError("");
  }
  async function handleSaveEdit() {
    if (!editStudent || !editName.trim() || !editRoll.trim() || !editClassId) return;
    if (editPassword && editPassword.length < 6) {
      setEditError("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      const {
        error: error2
      } = await supabase.from("students").update({
        name: editName.trim(),
        roll_number: editRoll.trim(),
        class_id: editClassId,
        section: editSection || "A",
        avatar_emoji: editEmoji || "🧑‍🎓"
      }).eq("id", editStudent.id);
      if (error2) throw error2;
      if (editStudent.user_id && (editPassword || editEmail.trim())) {
        const body = {
          targetUserId: editStudent.user_id
        };
        if (editEmail.trim()) body.email = editEmail.trim();
        if (editPassword) body.password = editPassword;
        const res = await supabase.functions.invoke("admin-update-user", {
          body
        });
        if (res.error) {
          throw new Error(await getFunctionErrorMessage(res.error, "Failed to update login details"));
        }
        if (res.data?.error) throw new Error(res.data.error);
      }
      setEditStudent(null);
      load();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  }
  const handleCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let count = 0;
        for (const row of results.data) {
          const n = row.name || row.Name || "";
          const r = row.roll || row.Roll || row.roll_number || "";
          const c = row.class || row.Class || "";
          const s = row.section || row.Section || "A";
          if (n.trim() && r.trim() && c.trim()) {
            const cls = classes.find((cl) => cl.name === c.trim());
            if (cls) {
              await supabase.from("students").insert({
                name: n.trim(),
                roll_number: r.trim(),
                class_id: cls.id,
                section: s.trim()
              });
              count++;
            }
          }
        }
        setCsvResult({
          count
        });
        load();
        setTimeout(() => setCsvResult(null), 3e3);
      }
    });
    e.target.value = "";
  };
  const filtered = filterClassId ? students.filter((s) => s.class_id === filterClassId) : students;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "Students" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        students.length,
        " total students"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-card-foreground", children: "Import from CSV" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "Columns: name, roll, class, section" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        csvResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500/10 text-green-600 border-0 gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3" }),
          " ",
          csvResult.count,
          " imported"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: ".csv", onChange: handleCSV, className: "hidden" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "rounded-xl", onClick: () => fileRef.current?.click(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-1" }),
          " Upload CSV"
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-bold", children: "Add Student" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Full name", value: name, onChange: (e) => setName(e.target.value), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Roll Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "101", value: roll, onChange: (e) => setRoll(e.target.value), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: classId, onChange: (e) => setClassId(e.target.value), className: "flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select" }),
              classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Section" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "A", value: section, onChange: (e) => setSection(e.target.value), className: "rounded-xl" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3 w-3" }),
            " Optional: Create login account"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "student@school.edu", value: email, onChange: (e) => setEmail(e.target.value), className: "rounded-xl" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", placeholder: "Min 6 chars", value: password, onChange: (e) => setPassword(e.target.value), className: "rounded-xl" })
            ] })
          ] })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleAdd, className: "rounded-xl", disabled: !name.trim() || !roll.trim() || !classId || creating, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          " ",
          creating ? "Creating..." : "Add Student"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 overflow-x-auto pb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: filterClassId === "" ? "default" : "outline", size: "sm", className: "rounded-xl text-xs", onClick: () => setFilterClassId(""), children: "All" }),
      classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: filterClassId === c.id ? "default" : "outline", size: "sm", className: "rounded-xl text-xs", onClick: () => setFilterClassId(c.id), children: c.name }, c.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filtered.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-lg", children: s.avatar_emoji }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-card-foreground truncate", children: s.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "Roll #",
          s.roll_number,
          " • ",
          s.classes?.name,
          " (",
          s.section,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right mr-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-primary text-sm", children: s.total_points }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "pts" })
      ] }),
      s.user_id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] border-green-500/30 text-green-600", children: "Login" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] border-muted text-muted-foreground", children: "No Login" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => openEdit(s), className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleRemove(s.id), className: "h-8 w-8 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
    ] }) }, s.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editStudent, onOpenChange: (open) => !open && setEditStudent(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Student" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editName, onChange: (e) => setEditName(e.target.value), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Roll Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editRoll, onChange: (e) => setEditRoll(e.target.value), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: editClassId, onChange: (e) => setEditClassId(e.target.value), className: "flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select" }),
            classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Section" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editSection, onChange: (e) => setEditSection(e.target.value), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Avatar Emoji" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editEmoji, onChange: (e) => setEditEmoji(e.target.value), className: "rounded-xl" })
        ] }),
        editStudent?.user_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3 w-3" }),
            " Login Account (leave blank to keep current)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "New Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editEmail, onChange: (e) => setEditEmail(e.target.value), className: "rounded-xl", placeholder: "Optional" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "New Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: editPassword, onChange: (e) => setEditPassword(e.target.value), className: "rounded-xl", placeholder: "Min 6 chars" })
          ] })
        ] }),
        editError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: editError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSaveEdit, className: "rounded-xl w-full", disabled: !editName.trim() || !editRoll.trim() || !editClassId || saving, children: saving ? "Saving..." : "Save Changes" })
      ] })
    ] }) })
  ] });
}
export {
  AdminStudents as component
};
