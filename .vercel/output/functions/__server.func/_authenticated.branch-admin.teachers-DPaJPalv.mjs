import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, B as Button, C as Card, a as CardContent, I as Input } from "./_ssr/router-OBc8LoFd.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { L as Label } from "./_ssr/label-Ccl7j--t.mjs";
import { B as Badge } from "./_ssr/badge-jnHTbLud.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./_ssr/dialog-BX2IkkIR.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { z as Plus, X, a7 as LoaderCircle, ac as MapPin, F as Pencil, T as Trash2, v as BookOpen } from "./_libs/lucide-react.mjs";
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
function BranchAdminTeachers() {
  const {
    user
  } = useAuth();
  const [teachers, setTeachers] = reactExports.useState([]);
  const [classes, setClasses] = reactExports.useState([]);
  const [subjects, setSubjects] = reactExports.useState([]);
  const [houses, setHouses] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    password: "",
    avatar_emoji: "👨‍🏫",
    house_id: ""
  });
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [assignTeacher, setAssignTeacher] = reactExports.useState(null);
  const [assignClassId, setAssignClassId] = reactExports.useState("");
  const [assignSubjectId, setAssignSubjectId] = reactExports.useState("");
  const [assignSection, setAssignSection] = reactExports.useState("");
  const [assigning, setAssigning] = reactExports.useState(false);
  const isSubmittingRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (user?.branchId) loadData();
  }, [user]);
  async function loadData() {
    setLoading(true);
    setError(null);
    const [tRes, cRes, sRes, hRes] = await Promise.all([supabase.from("teachers").select("id, user_id, name, email, avatar_emoji, branch_id, house_id, houses(name, emoji, color), teacher_assignments(id, class_id, subject_id, section, classes(name), subjects(name))").eq("branch_id", user.branchId).order("name"), supabase.from("classes").select("id, name, branches(name)").eq("school_id", user.schoolId).eq("branch_id", user.branchId).order("name"), supabase.from("subjects").select("id, name, class_id").eq("school_id", user.schoolId).order("name"), supabase.from("houses").select("id, name, emoji, color").eq("branch_id", user.branchId).order("name")]);
    if (tRes.error) {
      setError(`${tRes.error.message} (${tRes.error.code})`);
      toast.error(tRes.error.message);
    } else {
      setTeachers(tRes.data || []);
    }
    setClasses(cRes.data || []);
    setSubjects(sRes.data || []);
    setHouses(hRes.data || []);
    setLoading(false);
  }
  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      email: "",
      password: "",
      avatar_emoji: "👨‍🏫",
      house_id: ""
    });
    setShowForm(true);
  }
  function openEdit(t) {
    setEditing(t);
    setForm({
      name: t.name || "",
      email: t.email || "",
      password: "",
      avatar_emoji: t.avatar_emoji || "👨‍🏫",
      house_id: t.house_id || ""
    });
    setShowForm(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmittingRef.current) {
      return;
    }
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email required");
      return;
    }
    if (!editing && form.password && form.password.length < 6) {
      toast.error("Password must be 6+ chars");
      return;
    }
    if (editing && form.password && form.password.length < 6) {
      toast.error("Password must be 6+ chars");
      return;
    }
    isSubmittingRef.current = true;
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      avatar_emoji: form.avatar_emoji,
      school_id: user.schoolId,
      branch_id: user.branchId,
      house_id: form.house_id || null
    };
    if (editing) {
      if (form.email.trim() !== editing.email || form.password) {
        const updatePayload = {
          targetUserId: editing.user_id,
          email: form.email.trim(),
          password: form.password || void 0
        };
        const res = await supabase.functions.invoke("admin-update-user", {
          body: updatePayload
        });
        if (res.error || res.data?.error) {
          toast.error(res.data?.error || res.error?.message || "Failed to update credentials");
          setSubmitting(false);
          return;
        }
      }
      const {
        error: err
      } = await supabase.from("teachers").update(payload).eq("id", editing.id);
      if (err) toast.error(err.message);
      else toast.success("Teacher updated");
    } else {
      const {
        data: existingTeacher
      } = await supabase.from("teachers").select("id").eq("email", form.email.trim()).eq("school_id", user.schoolId).eq("branch_id", user.branchId).maybeSingle();
      if (existingTeacher) {
        toast.error("A teacher with this email already exists in your branch");
        setSubmitting(false);
        return;
      }
      const {
        data: newTeacher,
        error: teacherInsertError
      } = await supabase.from("teachers").insert(payload).select().single();
      if (teacherInsertError) {
        if (teacherInsertError.code === "23505") {
          toast.error("A teacher with this email already exists in your branch");
        } else {
          toast.error(teacherInsertError.message);
        }
        setSubmitting(false);
        return;
      }
      if (form.password) {
        const res = await supabase.functions.invoke("create-user", {
          body: {
            email: form.email.trim(),
            password: form.password,
            role: "teacher",
            tenant_role: "teacher",
            school_id: user.schoolId,
            branch_id: user.branchId,
            skip_domain_insert: true,
            teacher_id: newTeacher.id,
            meta: {
              name: form.name.trim(),
              avatar_emoji: form.avatar_emoji
            }
          }
        });
        console.log("Edge function response:", res);
        if (res.error || res.data?.error) {
          await supabase.from("teachers").delete().eq("id", newTeacher.id);
          toast.error(res.data?.error || res.error?.message || "Failed to create auth account");
          setSubmitting(false);
          isSubmittingRef.current = false;
          return;
        }
        if (res.data?.userId) {
          const {
            error: linkError
          } = await supabase.from("teachers").update({
            user_id: res.data.userId
          }).eq("id", newTeacher.id);
          if (linkError) {
            await supabase.from("teachers").delete().eq("id", newTeacher.id);
            toast.error("Failed to link auth user to teacher record");
            setSubmitting(false);
            isSubmittingRef.current = false;
            return;
          }
        }
      }
      toast.success("Teacher created");
    }
    setShowForm(false);
    setEditing(null);
    setSubmitting(false);
    isSubmittingRef.current = false;
    loadData();
  }
  async function handleDelete(id) {
    if (!confirm("Delete this teacher? All assignments will also be removed.")) return;
    const {
      error: err
    } = await supabase.from("teachers").delete().eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Teacher deleted");
      loadData();
    }
  }
  function openAssign(t) {
    setAssignTeacher(t);
    setAssignClassId("");
    setAssignSubjectId("");
    setAssignSection("");
  }
  async function handleAssign() {
    if (!assignTeacher || !assignClassId || !assignSubjectId) return;
    setAssigning(true);
    const payload = {
      teacher_id: assignTeacher.id,
      class_id: assignClassId,
      subject_id: assignSubjectId,
      section: assignSection || null,
      school_id: user.schoolId
    };
    const {
      error: err
    } = await supabase.from("teacher_assignments").insert(payload);
    if (err) toast.error(err.message);
    else {
      toast.success("Assignment added");
      setAssignTeacher(null);
      loadData();
    }
    setAssigning(false);
  }
  async function handleRemoveAssignment(assignmentId) {
    if (!confirm("Remove this assignment?")) return;
    const {
      error: err
    } = await supabase.from("teacher_assignments").delete().eq("id", assignmentId);
    if (err) toast.error(err.message);
    else {
      toast.success("Assignment removed");
      loadData();
    }
  }
  const allowedRoles = ["branch_admin", "school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Access Denied" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black", children: "Branch Teachers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage teachers and their class assignments" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openCreate, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
        "Add Teacher"
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Error:" }),
      " ",
      error
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold", children: editing ? "Edit Teacher" : "New Teacher" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowForm(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Avatar Emoji" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.avatar_emoji, onChange: (e) => setForm((f) => ({
              ...f,
              avatar_emoji: e.target.value
            })), className: "w-16 text-center text-lg px-0", maxLength: 4 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Choose an emoji for this teacher" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "teacher-name", children: "Full Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "teacher-name", placeholder: "Enter teacher's full name", required: true, value: form.name, onChange: (e) => setForm((f) => ({
            ...f,
            name: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "teacher-email", children: "Email *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "teacher-email", type: "email", placeholder: "teacher@school.com", required: true, value: form.email, onChange: (e) => setForm((f) => ({
            ...f,
            email: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "teacher-password", children: editing ? "New Password (optional)" : "Password *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "teacher-password", type: "password", placeholder: editing ? "Leave blank to keep current password" : "Minimum 6 characters", minLength: 6, required: !editing, value: form.password, onChange: (e) => setForm((f) => ({
            ...f,
            password: e.target.value
          })) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: editing ? "Only enter a new password if you want to change it" : "Required for login access" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "teacher-house", children: "House" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "teacher-house", value: form.house_id, onChange: (e) => setForm((f) => ({
            ...f,
            house_id: e.target.value
          })), className: "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "No house" }),
            houses.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: h.id, children: [
              h.emoji,
              " ",
              h.name
            ] }, h.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: submitting, className: "flex-1", children: [
            submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : null,
            editing ? "Update Teacher" : "Create Teacher"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setShowForm(false), children: "Cancel" })
        ] })
      ] })
    ] }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Loading..." }) : teachers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "No teachers found. Click Add Teacher to create one." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: teachers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl shrink-0", children: t.avatar_emoji || "👨‍🏫" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate", children: t.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-mono truncate", children: [
              "Auth: ",
              t.user_id || "Not linked"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
              "Branch"
            ] }),
            t.houses && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full", style: {
              backgroundColor: t.houses.color + "20",
              color: t.houses.color
            }, children: [
              t.houses.emoji,
              " ",
              t.houses.name
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => openEdit(t), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive", onClick: () => handleDelete(t.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-medium text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3 w-3" }),
              "Class Assignments"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "h-7 text-xs", onClick: () => openAssign(t), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3 mr-1" }),
              "Assign"
            ] })
          ] }),
          (t.teacher_assignments?.length ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground italic", children: "No class assignments yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: t.teacher_assignments?.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "flex items-center gap-1 pr-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px]", children: [
              a.classes?.name || "Class",
              a.section ? ` (${a.section})` : "",
              " ",
              "• ",
              a.subjects?.name || "Subject"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRemoveAssignment(a.id), className: "ml-1 rounded-full hover:bg-destructive/20 p-0.5 text-destructive", title: "Remove assignment", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
          ] }, a.id)) })
        ] })
      ] })
    ] }) }) }, t.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!assignTeacher, onOpenChange: (open) => !open && setAssignTeacher(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Assign Class & Subject" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Assign a class, section, and subject for",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: assignTeacher?.name }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: assignClassId, onChange: (e) => {
            setAssignClassId(e.target.value);
            setAssignSubjectId("");
          }, className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select class" }),
            classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.id, children: [
              c.name,
              " ",
              c.branches?.name ? `(${c.branches.name})` : ""
            ] }, c.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Section" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. A", value: assignSection, onChange: (e) => setAssignSection(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Subject" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: assignSubjectId, onChange: (e) => setAssignSubjectId(e.target.value), className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm", disabled: !assignClassId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select subject" }),
              subjects.filter((s) => s.class_id === assignClassId).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleAssign, className: "w-full", disabled: !assignClassId || !assignSubjectId || assigning, children: [
          assigning ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : null,
          "Assign"
        ] })
      ] })
    ] }) })
  ] });
}
export {
  BranchAdminTeachers as component
};
