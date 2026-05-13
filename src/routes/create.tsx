import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Calendar, Globe, Lock, Sparkles, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const [emoji, setEmoji] = useState("🌸");
  const [color, setColor] = useState<(typeof colors)[number]>("pink");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [maxPoints, setMaxPoints] = useState(100);
  const [rules, setRules] = useState<string[]>([""]);
  const [isLaunching, setIsLaunching] = useState(false);

  const addRule = () => setRules([...rules, ""]);
  const updateRule = (idx: number, val: string) => {
    const next = [...rules];
    next[idx] = val;
    setRules(next);
  };
  const removeRule = (idx: number) => setRules(rules.filter((_, i) => i !== idx));

  const handleLaunch = async () => {
    if (!title || !description || rules.some(r => !r)) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setIsLaunching(true);
    try {
      await apiClient.post('/quests', {
        title,
        description,
        emoji,
        color,
        deadline,
        visibility,
        max_points: maxPoints,
        rules: rules.filter(r => r.trim() !== "")
      });
      toast.success("Quest launched! 🚀");
      navigate({ to: '/' });
    } catch (err) {
      toast.error("Failed to launch quest. Are you logged in?");
    } finally {
      setIsLaunching(false);
    }
  };

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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Snap 8 different flowers blooming around campus this week."
            rows={3}
            className="w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/30"
          />
        </Field>

        <Field label="Quest Rules (for the AI judge)">
          <div className="space-y-2">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={rule}
                  onChange={(e) => updateRule(idx, e.target.value)}
                  placeholder={`Rule #${idx + 1}`}
                  className="flex-1 rounded-xl bg-muted px-4 py-2 text-sm outline-none focus:ring-2 ring-primary/30"
                />
                {rules.length > 1 && (
                  <button onClick={() => removeRule(idx)} className="text-muted-foreground hover:text-destructive px-2"><Trash2 className="h-4 w-4" /></button>
                )}
              </div>
            ))}
            <button onClick={addRule} className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              <Plus className="h-3 w-3" /> Add another rule
            </button>
          </div>
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Total Points">
            <input 
              type="number" 
              value={maxPoints} 
              onChange={(e) => setMaxPoints(Number(e.target.value))}
              className="w-full rounded-2xl bg-muted px-4 py-3 outline-none focus:ring-2 ring-primary/30" 
            />
          </Field>
          <Field label="Deadline">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="date" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-2xl bg-muted pl-10 pr-4 py-3 outline-none focus:ring-2 ring-primary/30" 
              />
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

      <button 
        disabled={isLaunching}
        onClick={handleLaunch}
        className="w-full rounded-full bg-primary text-primary-foreground px-5 py-4 font-display text-lg inline-flex items-center justify-center gap-2 shadow-pop disabled:opacity-50"
      >
        <Sparkles className="h-5 w-5" /> 
        {isLaunching ? "Launching..." : "Launch quest"}
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
