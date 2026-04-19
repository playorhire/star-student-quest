import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/student/qr")({
  component: StudentQR,
});

function StudentQR() {
  const { user } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    const { data } = await supabase.from("students").select("*, classes(name)").eq("user_id", user!.id).single();
    setStudent(data);
  }

  function downloadPNG() {
    const svg = qrWrapperRef.current?.querySelector("svg");
    if (!svg) return;
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const size = 600;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size + 80;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, size, size);
      ctx.fillStyle = "#000000";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Code: ${student.student_code}`, size / 2, size + 50);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `${student.name.replace(/\s+/g, "_")}_QR.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  }

  function copyCode() {
    navigator.clipboard.writeText(student.student_code);
    toast.success("Code copied");
  }

  if (!student) return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">📱</div></div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Card className="border-2 border-primary/20 w-full max-w-xs">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-2">{student.avatar_emoji}</div>
          <h2 className="text-lg font-black text-foreground">{student.name}</h2>
          <p className="text-xs text-muted-foreground mb-4">{student.classes?.name} • Roll #{student.roll_number}</p>
          <div ref={qrWrapperRef} className="bg-white p-4 rounded-2xl inline-block">
            <QRCodeSVG value={student.qr_code} size={200} level="H" />
          </div>
          <div className="mt-4 p-3 rounded-xl bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Manual entry code</p>
            <button onClick={copyCode} className="text-2xl font-black tracking-widest text-foreground flex items-center gap-2 mx-auto">
              {student.student_code}
              <Copy className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Show QR or share the code with your teacher</p>
        </CardContent>
      </Card>
      <Button onClick={downloadPNG} className="w-full max-w-xs gap-2">
        <Download className="h-4 w-4" /> Download QR as PNG
      </Button>
    </div>
  );
}
