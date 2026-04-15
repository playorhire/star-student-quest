import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/student/qr")({
  component: StudentQR,
});

function StudentQR() {
  const { user } = useAuth();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    const { data } = await supabase.from("students").select("*, classes(name)").eq("user_id", user!.id).single();
    setStudent(data);
  }

  if (!student) return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">📱</div></div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <Card className="border-2 border-primary/20 w-full max-w-xs">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-2">{student.avatar_emoji}</div>
          <h2 className="text-lg font-black text-foreground">{student.name}</h2>
          <p className="text-xs text-muted-foreground mb-4">{student.classes?.name} • Roll #{student.roll_number}</p>
          <div className="bg-white p-4 rounded-2xl inline-block">
            <QRCodeSVG value={student.qr_code} size={200} level="H" />
          </div>
          <p className="text-xs text-muted-foreground mt-4">Show this to your teacher to receive points</p>
        </CardContent>
      </Card>
    </div>
  );
}
