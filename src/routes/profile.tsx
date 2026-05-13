import { createFileRoute } from "@tanstack/react-router";
import { QuestCard } from "@/components/QuestCard";
import { Settings, Share2, LogOut } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQuests } from "@/hooks/use-quests";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: "Profile · CampusQuest" }] }),
});

const badges = [
  { emoji: "🏆", name: "First Win", color: "bg-lemon" },
  { emoji: "🔥", name: "7-day Streak", color: "bg-pink" },
  { emoji: "🌸", name: "Botanist", color: "bg-mint" },
  { emoji: "🦉", name: "Night Owl", color: "bg-lilac" },
  { emoji: "📸", name: "Shutterbug", color: "bg-sky" },
  { emoji: "⚡", name: "Speedrunner", color: "bg-peach" },
];

function Profile() {
  const { data: me, isLoading } = useUser();
  const { data: quests } = useQuests(); // For now, we'll just show active quests they joined

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-3xl" />)}
        </div>
      </div>
    );
  }

  if (!me) {
    return <div className="p-10 text-center">Failed to load profile.</div>;
  }

  const level = me.level || 1;
  const xp = me.xp || 0;
  const xpToNext = level * 1000;
  const xpPct = Math.min(Math.round((xp / xpToNext) * 100), 100);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  // Filter quests where the user is a participant or host
  // The API doesn't have a direct /users/me/quests yet, so we filter the main list
  const activeQuests = (quests || []).slice(0, 3); // placeholder for actual active quests

  return (
    <div className="space-y-5">
      <section className="tile p-6 md:p-8 bg-lilac">
        <div className="flex flex-wrap items-start md:items-center gap-5">
          <div className="h-24 w-24 rounded-3xl bg-card grid place-items-center text-5xl ring-pop shrink-0">
            {me.avatar_emoji || "👤"}
          </div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="font-display text-3xl text-lilac-foreground leading-none">{me.name}</h1>
            <p className="text-sm text-lilac-foreground/70 mt-1">{me.handle} · joined recently</p>
            <div className="mt-4 space-y-1 max-w-md">
              <div className="flex justify-between text-xs font-semibold text-lilac-foreground/80">
                <span>Level {level}</span>
                <span>{xp} / {xpToNext} XP</span>
              </div>
              <div className="h-2.5 rounded-full bg-card/60 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="h-11 w-11 rounded-full bg-card grid place-items-center transition-all hover:scale-105 active:scale-95 hover:bg-white"><Share2 className="h-4 w-4" /></button>
            <button className="h-11 w-11 rounded-full bg-card grid place-items-center transition-all hover:scale-105 active:scale-95 hover:bg-white"><Settings className="h-4 w-4" /></button>
            <button onClick={handleLogout} className="h-11 w-11 rounded-full bg-card grid place-items-center text-destructive hover:bg-red-50 transition-all hover:scale-105 active:scale-95"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Total points" value={me.total_points ?? 0} />
        <Stat label="Quests joined" value={me.quests_joined_count ?? 0} />
        <Stat label="Quests created" value={me.quests_hosted_count ?? 0} />
        <Stat label="Streak" value={`${me.streak ?? 0} 🔥`} />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl px-1">Badges</h2>
        <div className="tile p-5 grid grid-cols-3 sm:grid-cols-6 gap-3">
          {badges.map((b) => (
            <div key={b.name} className="flex flex-col items-center gap-2">
              <div className={`h-16 w-16 rounded-2xl ${b.color} grid place-items-center text-2xl shadow-inset-soft`}>{b.emoji}</div>
              <div className="text-[11px] font-semibold text-center">{b.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl px-1">Quests you're hosting</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {me.quests_hosted && me.quests_hosted.length > 0 ? (
            me.quests_hosted.map((q) => <QuestCard key={q.id} quest={q} />)
          ) : (
            <div className="col-span-full tile p-10 text-center text-muted-foreground italic">You haven't created any quests yet.</div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl px-1">Active hunts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {me.quests_joined && me.quests_joined.length > 0 ? (
            me.quests_joined.map((q) => <QuestCard key={q.id} quest={q} />)
          ) : (
            <div className="col-span-full tile p-10 text-center text-muted-foreground italic">You aren't participating in any quests yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="tile p-4">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="font-display text-3xl mt-1">{value}</div>
    </div>
  );
}
