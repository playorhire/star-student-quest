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
function AdminTeachers() {
  const [teachers, setTeachers] = reactExports.useState([]);
  const [classes, setClasses] = reactExports.useState([]);
  const [subjects, setSubjects] = reactExports.useState([]);
  const fileRef = reactExports.useRef(null);
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [csvResult, setCsvResult] = reactExports.useState(null);
  const [creating, setCreating] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [editTeacher, setEditTeacher] = reactExports.useState(null);
  const [editName, setEditName] = reactExports.useState("");
  const [editEmail, setEditEmail] = reactExports.useState("");
  const [editPassword, setEditPassword] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [editError, setEditError] = reactExports.useState("");
  const [assignTeacher, setAssignTeacher] = reactExports.useState(null);
  const [assignClassId, setAssignClassId] = reactExports.useState("");
  const [assignSubjectId, setAssignSubjectId] = reactExports.useState("");
  const [assigning, setAssigning] = reactExports.useState(false);
  const [assignError, setAssignError] = reactExports.useState("");
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
    const [teacherRes, classRes, subjectRes] = await Promise.all([supabase.from("teachers").select("id, name, email, user_id, teacher_assignments(id, class_id, subject_id, classes(name), subjects(name))").order("name"), supabase.from("classes").select("id, name").order("name"), supabase.from("subjects").select("id, name, class_id").order("name")]);
    setTeachers(teacherRes.data || []);
    setClasses(classRes.data || []);
    setSubjects(subjectRes.data || []);
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
          role: "teacher",
          meta: {
            name: name.trim()
          }
        }
      });
      if (res.error) throw new Error(res.error.message || "Failed to create account");
      if (res.data?.error) throw new Error(res.data.error);
      setName("");
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
    await supabase.from("teachers").delete().eq("id", id);
    load();
  }
  function openEdit(t) {
    setEditTeacher(t);
    setEditName(t.name);
    setEditEmail(t.email);
    setEditPassword("");
    setEditError("");
  }
  async function handleSaveEdit() {
    if (!editTeacher || !editName.trim() || !editEmail.trim()) return;
    if (editPassword && editPassword.length < 6) {
      setEditError("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      const {
        error: error2
      } = await supabase.from("teachers").update({
        name: editName.trim(),
        email: editEmail.trim()
      }).eq("id", editTeacher.id);
      if (error2) throw error2;
      if (editTeacher.user_id && (editPassword || editEmail.trim() !== editTeacher.email)) {
        const body = {
          targetUserId: editTeacher.user_id
        };
        if (editEmail.trim() !== editTeacher.email) body.email = editEmail.trim();
        if (editPassword) body.password = editPassword;
        const res = await supabase.functions.invoke("admin-update-user", {
          body
        });
        if (res.error) {
          throw new Error(await getFunctionErrorMessage(res.error, "Failed to update login details"));
        }
        if (res.data?.error) throw new Error(res.data.error);
      }
      setEditTeacher(null);
      load();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  }
  function openAssign(t) {
    setAssignTeacher(t);
    setAssignClassId("");
    setAssignSubjectId("");
    setAssignError("");
  }
  async function handleAssignClass() {
    if (!assignTeacher || !assignClassId || !assignSubjectId) return;
    setAssigning(true);
    setAssignError("");
    try {
      const {
        error: error2
      } = await supabase.from("teacher_assignments").insert({
        teacher_id: assignTeacher.id,
        class_id: assignClassId,
        subject_id: assignSubjectId
      });
      if (error2) throw error2;
      setAssignTeacher(null);
      load();
    } catch (err) {
      setAssignError(err.message || "Unable to assign teacher to class");
    } finally {
      setAssigning(false);
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
          const em = row.email || row.Email || "";
          if (n.trim()) {
            await supabase.from("teachers").insert({
              name: n.trim(),
              email: em.trim()
            });
            count++;
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "Teachers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage teacher accounts" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-card-foreground", children: "Import from CSV" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "Columns: name, email (no login account created)" })
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-bold", children: "Add Teacher with Login" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Full name", value: name, onChange: (e) => setName(e.target.value), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "email@school.edu", value: email, onChange: (e) => setEmail(e.target.value), className: "rounded-xl" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3 w-3" }),
            " Password"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", placeholder: "Min 6 characters", value: password, onChange: (e) => setPassword(e.target.value), className: "rounded-xl" })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleAdd, className: "rounded-xl", disabled: !name.trim() || !email.trim() || !password.trim() || creating, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          " ",
          creating ? "Creating..." : "Add Teacher"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: teachers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg", children: "👩‍🏫" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-card-foreground truncate", children: t.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t.email })
            ] }),
            t.user_id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] border-green-500/30 text-green-600", children: "Has Login" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] border-muted text-muted-foreground", children: "No Login" })
          ] }),
          t.teacher_assignments?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-2xl border border-yellow-300/70 bg-yellow-50 px-3 py-2 text-sm text-amber-900", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "No class assignments yet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-900/80", children: "Teachers need at least one assigned class and activity/quiz to assign points." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => openAssign(t), className: "rounded-xl", children: "Assign class" })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground", children: t.teacher_assignments?.map((assign) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-border bg-muted/20 px-2 py-1 text-[10px]", children: [
            assign.classes?.name || "Class",
            " • ",
            assign.subjects?.name || "Activity/Quiz"
          ] }, assign.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => openEdit(t), className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleRemove(t.id), className: "h-8 w-8 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }) }, t.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editTeacher, onOpenChange: (open) => !open && setEditTeacher(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Teacher" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editName, onChange: (e) => setEditName(e.target.value), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editEmail, onChange: (e) => setEditEmail(e.target.value), className: "rounded-xl" })
        ] }),
        editTeacher?.user_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3 w-3" }),
            " New Password (leave blank to keep current)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: editPassword, onChange: (e) => setEditPassword(e.target.value), className: "rounded-xl", placeholder: "Min 6 characters" })
        ] }),
        editError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: editError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSaveEdit, className: "rounded-xl w-full", disabled: !editName.trim() || !editEmail.trim() || saving, children: saving ? "Saving..." : "Save Changes" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!assignTeacher, onOpenChange: (open) => !open && setAssignTeacher(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Assign Class" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Assign a class and activity/quiz for ",
          assignTeacher?.name,
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: assignClassId, onChange: (e) => {
            setAssignClassId(e.target.value);
            setAssignSubjectId("");
          }, className: "flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select class" }),
            classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Activity/Quiz" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: assignSubjectId, onChange: (e) => setAssignSubjectId(e.target.value), className: "flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm", disabled: !assignClassId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select activity/quiz" }),
            subjects.filter((s) => s.class_id === assignClassId).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
          ] })
        ] }),
        assignError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: assignError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleAssignClass, className: "rounded-xl w-full", disabled: !assignClassId || !assignSubjectId || assigning, children: assigning ? "Assigning..." : "Assign class" })
      ] })
    ] }) })
  ] });
}
export {
  AdminTeachers as component
};
