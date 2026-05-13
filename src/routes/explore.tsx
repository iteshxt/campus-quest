import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { QuestCard } from "@/components/QuestCard";
import { quests } from "@/lib/mock";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { useQuests } from "@/hooks/use-quests";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/explore")({
  component: Explore,
  head: () => ({ meta: [{ title: "Explore quests · CampusQuest" }] }),
});

const filters = ["All", "Active", "Trending", "Almost done", "New"] as const;

function Explore() {
  const [q, setQ] = useState("");
  const [f, setF] = useState<(typeof filters)[number]>("All");
  
  // Server-side search allows us to find private quests by code
  const { data: list, isLoading } = useQuests(q);

  const [isSearchingCode, setIsSearchingCode] = useState(false);
  const router = useRouter();

  const handleJoinCode = async () => {
    if (!q.trim()) {
      toast.error("Please enter a code first");
      return;
    }
    setIsSearchingCode(true);
    try {
      const res = await apiClient.get(`/quests?join_code=${q.trim()}`);
      if (res.data && res.data.length > 0) {
        toast.success("Quest found!");
        router.navigate({ to: `/quest/${res.data[0].join_code || res.data[0].id}` });
      } else {
        toast.error("No quest found with that code");
      }
    } catch (err) {
      toast.error("Failed to lookup code");
    } finally {
      setIsSearchingCode(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1 px-1">
        <h1 className="font-display text-3xl">Explore quests</h1>
        <p className="text-sm text-muted-foreground">Hand-picked hunts happening on your campus right now.</p>
      </div>

      <div className="tile p-2 flex items-center gap-2 focus-within:ring-2 ring-primary transition-all">
        <div className="pl-3 text-muted-foreground"><Search className="h-4 w-4" /></div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoinCode()}
          placeholder="Search quests or enter Join Code…"
          className="flex-1 bg-transparent outline-none py-2 text-sm placeholder:text-muted-foreground"
        />
        <button 
          onClick={handleJoinCode}
          disabled={isSearchingCode}
          className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold active:scale-95 transition-all disabled:opacity-50"
        >
          {isSearchingCode ? "Searching..." : "Join code"}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {filters.map((x) => (
          <button
            key={x}
            onClick={() => setF(x)}
            className={`shrink-0 chip transition-all active:scale-95 hover:bg-foreground/5 ${f === x ? "bg-primary text-primary-foreground border-transparent hover:bg-primary/90" : ""}`}
          >
            {x}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list && list.map((quest) => <QuestCard key={quest.id} quest={quest} />)}
          {(!list || list.length === 0) && (
            <div className="col-span-full py-12 text-center text-muted-foreground italic">
              No quests found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
