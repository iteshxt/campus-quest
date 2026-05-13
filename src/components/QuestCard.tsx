import { Link } from "@tanstack/react-router";
import { Clock, Users } from "lucide-react";
import { colorMap } from "@/lib/mock";

export function QuestCard({ quest, large = false }: { quest: any; large?: boolean }) {
  const c = colorMap[quest.color as keyof typeof colorMap] || colorMap.pink;
  // Use participants_count from API if available, otherwise 0
  const participantsCount = quest.participants_count || 0;
  const submissionsCount = quest.submissions_count || 0;
  
  return (
    <Link
      to="/quest/$id"
      params={{ id: quest.join_code || quest.id }}
      className={`group tile p-5 flex flex-col gap-4 transition-all hover:-translate-y-1 active:scale-95 ${large ? "min-h-[260px]" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`h-14 w-14 rounded-2xl ${c.bg} ${c.fg} grid place-items-center text-2xl shadow-inset-soft`}>
          {quest.emoji || "🎯"}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="chip">
            <Clock className="h-3 w-3" /> {quest.deadline ? new Date(quest.deadline).toLocaleDateString() : "Ongoing"}
          </span>
          <span className={`chip ${quest.visibility === "private" ? "bg-lilac text-lilac-foreground border-transparent" : ""}`}>
            {quest.visibility === "private" ? "🔒 Private" : "🌍 Public"}
          </span>
          {quest.join_code && (
            <span className="chip bg-lemon text-black font-bold border-transparent">
              Code: {quest.join_code}
            </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl leading-tight">{quest.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{quest.description}</p>
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {participantsCount} joined</span>
          <span className="font-semibold text-foreground">{submissionsCount} submissions</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full ${c.bg} transition-all`}
            style={{ width: `0%` }} // We'll update this once we have a 'target' field in API
          />
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            by {quest.host?.name || "Anonymous"}
          </span>
          <span className="font-display text-sm">+{quest.max_points} pts</span>
        </div>
      </div>
    </Link>
  );
}
