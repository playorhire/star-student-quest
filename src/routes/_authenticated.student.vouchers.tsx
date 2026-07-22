import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { Download, Printer, Ticket, ShoppingBag, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/student/vouchers")({
  component: StudentVouchers,
});

function StudentVouchers() {
  const { user } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    setLoading(true);
    const { data: s } = await supabase
      .from("students")
      .select("id, name, total_points, avatar_emoji, student_code, roll_number, classes(name)")
      .eq("user_id", user!.id)
      .single();
    setStudent(s);

    if (s) {
      const { data: v } = await (supabase as any)
        .from("reward_redemptions")
        .select(`
          id, points_used, voucher_code, status, redeemed_at, expires_at, collected_at,
          vendor_products(product_name, description, category),
          vendors(shop_name, logo_url)
        `)
        .eq("student_id", s.id)
        .order("redeemed_at", { ascending: false });
      setVouchers(v || []);
    }
    setLoading(false);
  }

  function downloadVoucherPNG(voucher: any) {
    const wrapper = document.getElementById(`voucher-${voucher.id}`);
    if (!wrapper) return;

    const svg = wrapper.querySelector("svg");
    if (!svg) return;

    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const qrImg = new Image();
    qrImg.onload = () => {
      const scale = 2;
      const cardW = 340 * scale;
      const cardH = 520 * scale;
      const canvas = document.createElement("canvas");
      canvas.width = cardW;
      canvas.height = cardH;
      const ctx = canvas.getContext("2d")!;

      // Card background
      const r = 24 * scale;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, 0, 0, cardW, cardH, r);
      ctx.fill();

      // Card border - gradient style
      ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
      ctx.lineWidth = 2 * scale;
      roundRect(ctx, 0, 0, cardW, cardH, r);
      ctx.stroke();

      // Header bar
      ctx.fillStyle = "#059669";
      roundRect(ctx, 0, 0, cardW, 60 * scale, { tl: r, tr: r, bl: 0, br: 0 });
      ctx.fill();

      // Header text
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${16 * scale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🎁 Bookshop Gift Voucher", cardW / 2, 30 * scale);

      // Student name
      ctx.fillStyle = "#111827";
      ctx.font = `bold ${20 * scale}px sans-serif`;
      ctx.fillText(student.name, cardW / 2, 95 * scale);

      // Class & Roll
      ctx.fillStyle = "#6b7280";
      ctx.font = `${13 * scale}px sans-serif`;
      ctx.fillText(
        `${student.classes?.name || ""} • Roll #${student.roll_number || ""}`,
        cardW / 2,
        120 * scale
      );

      // Product name
      ctx.fillStyle = "#059669";
      ctx.font = `bold ${15 * scale}px sans-serif`;
      ctx.fillText(voucher.vendor_products?.product_name || "Gift Item", cardW / 2, 150 * scale);

      // Shop name
      ctx.fillStyle = "#6b7280";
      ctx.font = `${12 * scale}px sans-serif`;
      ctx.fillText(voucher.vendors?.shop_name || "Bookshop", cardW / 2, 170 * scale);

      // QR white box
      const qrBoxSize = 200 * scale;
      const qrBoxX = (cardW - qrBoxSize) / 2;
      const qrBoxY = 185 * scale;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 16 * scale);
      ctx.fill();

      // QR code image
      ctx.drawImage(qrImg, qrBoxX + 10 * scale, qrBoxY + 10 * scale, qrBoxSize - 20 * scale, qrBoxSize - 20 * scale);

      // Voucher code section
      const codeBoxY = 405 * scale;
      const codeBoxH = 70 * scale;
      ctx.fillStyle = "#f0fdf4";
      roundRect(ctx, 24 * scale, codeBoxY, cardW - 48 * scale, codeBoxH, 16 * scale);
      ctx.fill();

      // Voucher code label
      ctx.fillStyle = "#059669";
      ctx.font = `${11 * scale}px sans-serif`;
      ctx.fillText("Voucher Code", cardW / 2, codeBoxY + 20 * scale);

      // Voucher code
      ctx.fillStyle = "#111827";
      ctx.font = `bold ${26 * scale}px sans-serif`;
      const codeText = String(voucher.voucher_code || "");
      const letterSpacing = 5 * scale;
      const totalWidth = ctx.measureText(codeText).width + (codeText.length - 1) * letterSpacing;
      let codeX = (cardW - totalWidth) / 2;
      for (const char of codeText) {
        ctx.fillText(char, codeX + ctx.measureText(char).width / 2, codeBoxY + 52 * scale);
        codeX += ctx.measureText(char).width + letterSpacing;
      }

      // Points used
      ctx.fillStyle = "#6b7280";
      ctx.font = `${11 * scale}px sans-serif`;
      ctx.fillText(`${voucher.points_used} points redeemed`, cardW / 2, cardH - 20 * scale);

      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `Voucher_${voucher.voucher_code}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    qrImg.src = url;
  }

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    radii: number | { tl: number; tr: number; bl: number; br: number }
  ) {
    const r = typeof radii === "number" ? { tl: radii, tr: radii, bl: radii, br: radii } : radii;
    ctx.beginPath();
    ctx.moveTo(x + r.tl, y);
    ctx.lineTo(x + w - r.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    ctx.lineTo(x + w, y + h - r.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    ctx.lineTo(x + r.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    ctx.lineTo(x, y + r.tl);
    ctx.quadraticCurveTo(x, y, x + r.tl, y);
    ctx.closePath();
  }

  function printVoucher(voucher: any) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow pop-ups to print");
      return;
    }

    const statusColor = voucher.status === "collected" ? "#d1fae5" : voucher.status === "cancelled" ? "#fee2e2" : "#fef3c7";
    const statusTextColor = voucher.status === "collected" ? "#065f46" : voucher.status === "cancelled" ? "#991b1b" : "#92400e";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Voucher - ${voucher.voucher_code}</title>
        <style>
          @page { margin: 0; size: auto; }
          body {
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f3f4f6;
          }
          .voucher-card {
            width: 340px;
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            border: 2px solid rgba(16, 185, 129, 0.2);
          }
          .header {
            background: linear-gradient(135deg, #059669, #10b981);
            padding: 20px;
            text-align: center;
            color: white;
          }
          .header h1 { margin: 0; font-size: 18px; }
          .header .emoji { font-size: 28px; display: block; margin-bottom: 4px; }
          .body { padding: 20px; text-align: center; }
          .student-name { font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 4px; }
          .student-info { font-size: 13px; color: #6b7280; margin: 0 0 8px; }
          .product-name { font-size: 15px; font-weight: 700; color: #059669; margin: 0 0 2px; }
          .shop-name { font-size: 12px; color: #6b7280; margin: 0 0 12px; }
          .qr-wrapper {
            background: white;
            border-radius: 16px;
            padding: 10px;
            display: inline-block;
            border: 2px solid #e5e7eb;
          }
          .qr-wrapper svg { display: block; width: 180px; height: 180px; }
          .code-section {
            background: #f0fdf4;
            border-radius: 16px;
            padding: 12px;
            margin-top: 12px;
          }
          .code-label { font-size: 11px; color: #059669; margin: 0 0 4px; }
          .code-value {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 6px;
            color: #111827;
            font-family: 'Courier New', monospace;
            margin: 0;
          }
          .points { font-size: 11px; color: #6b7280; margin-top: 8px; }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            background: ${statusColor};
            color: ${statusTextColor};
            margin-top: 8px;
          }
          .footer {
            text-align: center;
            padding: 12px;
            font-size: 10px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
          }
          @media print {
            body { background: white; padding: 0; }
            .voucher-card { box-shadow: none; border: 2px solid #d1d5db; }
          }
        </style>
      </head>
      <body>
        <div class="voucher-card">
          <div class="header">
            <span class="emoji">🎁</span>
            <h1>Bookshop Gift Voucher</h1>
          </div>
          <div class="body">
            <p class="student-name">${student.name}</p>
            <p class="student-info">${student.classes?.name || ""} • Roll #${student.roll_number || ""}</p>
            <p class="product-name">${voucher.vendor_products?.product_name || "Gift Item"}</p>
            <p class="shop-name">${voucher.vendors?.shop_name || "Bookshop"}</p>
            <div class="qr-wrapper" id="qr-${voucher.id}">
              ${new XMLSerializer().serializeToString(
                (document.getElementById(`voucher-${voucher.id}`)?.querySelector("svg")?.cloneNode(true) as SVGSVGElement) || document.createElement("svg")
              )}
            </div>
            <div class="code-section">
              <p class="code-label">Voucher Code</p>
              <p class="code-value">${voucher.voucher_code}</p>
            </div>
            <p class="points">${voucher.points_used} points redeemed</p>
            <div class="status-badge">${voucher.status.toUpperCase()}</div>
          </div>
          <div class="footer">
            Show this voucher at the bookshop counter to redeem • Valid for 30 days
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "approved":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600"><Clock className="h-3 w-3" /> Active</span>;
      case "collected":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Collected</span>;
      case "cancelled":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-600"><XCircle className="h-3 w-3" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-600">{status}</span>;
    }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  if (loading) return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">🎫</div></div>;

  return (
    <div className="space-y-4" ref={printRef}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-700 p-4 text-emerald-50 shadow-lg">
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">My Vouchers</h1>
            <p className="text-xs opacity-90">Gift vouchers for bookshop redemption</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Ticket className="h-5 w-5" />
              <span className="text-3xl font-black leading-none">{vouchers.filter(v => v.status === "approved").length}</span>
            </div>
            <div className="text-[10px] opacity-90 mt-0.5">active vouchers</div>
          </div>
        </div>
      </div>

      {vouchers.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-3">🎫</div>
            <h3 className="font-bold text-foreground mb-1">No vouchers yet</h3>
            <p className="text-sm text-muted-foreground">
              Redeem your points for bookshop items in the Rewards section to get vouchers.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {vouchers.map((v) => (
            <Card key={v.id} className="border-0 shadow-sm overflow-hidden">
              {/* Voucher Card Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-3 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span className="text-sm font-bold">Bookshop Voucher</span>
                  </div>
                  {getStatusBadge(v.status)}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* QR Code */}
                  <div className="flex-shrink-0">
                    <div
                      id={`voucher-${v.id}`}
                      className="bg-white p-2 rounded-xl border-2 border-emerald-100"
                    >
                      <QRCodeSVG
                        value={v.voucher_code}
                        size={120}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                  </div>

                  {/* Voucher Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm truncate">
                      {v.vendor_products?.product_name || "Gift Item"}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {v.vendors?.shop_name || "Bookshop"}
                    </p>
                    <div className="mt-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Voucher Code</p>
                      <p className="text-base font-black tracking-[0.25em] text-foreground font-mono">
                        {v.voucher_code}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>{v.points_used} pts</span>
                      <span>•</span>
                      <span>Exp: {formatDate(v.expires_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl h-9 text-xs gap-1.5"
                    onClick={() => downloadVoucherPNG(v)}
                    disabled={v.status === "cancelled"}
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl h-9 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => printVoucher(v)}
                    disabled={v.status === "cancelled"}
                  >
                    <Printer className="h-3.5 w-3.5" /> Print
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="border-0 bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
              <Ticket className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">How to redeem at the bookshop</h4>
              <ol className="mt-1 text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Show this voucher (QR code or code) at the bookshop counter</li>
                <li>The bookshop staff will scan your QR code or enter the voucher code</li>
                <li>Collect your gift item!</li>
              </ol>
              <p className="text-[10px] text-muted-foreground mt-2">
                Vouchers are valid for 30 days from the date of redemption. Each voucher can only be used once.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}