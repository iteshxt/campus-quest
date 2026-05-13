import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Bell, Compass, Home, Plus, Trophy, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AuthScreen } from "./AuthScreen";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "./ui/skeleton";

type Tab = { to: string; label: string; icon: typeof Home; primary?: boolean };
const tabs: Tab[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/create", label: "Create", icon: Plus, primary: true },
  { to: "/leaderboard", label: "Ranks", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppShell() {
  const { pathname } = useLocation();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: me } = useUser();

  if (loading) {
    return <div className="min-h-screen grid place-items-center"><Skeleton className="h-20 w-20 rounded-3xl" /></div>;
  }

  if (!session) {
    return <AuthScreen onLogin={() => {}} />;
  }

  // Use Laravel profile data, or fallback if still loading
  const level = me?.level || 1;
  const streak = me?.streak || 0;
  const emoji = me?.avatar_emoji || "👤";

  return (
    <div className="min-h-screen pb-28">
      <header className="mx-auto max-w-6xl px-5 pt-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-display text-lg">Q</div>
          <div className="leading-tight">
            <div className="font-display text-lg">CampusQuest</div>
            <div className="text-[11px] text-muted-foreground -mt-0.5">level {level} · {streak}🔥 streak</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button className="relative h-10 w-10 rounded-full bg-card border grid place-items-center shadow-soft">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-pink" />
          </button>
          <Link to="/profile" className="h-10 w-10 rounded-full bg-pink grid place-items-center text-lg ring-pop">{emoji}</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-6">
        <Outlet />
      </main>

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-end gap-1 px-2 py-2 rounded-full bg-card/90 backdrop-blur-xl border shadow-pop">
          {tabs.map((t) => {
            const active = pathname === t.to || (t.to !== "/" && pathname.startsWith(t.to));
            const Icon = t.icon;
            if (t.primary) {
              return (
                <Link key={t.to} to={t.to as never} className="-mt-6 h-14 w-14 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-pop ring-4 ring-background transition-all hover:-translate-y-1 active:scale-95">
                  <Icon className="h-6 w-6" />
                </Link>
              );
            }
            return (
              <Link
                key={t.to}
                to={t.to as never}
                className={`px-4 py-2 rounded-full flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all active:scale-95 ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
