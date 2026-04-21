import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { QrCode, Trophy, Gift, Sparkles, Zap, ArrowRight, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "StarPoints — Learn, Earn, Shine ✨" },
      { name: "description", content: "A playful school rewards app where students earn points, climb the leaderboard, and redeem fun rewards with a tap of their QR card." },
      { property: "og:title", content: "StarPoints — Learn, Earn, Shine ✨" },
      { property: "og:description", content: "Gamified learning for classrooms. Points, badges, leaderboards, and a rewards shop kids actually love." },
    ],
  }),
});

function Index() {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated && user) {
      if (user.role === "admin") navigate({ to: "/admin/dashboard" });
      else if (user.role === "teacher") navigate({ to: "/teacher/dashboard" });
      else if (user.role === "parent") navigate({ to: "/parent/dashboard" });
      else navigate({ to: "/student/dashboard" });
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-4xl animate-bounce">🎓</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Decorative pastel blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg shadow-lg shadow-primary/30">
            ✨
          </div>
          <span className="text-lg font-black tracking-tight text-foreground">StarPoints</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-bold text-foreground/80 hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link to="/login">
            <Button className="rounded-full px-5 font-bold shadow-md shadow-primary/30">
              Get Started <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pt-8 pb-16 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 backdrop-blur px-4 py-1.5 text-xs font-bold text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> Made for classrooms kids love
            </div>
            <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-foreground">
              Learn, Earn,{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Shine
              </span>{" "}
              ✨
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Turn every quiz, project, and gold-star moment into points. Scan, earn,
              climb the leaderboard, and redeem rewards — all in one playful app for
              students, teachers, and parents. 🎉
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link to="/login">
                <Button size="lg" className="rounded-full px-7 h-12 text-base font-bold shadow-xl shadow-primary/30 hover:scale-105 transition-transform">
                  Start Earning <Zap className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="rounded-full px-7 h-12 text-base font-bold bg-white/60 backdrop-blur border-2">
                  See how it works
                </Button>
              </a>
            </div>
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-5 text-xs text-muted-foreground font-semibold">
              <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-secondary text-secondary" /> Loved by teachers</div>
              <div>🧒 Kid-friendly</div>
              <div>📱 Mobile-first</div>
            </div>
          </div>

          {/* Animated illustration */}
          <div className="relative mx-auto w-full max-w-md animate-fade-in">
            <div className="relative aspect-square">
              {/* Glass card phone */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xl border border-white/60 shadow-2xl shadow-primary/20" />

              {/* Student avatar */}
              <div className="absolute top-8 left-8 flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur px-3 py-2 shadow-lg animate-fade-in">
                <div className="text-3xl">🧑‍🎓</div>
                <div>
                  <div className="text-xs font-black text-foreground">Maaz</div>
                  <div className="text-[10px] text-muted-foreground">Class 7A</div>
                </div>
              </div>

              {/* Points popup */}
              <div className="absolute top-6 right-6 rounded-2xl bg-gradient-to-br from-primary to-accent px-4 py-3 text-center shadow-xl shadow-primary/40 animate-bounce" style={{ animationDuration: "2.5s" }}>
                <div className="text-[10px] font-bold text-white/80">+ Points</div>
                <div className="text-2xl font-black text-white">+50 ⚡</div>
              </div>

              {/* QR code */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-5 shadow-2xl">
                <div className="grid grid-cols-6 gap-1">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 w-3 rounded-sm ${
                        [0, 1, 2, 5, 6, 10, 12, 13, 17, 20, 22, 25, 27, 28, 31, 33, 35].includes(i)
                          ? "bg-foreground"
                          : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 text-center text-[10px] font-black tracking-widest text-foreground">SCAN ME</div>
              </div>

              {/* Floating emojis */}
              <div className="absolute bottom-10 left-6 text-4xl animate-bounce" style={{ animationDuration: "3s" }}>🏆</div>
              <div className="absolute bottom-16 right-10 text-3xl animate-bounce" style={{ animationDuration: "2s", animationDelay: "0.5s" }}>🎁</div>
              <div className="absolute top-1/3 right-4 text-2xl animate-pulse">⭐</div>
              <div className="absolute bottom-4 right-1/3 text-2xl animate-pulse" style={{ animationDelay: "1s" }}>💜</div>

              {/* Teacher card */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur px-3 py-2 shadow-lg">
                <div className="text-2xl">👩‍🏫</div>
                <div className="text-[10px] font-bold text-foreground">Ms. Qurat ul Ain scanned!</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-5 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-bold text-accent">
            🎯 Everything you need
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black text-foreground">
            Built for joyful learning
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Four playful tools that turn classrooms into adventures.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              icon: Zap,
              emoji: "⚡",
              title: "Points System",
              desc: "Teachers award points instantly for great work, kindness, and effort. Auto-calculated by activity/quiz rules.",
              tint: "from-primary/20 to-primary/5",
              iconColor: "text-primary",
            },
            {
              icon: Trophy,
              emoji: "🏆",
              title: "Badges",
              desc: "Earn badges as you climb — Bronze, Silver, Gold and beyond.",
              tint: "from-secondary/30 to-secondary/5",
              iconColor: "text-secondary-foreground",
            },
            {
              icon: Gift,
              emoji: "🎁",
              title: "Rewards Shop",
              desc: "Spend points on real treats — homework passes, stickers, extra recess. Admins set the catalog.",
              tint: "from-accent/20 to-accent/5",
              iconColor: "text-accent",
            },
            {
              icon: QrCode,
              emoji: "📱",
              title: "QR Card",
              desc: "Every student has a unique QR. Teachers scan, points fly, parents get notified. Magic.",
              tint: "from-primary/20 to-accent/10",
              iconColor: "text-primary",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`group relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br ${f.tint} backdrop-blur-xl p-6 shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 backdrop-blur text-3xl shadow-md">
                  {f.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                    {f.title}
                    <f.icon className={`h-4 w-4 ${f.iconColor}`} />
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Roles strip */}
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { emoji: "🧑‍🎓", title: "Students", desc: "Earn, collect badges, redeem rewards" },
            { emoji: "👩‍🏫", title: "Teachers", desc: "Scan QR, award points in seconds" },
            { emoji: "👨‍👩‍👧", title: "Parents", desc: "Get notified when kids shine" },
          ].map((r) => (
            <div key={r.title} className="rounded-3xl border border-white/60 bg-white/50 backdrop-blur-xl p-5 text-center shadow-md">
              <div className="text-4xl">{r.emoji}</div>
              <div className="mt-2 font-black text-foreground">{r.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="relative mt-16 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-accent to-secondary p-10 text-center shadow-2xl shadow-primary/30">
          <div className="absolute -top-10 -right-10 text-9xl opacity-20">✨</div>
          <div className="absolute -bottom-8 -left-8 text-9xl opacity-20">🎉</div>
          <h3 className="relative text-3xl sm:text-4xl font-black text-white">
            Ready to make learning sparkle?
          </h3>
          <p className="relative mt-3 text-white/90 max-w-md mx-auto">
            Join classrooms turning every gold-star moment into a celebration.
          </p>
          <Link to="/login" className="relative inline-block mt-6">
            <Button size="lg" className="rounded-full px-8 h-12 bg-white text-primary hover:bg-white/90 font-black text-base shadow-xl hover:scale-105 transition-transform">
              Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/40 bg-white/30 backdrop-blur py-6 text-center text-xs text-muted-foreground">
        Made with 💜 for curious kids • © {new Date().getFullYear()} StarPoints
      </footer>
    </div>
  );
}
