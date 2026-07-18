import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, C as Card, a as CardContent, B as Button } from "./_ssr/router-WWTDPtlD.mjs";
import { Q as QRCodeSVG } from "./_libs/qrcode.react.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { a8 as Copy, ab as Download } from "./_libs/lucide-react.mjs";
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
function StudentQR() {
  const {
    user
  } = useAuth();
  const [student, setStudent] = reactExports.useState(null);
  const qrWrapperRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (user) load();
  }, [user]);
  async function load() {
    const {
      data
    } = await supabase.from("students").select("*, classes(name)").eq("user_id", user.id).single();
    setStudent(data);
  }
  function downloadPNG() {
    const svg = qrWrapperRef.current?.querySelector("svg");
    if (!svg) return;
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8"
    });
    const url = URL.createObjectURL(svgBlob);
    const qrImg = new Image();
    qrImg.onload = () => {
      const scale = 2;
      const cardW = 340 * scale;
      const cardH = 540 * scale;
      const canvas = document.createElement("canvas");
      canvas.width = cardW;
      canvas.height = cardH;
      const ctx = canvas.getContext("2d");
      const r = 24 * scale;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, 0, 0, cardW, cardH, r);
      ctx.fill();
      ctx.strokeStyle = "rgba(99, 102, 241, 0.2)";
      ctx.lineWidth = 2 * scale;
      roundRect(ctx, 0, 0, cardW, cardH, r);
      ctx.stroke();
      ctx.fillStyle = "#111827";
      ctx.font = `bold ${18 * scale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("StarPoints✨", cardW / 2, 28 * scale);
      ctx.fillStyle = "#111827";
      ctx.font = `bold ${22 * scale}px sans-serif`;
      ctx.fillText(student.name, cardW / 2, 115 * scale);
      ctx.fillStyle = "#6b7280";
      ctx.font = `${14 * scale}px sans-serif`;
      ctx.fillText(`${student.classes?.name || ""} • Roll #${student.roll_number || ""}`, cardW / 2, 145 * scale);
      const qrBoxSize = 220 * scale;
      const qrBoxX = (cardW - qrBoxSize) / 2;
      const qrBoxY = 170 * scale;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 16 * scale);
      ctx.fill();
      ctx.drawImage(qrImg, qrBoxX + 10 * scale, qrBoxY + 10 * scale, qrBoxSize - 20 * scale, qrBoxSize - 20 * scale);
      const codeBoxY = 410 * scale;
      const codeBoxH = 80 * scale;
      ctx.fillStyle = "#f3f4f6";
      roundRect(ctx, 24 * scale, codeBoxY, cardW - 48 * scale, codeBoxH, 16 * scale);
      ctx.fill();
      ctx.fillStyle = "#6b7280";
      ctx.font = `${12 * scale}px sans-serif`;
      ctx.fillText("Manual entry code", cardW / 2, codeBoxY + 22 * scale);
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
      ctx.fillStyle = "#6b7280";
      ctx.font = `${12 * scale}px sans-serif`;
      ctx.fillText("Show QR or share the code with your teacher,", cardW / 2, cardH - 28 * scale);
      ctx.fillText("Question ! 0331-897-2780.", cardW / 2, cardH - 12 * scale);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `${student.name.replace(/\s+/g, "_")}_Student_Card.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    qrImg.src = url;
  }
  function roundRect(ctx, x, y, w, h, r) {
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
  if (!student) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl animate-bounce", children: "📱" }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh] space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-primary/20 w-full max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", children: student.avatar_emoji }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-black text-foreground", children: student.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-4", children: [
        student.classes?.name,
        " • Roll #",
        student.roll_number
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: qrWrapperRef, className: "bg-white p-4 rounded-2xl inline-block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeSVG, { value: student.qr_code, size: 200, level: "H" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-3 rounded-xl bg-muted", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Manual entry code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: copyCode, className: "text-2xl font-black tracking-widest text-foreground flex items-center gap-2 mx-auto", children: [
          student.student_code,
          /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4 text-muted-foreground" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-3", children: "Show QR or share the code with your teacher" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: downloadPNG, className: "w-full max-w-xs gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
      " Download Card as PNG"
    ] })
  ] });
}
export {
  StudentQR as component
};
