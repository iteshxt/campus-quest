import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Camera, Clock, Lock, Share2, Trophy, Users } from "lucide-react";
import { colorMap, leaderboard, quests } from "@/lib/mock";

export const Route = createFileRoute("/quest/$id")({
  component: QuestDetail,
  loader: ({ params }) => {
    const quest = quests.find((q) => q.id === params.id);
    if (!quest) throw notFound();
    return { quest };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.quest.title} · CampusQuest` : "Quest · CampusQuest" },
      { name: "description", content: loaderData?.quest.description ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="tile p-10 text-center">
      <h1 className="font-display text-2xl">Quest not found</h1>
      <Link to="/explore" className="mt-4 inline-block text-sm font-semibold underline">Back to Explore</Link>
    </div>
  ),
});

function QuestDetail() {
  const { quest } = Route.useLoaderData();
  const c = colorMap[quest.color];
  const pct = Math.round((quest.submissions / quest.total) * 100);

  return (
    <div className="space-y-5">
      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <section className={`tile ${c.bg} p-6 md:p-8 relative overflow-hidden`}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="chip bg-card/80"><Clock className="h-3 w-3" /> {quest.deadline} left</span>
              {quest.visibility === "private" && <span className="chip bg-card/80"><Lock className="h-3 w-3" /> Private</span>}
            </div>
            <h1 className={`font-display text-4xl md:text-5xl ${c.fg}`}>{quest.title}</h1>
            <p className={`max-w-xl ${c.fg} opacity-80`}>{quest.description}</p>
            <div className={`flex items-center gap-4 text-sm ${c.fg} opacity-80`}>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {quest.participants} hunters</span>
              <span className="flex items-center gap-1"><Trophy className="h-4 w-4" /> {quest.points} pts</span>
            </div>
          </div>
          <div className="text-7xl md:text-8xl animate-float shrink-0">{quest.emoji}</div>
        </div>

        <div className="mt-6 space-y-2">
          <div className={`flex items-center justify-between text-xs font-semibold ${c.fg}`}>
            <span>Your progress</span>
            <span>{quest.submissions}/{quest.total} captures</span>
          </div>
          <div className="h-3 rounded-full bg-card/60 overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button className="rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold inline-flex items-center gap-2">
            <Camera className="h-4 w-4" /> Submit a capture
          </button>
          <button className="rounded-full bg-card text-foreground px-5 py-3 text-sm font-semibold border inline-flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Invite
          </button>
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="tile p-6">
            <h2 className="font-display text-xl mb-3">The rules</h2>
            <ul className="space-y-2">
              {quest.rules.map((r, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="h-6 w-6 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">{i + 1}</span>
                  <span className="text-sm">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="tile p-6">
            <h2 className="font-display text-xl mb-3">Recent captures</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`aspect-square rounded-2xl grid place-items-center text-3xl ${["bg-pink","bg-mint","bg-peach","bg-sky","bg-lemon","bg-lilac"][i % 6]}`}>
                  {["🌸","🌿","🌻","🌼","🌷","🪻","🌺","🌹"][i]}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="tile p-5 space-y-3 h-fit">
          <h2 className="font-display text-xl">Leaderboard</h2>
          <p className="text-xs text-muted-foreground -mt-2">Updates live · winner crowned at deadline</p>
          <div className="space-y-1 pt-1">
            {leaderboard.slice(0, 6).map((p) => (
              <div key={p.rank} className={`flex items-center gap-3 p-2 rounded-2xl ${p.name === "You" ? "bg-primary/10 ring-1 ring-primary/30" : ""}`}>
                <div className="w-6 text-center font-display text-sm">{p.rank}</div>
                <div className="h-9 w-9 rounded-full bg-secondary grid place-items-center text-lg">{p.avatar}</div>
                <div className="flex-1 text-sm font-semibold">{p.name}</div>
                <div className="font-display">{p.points}</div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
