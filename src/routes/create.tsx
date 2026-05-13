import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Globe, Lock, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/create")({
  component: Create,
  head: () => ({ meta: [{ title: "Create a quest · CampusQuest" }] }),
});

const emojis = ["🌸","🗺️","🌈","🍜","🍃","🪑","📚","🎨","⚽","🎵","☕","🐾"];
const colors = ["pink","mint","peach","sky","lemon","lilac"] as const;
const bgClass: Record<(typeof colors)[number], string> = {
  pink: "bg-pink", mint: "bg-mint", peach: "bg-peach",
  sky: "bg-sky", lemon: "bg-lemon", lilac: "bg-lilac",
};

function Create() {
  const [emoji, setEmoji] = useState("🌸");
  const [color, setColor] = useState<(typeof colors)[number]>("pink");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [title, setTitle] = useState("");

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="px-1">
        <h1 className="font-display text-3xl">Design your quest</h1>
        <p className="text-sm text-muted-foreground">Make it weird. Make it fun. Make hunters lose sleep.</p>
      </div>

      <section className={`tile p-6 bg-${color} transition-colors`}>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-3xl bg-card grid place-items-center text-5xl shadow-soft">{emoji}</div>
          <div className="flex-1">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name your quest…"
              className="w-full bg-transparent border-b-2 border-foreground/20 focus:border-foreground outline-none font-display text-2xl placeholder:text-foreground/40 pb-1"
            />
            <p className="text-xs mt-2 opacity-70">A great title is short, weird, and slightly chaotic.</p>
          </div>
        </div>
      </section>

      <section className="tile p-6 space-y-4">
        <Field label="Pick an icon">
          <div className="flex flex-wrap gap-2">
            {emojis.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`h-11 w-11 rounded-2xl text-xl grid place-items-center transition-all ${emoji === e ? "bg-primary text-primary-foreground scale-110" : "bg-muted hover:bg-secondary"}`}
              >{e}</button>
            ))}
          </div>
        </Field>

        <Field label="Vibe color">
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={c}
                className={`h-10 w-10 rounded-full bg-${c} ${color === c ? "ring-pop scale-110" : ""} transition-transform`}
              />
            ))}
          </div>
        </Field>

        <Field label="What are hunters looking for?">
          <textarea
            placeholder="e.g. Snap 8 different flowers blooming around campus this week."
            rows={3}
            className="w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/30"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Number of captures">
            <input type="number" defaultValue={5} className="w-full rounded-2xl bg-muted px-4 py-3 outline-none focus:ring-2 ring-primary/30" />
          </Field>
          <Field label="Deadline">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="date" className="w-full rounded-2xl bg-muted pl-10 pr-4 py-3 outline-none focus:ring-2 ring-primary/30" />
            </div>
          </Field>
        </div>

        <Field label="Who can join?">
          <div className="grid grid-cols-2 gap-2">
            <Toggle active={visibility === "public"} onClick={() => setVisibility("public")} icon={<Globe className="h-4 w-4" />} title="Public" sub="Anyone on Explore" />
            <Toggle active={visibility === "private"} onClick={() => setVisibility("private")} icon={<Lock className="h-4 w-4" />} title="Private" sub="Invite-only code" />
          </div>
        </Field>
      </section>

      <button className="w-full rounded-full bg-primary text-primary-foreground px-5 py-4 font-display text-lg inline-flex items-center justify-center gap-2 shadow-pop">
        <Sparkles className="h-5 w-5" /> Launch quest
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ active, onClick, icon, title, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border-2 transition-all ${active ? "border-primary bg-primary/5" : "border-transparent bg-muted"}`}
    >
      <div className="flex items-center gap-2 font-semibold text-sm">{icon} {title}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </button>
  );
}
