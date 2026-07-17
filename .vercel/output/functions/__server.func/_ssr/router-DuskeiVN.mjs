import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as toast, T as Toaster$1 } from "../_libs/sonner.mjs";
import { H as Html5Qrcode } from "../_libs/html5-qrcode.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { R as Root2, V as Value, T as Trigger, I as Icon, P as Portal, C as Content2, a as Viewport, b as Item, c as ItemIndicator, d as ItemText, S as ScrollUpButton, e as ScrollDownButton, L as Label, f as Separator } from "../_libs/radix-ui__react-select.mjs";
import { R as Root, I as Image, F as Fallback } from "../_libs/radix-ui__react-avatar.mjs";
import { c as confetti } from "../_libs/canvas-confetti.mjs";
import { T as Trash2, C as ChevronDown, a as Check, b as ChevronUp } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "tslib";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
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
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
function createSupabaseClient() {
  const SUPABASE_URL = "https://yhppzdvhemngdtpeegru.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlocHB6ZHZoZW1uZ2R0cGVlZ3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTEzNjQsImV4cCI6MjA5MTc4NzM2NH0.gpPmnLLwyfVV0mqjlLvmKwI8MFfsxsVgWA7Xke2S12Y";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
function getFunctionErrorMessage(error, data) {
  if (error && typeof error === "object") {
    const maybe = error;
    if (typeof maybe.message === "string" && maybe.message && !/httperror/i.test(maybe.message)) {
      return maybe.message;
    }
    if (typeof maybe.details === "string" && maybe.details) {
      return maybe.details;
    }
    if (typeof maybe.error === "string" && maybe.error) {
      return maybe.error;
    }
  }
  if (data && typeof data === "object") {
    const payload = data;
    if (typeof payload.error === "string" && payload.error) return payload.error;
    if (typeof payload.message === "string" && payload.message) return payload.message;
  }
  if (typeof data === "string" && data) {
    return data;
  }
  return "The request could not be completed. Please try again.";
}
async function getFunctionErrorPayload(error) {
  if (!error || typeof error !== "object") return void 0;
  const context = error.context;
  if (!context || typeof context !== "object" || !("clone" in context)) return void 0;
  try {
    const response = context.clone();
    const contentType = response.headers.get("content-type") || "";
    return contentType.includes("application/json") ? await response.json() : await response.text();
  } catch {
    return void 0;
  }
}
async function normalizeFunctionError(error, data) {
  if (error instanceof Error) {
    const message = error.message;
    if (/httperror/i.test(message) || /unexpected end of json input/i.test(message)) {
      const payload = data ?? await getFunctionErrorPayload(error);
      return new Error(getFunctionErrorMessage(error, payload));
    }
  }
  return error;
}
function wrapFunctions(functions) {
  return new Proxy(functions, {
    get(target, prop, receiver) {
      if (prop === "invoke") {
        return async (name, options) => {
          const result = await target.invoke(name, options);
          if (result?.error) {
            return {
              ...result,
              error: await normalizeFunctionError(result.error, result.data)
            };
          }
          if (result?.data && typeof result.data === "object" && "error" in result.data) {
            const payload = result.data;
            if (typeof payload.error === "string" && payload.error) {
              return {
                ...result,
                error: new Error(payload.error)
              };
            }
          }
          return result;
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    const value = Reflect.get(_supabase, prop, receiver);
    if (prop === "functions") {
      return wrapFunctions(value);
    }
    return value;
  }
});
const AuthContext = reactExports.createContext(null);
async function fetchUserRole(userId) {
  let result = await supabase.from("user_roles").select("tenant_role, school_id, branch_id, role").eq("user_id", userId).eq("is_primary", true).limit(1).single();
  if (result.error) {
    console.warn("Tenant columns missing, falling back to legacy role:", result.error.message);
    result = await supabase.from("user_roles").select("role").eq("user_id", userId).limit(1).single();
  }
  if (!result.data) return null;
  const data = result.data;
  const tenantRole = data.tenant_role || data.role || "student";
  return {
    id: userId,
    email: "",
    role: tenantRole,
    schoolId: data.school_id || null,
    branchId: data.branch_id || null
  };
}
function buildAuthUser(supaUser, roleData) {
  return {
    id: supaUser.id,
    email: supaUser.email || "",
    role: roleData?.role || "student",
    schoolId: roleData?.schoolId || null,
    branchId: roleData?.branchId || null
  };
}
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: session2 } }) => {
      setSession(session2);
      if (session2?.user) {
        const roleData = await fetchUserRole(session2.user.id);
        if (roleData) {
          setUser(buildAuthUser(session2.user, roleData));
        }
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session2) => {
        setSession(session2);
        if (session2?.user) {
          fetchUserRole(session2.user.id).then((roleData) => {
            if (roleData) {
              setUser(buildAuthUser(session2.user, roleData));
            } else {
              setUser(null);
            }
          });
        } else {
          setUser(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);
  const login = reactExports.useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);
  const signup = reactExports.useCallback(async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }, []);
  const logout = reactExports.useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: { isAuthenticated: !!user, user, session, loading, login, signup, logout }, children });
}
function useAuth() {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const appCss = "/assets/styles-B4CVjKN8.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-7xl mb-4", children: "🔍" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    )
  ] }) });
}
const Route$17 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Student Rewards App" },
      { name: "description", content: "Gamified student rewards system with QR scanning and point tracking" },
      { property: "og:title", content: "Student Rewards App" },
      { name: "twitter:title", content: "Student Rewards App" },
      { property: "og:description", content: "Gamified student rewards system with QR scanning and point tracking" },
      { name: "twitter:description", content: "Gamified student rewards system with QR scanning and point tracking" },
      { name: "twitter:card", content: "summary" },
      { property: "og:type", content: "website" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { style: { fontFamily: "'Nunito', sans-serif" }, children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-center", closeButton: true })
  ] });
}
const $$splitComponentImporter$15 = () => import("./reset-password-CpO6hEcI.mjs");
const Route$16 = createFileRoute("/reset-password")({
  component: lazyRouteComponent($$splitComponentImporter$15, "component"),
  head: () => ({
    meta: [{
      title: "Reset password — StarPoints"
    }, {
      name: "description",
      content: "Set a new password for your StarPoints account."
    }]
  })
});
const $$splitComponentImporter$14 = () => import("./register-school-gP5k1Ovl.mjs");
const Route$15 = createFileRoute("/register-school")({
  component: lazyRouteComponent($$splitComponentImporter$14, "component"),
  head: () => ({
    meta: [{
      title: "Register your school — StarPoints"
    }, {
      name: "description",
      content: "Create your StarPoints school admin account in seconds."
    }]
  })
});
const $$splitComponentImporter$13 = () => import("./login-dTk9XfDj.mjs");
const Route$14 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$13, "component"),
  head: () => ({
    meta: [{
      title: "Login — Student Rewards App"
    }, {
      name: "description",
      content: "Sign in to access the Student Rewards system"
    }]
  })
});
const $$splitComponentImporter$12 = () => import("./forgot-password-BHTJtSRt.mjs");
const Route$13 = createFileRoute("/forgot-password")({
  component: lazyRouteComponent($$splitComponentImporter$12, "component"),
  head: () => ({
    meta: [{
      title: "Forgot password — StarPoints"
    }, {
      name: "description",
      content: "Reset your StarPoints account password."
    }]
  })
});
const $$splitComponentImporter$11 = () => import("../_authenticated-Py9sCbd7.mjs");
const Route$12 = createFileRoute("/_authenticated")({
  component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
const $$splitComponentImporter$10 = () => import("./index-Cxw-tL6F.mjs");
const Route$11 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$10, "component"),
  head: () => ({
    meta: [{
      title: "StarPoints — Learn, Earn, Shine ✨"
    }, {
      name: "description",
      content: "A playful school rewards app where students earn points, climb the leaderboard, and redeem fun rewards with a tap of their QR card."
    }, {
      property: "og:title",
      content: "StarPoints — Learn, Earn, Shine ✨"
    }, {
      property: "og:description",
      content: "Gamified learning for classrooms. Points, badges, leaderboards, and a rewards shop kids actually love."
    }]
  })
});
const $$splitComponentImporter$$ = () => import("../_authenticated.vendor-DMWjESna.mjs");
const Route$10 = createFileRoute("/_authenticated/vendor")({
  component: lazyRouteComponent($$splitComponentImporter$$, "component")
});
const $$splitComponentImporter$_ = () => import("../_authenticated.teacher-DpNmdiI-.mjs");
const Route$$ = createFileRoute("/_authenticated/teacher")({
  component: lazyRouteComponent($$splitComponentImporter$_, "component")
});
const $$splitComponentImporter$Z = () => import("../_authenticated.super-admin-uU71a6LG.mjs");
const Route$_ = createFileRoute("/_authenticated/super-admin")({
  component: lazyRouteComponent($$splitComponentImporter$Z, "component")
});
const $$splitComponentImporter$Y = () => import("../_authenticated.student-0dWEoqgw.mjs");
const Route$Z = createFileRoute("/_authenticated/student")({
  component: lazyRouteComponent($$splitComponentImporter$Y, "component")
});
const $$splitComponentImporter$X = () => import("../_authenticated.school-admin-CNOecOSM.mjs");
const Route$Y = createFileRoute("/_authenticated/school-admin")({
  component: lazyRouteComponent($$splitComponentImporter$X, "component")
});
const $$splitComponentImporter$W = () => import("../_authenticated.parent-CJ7I4QZO.mjs");
const Route$X = createFileRoute("/_authenticated/parent")({
  component: lazyRouteComponent($$splitComponentImporter$W, "component")
});
const $$splitComponentImporter$V = () => import("../_authenticated.branch-admin-CSUlcHKT.mjs");
const Route$W = createFileRoute("/_authenticated/branch-admin")({
  component: lazyRouteComponent($$splitComponentImporter$V, "component")
});
const $$splitComponentImporter$U = () => import("../_authenticated.admin-DgzSklQj.mjs");
const Route$V = createFileRoute("/_authenticated/admin")({
  component: lazyRouteComponent($$splitComponentImporter$U, "component")
});
const $$splitComponentImporter$T = () => import("../_authenticated.vendor.redeemed-DKhRbbt8.mjs");
const Route$U = createFileRoute("/_authenticated/vendor/redeemed")({
  component: lazyRouteComponent($$splitComponentImporter$T, "component")
});
const $$splitComponentImporter$S = () => import("../_authenticated.vendor.profile-D4BcWImi.mjs");
const Route$T = createFileRoute("/_authenticated/vendor/profile")({
  component: lazyRouteComponent($$splitComponentImporter$S, "component")
});
const $$splitComponentImporter$R = () => import("../_authenticated.vendor.products-BICE2Nmw.mjs");
const Route$S = createFileRoute("/_authenticated/vendor/products")({
  component: lazyRouteComponent($$splitComponentImporter$R, "component")
});
const $$splitComponentImporter$Q = () => import("../_authenticated.vendor.orders-Cms-9Ggq.mjs");
const Route$R = createFileRoute("/_authenticated/vendor/orders")({
  component: lazyRouteComponent($$splitComponentImporter$Q, "component")
});
const $$splitComponentImporter$P = () => import("../_authenticated.vendor.dashboard-DIo4-2m8.mjs");
const Route$Q = createFileRoute("/_authenticated/vendor/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$P, "component")
});
const $$splitComponentImporter$O = () => import("../_authenticated.teacher.students-Ca_edmSj.mjs");
const Route$P = createFileRoute("/_authenticated/teacher/students")({
  component: lazyRouteComponent($$splitComponentImporter$O, "component")
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Card = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Select = Root2;
const SelectValue = Value;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = Trigger.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Content2,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = Content2.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = Label.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
    ]
  }
));
SelectItem.displayName = Item.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = Separator.displayName;
const Avatar = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = Root.displayName;
const AvatarImage = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = Image.displayName;
const AvatarFallback = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = Fallback.displayName;
const Route$O = createFileRoute("/_authenticated/teacher/scan")({
  component: TeacherScan
});
function TeacherScan() {
  const { user } = useAuth();
  const [step, setStep] = reactExports.useState("scanning");
  const [teacherId, setTeacherId] = reactExports.useState(null);
  const [student, setStudent] = reactExports.useState(null);
  const [subjectsForClass, setSubjectsForClass] = reactExports.useState([]);
  const [transactions, setTransactions] = reactExports.useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = reactExports.useState("");
  const [marks, setMarks] = reactExports.useState("");
  const [calculatedPoints, setCalculatedPoints] = reactExports.useState(0);
  const [studentsForClasses, setStudentsForClasses] = reactExports.useState([]);
  const [manualCode, setManualCode] = reactExports.useState("");
  const [scannerError, setScannerError] = reactExports.useState(null);
  const [isScannerLoading, setIsScannerLoading] = reactExports.useState(false);
  const [scanSuccess, setScanSuccess] = reactExports.useState(false);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = reactExports.useState(null);
  const scannerRef = reactExports.useRef(null);
  const scannerInstanceRef = reactExports.useRef(null);
  const scanLockRef = reactExports.useRef(false);
  const extractLookupTokens = reactExports.useCallback((value) => {
    const raw = value.trim();
    if (!raw) return [];
    const tokens = /* @__PURE__ */ new Set([raw]);
    try {
      const decoded = decodeURIComponent(raw);
      if (decoded) tokens.add(decoded.trim());
    } catch {
    }
    const looksLikeUrl = /^https?:\/\//i.test(raw);
    if (looksLikeUrl) {
      try {
        const url = new URL(raw);
        const queryCode = url.searchParams.get("code") || url.searchParams.get("student_code") || url.searchParams.get("qr_code");
        if (queryCode) tokens.add(queryCode.trim());
        const segments = url.pathname.split("/").filter(Boolean);
        const last = segments[segments.length - 1];
        if (last) tokens.add(last.trim());
      } catch {
      }
    }
    if (raw.startsWith("{") && raw.endsWith("}")) {
      try {
        const parsed = JSON.parse(raw);
        const possibleCode = parsed.qr_code || parsed.student_code || parsed.code || parsed.studentCode || parsed.qrCode;
        if (typeof possibleCode === "string" && possibleCode.trim()) {
          tokens.add(possibleCode.trim());
        }
      } catch {
      }
    }
    return Array.from(tokens).filter(Boolean);
  }, []);
  const findStudentFromCode = reactExports.useCallback(async (input) => {
    const candidates = extractLookupTokens(input);
    if (candidates.length === 0) return null;
    const { data: qrMatches, error: qrError } = await supabase.from("students").select("*").in("qr_code", candidates).limit(1);
    if (!qrError && qrMatches && qrMatches.length > 0) {
      return qrMatches[0];
    }
    const upperCandidates = Array.from(new Set(candidates.map((value) => value.toUpperCase())));
    const { data: codeMatches, error: codeError } = await supabase.from("students").select("*").in("student_code", upperCandidates).limit(1);
    if (codeError) {
      throw codeError;
    }
    return codeMatches?.[0] ?? null;
  }, [extractLookupTokens]);
  reactExports.useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data: teacher } = await supabase.from("teachers").select("id, branch_id").eq("user_id", user.id).maybeSingle();
      if (!teacher) {
        setStudentsForClasses([]);
        return;
      }
      setTeacherId(teacher.id);
      const { data: assignments } = await supabase.from("teacher_assignments").select("class_id").eq("teacher_id", teacher.id);
      const classIds = (assignments ?? []).map((a) => a.class_id);
      if (classIds.length === 0) {
        setStudentsForClasses([]);
        return;
      }
      const studentQuery = supabase.from("students").select("id, name, roll_number, total_points, avatar_emoji, class_id, section, qr_code").eq("school_id", user.schoolId).in("class_id", classIds);
      if (teacher.branch_id) {
        studentQuery.eq("branch_id", teacher.branch_id);
      }
      const { data: students } = await studentQuery;
      setStudentsForClasses(students || []);
    };
    load();
  }, [user]);
  const loadStudentData = reactExports.useCallback(async (studentData) => {
    setStudent(studentData);
    const { data: subs } = await supabase.from("subjects").select("id, name, point_rules(passing_marks, multiplier, min_marks, max_marks)").eq("class_id", studentData.class_id);
    setSubjectsForClass(subs || []);
    const { data: tx } = await supabase.from("point_transactions").select("*, subjects(name)").eq("student_id", studentData.id).order("created_at", { ascending: false });
    setTransactions(tx || []);
    setStep("student-found");
  }, []);
  reactExports.useEffect(() => {
    if (!student?.id) return;
    const channel = supabase.channel(`scan-student-${student.id}`).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "students", filter: `id=eq.${student.id}` },
      (payload) => {
        if (payload.new) setStudent((s) => ({ ...s, ...payload.new }));
      }
    ).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "point_transactions", filter: `student_id=eq.${student.id}` },
      async () => {
        const { data: tx } = await supabase.from("point_transactions").select("*, subjects(name)").eq("student_id", student.id).order("created_at", { ascending: false });
        setTransactions(tx || []);
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [student?.id]);
  const getRule = () => {
    const sub = subjectsForClass.find((s) => s.id === selectedSubjectId);
    const r = sub?.point_rules;
    return r ? { passing: Number(r.passing_marks), multiplier: Number(r.multiplier), min: Number(r.min_marks), max: Number(r.max_marks) } : null;
  };
  const handleMarksChange = (val) => {
    setMarks(val);
    const num = parseInt(val, 10);
    const rule = getRule();
    if (rule && !isNaN(num)) {
      const points = Math.floor((num - rule.passing) * rule.multiplier);
      setCalculatedPoints(points > 0 ? points : 0);
    } else {
      setCalculatedPoints(0);
    }
  };
  const getActiveTeacherId = reactExports.useCallback(async () => {
    if (teacherId) return teacherId;
    if (!user?.id) return null;
    const { data: teacher, error } = await supabase.from("teachers").select("id").eq("user_id", user.id).maybeSingle();
    if (error) {
      throw error;
    }
    if (teacher?.id) {
      setTeacherId(teacher.id);
      return teacher.id;
    }
    return null;
  }, [teacherId, user?.id]);
  const handleConfirm = async () => {
    if (!student) {
      toast.error("Select a student first");
      return;
    }
    if (!selectedSubjectId) {
      toast.error("Select an activity/quiz first");
      return;
    }
    if (!marks.trim()) {
      toast.error("Enter the student's marks");
      return;
    }
    const score = parseInt(marks, 10);
    if (isNaN(score)) {
      toast.error("Enter a valid numeric mark");
      return;
    }
    const rule = getRule();
    if (!rule) {
      toast.error("This activity/quiz doesn't have a point rule configured yet");
      return;
    }
    if (score < rule.min || score > rule.max) {
      toast.error(`Marks must be between ${rule.min} and ${rule.max}`);
      return;
    }
    const points = Math.floor((score - rule.passing) * rule.multiplier);
    const awardedPoints = points > 0 ? points : 0;
    if (awardedPoints < 1) {
      toast.error("Points must be at least 1 to award");
      return;
    }
    let activeTeacherId = null;
    try {
      activeTeacherId = await getActiveTeacherId();
    } catch (error) {
      toast.error(error?.message || "Unable to verify teacher profile");
      return;
    }
    if (!activeTeacherId) {
      toast.error("Teacher profile not found. Please re-login and try again.");
      return;
    }
    const payload = {
      student_id: student.id,
      teacher_id: activeTeacherId,
      subject_id: selectedSubjectId,
      marks_entered: score,
      passing_marks: rule.passing,
      multiplier: rule.multiplier,
      points_awarded: awardedPoints,
      school_id: student.school_id || null,
      branch_id: student.branch_id || user?.branchId || null
    };
    if (isEditing && selectedTransactionId) {
      const { error } = await supabase.from("point_transactions").update(payload).eq("id", selectedTransactionId);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Points updated");
    } else {
      const { error } = await supabase.from("point_transactions").insert(payload);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(`+${awardedPoints} points awarded`);
    }
    await loadStudentData(student);
    confetti();
    setStep("confirmed");
    setIsEditing(false);
  };
  const handleDelete = async (id) => {
    if (!student) return;
    if (!confirm("Delete this points record? Student total will be adjusted.")) return;
    const deletedTx = transactions.find((tx) => tx.id === id);
    const { error } = await supabase.from("point_transactions").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Record deleted");
    if (deletedTx) {
      const pointsRemoved = Number(deletedTx.points_awarded ?? 0);
      setStudent((current) => current ? { ...current, total_points: Number(current.total_points ?? 0) - pointsRemoved } : current);
      setTransactions((current) => current.filter((tx) => tx.id !== id));
    }
    if (selectedTransactionId === id) {
      setSelectedTransactionId(null);
      setIsEditing(false);
      setMarks("");
      setSelectedSubjectId("");
      setCalculatedPoints(0);
    }
  };
  const handleTransactionSelect = (id) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;
    setSelectedTransactionId(id);
    setSelectedSubjectId(tx.subject_id);
    setMarks(String(tx.marks_entered));
    setCalculatedPoints(tx.points_awarded);
    setIsEditing(true);
  };
  const handleReset = () => {
    setStep("scanning");
    setStudent(null);
    setSelectedSubjectId("");
    setMarks("");
    setCalculatedPoints(0);
    setIsEditing(false);
    setSelectedTransactionId(null);
    setManualCode("");
    setScannerError(null);
    scanLockRef.current = false;
  };
  const handleManualLookup = async () => {
    const code = manualCode.trim();
    if (!code) return;
    let data = null;
    try {
      data = await findStudentFromCode(code);
    } catch (error) {
      toast.error(error?.message || "Unable to fetch student details");
      return;
    }
    if (!data) {
      toast.error("No student found with that code");
      return;
    }
    await loadStudentData(data);
  };
  const playScanBeep = reactExports.useCallback(() => {
    try {
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(900, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.16, audioCtx.currentTime);
      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.14);
      oscillator.onended = () => {
        audioCtx.close().catch(() => void 0);
      };
    } catch {
    }
  }, []);
  const stopScanner = reactExports.useCallback(async () => {
    if (!scannerInstanceRef.current) return;
    try {
      await scannerInstanceRef.current.stop();
    } catch {
    }
    try {
      scannerInstanceRef.current.clear();
    } catch {
    }
    if (scannerRef.current) scannerRef.current.innerHTML = "";
    scannerInstanceRef.current = null;
  }, []);
  reactExports.useEffect(() => {
    if (step !== "scanning") return;
    if (!scannerRef.current) return;
    const scanner = new Html5Qrcode("html5qr-scanner", { verbose: false });
    scannerInstanceRef.current = scanner;
    let active = true;
    scanLockRef.current = false;
    const initScanner = async () => {
      setScannerError(null);
      setIsScannerLoading(true);
      try {
        const cameras = await Html5Qrcode.getCameras().catch(() => []);
        if (!active) return;
        const preferred = cameras.find(
          (camera) => /rear|back|environment/i.test(camera.label || "")
        );
        const cameraConfig = preferred ? { deviceId: { exact: preferred.id } } : { facingMode: { ideal: "environment" } };
        await scanner.start(
          cameraConfig,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.2,
            disableFlip: false
          },
          async (decodedText) => {
            if (scanLockRef.current) return;
            scanLockRef.current = true;
            const scannedCode = decodedText.trim();
            if (!scannedCode) {
              scanLockRef.current = false;
              return;
            }
            let studentRow = null;
            try {
              studentRow = await findStudentFromCode(scannedCode);
            } catch (error) {
              scanLockRef.current = false;
              toast.error(error?.message || "Unable to verify scanned code");
              return;
            }
            if (!studentRow) {
              scanLockRef.current = false;
              toast.error("No student found for scanned QR code");
              return;
            }
            playScanBeep();
            setScanSuccess(true);
            window.setTimeout(() => setScanSuccess(false), 1e3);
            setStudent(studentRow);
            setStep("scan-confirm");
            void stopScanner();
          },
          () => void 0
        );
        setIsScannerLoading(false);
      } catch (error) {
        if (!active) return;
        setScannerError(error?.message || "Please allow camera permissions.");
        setIsScannerLoading(false);
      }
    };
    initScanner();
    return () => {
      active = false;
      scanLockRef.current = false;
      void stopScanner();
    };
  }, [step, findStudentFromCode, playScanBeep, stopScanner]);
  reactExports.useEffect(() => {
    if (step === "scanning") return;
    void stopScanner();
  }, [step, stopScanner]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Assign Points" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Scan QR codes or select students to award points" }),
      step === "scanning" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: studentsForClasses.length > 0 ? `${studentsForClasses.length} student${studentsForClasses.length !== 1 ? "s" : ""} loaded from your assigned classes` : "Loading students for your assigned classes..." })
    ] }),
    step === "scanning" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-dashed border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-primary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12l3-3m-3 3l-3-3m-3 7h2.01M12 12v4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "Ready to Assign" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Choose how you'd like to find a student" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-primary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", children: "Select from your class" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (id) => {
            const s = studentsForClasses.find((x) => x.id === id);
            if (s) loadStudentData(s);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose a student..." }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: studentsForClasses.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.avatar_emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "#",
                s.roll_number
              ] })
            ] }) }, s.id)) })
          ] }),
          studentsForClasses.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No students assigned to your classes yet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Contact an admin to assign you to a class in ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Admin → Teachers" }),
              "."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-full border-t" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-background px-2 text-muted-foreground", children: "Or" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-primary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12l3-3m-3 3l-3-3m-3 7h2.01M12 12v4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", children: "Scan Student QR" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                id: "html5qr-scanner",
                ref: scannerRef,
                className: `rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-[280px] border-2 border-dashed ${scanSuccess ? "border-emerald-400 bg-emerald-50/60 dark:bg-emerald-900/30 animate-pulse" : "border-gray-300 dark:border-gray-600"}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 text-center", children: isScannerLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Starting camera... please allow access." }) : scannerError ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-500", children: scannerError }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Position the student QR code inside the frame. Scan runs automatically." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-full border-t" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-background px-2 text-muted-foreground", children: "Or" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-primary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", children: "Enter Code Manually" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. A1B2C3",
                value: manualCode,
                onChange: (e) => setManualCode(e.target.value.toUpperCase()),
                maxLength: 12,
                className: "tracking-widest font-mono uppercase text-center"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleManualLookup, disabled: !manualCode.trim(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) })
          ] })
        ] })
      ] }) })
    ] }),
    student && step === "scan-confirm" && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { children: student.photo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: student.photo_url, alt: student.name }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: student.avatar_emoji || "🎓" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.2em] text-muted-foreground", children: "Scan Confirmed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-card-foreground", children: student.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "#",
              student.roll_number
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-primary", children: student.total_points ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Current Points" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "flex-1",
            onClick: async () => {
              if (!student) return;
              await loadStudentData(student);
            },
            children: "Confirm and Assign Points"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => {
              setStudent(null);
              setStep("scanning");
              scanLockRef.current = false;
            },
            children: "Scan Again"
          }
        )
      ] })
    ] }) }),
    student && step === "student-found" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { children: student.photo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: student.photo_url, alt: student.name }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: student.avatar_emoji || "🎓" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.2em] text-muted-foreground", children: "Student selected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-card-foreground", children: student.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "#",
              student.roll_number,
              " • Class ",
              student.classes?.name
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black text-primary", children: student.total_points }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Points" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-primary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: isEditing ? "Edit Points Record" : "Award Points" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Activity/Quiz" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedSubjectId, onValueChange: (v) => {
            setSelectedSubjectId(v);
            setCalculatedPoints(0);
            setMarks("");
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose activity/quiz..." }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: subjectsForClass.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id)) })
          ] })
        ] }),
        selectedSubjectId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Marks Scored" }),
            (() => {
              const rule = getRule();
              return rule ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground bg-muted px-2 py-1 rounded", children: [
                "Range: ",
                rule.min,
                "–",
                rule.max,
                " • Pass: ",
                rule.passing,
                " • ×",
                rule.multiplier
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded", children: "No rule configured" });
            })()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: getRule()?.min ?? 0,
              max: getRule()?.max ?? 100,
              placeholder: "Enter marks...",
              value: marks,
              onChange: (e) => handleMarksChange(e.target.value),
              className: "text-center text-lg font-mono"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Enter the marks this student scored for this activity/quiz" })
        ] }),
        marks && selectedSubjectId && (() => {
          const rule = getRule();
          const score = parseInt(marks, 10);
          const outOfRange = rule && !isNaN(score) && (score < rule.min || score > rule.max);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-lg p-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Points Calculation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-lg font-bold ${calculatedPoints > 0 ? "text-green-600" : "text-muted-foreground"}`, children: calculatedPoints > 0 ? `+${calculatedPoints} points` : "No points" })
            ] }),
            rule && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Formula: (marks - passing) × multiplier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "(",
                score,
                " - ",
                rule.passing,
                ") × ",
                rule.multiplier,
                " = ",
                calculatedPoints > 0 ? calculatedPoints : 0,
                " points"
              ] })
            ] }),
            outOfRange && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-amber-700 bg-amber-50 dark:bg-amber-950 p-2 rounded border border-amber-200 dark:border-amber-800", children: [
              "⚠️ Marks must be between ",
              rule?.min,
              " and ",
              rule?.max
            ] }),
            !rule && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded border border-red-200 dark:border-red-800", children: "❌ No point rule configured for this activity/quiz" })
          ] });
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleConfirm,
              className: "flex-1",
              disabled: !selectedSubjectId || !marks || (() => {
                const rule = getRule();
                const score = parseInt(marks, 10);
                if (!rule) return false;
                if (isNaN(score) || score < rule.min || score > rule.max) return true;
                return Math.floor((score - rule.passing) * rule.multiplier) < 1;
              })(),
              children: isEditing ? "Update Record" : "Award Points"
            }
          ),
          isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => {
                setIsEditing(false);
                setSelectedTransactionId(null);
                setMarks("");
                setSelectedSubjectId("");
                setCalculatedPoints(0);
              },
              children: "Cancel"
            }
          )
        ] })
      ] }) }),
      transactions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-primary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "Recent Records" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: transactions.slice(0, 5).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `p-3 rounded-lg border cursor-pointer transition-colors ${selectedTransactionId === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`,
            onClick: () => handleTransactionSelect(t.id),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: t.subjects?.name || "Activity/Quiz" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  t.marks_entered,
                  " marks • ",
                  new Date(t.created_at).toLocaleDateString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `font-bold ${t.points_awarded > 0 ? "text-green-600" : "text-muted-foreground"}`, children: [
                  "+",
                  t.points_awarded
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "ghost",
                    onClick: (e) => {
                      e.stopPropagation();
                      handleDelete(t.id);
                    },
                    className: "h-6 w-6 text-destructive hover:text-destructive",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                  }
                )
              ] })
            ] })
          },
          t.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handleReset, className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16l-4-4m0 0l4-4m-4 4h18" }) }),
        "Choose Different Student"
      ] })
    ] }),
    step === "confirmed" && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 text-center space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-10 h-10 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-green-800 dark:text-green-200", children: "Points Awarded!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-green-700 dark:text-green-300", children: [
          student?.name,
          " has been awarded ",
          calculatedPoints,
          " points"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleReset, className: "flex-1 bg-green-600 hover:bg-green-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12l3-3m-3 3l-3-3m-3 7h2.01M12 12v4" }) }),
          "Next Student"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => setStep("student-found"),
            className: "flex-1 border-green-300 text-green-700 hover:bg-green-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 17l-5-5m0 0l5-5m-5 5h12" }) }),
              "Back to ",
              student?.name
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
const $$splitComponentImporter$N = () => import("../_authenticated.teacher.rewards-CNZWvq7L.mjs");
const Route$N = createFileRoute("/_authenticated/teacher/rewards")({
  component: lazyRouteComponent($$splitComponentImporter$N, "component")
});
const $$splitComponentImporter$M = () => import("../_authenticated.teacher.profile-Fr916Q5c.mjs");
const Route$M = createFileRoute("/_authenticated/teacher/profile")({
  component: lazyRouteComponent($$splitComponentImporter$M, "component")
});
const $$splitComponentImporter$L = () => import("../_authenticated.teacher.notifications-DtoWYxec.mjs");
const Route$L = createFileRoute("/_authenticated/teacher/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$L, "component")
});
const $$splitComponentImporter$K = () => import("../_authenticated.teacher.messages-C6TBximP.mjs");
const Route$K = createFileRoute("/_authenticated/teacher/messages")({
  component: lazyRouteComponent($$splitComponentImporter$K, "component")
});
const $$splitComponentImporter$J = () => import("../_authenticated.teacher.history-DpYOswRJ.mjs");
const Route$J = createFileRoute("/_authenticated/teacher/history")({
  component: lazyRouteComponent($$splitComponentImporter$J, "component")
});
const $$splitComponentImporter$I = () => import("../_authenticated.teacher.help-DITmwiP8.mjs");
const Route$I = createFileRoute("/_authenticated/teacher/help")({
  component: lazyRouteComponent($$splitComponentImporter$I, "component")
});
const $$splitComponentImporter$H = () => import("../_authenticated.teacher.dashboard-DWRHSMst.mjs");
const Route$H = createFileRoute("/_authenticated/teacher/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$H, "component")
});
const $$splitComponentImporter$G = () => import("../_authenticated.super-admin.vendors-BYUZoAfw.mjs");
const Route$G = createFileRoute("/_authenticated/super-admin/vendors")({
  component: lazyRouteComponent($$splitComponentImporter$G, "component")
});
const $$splitComponentImporter$F = () => import("../_authenticated.super-admin.settings-hzKyBIAl.mjs");
const Route$F = createFileRoute("/_authenticated/super-admin/settings")({
  component: lazyRouteComponent($$splitComponentImporter$F, "component")
});
const $$splitComponentImporter$E = () => import("../_authenticated.super-admin.schools-OW4LGaFE.mjs");
const Route$E = createFileRoute("/_authenticated/super-admin/schools")({
  component: lazyRouteComponent($$splitComponentImporter$E, "component")
});
const $$splitComponentImporter$D = () => import("../_authenticated.super-admin.school-admins-Cr4slohM.mjs");
const Route$D = createFileRoute("/_authenticated/super-admin/school-admins")({
  component: lazyRouteComponent($$splitComponentImporter$D, "component")
});
const $$splitComponentImporter$C = () => import("../_authenticated.super-admin.roles-D2axFxFB.mjs");
const Route$C = createFileRoute("/_authenticated/super-admin/roles")({
  component: lazyRouteComponent($$splitComponentImporter$C, "component")
});
const $$splitComponentImporter$B = () => import("../_authenticated.super-admin.dashboard-D4_ar-QD.mjs");
const Route$B = createFileRoute("/_authenticated/super-admin/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$B, "component")
});
const $$splitComponentImporter$A = () => import("../_authenticated.super-admin.assign-school-2Jlgz4PO.mjs");
const Route$A = createFileRoute("/_authenticated/super-admin/assign-school")({
  component: lazyRouteComponent($$splitComponentImporter$A, "component")
});
const $$splitComponentImporter$z = () => import("../_authenticated.student.rewards-BvVzalgW.mjs");
const Route$z = createFileRoute("/_authenticated/student/rewards")({
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
});
const $$splitComponentImporter$y = () => import("../_authenticated.student.qr-ZNc9Wamw.mjs");
const Route$y = createFileRoute("/_authenticated/student/qr")({
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("../_authenticated.student.notifications-DKUhgqju.mjs");
const Route$x = createFileRoute("/_authenticated/student/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("../_authenticated.student.history-BlYMV5t1.mjs");
const Route$w = createFileRoute("/_authenticated/student/history")({
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("../_authenticated.student.help-CT_Sjo-N.mjs");
const Route$v = createFileRoute("/_authenticated/student/help")({
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("../_authenticated.student.dashboard-C5Ct45U6.mjs");
const Route$u = createFileRoute("/_authenticated/student/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("../_authenticated.school-admin.teachers-CSXQaU59.mjs");
const Route$t = createFileRoute("/_authenticated/school-admin/teachers")({
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("../_authenticated.school-admin.students-B4BLWuYH.mjs");
const Route$s = createFileRoute("/_authenticated/school-admin/students")({
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("../_authenticated.school-admin.rewards-DBrHWbI_.mjs");
const Route$r = createFileRoute("/_authenticated/school-admin/rewards")({
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("../_authenticated.school-admin.help-B2X0r4v1.mjs");
const Route$q = createFileRoute("/_authenticated/school-admin/help")({
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("../_authenticated.school-admin.dashboard-CW6i8xKR.mjs");
const Route$p = createFileRoute("/_authenticated/school-admin/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("../_authenticated.school-admin.branches-C3n5lZLe.mjs");
const Route$o = createFileRoute("/_authenticated/school-admin/branches")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("../_authenticated.school-admin.branch-admins-6JrAMypq.mjs");
const Route$n = createFileRoute("/_authenticated/school-admin/branch-admins")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("../_authenticated.school-admin.assign-branch-admin-D5rijiwY.mjs");
const Route$m = createFileRoute("/_authenticated/school-admin/assign-branch-admin")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("../_authenticated.parent.profile-C10o6YUs.mjs");
const Route$l = createFileRoute("/_authenticated/parent/profile")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("../_authenticated.parent.notifications-BHXYx18m.mjs");
const Route$k = createFileRoute("/_authenticated/parent/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("../_authenticated.parent.messages-DqFIY0WW.mjs");
const Route$j = createFileRoute("/_authenticated/parent/messages")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component"),
  validateSearch: (search) => ({
    with: typeof search.with === "string" ? search.with : void 0,
    name: typeof search.name === "string" ? search.name : void 0
  })
});
const $$splitComponentImporter$i = () => import("../_authenticated.parent.dashboard-DVHuS94r.mjs");
const Route$i = createFileRoute("/_authenticated/parent/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("../_authenticated.branch-admin.teachers-BqBFWa0D.mjs");
const Route$h = createFileRoute("/_authenticated/branch-admin/teachers")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("../_authenticated.branch-admin.students-B-aICO9Z.mjs");
const Route$g = createFileRoute("/_authenticated/branch-admin/students")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("../_authenticated.branch-admin.rewards-CqQRLSvG.mjs");
const Route$f = createFileRoute("/_authenticated/branch-admin/rewards")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("../_authenticated.branch-admin.parents-BMQz64RF.mjs");
const Route$e = createFileRoute("/_authenticated/branch-admin/parents")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("../_authenticated.branch-admin.houses-D6JCJN7O.mjs");
const Route$d = createFileRoute("/_authenticated/branch-admin/houses")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("../_authenticated.branch-admin.help-D1qs3Nvi.mjs");
const Route$c = createFileRoute("/_authenticated/branch-admin/help")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("../_authenticated.branch-admin.dashboard-xEL-XZ-v.mjs");
const Route$b = createFileRoute("/_authenticated/branch-admin/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("../_authenticated.branch-admin.classes-EgJxvJND.mjs");
const Route$a = createFileRoute("/_authenticated/branch-admin/classes")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("../_authenticated.branch-admin.badges-BvMedTJI.mjs");
const Route$9 = createFileRoute("/_authenticated/branch-admin/badges")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("../_authenticated.admin.teachers-BLhOD9V5.mjs");
const Route$8 = createFileRoute("/_authenticated/admin/teachers")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("../_authenticated.admin.students-DmwYTA9E.mjs");
const Route$7 = createFileRoute("/_authenticated/admin/students")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("../_authenticated.admin.rules-DE6TI_7Z.mjs");
const Route$6 = createFileRoute("/_authenticated/admin/rules")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("../_authenticated.admin.rewards-bz0QCWhV.mjs");
const Route$5 = createFileRoute("/_authenticated/admin/rewards")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("../_authenticated.admin.profile-Cih9PmnL.mjs");
const Route$4 = createFileRoute("/_authenticated/admin/profile")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("../_authenticated.admin.parents-BM8hOx5K.mjs");
const Route$3 = createFileRoute("/_authenticated/admin/parents")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("../_authenticated.admin.dashboard-9dpNiGcP.mjs");
const Route$2 = createFileRoute("/_authenticated/admin/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_authenticated.admin.classes-Bjsi1YMz.mjs");
const Route$1 = createFileRoute("/_authenticated/admin/classes")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("../_authenticated.admin.badges-iNEDCHyh.mjs");
const Route = createFileRoute("/_authenticated/admin/badges")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ResetPasswordRoute = Route$16.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$17
});
const RegisterSchoolRoute = Route$15.update({
  id: "/register-school",
  path: "/register-school",
  getParentRoute: () => Route$17
});
const LoginRoute = Route$14.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$17
});
const ForgotPasswordRoute = Route$13.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => Route$17
});
const AuthenticatedRoute = Route$12.update({
  id: "/_authenticated",
  getParentRoute: () => Route$17
});
const IndexRoute = Route$11.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$17
});
const AuthenticatedVendorRoute = Route$10.update({
  id: "/vendor",
  path: "/vendor",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedTeacherRoute = Route$$.update({
  id: "/teacher",
  path: "/teacher",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedSuperAdminRoute = Route$_.update({
  id: "/super-admin",
  path: "/super-admin",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedStudentRoute = Route$Z.update({
  id: "/student",
  path: "/student",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedSchoolAdminRoute = Route$Y.update({
  id: "/school-admin",
  path: "/school-admin",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedParentRoute = Route$X.update({
  id: "/parent",
  path: "/parent",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedBranchAdminRoute = Route$W.update({
  id: "/branch-admin",
  path: "/branch-admin",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedAdminRoute = Route$V.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedVendorRedeemedRoute = Route$U.update({
  id: "/redeemed",
  path: "/redeemed",
  getParentRoute: () => AuthenticatedVendorRoute
});
const AuthenticatedVendorProfileRoute = Route$T.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AuthenticatedVendorRoute
});
const AuthenticatedVendorProductsRoute = Route$S.update({
  id: "/products",
  path: "/products",
  getParentRoute: () => AuthenticatedVendorRoute
});
const AuthenticatedVendorOrdersRoute = Route$R.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AuthenticatedVendorRoute
});
const AuthenticatedVendorDashboardRoute = Route$Q.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedVendorRoute
});
const AuthenticatedTeacherStudentsRoute = Route$P.update({
  id: "/students",
  path: "/students",
  getParentRoute: () => AuthenticatedTeacherRoute
});
const AuthenticatedTeacherScanRoute = Route$O.update({
  id: "/scan",
  path: "/scan",
  getParentRoute: () => AuthenticatedTeacherRoute
});
const AuthenticatedTeacherRewardsRoute = Route$N.update({
  id: "/rewards",
  path: "/rewards",
  getParentRoute: () => AuthenticatedTeacherRoute
});
const AuthenticatedTeacherProfileRoute = Route$M.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AuthenticatedTeacherRoute
});
const AuthenticatedTeacherNotificationsRoute = Route$L.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AuthenticatedTeacherRoute
});
const AuthenticatedTeacherMessagesRoute = Route$K.update({
  id: "/messages",
  path: "/messages",
  getParentRoute: () => AuthenticatedTeacherRoute
});
const AuthenticatedTeacherHistoryRoute = Route$J.update({
  id: "/history",
  path: "/history",
  getParentRoute: () => AuthenticatedTeacherRoute
});
const AuthenticatedTeacherHelpRoute = Route$I.update({
  id: "/help",
  path: "/help",
  getParentRoute: () => AuthenticatedTeacherRoute
});
const AuthenticatedTeacherDashboardRoute = Route$H.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedTeacherRoute
});
const AuthenticatedSuperAdminVendorsRoute = Route$G.update({
  id: "/vendors",
  path: "/vendors",
  getParentRoute: () => AuthenticatedSuperAdminRoute
});
const AuthenticatedSuperAdminSettingsRoute = Route$F.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedSuperAdminRoute
});
const AuthenticatedSuperAdminSchoolsRoute = Route$E.update({
  id: "/schools",
  path: "/schools",
  getParentRoute: () => AuthenticatedSuperAdminRoute
});
const AuthenticatedSuperAdminSchoolAdminsRoute = Route$D.update({
  id: "/school-admins",
  path: "/school-admins",
  getParentRoute: () => AuthenticatedSuperAdminRoute
});
const AuthenticatedSuperAdminRolesRoute = Route$C.update({
  id: "/roles",
  path: "/roles",
  getParentRoute: () => AuthenticatedSuperAdminRoute
});
const AuthenticatedSuperAdminDashboardRoute = Route$B.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedSuperAdminRoute
});
const AuthenticatedSuperAdminAssignSchoolRoute = Route$A.update({
  id: "/assign-school",
  path: "/assign-school",
  getParentRoute: () => AuthenticatedSuperAdminRoute
});
const AuthenticatedStudentRewardsRoute = Route$z.update({
  id: "/rewards",
  path: "/rewards",
  getParentRoute: () => AuthenticatedStudentRoute
});
const AuthenticatedStudentQrRoute = Route$y.update({
  id: "/qr",
  path: "/qr",
  getParentRoute: () => AuthenticatedStudentRoute
});
const AuthenticatedStudentNotificationsRoute = Route$x.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AuthenticatedStudentRoute
});
const AuthenticatedStudentHistoryRoute = Route$w.update({
  id: "/history",
  path: "/history",
  getParentRoute: () => AuthenticatedStudentRoute
});
const AuthenticatedStudentHelpRoute = Route$v.update({
  id: "/help",
  path: "/help",
  getParentRoute: () => AuthenticatedStudentRoute
});
const AuthenticatedStudentDashboardRoute = Route$u.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedStudentRoute
});
const AuthenticatedSchoolAdminTeachersRoute = Route$t.update({
  id: "/teachers",
  path: "/teachers",
  getParentRoute: () => AuthenticatedSchoolAdminRoute
});
const AuthenticatedSchoolAdminStudentsRoute = Route$s.update({
  id: "/students",
  path: "/students",
  getParentRoute: () => AuthenticatedSchoolAdminRoute
});
const AuthenticatedSchoolAdminRewardsRoute = Route$r.update({
  id: "/rewards",
  path: "/rewards",
  getParentRoute: () => AuthenticatedSchoolAdminRoute
});
const AuthenticatedSchoolAdminHelpRoute = Route$q.update({
  id: "/help",
  path: "/help",
  getParentRoute: () => AuthenticatedSchoolAdminRoute
});
const AuthenticatedSchoolAdminDashboardRoute = Route$p.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedSchoolAdminRoute
});
const AuthenticatedSchoolAdminBranchesRoute = Route$o.update({
  id: "/branches",
  path: "/branches",
  getParentRoute: () => AuthenticatedSchoolAdminRoute
});
const AuthenticatedSchoolAdminBranchAdminsRoute = Route$n.update({
  id: "/branch-admins",
  path: "/branch-admins",
  getParentRoute: () => AuthenticatedSchoolAdminRoute
});
const AuthenticatedSchoolAdminAssignBranchAdminRoute = Route$m.update({
  id: "/assign-branch-admin",
  path: "/assign-branch-admin",
  getParentRoute: () => AuthenticatedSchoolAdminRoute
});
const AuthenticatedParentProfileRoute = Route$l.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AuthenticatedParentRoute
});
const AuthenticatedParentNotificationsRoute = Route$k.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AuthenticatedParentRoute
});
const AuthenticatedParentMessagesRoute = Route$j.update({
  id: "/messages",
  path: "/messages",
  getParentRoute: () => AuthenticatedParentRoute
});
const AuthenticatedParentDashboardRoute = Route$i.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedParentRoute
});
const AuthenticatedBranchAdminTeachersRoute = Route$h.update({
  id: "/teachers",
  path: "/teachers",
  getParentRoute: () => AuthenticatedBranchAdminRoute
});
const AuthenticatedBranchAdminStudentsRoute = Route$g.update({
  id: "/students",
  path: "/students",
  getParentRoute: () => AuthenticatedBranchAdminRoute
});
const AuthenticatedBranchAdminRewardsRoute = Route$f.update({
  id: "/rewards",
  path: "/rewards",
  getParentRoute: () => AuthenticatedBranchAdminRoute
});
const AuthenticatedBranchAdminParentsRoute = Route$e.update({
  id: "/parents",
  path: "/parents",
  getParentRoute: () => AuthenticatedBranchAdminRoute
});
const AuthenticatedBranchAdminHousesRoute = Route$d.update({
  id: "/houses",
  path: "/houses",
  getParentRoute: () => AuthenticatedBranchAdminRoute
});
const AuthenticatedBranchAdminHelpRoute = Route$c.update({
  id: "/help",
  path: "/help",
  getParentRoute: () => AuthenticatedBranchAdminRoute
});
const AuthenticatedBranchAdminDashboardRoute = Route$b.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedBranchAdminRoute
});
const AuthenticatedBranchAdminClassesRoute = Route$a.update({
  id: "/classes",
  path: "/classes",
  getParentRoute: () => AuthenticatedBranchAdminRoute
});
const AuthenticatedBranchAdminBadgesRoute = Route$9.update({
  id: "/badges",
  path: "/badges",
  getParentRoute: () => AuthenticatedBranchAdminRoute
});
const AuthenticatedAdminTeachersRoute = Route$8.update({
  id: "/teachers",
  path: "/teachers",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminStudentsRoute = Route$7.update({
  id: "/students",
  path: "/students",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminRulesRoute = Route$6.update({
  id: "/rules",
  path: "/rules",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminRewardsRoute = Route$5.update({
  id: "/rewards",
  path: "/rewards",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminProfileRoute = Route$4.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminParentsRoute = Route$3.update({
  id: "/parents",
  path: "/parents",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminDashboardRoute = Route$2.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminClassesRoute = Route$1.update({
  id: "/classes",
  path: "/classes",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminBadgesRoute = Route.update({
  id: "/badges",
  path: "/badges",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminRouteChildren = {
  AuthenticatedAdminBadgesRoute,
  AuthenticatedAdminClassesRoute,
  AuthenticatedAdminDashboardRoute,
  AuthenticatedAdminParentsRoute,
  AuthenticatedAdminProfileRoute,
  AuthenticatedAdminRewardsRoute,
  AuthenticatedAdminRulesRoute,
  AuthenticatedAdminStudentsRoute,
  AuthenticatedAdminTeachersRoute
};
const AuthenticatedAdminRouteWithChildren = AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren);
const AuthenticatedBranchAdminRouteChildren = {
  AuthenticatedBranchAdminBadgesRoute,
  AuthenticatedBranchAdminClassesRoute,
  AuthenticatedBranchAdminDashboardRoute,
  AuthenticatedBranchAdminHelpRoute,
  AuthenticatedBranchAdminHousesRoute,
  AuthenticatedBranchAdminParentsRoute,
  AuthenticatedBranchAdminRewardsRoute,
  AuthenticatedBranchAdminStudentsRoute,
  AuthenticatedBranchAdminTeachersRoute
};
const AuthenticatedBranchAdminRouteWithChildren = AuthenticatedBranchAdminRoute._addFileChildren(
  AuthenticatedBranchAdminRouteChildren
);
const AuthenticatedParentRouteChildren = {
  AuthenticatedParentDashboardRoute,
  AuthenticatedParentMessagesRoute,
  AuthenticatedParentNotificationsRoute,
  AuthenticatedParentProfileRoute
};
const AuthenticatedParentRouteWithChildren = AuthenticatedParentRoute._addFileChildren(AuthenticatedParentRouteChildren);
const AuthenticatedSchoolAdminRouteChildren = {
  AuthenticatedSchoolAdminAssignBranchAdminRoute,
  AuthenticatedSchoolAdminBranchAdminsRoute,
  AuthenticatedSchoolAdminBranchesRoute,
  AuthenticatedSchoolAdminDashboardRoute,
  AuthenticatedSchoolAdminHelpRoute,
  AuthenticatedSchoolAdminRewardsRoute,
  AuthenticatedSchoolAdminStudentsRoute,
  AuthenticatedSchoolAdminTeachersRoute
};
const AuthenticatedSchoolAdminRouteWithChildren = AuthenticatedSchoolAdminRoute._addFileChildren(
  AuthenticatedSchoolAdminRouteChildren
);
const AuthenticatedStudentRouteChildren = {
  AuthenticatedStudentDashboardRoute,
  AuthenticatedStudentHelpRoute,
  AuthenticatedStudentHistoryRoute,
  AuthenticatedStudentNotificationsRoute,
  AuthenticatedStudentQrRoute,
  AuthenticatedStudentRewardsRoute
};
const AuthenticatedStudentRouteWithChildren = AuthenticatedStudentRoute._addFileChildren(AuthenticatedStudentRouteChildren);
const AuthenticatedSuperAdminRouteChildren = {
  AuthenticatedSuperAdminAssignSchoolRoute,
  AuthenticatedSuperAdminDashboardRoute,
  AuthenticatedSuperAdminRolesRoute,
  AuthenticatedSuperAdminSchoolAdminsRoute,
  AuthenticatedSuperAdminSchoolsRoute,
  AuthenticatedSuperAdminSettingsRoute,
  AuthenticatedSuperAdminVendorsRoute
};
const AuthenticatedSuperAdminRouteWithChildren = AuthenticatedSuperAdminRoute._addFileChildren(
  AuthenticatedSuperAdminRouteChildren
);
const AuthenticatedTeacherRouteChildren = {
  AuthenticatedTeacherDashboardRoute,
  AuthenticatedTeacherHelpRoute,
  AuthenticatedTeacherHistoryRoute,
  AuthenticatedTeacherMessagesRoute,
  AuthenticatedTeacherNotificationsRoute,
  AuthenticatedTeacherProfileRoute,
  AuthenticatedTeacherRewardsRoute,
  AuthenticatedTeacherScanRoute,
  AuthenticatedTeacherStudentsRoute
};
const AuthenticatedTeacherRouteWithChildren = AuthenticatedTeacherRoute._addFileChildren(AuthenticatedTeacherRouteChildren);
const AuthenticatedVendorRouteChildren = {
  AuthenticatedVendorDashboardRoute,
  AuthenticatedVendorOrdersRoute,
  AuthenticatedVendorProductsRoute,
  AuthenticatedVendorProfileRoute,
  AuthenticatedVendorRedeemedRoute
};
const AuthenticatedVendorRouteWithChildren = AuthenticatedVendorRoute._addFileChildren(AuthenticatedVendorRouteChildren);
const AuthenticatedRouteChildren = {
  AuthenticatedAdminRoute: AuthenticatedAdminRouteWithChildren,
  AuthenticatedBranchAdminRoute: AuthenticatedBranchAdminRouteWithChildren,
  AuthenticatedParentRoute: AuthenticatedParentRouteWithChildren,
  AuthenticatedSchoolAdminRoute: AuthenticatedSchoolAdminRouteWithChildren,
  AuthenticatedStudentRoute: AuthenticatedStudentRouteWithChildren,
  AuthenticatedSuperAdminRoute: AuthenticatedSuperAdminRouteWithChildren,
  AuthenticatedTeacherRoute: AuthenticatedTeacherRouteWithChildren,
  AuthenticatedVendorRoute: AuthenticatedVendorRouteWithChildren
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  ForgotPasswordRoute,
  LoginRoute,
  RegisterSchoolRoute,
  ResetPasswordRoute
};
const routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({
  error,
  reset
}) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  Card as C,
  Input as I,
  Route$j as R,
  CardContent as a,
  CardHeader as b,
  CardTitle as c,
  cn as d,
  buttonVariants as e,
  router as r,
  supabase as s,
  useAuth as u
};
