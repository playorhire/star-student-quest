import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, B as Button } from "./router-DuskeiVN.mjs";
import "../_libs/sonner.mjs";
import "../_libs/html5-qrcode.mjs";
import "../_libs/canvas-confetti.mjs";
import { d as ArrowRight, e as Sparkles, Z as Zap, f as Star, g as Trophy, h as Gift, Q as QrCode } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
function Index() {
  const {
    isAuthenticated,
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (loading) return;
    if (isAuthenticated && user) {
      if (user.role === "super_admin") navigate({
        to: "/super-admin/dashboard"
      });
      else if (user.role === "school_admin" || user.role === "admin") navigate({
        to: "/school-admin/dashboard"
      });
      else if (user.role === "branch_admin") navigate({
        to: "/branch-admin/dashboard"
      });
      else if (user.role === "teacher") navigate({
        to: "/teacher/dashboard"
      });
      else if (user.role === "parent") navigate({
        to: "/parent/dashboard"
      });
      else if (user.role === "vendor") navigate({
        to: "/vendor/dashboard"
      });
      else navigate({
        to: "/student/dashboard"
      });
    }
  }, [isAuthenticated, user, loading, navigate]);
  if (loading || isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl animate-bounce", children: "🎓" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-40 -right-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-pulse", style: {
        animationDelay: "1s"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl animate-pulse", style: {
        animationDelay: "2s"
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg shadow-lg shadow-primary/30", children: "✨" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-black tracking-tight text-foreground", children: "StarPoints" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-bold text-foreground/80 hover:text-foreground transition-colors", children: "Log in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register-school", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "rounded-full px-5 font-bold shadow-md shadow-primary/30", children: [
          "Register School ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative z-10 mx-auto max-w-6xl px-5 pt-8 pb-16 sm:pt-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid items-center gap-10 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center lg:text-left animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 backdrop-blur px-4 py-1.5 text-xs font-bold text-primary shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
          " Made for classrooms kids love"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-5 text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-foreground", children: [
          "Learn, Earn,",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent", children: "Shine" }),
          " ",
          "✨"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0", children: "Turn every quiz, project, and gold-star moment into points. Scan, earn, climb the leaderboard, and redeem rewards — all in one playful app for students, teachers, and parents. 🎉" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register-school", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "rounded-full px-7 h-12 text-base font-bold shadow-xl shadow-primary/30 hover:scale-105 transition-transform", children: [
            "Register your School ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "ml-1 h-4 w-4" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", className: "rounded-full px-7 h-12 text-base font-bold bg-white/60 backdrop-blur border-2", children: "Log in" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center lg:justify-start gap-5 text-xs text-muted-foreground font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-secondary text-secondary" }),
            " Loved by teachers"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "🧒 Kid-friendly" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "📱 Mobile-first" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto w-full max-w-md animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xl border border-white/60 shadow-2xl shadow-primary/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-8 left-8 flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur px-3 py-2 shadow-lg animate-fade-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: "🧑‍🎓" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-black text-foreground", children: "Maaz" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "Class 7A" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-6 right-6 rounded-2xl bg-gradient-to-br from-primary to-accent px-4 py-3 text-center shadow-xl shadow-primary/40 animate-bounce", style: {
          animationDuration: "2.5s"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-white/80", children: "+ Points" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-white", children: "+50 ⚡" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-5 shadow-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-1", children: Array.from({
            length: 36
          }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-3 w-3 rounded-sm ${[0, 1, 2, 5, 6, 10, 12, 13, 17, 20, 22, 25, 27, 28, 31, 33, 35].includes(i) ? "bg-foreground" : "bg-transparent"}` }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-center text-[10px] font-black tracking-widest text-foreground", children: "SCAN ME" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-10 left-6 text-4xl animate-bounce", style: {
          animationDuration: "3s"
        }, children: "🏆" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-16 right-10 text-3xl animate-bounce", style: {
          animationDuration: "2s",
          animationDelay: "0.5s"
        }, children: "🎁" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/3 right-4 text-2xl animate-pulse", children: "⭐" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 right-1/3 text-2xl animate-pulse", style: {
          animationDelay: "1s"
        }, children: "💜" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-6 left-6 flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur px-3 py-2 shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: "👩‍🏫" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-foreground", children: "Ms. Qurat ul Ain scanned!" })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative z-10 mx-auto max-w-6xl px-5 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[2rem] border border-white/60 bg-white/60 p-6 shadow-lg shadow-primary/10 backdrop-blur-xl sm:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm font-bold uppercase tracking-[0.25em] text-muted-foreground", children: "Proudly supporting organizations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 md:grid-cols-3", children: [{
        name: "Knorr",
        src: "/logos/knorr.svg"
      }, {
        name: "EBM",
        src: "/logos/ebm.svg"
      }, {
        name: "Candyland",
        src: "/logos/candyland.svg"
      }].map((logo) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center rounded-2xl border border-primary/10 bg-white/80 p-3 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo.src, alt: logo.name, className: "h-20 w-full max-w-[180px] object-contain" }) }, logo.name)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "features", className: "relative z-10 mx-auto max-w-6xl px-5 pb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-1 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-bold text-accent", children: "🎯 Everything you need" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-3xl sm:text-4xl font-black text-foreground", children: "Built for joyful learning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground max-w-xl mx-auto", children: "Four playful tools that turn classrooms into adventures." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-5 sm:grid-cols-2", children: [{
        icon: Zap,
        emoji: "⚡",
        title: "Points System",
        desc: "Teachers award points instantly for great work, kindness, and effort. Auto-calculated by activity/quiz rules.",
        tint: "from-primary/20 to-primary/5",
        iconColor: "text-primary"
      }, {
        icon: Trophy,
        emoji: "🏆",
        title: "Badges",
        desc: "Earn badges as you climb — Bronze, Silver, Gold and beyond.",
        tint: "from-secondary/30 to-secondary/5",
        iconColor: "text-secondary-foreground"
      }, {
        icon: Gift,
        emoji: "🎁",
        title: "Rewards Shop",
        desc: "Spend points on real treats — homework passes, stickers, extra recess. Admins set the catalog.",
        tint: "from-accent/20 to-accent/5",
        iconColor: "text-accent"
      }, {
        icon: QrCode,
        emoji: "📱",
        title: "QR Card",
        desc: "Every student has a unique QR. Teachers scan, points fly, parents get notified. Magic.",
        tint: "from-primary/20 to-accent/10",
        iconColor: "text-primary"
      }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `group relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br ${f.tint} backdrop-blur-xl p-6 shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 backdrop-blur text-3xl shadow-md", children: f.emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-black text-foreground flex items-center gap-2", children: [
            f.title,
            /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: `h-4 w-4 ${f.iconColor}` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: f.desc })
        ] })
      ] }) }, f.title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14 grid gap-4 sm:grid-cols-3", children: [{
        emoji: "🧑‍🎓",
        title: "Students",
        desc: "Earn, collect badges, redeem rewards"
      }, {
        emoji: "👩‍🏫",
        title: "Teachers",
        desc: "Scan QR, award points in seconds"
      }, {
        emoji: "👨‍👩‍👧",
        title: "Parents",
        desc: "Get notified when kids shine"
      }].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-white/60 bg-white/50 backdrop-blur-xl p-5 text-center shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: r.emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 font-black text-foreground", children: r.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: r.desc })
      ] }, r.title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-16 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-accent to-secondary p-10 text-center shadow-2xl shadow-primary/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-10 -right-10 text-9xl opacity-20", children: "✨" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-8 -left-8 text-9xl opacity-20", children: "🎉" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "relative text-3xl sm:text-4xl font-black text-white", children: "Ready to make learning sparkle?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative mt-3 text-white/90 max-w-md mx-auto", children: "Join classrooms turning every gold-star moment into a celebration." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register-school", className: "relative inline-block mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "rounded-full px-8 h-12 bg-white text-primary hover:bg-white/90 font-black text-base shadow-xl hover:scale-105 transition-transform", children: [
          "Register your School ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "relative z-10 border-t border-white/40 bg-white/30 backdrop-blur py-6 text-center text-xs text-muted-foreground", children: [
      "Question ! 0331-897-2780 ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      "Made with 💜 for curious kids • © ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " StarPoints"
    ] })
  ] });
}
export {
  Index as component
};
