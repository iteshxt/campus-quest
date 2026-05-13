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

function Home() {
  const featured = quests[0];
  const xpPct = Math.round((me.xp / me.xpToNext) * 100);
  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="tile relative overflow-hidden p-6 md:p-8 bg-pink">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="space-y-4 max-w-xl">
            <span className="chip bg-card/70 backdrop-blur"><Flame className="h-3 w-3 text-pink-foreground" /> {me.streak}-day streak</span>
            <h1 className="font-display text-4xl md:text-5xl text-pink-foreground">
              Hey {me.name.split(" ")[0]}, ready for today's hunt?
            </h1>
            <p className="text-pink-foreground/80">
              You're {me.xpToNext - me.xp} XP from level {me.level + 1}. One submission could do it.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-pink-foreground/80">
                <span>Level {me.level}</span>
                <span>{me.xp} / {me.xpToNext} XP</span>
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
        <StatTile color="bg-mint" label="Total points" value={me.totalPoints} icon={<Sparkles className="h-4 w-4" />} />
        <StatTile color="bg-peach" label="Quests joined" value={me.questsJoined} icon={<Target className="h-4 w-4" />} />
        <StatTile color="bg-sky" label="Wins" value={me.wins} icon={<Trophy className="h-4 w-4" />} />
        <StatTile color="bg-lemon" label="Streak" value={`${me.streak} 🔥`} icon={<Flame className="h-4 w-4" />} />
      </section>

      {/* Featured + side */}
      <section className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <SectionTitle title="Featured today" sub="Drops every 24 hours" />
          <QuestCard quest={featured} large />
        </div>
        <div className="space-y-3">
          <SectionTitle title="Top hunters" />
          <div className="tile p-4 space-y-2">
            {top3.map((p) => (
              <div key={p.rank} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-muted/60 transition-colors">
                <div className={`h-9 w-9 rounded-full grid place-items-center text-lg ${
                  p.rank === 1 ? "bg-lemon" : p.rank === 2 ? "bg-sky" : "bg-peach"
                }`}>{p.avatar}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold leading-tight">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.submissions} submissions</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-base">{p.points}</div>
                  <div className="text-[10px] text-muted-foreground">pts</div>
                </div>
              </div>
            ))}
            <Link to="/leaderboard" className="block text-center text-xs font-semibold text-muted-foreground hover:text-foreground pt-1">
              See full board →
            </Link>
          </div>
        </div>
      </section>

      {/* Active quests */}
      <section className="space-y-3">
        <SectionTitle title="Continue hunting" sub="Quests you've joined" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quests.slice(1, 4).map((q) => <QuestCard key={q.id} quest={q} />)}
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
