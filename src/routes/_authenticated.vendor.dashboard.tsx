import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Package, ShoppingBag, CheckCircle2, Clock, Download } from "lucide-react";

export const Route = createFileRoute("/_authenticated/vendor/dashboard")({
  component: VendorDashboard,
});

function VendorDashboard() {
  const [stats, setStats] = useState({ products: 0, pending: 0, approved: 0, collected: 0 });
  const [monthly, setMonthly] = useState<{ month: string; count: number }[]>([]);
  const [vendor, setVendor] = useState<{ id?: string; shop_name?: string } | null>(null);
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: vendorIdRow } = await (supabase as any).rpc("get_my_vendor_id");
    const vendorId = vendorIdRow as string | null;
    if (!vendorId) return;

    const [vendorData, products, redemptions] = await Promise.all([
      (supabase as any).from("vendors").select("id, shop_name").eq("id", vendorId).single(),
      (supabase as any).from("vendor_products").select("id, admin_status").eq("vendor_id", vendorId),
      (supabase as any).from("reward_redemptions").select("id, status, redeemed_at").eq("vendor_id", vendorId),
    ]);
    setVendor(vendorData.data || null);

    const p = products.data || [];
    const r = redemptions.data || [];
    setStats({
      products: p.length,
      pending: r.filter((x: any) => x.status === "pending" || x.status === "approved").length,
      approved: r.filter((x: any) => x.status === "approved").length,
      collected: r.filter((x: any) => x.status === "collected").length,
    });

    const byMonth: Record<string, number> = {};
    r.forEach((x: any) => {
      const m = new Date(x.redeemed_at).toISOString().slice(0, 7);
      byMonth[m] = (byMonth[m] || 0) + 1;
    });
    setMonthly(Object.entries(byMonth).sort(([a],[b]) => a.localeCompare(b)).map(([month, count]) => ({ month, count })));
  }

  function downloadPNG() {
    const svg = qrWrapperRef.current?.querySelector("svg");
    if (!svg || !vendor?.id) return;

    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    // Load all images
    const qrImg = new Image();
    const sindhBankLogo = new Image();
    const starPointsLogo = new Image();
    let imagesLoaded = 0;

    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 3) {
        renderCard();
      }
    };

    const renderCard = () => {
      const scale = 2;
      const cardW = 340 * scale;
      const cardH = 480 * scale;
      const canvas = document.createElement("canvas");
      canvas.width = cardW;
      canvas.height = cardH;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = "#ffffff";
      roundRect(ctx, 0, 0, cardW, cardH, 28 * scale);
      ctx.fill();

      // Header background
      ctx.fillStyle = "#f3f4f6";
      roundRect(ctx, 0, 0, cardW, 110 * scale, 28 * scale);
      ctx.fill();

      // Draw Sindh Bank logo on left
      const logoSize = 50 * scale;
      const logoY = 20 * scale;
      try {
        ctx.drawImage(sindhBankLogo, 16 * scale, logoY, logoSize, logoSize);
      } catch (e) {
        // Fallback: draw text if logo fails
        ctx.fillStyle = "#1e3a8a";
        ctx.font = `bold ${12 * scale}px sans-serif`;
        ctx.fillText("Sindh Bank", 16 * scale + logoSize / 2, logoY + logoSize / 2);
      }

      // Draw StarPoints logo on right
      try {
        ctx.drawImage(starPointsLogo, cardW - 16 * scale - logoSize, logoY, logoSize, logoSize);
      } catch (e) {
        // Fallback: draw text if logo fails
        ctx.fillStyle = "#f59e0b";
        ctx.font = `bold ${12 * scale}px sans-serif`;
        ctx.fillText("StarPoints", cardW - 16 * scale + logoSize / 2, logoY + logoSize / 2);
      }

      ctx.fillStyle = "#111827";
      ctx.font = `bold ${20 * scale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(vendor.shop_name || "Vendor Shop", cardW / 2, 95 * scale);

      const qrBoxSize = 180 * scale;
      const qrBoxX = (cardW - qrBoxSize) / 2;
      const qrBoxY = 140 * scale;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 18 * scale);
      ctx.fill();
      ctx.drawImage(qrImg, qrBoxX + 10 * scale, qrBoxY + 10 * scale, qrBoxSize - 20 * scale, qrBoxSize - 20 * scale);

      const codeBoxY = 350 * scale;
      const codeBoxH = 52 * scale;
      ctx.fillStyle = "#f3f4f6";
      roundRect(ctx, 24 * scale, codeBoxY, cardW - 48 * scale, codeBoxH, 16 * scale);
      ctx.fill();

      ctx.fillStyle = "#374151";
      ctx.font = `${11 * scale}px sans-serif`;
      ctx.fillText("Vendor ID", cardW / 2, codeBoxY + 17 * scale);

      ctx.fillStyle = "#111827";
      ctx.font = `bold ${14 * scale}px sans-serif`;
      ctx.fillText(String(vendor.id).slice(0, 8).toUpperCase(), cardW / 2, codeBoxY + 34 * scale);

      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `${(vendor.shop_name || "vendor").replace(/\s+/g, "_")}_QR.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };

    qrImg.onload = onImageLoad;
    sindhBankLogo.onload = onImageLoad;
    starPointsLogo.onload = onImageLoad;

    qrImg.src = url;
    sindhBankLogo.src = "/logos/sindh-bank.svg";
    starPointsLogo.src = "/logos/starpoints.svg";
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

  const cards = [
    { label: "Products", value: stats.products, icon: Package, tint: "bg-primary/10 text-primary" },
    { label: "Pending", value: stats.pending, icon: Clock, tint: "bg-amber-500/10 text-amber-600" },
    { label: "Approved", value: stats.approved, icon: ShoppingBag, tint: "bg-blue-500/10 text-blue-600" },
    { label: "Collected", value: stats.collected, icon: CheckCircle2, tint: "bg-emerald-500/10 text-emerald-600" },
  ];

  const maxCount = Math.max(1, ...monthly.map((m) => m.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your shop</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <Card key={c.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${c.tint} mb-2`}>
                <c.icon className="h-4 w-4" />
              </div>
              <div className="text-2xl font-black text-foreground">{c.value}</div>
              <div className="text-xs text-muted-foreground">{c.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vendor && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="text-sm font-bold text-foreground">Vendor QR</div>
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-muted/30 p-4 text-center">
              <div ref={qrWrapperRef} className="bg-white p-3 rounded-2xl border">
                <QRCodeSVG value={`vendor:${vendor.id}`} size={160} level="H" />
              </div>
              <p className="text-xs text-muted-foreground">{vendor.shop_name || "Vendor"} QR code</p>
              <Button onClick={downloadPNG} className="w-full gap-2 rounded-xl">
                <Download className="h-4 w-4" /> Download PNG
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="mb-3 text-sm font-bold text-foreground">Monthly Redemptions</div>
          {monthly.length === 0 ? (
            <p className="text-xs text-muted-foreground">No redemptions yet</p>
          ) : (
            <div className="space-y-1.5">
              {monthly.map((m) => (
                <div key={m.month} className="flex items-center gap-2">
                  <div className="text-[10px] w-16 text-muted-foreground">{m.month}</div>
                  <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${(m.count / maxCount) * 100}%` }} />
                  </div>
                  <div className="text-xs font-bold w-8 text-right">{m.count}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}