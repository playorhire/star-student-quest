import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";

export const Route = createFileRoute("/_authenticated/parent/messages")({
  component: ParentMessages,
});

interface Conversation {
  userId: string;
  email: string;
  teacherName: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

function ParentMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel("parent-messages")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${user.id}`,
      }, (payload) => {
        const newMsg = payload.new as Message;
        if (selectedTeacher && newMsg.sender_id === selectedTeacher) {
          setMessages(prev => [...prev, newMsg]);
        }
        loadConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    if (selectedTeacher) {
      loadMessages(selectedTeacher);
    }
  }, [selectedTeacher]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadConversations() {
    if (!user) return;
    // Get all messages involving this user
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!msgs) { setLoading(false); return; }

    // Group by other person
    const convMap = new Map<string, { msgs: Message[] }>();
    for (const m of msgs) {
      const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      if (!convMap.has(otherId)) convMap.set(otherId, { msgs: [] });
      convMap.get(otherId)!.msgs.push(m);
    }

    // Get teacher info
    const otherIds = [...convMap.keys()];
    const { data: teachers } = await supabase
      .from("teachers")
      .select("user_id, name, email")
      .in("user_id", otherIds);

    const convs: Conversation[] = otherIds.map(id => {
      const teacher = teachers?.find(t => t.user_id === id);
      const ms = convMap.get(id)!.msgs;
      const unread = ms.filter(m => m.receiver_id === user.id && !m.read).length;
      return {
        userId: id,
        email: teacher?.email || id,
        teacherName: teacher?.name || "Teacher",
        lastMessage: ms[0]?.content || "",
        lastAt: ms[0]?.created_at || "",
        unread,
      };
    });

    setConversations(convs.sort((a, b) => b.lastAt.localeCompare(a.lastAt)));
    setLoading(false);
  }

  async function loadMessages(teacherId: string) {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${teacherId}),and(sender_id.eq.${teacherId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    setMessages(data || []);

    // Mark received messages as read
    if (data?.length) {
      const unreadIds = data.filter(m => m.receiver_id === user.id && !m.read).map(m => m.id);
      if (unreadIds.length > 0) {
        await supabase.from("messages").update({ read: true }).in("id", unreadIds);
      }
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedTeacher || !user) return;
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedTeacher,
      content: newMessage.trim(),
    });
    setNewMessage("");
    loadMessages(selectedTeacher);
    loadConversations();
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">💬</div></div>;
  }

  if (selectedTeacher) {
    const conv = conversations.find(c => c.userId === selectedTeacher);
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <button onClick={() => setSelectedTeacher(null)} className="text-primary font-semibold text-sm">← Back</button>
          <div className="font-bold text-foreground">{conv?.teacherName}</div>
        </div>
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${msg.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2 pt-3 border-t border-border">
          <input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button onClick={sendMessage} className="rounded-xl bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-foreground">Messages</h2>
        <p className="text-muted-foreground text-sm">Chat with your child's teachers</p>
      </div>

      {conversations.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-muted-foreground">No conversations yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Messages will appear when a teacher starts a conversation.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => (
            <button
              key={conv.userId}
              onClick={() => setSelectedTeacher(conv.userId)}
              className="w-full flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left hover:border-primary transition-colors"
            >
              <div className="text-2xl">👩‍🏫</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-foreground">{conv.teacherName}</div>
                <div className="text-xs text-muted-foreground truncate">{conv.lastMessage}</div>
              </div>
              {conv.unread > 0 && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {conv.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
