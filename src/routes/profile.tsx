import { createFileRoute } from "@tanstack/react-router";
import { QuestCard } from "@/components/QuestCard";
import { me, quests } from "@/lib/mock";
import { Settings, Share2 } from "lucide-react";

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
  const xpPct = Math.round((me.xp / me.xpToNext) * 100);

  return (
    <div className="space-y-5">
      <section className="tile p-6 md:p-8 bg-lilac">
        <div className="flex flex-wrap items-center gap-5">
          <div className="h-24 w-24 rounded-3xl bg-card grid place-items-center text-5xl ring-pop">🐨</div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="font-display text-3xl text-lilac-foreground">{me.name}</h1>
            <p className="text-sm text-lilac-foreground/70">{me.handle} · joined Sept 2025</p>
            <div className="mt-3 space-y-1 max-w-md">
              <div className="flex justify-between text-xs font-semibold text-lilac-foreground/80">
                <span>Level {me.level}</span>
                <span>{me.xp} / {me.xpToNext} XP</span>
              </div>
              <div className="h-2.5 rounded-full bg-card/60 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="h-11 w-11 rounded-full bg-card grid place-items-center"><Share2 className="h-4 w-4" /></button>
            <button className="h-11 w-11 rounded-full bg-card grid place-items-center"><Settings className="h-4 w-4" /></button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Total points" value={me.totalPoints} />
        <Stat label="Quests joined" value={me.questsJoined} />
        <Stat label="Quests created" value={me.questsCreated} />
        <Stat label="Wins" value={me.wins} />
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
        <h2 className="font-display text-2xl px-1">Your active quests</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quests.slice(0, 3).map((q) => <QuestCard key={q.id} quest={q} />)}
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
