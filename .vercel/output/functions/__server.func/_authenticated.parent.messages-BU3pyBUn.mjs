import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, R as Route$j, s as supabase } from "./_ssr/router-OBc8LoFd.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { V as Send } from "./_libs/lucide-react.mjs";
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
function ParentMessages() {
  const {
    user
  } = useAuth();
  const search = Route$j.useSearch();
  const [conversations, setConversations] = reactExports.useState([]);
  const [selectedTeacher, setSelectedTeacher] = reactExports.useState(null);
  const [selectedTeacherName, setSelectedTeacherName] = reactExports.useState("");
  const [messages, setMessages] = reactExports.useState([]);
  const [newMessage, setNewMessage] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const messagesEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (search.with) {
      setSelectedTeacher(search.with);
      setSelectedTeacherName(search.name || "Teacher");
    }
  }, [search.with, search.name]);
  reactExports.useEffect(() => {
    if (!user) return;
    loadConversations();
    const channel = supabase.channel("parent-messages").on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `receiver_id=eq.${user.id}`
    }, (payload) => {
      const newMsg = payload.new;
      if (selectedTeacher && newMsg.sender_id === selectedTeacher) {
        setMessages((prev) => [...prev, newMsg]);
      }
      loadConversations();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  reactExports.useEffect(() => {
    if (selectedTeacher) {
      loadMessages(selectedTeacher);
    }
  }, [selectedTeacher]);
  reactExports.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  async function loadConversations() {
    if (!user) return;
    const {
      data: msgs
    } = await supabase.from("messages").select("*").or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).order("created_at", {
      ascending: false
    });
    if (!msgs) {
      setLoading(false);
      return;
    }
    const convMap = /* @__PURE__ */ new Map();
    for (const m of msgs) {
      const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      if (!convMap.has(otherId)) convMap.set(otherId, {
        msgs: []
      });
      convMap.get(otherId).msgs.push(m);
    }
    const otherIds = [...convMap.keys()];
    const {
      data: teachers
    } = await supabase.from("teachers").select("user_id, name, email").in("user_id", otherIds);
    const convs = otherIds.map((id) => {
      const teacher = teachers?.find((t) => t.user_id === id);
      const ms = convMap.get(id).msgs;
      const unread = ms.filter((m) => m.receiver_id === user.id && !m.read).length;
      return {
        userId: id,
        email: teacher?.email || id,
        teacherName: teacher?.name || "Teacher",
        lastMessage: ms[0]?.content || "",
        lastAt: ms[0]?.created_at || "",
        unread
      };
    });
    setConversations(convs.sort((a, b) => b.lastAt.localeCompare(a.lastAt)));
    setLoading(false);
  }
  async function loadMessages(teacherId) {
    if (!user) return;
    const {
      data
    } = await supabase.from("messages").select("*").or(`and(sender_id.eq.${user.id},receiver_id.eq.${teacherId}),and(sender_id.eq.${teacherId},receiver_id.eq.${user.id})`).order("created_at", {
      ascending: true
    });
    setMessages(data || []);
    if (data?.length) {
      const unreadIds = data.filter((m) => m.receiver_id === user.id && !m.read).map((m) => m.id);
      if (unreadIds.length > 0) {
        await supabase.from("messages").update({
          read: true
        }).in("id", unreadIds);
      }
    }
  }
  async function sendMessage() {
    if (!newMessage.trim() || !selectedTeacher || !user) return;
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedTeacher,
      content: newMessage.trim()
    });
    setNewMessage("");
    loadMessages(selectedTeacher);
    loadConversations();
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl animate-bounce", children: "💬" }) });
  }
  if (selectedTeacher) {
    const conv = conversations.find((c) => c.userId === selectedTeacher);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-[calc(100vh-8rem)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pb-3 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedTeacher(null), className: "text-primary font-semibold text-sm", children: "← Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-foreground", children: conv?.teacherName || selectedTeacherName || "Teacher" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto py-3 space-y-2", children: [
        messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `max-w-[75%] rounded-2xl px-4 py-2 text-sm ${msg.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`, children: msg.content }) }, msg.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-3 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: newMessage, onChange: (e) => setNewMessage(e.target.value), onKeyDown: (e) => e.key === "Enter" && sendMessage(), placeholder: "Type a message...", className: "flex-1 rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: sendMessage, className: "rounded-xl bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black text-foreground", children: "Messages" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Chat with your child's teachers" })
    ] }),
    conversations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-3", children: "💬" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No conversations yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Messages will appear when a teacher starts a conversation." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: conversations.map((conv) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedTeacher(conv.userId), className: "w-full flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left hover:border-primary transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: "👩‍🏫" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-foreground", children: conv.teacherName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: conv.lastMessage })
      ] }),
      conv.unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground", children: conv.unread })
    ] }, conv.userId)) })
  ] });
}
export {
  ParentMessages as component
};
