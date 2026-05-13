import { createFileRoute } from "@tanstack/react-router";
import { useLeaderboard, type LeaderboardEntry } from "@/hooks/use-leaderboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  component: Leaderboard,
  head: () => ({ meta: [{ title: "Leaderboard · CampusQuest" }] }),
});

function Leaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="space-y-6 px-1">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="space-y-3 mt-6">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-3xl" />)}
        </div>
      </div>
    );
  }

  const [first, second, third, ...rest] = leaderboard || [];

  return (
    <div className="space-y-6">
      <div className="px-1">
        <h1 className="font-display text-3xl">Campus leaderboard</h1>
        <p className="text-sm text-muted-foreground">All-time hunters ranked by points.</p>
      </div>

      {/* Podium */}
      {first && (
        <section className="tile p-6 md:p-8">
          <div className="grid grid-cols-3 gap-3 items-end max-w-2xl mx-auto">
            {second && <Podium rank={2} player={second} height="h-32" bg="bg-sky" />}
            <Podium rank={1} player={first} height="h-44" bg="bg-lemon" winner />
            {third && <Podium rank={3} player={third} height="h-24" bg="bg-peach" />}
          </div>
        </section>
      )}

      <section className="tile p-3">
        {rest.length > 0 ? rest.map((p, idx) => (
          <div key={p.handle} className={`flex items-center gap-3 p-3 rounded-2xl ${p.handle === "@me" ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-muted/60"}`}>
            <div className="w-8 text-center font-display text-lg">{idx + 4}</div>
            <div className="h-11 w-11 rounded-full bg-secondary grid place-items-center text-xl">{p.avatar_emoji || "👤"}</div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.handle}</div>
            </div>
            <div className="text-right">
              <div className="font-display text-lg">{p.total_points}</div>
              <div className="text-[10px] text-muted-foreground">points</div>
            </div>
          </div>
        )) : !isLoading && rest.length === 0 && <div className="p-10 text-center text-muted-foreground italic">Join a quest to be the first on the board!</div>}
      </section>
    </div>
  );
}

function Podium({ player, height, bg, rank, winner = false }: { player: LeaderboardEntry; height: string; bg: string; rank: number; winner?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`h-16 w-16 rounded-full ${bg} grid place-items-center text-3xl ring-pop ${winner ? "scale-110" : ""}`}>
        {player.avatar_emoji || "👤"}
      </div>
      <div className="text-center">
        <div className="font-semibold text-sm flex items-center gap-1 justify-center">
          {winner && <Crown className="h-4 w-4 text-lemon-foreground" />} {player.name}
        </div>
        <div className="font-display text-base">{player.total_points}</div>
      </div>
      <div className={`w-full ${height} ${bg} rounded-t-3xl grid place-items-center font-display text-3xl text-foreground/70`}>
        {rank}
      </div>
    </div>
  );
}
