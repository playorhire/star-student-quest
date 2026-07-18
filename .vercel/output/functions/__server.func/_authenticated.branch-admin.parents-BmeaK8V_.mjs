import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, B as Button, I as Input, C as Card, a as CardContent } from "./_ssr/router-WWTDPtlD.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { L as Label } from "./_ssr/label-DtSqJuKJ.mjs";
import { B as Badge } from "./_ssr/badge-Ch0o6HSr.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./_ssr/dialog-f2JQFkZf.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { a7 as LoaderCircle, z as Plus, O as Mail, ae as Phone, F as Pencil, T as Trash2, u as UsersRound } from "./_libs/lucide-react.mjs";
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
function BranchAdminParents() {
  const {
    user
  } = useAuth();
  const [parents, setParents] = reactExports.useState([]);
  const [students, setStudents] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    studentIds: []
  });
  const [submitting, setSubmitting] = reactExports.useState(false);
  const isSubmittingRef = reactExports.useRef(false);
  const [search, setSearch] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (user?.branchId) loadData();
  }, [user]);
  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const {
        data: studentsData,
        error: studentsError
      } = await supabase.from("students").select("id, name, roll_number, classes(name)").eq("branch_id", user.branchId).order("name");
      if (studentsError) throw studentsError;
      const {
        data: parentsData,
        error: parentsError
      } = await supabase.rpc("get_parents_for_branch_admin", {
        p_branch_id: user.branchId
      });
      if (!parentsError && parentsData) {
        setParents(parentsData);
      } else {
        console.log("Using fallback query for parents access");
        const {
          data: parentsList,
          error: parentsListError
        } = await supabase.from("parents").select("id, user_id, name, email, phone, created_at").order("name");
        if (parentsListError) throw parentsListError;
        const studentIds = studentsData?.map((s) => s.id) || [];
        const {
          data: linksData,
          error: linksError
        } = await supabase.from("parent_student_links").select("parent_user_id, student_id, students(id, name, roll_number, classes(name))").in("student_id", studentIds);
        if (linksError) {
          console.log("Links query failed, continuing without linked students:", linksError);
          setParents((parentsList || []).map((parent) => ({
            ...parent,
            linked_students: []
          })));
        } else {
          const parentsWithLinks = (parentsList || []).map((parent) => ({
            ...parent,
            linked_students: (linksData || []).filter((link) => link.parent_user_id === parent.user_id)
          }));
          setParents(parentsWithLinks);
        }
      }
      setStudents(studentsData || []);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting || isSubmittingRef.current) return;
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSubmitting(true);
    isSubmittingRef.current = true;
    try {
      if (editing) {
        const {
          error: updateError
        } = await supabase.from("parents").update({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null
        }).eq("id", editing.id);
        if (updateError) throw updateError;
        if (editing.user_id && (form.email.trim() !== editing.email || form.password.trim())) {
          const updateBody = {
            targetUserId: editing.user_id,
            name: form.name.trim()
          };
          if (form.email.trim() !== editing.email) updateBody.email = form.email.trim();
          if (form.password.trim()) updateBody.password = form.password.trim();
          const res = await supabase.functions.invoke("admin-update-user", {
            body: updateBody
          });
          if (res.error || res.data?.error) {
            toast.error(res.data?.error || res.error?.message || "Failed to update account");
            setSubmitting(false);
            isSubmittingRef.current = false;
            return;
          }
        }
        if (editing.user_id) {
          const currentIds = new Set((editing.linked_students || []).map((l) => l.student_id));
          const newIds = new Set(form.studentIds);
          const toAdd = [...newIds].filter((id) => !currentIds.has(id));
          const toRemove = [...currentIds].filter((id) => !newIds.has(id));
          if (toAdd.length > 0) {
            await supabase.from("parent_student_links").insert(toAdd.map((student_id) => ({
              parent_user_id: editing.user_id,
              student_id
            })));
          }
          if (toRemove.length > 0) {
            await supabase.from("parent_student_links").delete().eq("parent_user_id", editing.user_id).in("student_id", toRemove);
          }
        }
        toast.success("Parent updated");
      } else {
        const res = await supabase.functions.invoke("create-user", {
          body: {
            email: form.email.trim(),
            password: form.password,
            role: "parent",
            tenant_role: "parent",
            school_id: user.schoolId,
            branch_id: user.branchId,
            meta: {
              name: form.name.trim(),
              phone: form.phone.trim() || null,
              studentIds: form.studentIds
            }
          }
        });
        console.log("Edge function response:", res);
        if (res.error || res.data?.error) {
          toast.error(res.data?.error || res.error?.message || "Failed to create parent account");
          setSubmitting(false);
          isSubmittingRef.current = false;
          return;
        }
        toast.success("Parent created");
      }
      setShowForm(false);
      setEditing(null);
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        studentIds: []
      });
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
      isSubmittingRef.current = false;
    }
  }
  async function handleDelete(id) {
    if (!confirm("Delete this parent? This will also remove their account and all student links.")) return;
    try {
      const {
        error: error2
      } = await supabase.from("parents").delete().eq("id", id);
      if (error2) throw error2;
      toast.success("Parent deleted");
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  }
  function openEdit(parent) {
    setEditing(parent);
    setForm({
      name: parent.name,
      email: parent.email,
      password: "",
      phone: parent.phone || "",
      studentIds: parent.linked_students?.map((ls) => ls.student_id) || []
    });
    setShowForm(true);
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: loadData, className: "mt-2", children: "Retry" })
    ] });
  }
  const q = search.trim().toLowerCase();
  const filteredParents = q ? parents.filter((p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)) : [...parents].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Parents" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Manage parent accounts and student links" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowForm(true), className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        "Add Parent"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by name or email..." }),
      !q && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Showing 5 most recently added. Search to find others." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
      filteredParents.map((parent) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: "👨‍👩‍👧" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: parent.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3" }),
              parent.email
            ] }),
            parent.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
              parent.phone
            ] }),
            parent.linked_students && parent.linked_students.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Linked Students:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: parent.linked_students.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                link.students?.name,
                " (",
                link.students?.roll_number,
                ")",
                link.students?.classes && ` - ${link.students.classes.name}`
              ] }, link.student_id)) })
            ] }),
            parent.user_id && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "mt-2 text-xs", children: "Has Account" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => openEdit(parent), className: "gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }),
            "Edit"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => handleDelete(parent.id), className: "gap-1 text-destructive hover:text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }),
            "Delete"
          ] })
        ] })
      ] }) }) }, parent.id)),
      filteredParents.length === 0 && parents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 text-center text-sm text-muted-foreground", children: [
        'No parents match "',
        search,
        '"'
      ] }),
      parents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "No parents yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Add your first parent to get started" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowForm(true), className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          "Add Parent"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showForm, onOpenChange: setShowForm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Parent" : "Add Parent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", value: form.name, onChange: (e) => setForm({
            ...form,
            name: e.target.value
          }), placeholder: "Parent name", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", value: form.email, onChange: (e) => setForm({
            ...form,
            email: e.target.value
          }), placeholder: "parent@email.com", required: true, disabled: !!editing }),
          editing && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Email cannot be changed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: editing ? "New Password (leave blank to keep current)" : "Password *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", value: form.password, onChange: (e) => setForm({
            ...form,
            password: e.target.value
          }), placeholder: editing ? "Leave blank to keep" : "Create password", required: !editing })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", value: form.phone, onChange: (e) => setForm({
            ...form,
            phone: e.target.value
          }), placeholder: "Phone number (optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Link Students (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            students.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground p-2 border rounded-md", children: "No students available in this branch" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-32 overflow-y-auto border rounded-md p-2 space-y-1", children: students.map((student) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", id: `student-${student.id}`, checked: form.studentIds.includes(student.id), onChange: (e) => {
                if (e.target.checked) {
                  setForm({
                    ...form,
                    studentIds: [...form.studentIds, student.id]
                  });
                } else {
                  setForm({
                    ...form,
                    studentIds: form.studentIds.filter((id) => id !== student.id)
                  });
                }
              }, className: "rounded border-gray-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: `student-${student.id}`, className: "text-sm cursor-pointer flex-1", children: [
                student.name,
                " (",
                student.roll_number,
                ")",
                student.classes && ` - ${student.classes.name}`
              ] })
            ] }, student.id)) }),
            form.studentIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              form.studentIds.length,
              " student(s) selected"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setShowForm(false), className: "flex-1", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: submitting, className: "flex-1 gap-2", children: [
            submitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            editing ? "Update" : "Create"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  BranchAdminParents as component
};
