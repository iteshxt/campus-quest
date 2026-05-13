import { Link } from "@tanstack/react-router";
import { Clock, Users } from "lucide-react";
import { colorMap, type Quest } from "@/lib/mock";

export function QuestCard({ quest, large = false }: { quest: Quest; large?: boolean }) {
  const c = colorMap[quest.color];
  const pct = Math.round((quest.submissions / quest.total) * 100);
  return (
    <Link
      to="/quest/$id"
      params={{ id: quest.id }}
      className={`group tile p-5 flex flex-col gap-4 transition-transform hover:-translate-y-1 ${large ? "min-h-[260px]" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`h-14 w-14 rounded-2xl ${c.bg} ${c.fg} grid place-items-center text-2xl shadow-inset-soft`}>
          {quest.emoji}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="chip">
            <Clock className="h-3 w-3" /> {quest.deadline}
          </span>
          <span className={`chip ${quest.visibility === "private" ? "bg-lilac text-lilac-foreground border-transparent" : ""}`}>
            {quest.visibility === "private" ? "🔒 Private" : "🌍 Public"}
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl leading-tight">{quest.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{quest.description}</p>
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {quest.participants}</span>
          <span className="font-semibold text-foreground">{quest.submissions}/{quest.total}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full ${c.bg} transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">by {quest.host}</span>
          <span className="font-display text-sm">+{quest.points} pts</span>
        </div>
      </div>
    </Link>
  );
}
