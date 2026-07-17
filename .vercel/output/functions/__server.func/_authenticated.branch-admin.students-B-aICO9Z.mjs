import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, B as Button, C as Card, a as CardContent, I as Input } from "./_ssr/router-DuskeiVN.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { L as Label } from "./_ssr/label-TEKU4-jV.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./_ssr/dialog-CsPHMyaH.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { z as Plus, X, a7 as LoaderCircle, K as KeyRound, F as Pencil, T as Trash2 } from "./_libs/lucide-react.mjs";
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
function BranchAdminStudents() {
  const {
    user
  } = useAuth();
  const [students, setStudents] = reactExports.useState([]);
  const [classes, setClasses] = reactExports.useState([]);
  const [houses, setHouses] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    password: "",
    roll_number: "",
    class_id: "",
    avatar_emoji: "🎓",
    section: "A",
    house_id: ""
  });
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [credStudent, setCredStudent] = reactExports.useState(null);
  const [resettingPassword, setResettingPassword] = reactExports.useState(false);
  const isSubmittingRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (user?.branchId) loadData();
  }, [user]);
  async function loadData() {
    setLoading(true);
    setError(null);
    const [sRes, cRes, hRes] = await Promise.all([supabase.from("students").select("id, name, email, roll_number, total_points, classes(name), avatar_emoji, class_id, section, user_id, house_id, houses(name, color, emoji)").eq("branch_id", user.branchId).order("name"), supabase.from("classes").select("id, name, branches(name)").eq("school_id", user.schoolId).eq("branch_id", user.branchId).order("name"), supabase.from("houses").select("id, name, emoji, color").eq("branch_id", user.branchId).order("name")]);
    if (sRes.error) {
      setError(sRes.error.message + " (" + sRes.error.code + ")");
      toast.error(sRes.error.message);
    } else setStudents(sRes.data || []);
    setClasses(cRes.data || []);
    setHouses(hRes.data || []);
    setLoading(false);
  }
  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      email: "",
      password: "",
      roll_number: "",
      class_id: "",
      avatar_emoji: "🎓",
      section: "A",
      house_id: ""
    });
    setShowForm(true);
  }
  function openEdit(s) {
    setEditing(s);
    setForm({
      name: s.name || "",
      email: s.email || "",
      password: "",
      roll_number: s.roll_number || "",
      class_id: s.class_id || "",
      avatar_emoji: s.avatar_emoji || "🎓",
      section: s.section || "A",
      house_id: s.house_id || ""
    });
    setShowForm(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmittingRef.current) {
      return;
    }
    if (!form.name.trim() || !form.roll_number.trim() || !form.class_id) {
      toast.error("Name, roll number, and class are required");
      return;
    }
    if (!editing && form.email.trim() && !form.password) {
      toast.error("Password is required when email is provided");
      return;
    }
    if (form.password && form.password.length < 6) {
      toast.error("Password must be 6+ chars");
      return;
    }
    isSubmittingRef.current = true;
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      roll_number: form.roll_number.trim(),
      class_id: form.class_id,
      avatar_emoji: form.avatar_emoji,
      section: form.section,
      school_id: user.schoolId,
      branch_id: user.branchId,
      house_id: form.house_id || null
    };
    if (editing) {
      if (form.email.trim() !== (editing.email || "") || form.password) {
        const updatePayload = {
          targetUserId: editing.user_id,
          email: form.email.trim() || void 0,
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
      } = await supabase.from("students").update(payload).eq("id", editing.id);
      if (err) toast.error(err.message);
      else toast.success("Student updated");
    } else {
      const {
        data: existingStudent
      } = await supabase.from("students").select("id").eq("roll_number", form.roll_number.trim()).eq("school_id", user.schoolId).eq("branch_id", user.branchId).maybeSingle();
      if (existingStudent) {
        toast.error("A student with this roll number already exists in your branch");
        setSubmitting(false);
        isSubmittingRef.current = false;
        return;
      }
      const {
        data: newStudent,
        error: studentInsertError
      } = await supabase.from("students").insert({
        ...payload,
        total_points: 0,
        qr_code: crypto.randomUUID()
      }).select().single();
      if (studentInsertError) {
        if (studentInsertError.code === "23505") {
          toast.error("A student with this roll number or email already exists");
        } else {
          toast.error(studentInsertError.message);
        }
        setSubmitting(false);
        isSubmittingRef.current = false;
        return;
      }
      if (form.email.trim() && form.password) {
        const res = await supabase.functions.invoke("create-user", {
          body: {
            email: form.email.trim(),
            password: form.password,
            role: "student",
            tenant_role: "student",
            school_id: user.schoolId,
            branch_id: user.branchId,
            skip_domain_insert: true,
            student_id: newStudent.id,
            meta: {
              name: form.name.trim(),
              rollNumber: form.roll_number.trim(),
              classId: form.class_id,
              section: form.section,
              avatar_emoji: form.avatar_emoji
            }
          }
        });
        if (res.error || res.data?.error) {
          await supabase.from("students").delete().eq("id", newStudent.id);
          toast.error(res.data?.error || res.error?.message || "Failed to create auth account");
          setSubmitting(false);
          isSubmittingRef.current = false;
          return;
        }
        if (res.data?.userId) {
          const {
            error: linkError
          } = await supabase.from("students").update({
            user_id: res.data.userId
          }).eq("id", newStudent.id);
          if (linkError) {
            await supabase.from("students").delete().eq("id", newStudent.id);
            toast.error("Failed to link auth user to student record");
            setSubmitting(false);
            isSubmittingRef.current = false;
            return;
          }
        }
      }
      toast.success("Student created");
    }
    setShowForm(false);
    setEditing(null);
    setSubmitting(false);
    isSubmittingRef.current = false;
    loadData();
  }
  async function handleDelete(id) {
    if (!confirm("Delete this student?")) return;
    const {
      error: err
    } = await supabase.from("students").delete().eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Student deleted");
      loadData();
    }
  }
  async function handleResetPassword() {
    if (!credStudent?.email) {
      toast.error("No email found for this student");
      return;
    }
    setResettingPassword(true);
    const {
      error: error2
    } = await supabase.auth.resetPasswordForEmail(credStudent.email, {
      redirectTo: `${window.location.origin}/login`
    });
    if (error2) toast.error(`Reset failed: ${error2.message}`);
    else toast.success("Password reset email sent (if email service is configured)");
    setResettingPassword(false);
  }
  const allowedRoles = ["branch_admin", "school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Access Denied" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black", children: "Branch Students" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Students in your branch" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openCreate, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
        "Add Student"
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Error:" }),
      " ",
      error
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold", children: editing ? "Edit Student" : "New Student" }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Choose an emoji for this student" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "student-name", children: "Full Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "student-name", placeholder: "Enter student's full name", required: true, value: form.name, onChange: (e) => setForm((f) => ({
            ...f,
            name: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "student-email", children: "Email (optional for login)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "student-email", type: "email", placeholder: "student@school.com", value: form.email, onChange: (e) => setForm((f) => ({
            ...f,
            email: e.target.value
          })) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Provide email to enable login access" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "student-password", children: editing ? "New Password (optional)" : "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "student-password", type: "password", placeholder: editing ? "Leave blank to keep current password" : "Minimum 6 characters", minLength: 6, value: form.password, onChange: (e) => setForm((f) => ({
            ...f,
            password: e.target.value
          })) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: editing ? "Only enter a new password if you want to change it" : "Required if email is provided for login access" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "student-roll", children: "Roll Number *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "student-roll", placeholder: "e.g. 12345", required: true, value: form.roll_number, onChange: (e) => setForm((f) => ({
              ...f,
              roll_number: e.target.value
            })) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "student-section", children: "Section" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "student-section", placeholder: "e.g. A", value: form.section, onChange: (e) => setForm((f) => ({
              ...f,
              section: e.target.value
            })) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "student-class", children: "Class *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "student-class", required: true, value: form.class_id, onChange: (e) => setForm((f) => ({
            ...f,
            class_id: e.target.value
          })), className: "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Class" }),
            classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.id, children: [
              c.name,
              " ",
              c.branches?.name ? `(${c.branches.name})` : ""
            ] }, c.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "student-house", children: "House" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "student-house", value: form.house_id, onChange: (e) => setForm((f) => ({
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
            editing ? "Update Student" : "Create Student"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setShowForm(false), children: "Cancel" })
        ] })
      ] })
    ] }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Loading..." }) : students.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "No students found. Click Add Student to create one." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: students.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: s.avatar_emoji || "🎓" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: s.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-mono truncate", children: [
          "Auth: ",
          s.user_id || "Not linked"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          s.classes?.name,
          " • Roll #",
          s.roll_number,
          " • Section ",
          s.section
        ] }),
        s.houses && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full", style: {
          backgroundColor: s.houses.color + "20",
          color: s.houses.color
        }, children: [
          s.houses.emoji,
          " ",
          s.houses.name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-primary", children: s.total_points ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "pts" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setCredStudent(s), title: "Manage credentials", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => openEdit(s), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive", onClick: () => handleDelete(s.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }) }, s.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!credStudent, onOpenChange: (open) => !open && setCredStudent(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Student Credentials" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: credStudent?.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium font-mono text-sm", children: credStudent?.email || "No email" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Auth User ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs bg-muted rounded px-2 py-1 break-all", children: credStudent?.user_id || "No auth account linked" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleResetPassword, disabled: resettingPassword || !credStudent?.email, className: "w-full", variant: "outline", children: [
          resettingPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4 mr-1" }),
          "Send Password Reset Email"
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  BranchAdminStudents as component
};
