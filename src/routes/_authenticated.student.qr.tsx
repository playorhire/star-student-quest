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

    const qrImg = new Image();
    qrImg.onload = () => {
      const scale = 2;
      const cardW = 340 * scale;
      const cardH = 540 * scale;
      const canvas = document.createElement("canvas");
      canvas.width = cardW;
      canvas.height = cardH;
      const ctx = canvas.getContext("2d")!;

      // Card background
      const r = 24 * scale;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, 0, 0, cardW, cardH, r);
      ctx.fill();

      // Card border
      ctx.strokeStyle = "rgba(99, 102, 241, 0.2)";
      ctx.lineWidth = 2 * scale;
      roundRect(ctx, 0, 0, cardW, cardH, r);
      ctx.stroke();

      // StarPoints logo
      ctx.fillStyle = "#111827";
      ctx.font = `bold ${18 * scale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("StarPoints✨", cardW / 2, 28 * scale);

      // Name
      ctx.fillStyle = "#111827";
      ctx.font = `bold ${22 * scale}px sans-serif`;
      ctx.fillText(student.name, cardW / 2, 115 * scale);

      // Class & Roll
      ctx.fillStyle = "#6b7280";
      ctx.font = `${14 * scale}px sans-serif`;
      ctx.fillText(
        `${student.classes?.name || ""} • Roll #${student.roll_number || ""}`,
        cardW / 2,
        145 * scale
      );

      // QR white box
      const qrBoxSize = 220 * scale;
      const qrBoxX = (cardW - qrBoxSize) / 2;
      const qrBoxY = 170 * scale;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 16 * scale);
      ctx.fill();

      // QR code image
      ctx.drawImage(qrImg, qrBoxX + 10 * scale, qrBoxY + 10 * scale, qrBoxSize - 20 * scale, qrBoxSize - 20 * scale);

      // Manual code section background
      const codeBoxY = 410 * scale;
      const codeBoxH = 80 * scale;
      ctx.fillStyle = "#f3f4f6";
      roundRect(ctx, 24 * scale, codeBoxY, cardW - 48 * scale, codeBoxH, 16 * scale);
      ctx.fill();

      // Manual entry label
      ctx.fillStyle = "#6b7280";
      ctx.font = `${12 * scale}px sans-serif`;
      ctx.fillText("Manual entry code", cardW / 2, codeBoxY + 22 * scale);

      // Student code (manual letter spacing for cross-browser support)
      ctx.fillStyle = "#111827";
      ctx.font = `bold ${28 * scale}px sans-serif`;
      const codeText = String(student.student_code || "");
      const letterSpacing = 6 * scale;
      const totalWidth = ctx.measureText(codeText).width + (codeText.length - 1) * letterSpacing;
      let codeX = (cardW - totalWidth) / 2;
      for (const char of codeText) {
        ctx.fillText(char, codeX + ctx.measureText(char).width / 2, codeBoxY + 56 * scale);
        codeX += ctx.measureText(char).width + letterSpacing;
      }

      // Footer text
      ctx.fillStyle = "#6b7280";
      ctx.font = `${12 * scale}px sans-serif`;
      ctx.fillText("Show QR or share the code with your teacher,", cardW / 2, cardH - 28 * scale);
      // Line 2 (new line)
      ctx.fillText("Question ! 0331-897-2780.",cardW / 2, cardH - 12 * scale);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `${student.name.replace(/\s+/g, "_")}_Student_Card.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    qrImg.src = url;
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
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
        <Download className="h-4 w-4" /> Download Card as PNG
      </Button>
    </div>
  );
}
