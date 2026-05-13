import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Sparkles, Target, Trophy } from "lucide-react";
import { QuestCard } from "@/components/QuestCard";
import { quests, me, leaderboard } from "@/lib/mock";
import mascot from "@/assets/mascot.png";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "CampusQuest — Your daily campus scavenger hunt" },
      { name: "description", content: "Track your streak, see active quests, and snap photo proof to climb the leaderboard." },
    ],
  }),
});

import { useQuests } from "@/hooks/use-quests";
import { useUser } from "@/hooks/use-user";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { Skeleton } from "@/components/ui/skeleton";

function Home() {
  const { data: quests, isLoading: questsLoading } = useQuests();
  const { data: me, isLoading: userLoading } = useUser();
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard();

  if (questsLoading || userLoading || leaderboardLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px] w-full rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-3xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-3xl" />
          <Skeleton className="h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  // Fallback to mock-like defaults if data is missing (e.g. not logged in)
  const user = me || {
    name: "Explorer",
    level: 1,
    xp: 0,
    streak: 0,
    total_points: 0,
    quests_joined_count: 0,
  };

  const featured = quests?.[0];
  const xpToNext = user.level * 1000;
  const xpPct = Math.min(Math.round((user.xp / xpToNext) * 100), 100);
  const top3 = (leaderboard || []).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="tile relative overflow-hidden p-6 md:p-8 bg-pink">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="space-y-4 max-w-xl">
            <span className="chip bg-card/70 backdrop-blur"><Flame className="h-3 w-3 text-pink-foreground" /> {user.streak}-day streak</span>
            <h1 className="font-display text-4xl md:text-5xl text-pink-foreground">
              Hey {user.name.split(" ")[0]}, ready for today's hunt?
            </h1>
            <p className="text-pink-foreground/80">
              You're {xpToNext - user.xp} XP from level {user.level + 1}. One submission could do it.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-pink-foreground/80">
                <span>Level {user.level}</span>
                <span>{user.xp} / {xpToNext} XP</span>
              </div>
              <div className="h-3 rounded-full bg-card/50 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${xpPct}%` }} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Link to="/explore" className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-1.5">
                Find a quest <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/create" className="rounded-full bg-card text-foreground px-5 py-2.5 text-sm font-semibold border">
                + Start your own
              </Link>
            </div>
          </div>
          <img src={mascot} alt="CampusQuest mascot" width={220} height={220} className="hidden md:block animate-float drop-shadow-2xl" />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile color="bg-mint" label="Total points" value={user.total_points} icon={<Sparkles className="h-4 w-4" />} />
        <StatTile color="bg-peach" label="Quests joined" value={user.quests_joined_count} icon={<Target className="h-4 w-4" />} />
        <StatTile color="bg-sky" label="Wins" value={0} icon={<Trophy className="h-4 w-4" />} />
        <StatTile color="bg-lemon" label="Streak" value={`${user.streak} 🔥`} icon={<Flame className="h-4 w-4" />} />
      </section>

      {/* Featured + side */}
      <section className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <SectionTitle title="Featured today" sub="Drops every 24 hours" />
          {featured ? <QuestCard quest={featured} large /> : <div className="tile p-10 text-center text-muted-foreground">No featured quests today</div>}
        </div>
        <div className="space-y-3">
          <SectionTitle title="Top hunters" />
          <div className="tile p-4 space-y-2">
            {top3.length > 0 ? top3.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-muted/60 transition-colors">
                <div className={`h-9 w-9 rounded-full grid place-items-center text-lg ${
                  idx === 0 ? "bg-lemon" : idx === 1 ? "bg-sky" : "bg-peach"
                }`}>{p.avatar_emoji || "👤"}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold leading-tight">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.handle}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-base">{p.total_points}</div>
                  <div className="text-[10px] text-muted-foreground">pts</div>
                </div>
              </div>
            )) : <div className="text-center text-xs py-4 text-muted-foreground">Leaderboard is empty</div>}
            <Link to="/leaderboard" className="block text-center text-xs font-semibold text-muted-foreground hover:text-foreground pt-1">
              See full board →
            </Link>
          </div>
        </div>
      </section>

      {/* Active quests */}
      <section className="space-y-3">
        <SectionTitle title="Continue hunting" sub="Explore more quests" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quests && quests.length > 1 ? (
            quests.slice(1, 7).map((q) => <QuestCard key={q.id} quest={q} />)
          ) : (
            <div className="tile p-10 text-center text-muted-foreground col-span-full italic border-2 border-dashed rounded-3xl">
              Create more quests to fill up your dashboard!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatTile({ color, label, value, icon }: { color: string; label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className={`tile ${color} p-4 flex flex-col gap-1`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold opacity-80">{icon} {label}</div>
      <div className="font-display text-3xl">{value}</div>
    </div>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-end justify-between px-1">
      <div>
        <h2 className="font-display text-2xl">{title}</h2>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}
