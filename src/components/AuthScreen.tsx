import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";

export function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.trim().replace(/^["']|["']$/g, "");
    const cleanPassword = password.trim();

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword });
        if (error) throw error;
        toast.success("Welcome back!");
        onLogin();
      } else {
        const { error } = await supabase.auth.signUp({ email: cleanEmail, password: cleanPassword });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
        if (!error) onLogin();
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-pink/20">
      <div className="tile p-8 w-full max-w-md bg-background shadow-pop relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-primary text-primary-foreground grid place-items-center font-display text-4xl mb-4 shadow-soft">
            Q
          </div>
          <h1 className="font-display text-3xl">CampusQuest</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLogin ? "Sign in to continue your hunt" : "Create an account to start hunting"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl bg-muted pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 ring-primary/30"
                placeholder="hunter@campus.edu"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl bg-muted pl-10 pr-12 py-3 text-sm outline-none focus:ring-2 ring-primary/30"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary text-primary-foreground px-5 py-3 font-display text-lg inline-flex items-center justify-center gap-2 shadow-soft disabled:opacity-50 mt-4"
          >
            {loading ? "Authenticating..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already hunting?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-primary hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
