import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/vendor/profile")({
  component: VendorProfile,
});

function VendorProfile() {
  const [v, setV] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    const { data } = await (supabase as any).from("vendors").select("*").limit(1).single();
    setV(data);
  }
  async function save() {
    if (!v) return;
    setSaving(true);
    const { error } = await (supabase as any).from("vendors").update({
      shop_name: v.shop_name,
      owner_name: v.owner_name,
      phone: v.phone,
      address: v.address,
      city: v.city,
    }).eq("id", v.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  }

  function downloadPNG() {
    const svg = qrWrapperRef.current?.querySelector("svg");
    if (!svg || !v?.id) return;

    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const qrImg = new Image();
    qrImg.onload = () => {
      const scale = 2;
      const cardW = 360 * scale;
      const cardH = 470 * scale;
      const canvas = document.createElement("canvas");
      canvas.width = cardW;
      canvas.height = cardH;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = "#ffffff";
      roundRect(ctx, 0, 0, cardW, cardH, 28 * scale);
      ctx.fill();

      ctx.strokeStyle = "rgba(15, 23, 42, 0.08)";
      ctx.lineWidth = 2 * scale;
      roundRect(ctx, 0, 0, cardW, cardH, 28 * scale);
      ctx.stroke();

      ctx.fillStyle = "#0f172a";
      ctx.font = `bold ${18 * scale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("StarPoints✨", cardW / 2, 34 * scale);

      ctx.fillStyle = "#111827";
      ctx.font = `bold ${22 * scale}px sans-serif`;
      ctx.fillText(v.shop_name || "Vendor Shop", cardW / 2, 96 * scale);

      ctx.fillStyle = "#6b7280";
      ctx.font = `${13 * scale}px sans-serif`;
      ctx.fillText("Vendor QR Code", cardW / 2, 130 * scale);

      const qrBoxSize = 210 * scale;
      const qrBoxX = (cardW - qrBoxSize) / 2;
      const qrBoxY = 158 * scale;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 18 * scale);
      ctx.fill();
      ctx.drawImage(qrImg, qrBoxX + 10 * scale, qrBoxY + 10 * scale, qrBoxSize - 20 * scale, qrBoxSize - 20 * scale);

      const codeBoxY = 390 * scale;
      const codeBoxH = 48 * scale;
      ctx.fillStyle = "#f3f4f6";
      roundRect(ctx, 24 * scale, codeBoxY, cardW - 48 * scale, codeBoxH, 16 * scale);
      ctx.fill();

      ctx.fillStyle = "#374151";
      ctx.font = `${11 * scale}px sans-serif`;
      ctx.fillText("Vendor code", cardW / 2, codeBoxY + 16 * scale);

      ctx.fillStyle = "#111827";
      ctx.font = `bold ${16 * scale}px sans-serif`;
      const codeText = String(v.id).slice(0, 8).toUpperCase();
      ctx.fillText(codeText, cardW / 2, codeBoxY + 32 * scale);

      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `${(v.shop_name || "vendor").replace(/\s+/g, "_")}_QR.png`;
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

  if (!v) return <div className="text-center py-6 text-sm text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Your shop details</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col items-center justify-center text-center space-y-2 rounded-2xl border border-dashed bg-muted/30 p-4">
            <div ref={qrWrapperRef} className="bg-white p-3 rounded-2xl inline-block border">
              <QRCodeSVG value={`vendor:${v.id}`} size={170} level="H" />
            </div>
            <p className="text-xs text-muted-foreground">Scan this QR code to identify your vendor account</p>
            <Button onClick={downloadPNG} className="w-full rounded-xl gap-2">
              <Download className="h-4 w-4" /> Download PNG
            </Button>
          </div>

          <div className="space-y-3">
            <div><Label className="text-xs">Shop name</Label><Input value={v.shop_name || ""} onChange={(e) => setV({ ...v, shop_name: e.target.value })} className="rounded-xl" /></div>
            <div><Label className="text-xs">Owner name</Label><Input value={v.owner_name || ""} onChange={(e) => setV({ ...v, owner_name: e.target.value })} className="rounded-xl" /></div>
            <div><Label className="text-xs">Email</Label><Input value={v.email || ""} disabled className="rounded-xl" /></div>
            <div><Label className="text-xs">Phone</Label><Input value={v.phone || ""} onChange={(e) => setV({ ...v, phone: e.target.value })} className="rounded-xl" /></div>
            <div><Label className="text-xs">Address</Label><Input value={v.address || ""} onChange={(e) => setV({ ...v, address: e.target.value })} className="rounded-xl" /></div>
            <div><Label className="text-xs">City</Label><Input value={v.city || ""} onChange={(e) => setV({ ...v, city: e.target.value })} className="rounded-xl" /></div>
            <Button onClick={save} disabled={saving} className="w-full rounded-xl">{saving ? "Saving..." : "Save"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}