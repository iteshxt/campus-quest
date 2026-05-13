import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { QuestCard } from "@/components/QuestCard";
import { quests } from "@/lib/mock";

export const Route = createFileRoute("/explore")({
  component: Explore,
  head: () => ({ meta: [{ title: "Explore quests · CampusQuest" }] }),
});

const filters = ["All", "Active", "Trending", "Almost done", "New"] as const;

function Explore() {
  const [q, setQ] = useState("");
  const [f, setF] = useState<(typeof filters)[number]>("All");

  const list = quests.filter((x) =>
    x.title.toLowerCase().includes(q.toLowerCase()) ||
    x.description.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="space-y-1 px-1">
        <h1 className="font-display text-3xl">Explore quests</h1>
        <p className="text-sm text-muted-foreground">Hand-picked hunts happening on your campus right now.</p>
      </div>

      <div className="tile p-2 flex items-center gap-2">
        <div className="pl-3 text-muted-foreground"><Search className="h-4 w-4" /></div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search quests, hosts, or tags…"
          className="flex-1 bg-transparent outline-none py-2 text-sm placeholder:text-muted-foreground"
        />
        <button className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">Join code</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {filters.map((x) => (
          <button
            key={x}
            onClick={() => setF(x)}
            className={`shrink-0 chip transition-colors ${f === x ? "bg-primary text-primary-foreground border-transparent" : ""}`}
          >
            {x}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((quest) => <QuestCard key={quest.id} quest={quest} />)}
      </div>
    </div>
  );
}
