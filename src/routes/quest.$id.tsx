import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Camera, Clock, Lock, Share2, Trophy, Users } from "lucide-react";
import { colorMap, leaderboard, quests, type Quest } from "@/lib/mock";

export const Route = createFileRoute("/quest/$id")({
  component: QuestDetail,
  head: ({ params }) => ({
    meta: [
      { title: "Quest · CampusQuest" },
    ],
  }),
  notFoundComponent: () => (
    <div className="tile p-10 text-center">
      <h1 className="font-display text-2xl">Quest not found</h1>
      <Link to="/explore" className="mt-4 inline-block text-sm font-semibold underline">Back to Explore</Link>
    </div>
  ),
});

import { useQuest } from "@/hooks/use-quests";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useRef } from "react";
import { apiClient, API_BASE_URL } from "@/lib/api-client";
import { toast } from "sonner";
import { useQueryClient, useQuery } from "@tanstack/react-query";

function QuestDetail() {
  const queryClient = useQueryClient();
  const { id } = Route.useParams();
  const { data: quest, isLoading, error, refetch } = useQuest(id);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  // Fetch submission detail when selected
  const { data: submissionDetail, isLoading: detailLoading } = useQuery({
    queryKey: ["submission", selectedSubmissionId],
    queryFn: async () => {
      const res = await apiClient.get(`/submissions/${selectedSubmissionId}`);
      return res.data;
    },
    enabled: !!selectedSubmissionId,
  });

  // Fetch current user
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await apiClient.get("/users/me");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // Profile data is very static
  });

  // Fetch submissions
  const { data: submissions } = useQuery({
    queryKey: ["quest", id, "submissions"],
    queryFn: async () => {
      const res = await apiClient.get(`/quests/${id}/submissions`);
      return res.data;
    },
    refetchInterval: 30000, // 30 seconds
  });

  const mySubmissions = submissions?.filter((s: any) => s.user_id === user?.id);

  const [isJoining, setIsJoining] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (isLoading) return <div className="space-y-6"><Skeleton className="h-[400px] w-full rounded-3xl" /></div>;
  if (error || !quest) return <div className="tile p-10 text-center">Quest not found</div>;
  const isJoined = (quest as any).is_joined;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (e.g., 5MB limit for Base64 payload)
    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image is too big! Please keep it under ${MAX_SIZE_MB}MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    
    try {
      // Auto-join if not joined yet
      if (!isJoined) {
        try {
          await apiClient.post(`/quests/${id}/join`);
          await queryClient.invalidateQueries({ queryKey: ["quest", id] });
          await queryClient.invalidateQueries({ queryKey: ["user"] });
        } catch (joinErr: any) {
          if (joinErr.response?.status !== 400) throw joinErr;
        }
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64String = reader.result as string;
        try {
          await apiClient.post(`/quests/${id}/submissions`, { image_base64: base64String });
          toast.success("Capture submitted! Our AI is judging it now...");
          queryClient.invalidateQueries({ queryKey: ["quest", id, "submissions"] });
        } catch (err: any) {
          console.error("Submission error:", err.response?.data);
          const message = err.response?.data?.error || err.response?.data?.message || "Failed to submit capture.";
          toast.error(message);
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      
      reader.onerror = () => {
        toast.error("Failed to read image file.");
        setIsUploading(false);
      };
    } catch (err: any) {
      console.error("Join/Upload error:", err.response?.data || err);
      toast.error("An error occurred. Please try again.");
      setIsUploading(false);
    }
  };

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await apiClient.post(`/quests/${id}/join`);
      toast.success("Welcome to the hunt!");
      queryClient.invalidateQueries({ queryKey: ["quest", id] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      refetch();
    } catch (err) {
      toast.error("Could not join quest.");
    } finally {
      setIsJoining(false);
    }
  };

  const c = colorMap[quest.color as keyof typeof colorMap] || colorMap.pink;

  return (
    <div className="space-y-5">
      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <section className={`tile ${c.bg} p-6 md:p-8 relative overflow-hidden`}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="chip bg-card/80">
                <Clock className="h-3 w-3" /> 
                {quest.deadline ? new Date(quest.deadline).toLocaleDateString() : "Ongoing"}
              </span>
              {quest.visibility === "private" && <span className="chip bg-card/80"><Lock className="h-3 w-3" /> Private</span>}
              {isJoined && <span className="chip bg-primary text-primary-foreground">✓ Joined</span>}
            </div>
            <h1 className={`font-display text-4xl md:text-5xl ${c.fg}`}>{quest.title}</h1>
            <p className={`max-w-xl ${c.fg} opacity-80`}>{quest.description}</p>
            <div className={`flex items-center gap-4 text-sm ${c.fg} opacity-80`}>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {quest.participants_count || 0} hunters</span>
              <span className="flex items-center gap-1"><Trophy className="h-4 w-4" /> {quest.max_points} pts</span>
            </div>
          </div>
          <div className="text-7xl md:text-8xl animate-float shrink-0">{quest.emoji || "🎯"}</div>
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleUpload}
          />
          <button 
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold inline-flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Camera className="h-4 w-4" /> 
            {isUploading ? "Uploading..." : "Submit a capture"}
          </button>
          {!isJoined && (
            <button 
              disabled={isJoining}
              onClick={handleJoin}
              className="rounded-full bg-card text-foreground px-6 py-3.5 text-sm font-bold border inline-flex items-center gap-2 disabled:opacity-50 hover:bg-muted active:scale-95 transition-all"
            >
              {isJoining ? "Joining..." : "Join Quest"}
            </button>
          )}
          {quest.join_code && (
            <button 
              onClick={() => {
                navigator.clipboard.writeText(quest.join_code!);
                setIsCopied(true);
                toast.success("Code copied!");
                setTimeout(() => setIsCopied(false), 2000);
              }}
              className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3.5 text-sm font-bold border border-white/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="font-display tracking-widest text-lg">{quest.join_code}</span>
              {isCopied ? <span className="text-green-900 font-bold">✓</span> : <Share2 className="h-3 w-3 opacity-60" />}
            </button>
          )}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="tile p-6">
            <h2 className="font-display text-xl mb-3">The rules</h2>
            <ul className="space-y-2">
              {(quest as any).rules?.map((r: any, i: number) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="h-6 w-6 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">{i + 1}</span>
                  <span className="text-sm">{r.rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="tile p-6">
            <h2 className="font-display text-xl mb-3">Your captures</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {mySubmissions && mySubmissions.length > 0 ? (
                mySubmissions.map((s: any) => (
                  <div 
                    key={s.id} 
                    onClick={() => setSelectedSubmissionId(s.id)}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-muted cursor-pointer ring-offset-2 hover:ring-2 ring-primary transition-all"
                  >
                    <img 
                      src={`${API_BASE_URL}/submissions/${s.id}/image`} 
                      alt="Capture" 
                      className="h-full w-full object-cover transition-transform group-hover:scale-105" 
                      loading="lazy"
                    />
                    
                    {s.status === 'graded' && (
                      <div className="absolute top-2 right-2 chip bg-primary text-primary-foreground text-[10px] px-2 py-0.5 shadow-lg z-10">
                        +{s.awarded_points} pts
                      </div>
                    )}
                    {s.status === 'pending' && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] grid place-items-center z-10">
                        <div className="text-white text-[10px] font-bold animate-pulse tracking-widest">JUDGING...</div>
                      </div>
                    )}
                    {s.status === 'rejected' && (
                      <div className="absolute inset-0 bg-red-900/60 backdrop-blur-[1px] grid place-items-center z-10">
                        <div className="text-white text-[10px] font-bold bg-red-600 px-3 py-1 rounded shadow-lg uppercase tracking-wider">Rejected</div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground italic border-2 border-dashed rounded-3xl">
                  You haven't submitted any captures yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="tile p-5 space-y-3 h-fit">
          <h2 className="font-display text-xl">Top Hunters</h2>
          <p className="text-xs text-muted-foreground -mt-2">Updates live · winner crowned at deadline</p>
          <div className="space-y-3 pt-1">
            {submissions?.filter((s: any) => s.status === 'graded')
              .slice(0, 5)
              .map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted grid place-items-center text-sm">{s.user?.avatar_emoji}</div>
                <div className="flex-1 text-sm font-semibold">{s.user?.name}</div>
                <div className="font-display text-primary">{s.awarded_points}</div>
              </div>
            ))}
            {(!submissions || submissions.filter((s: any) => s.status === 'graded').length === 0) && (
              <div className="text-center py-8 text-muted-foreground italic text-sm">No hunters yet.</div>
            )}
          </div>
        </aside>
      </section>

      {/* Submission Detail Modal */}
      {selectedSubmissionId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setSelectedSubmissionId(null)}>
          <div className="bg-card w-full max-w-[340px] rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="relative aspect-square bg-muted grid place-items-center">
              {detailLoading ? (
                <div className="animate-pulse flex flex-col items-center gap-2">
                  <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : (
                <img src={`${API_BASE_URL}/submissions/${submissionDetail?.id}/image`} className="w-full h-full object-cover" />
              )}
              <button 
                onClick={() => setSelectedSubmissionId(null)}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-md grid place-items-center hover:bg-black/70 transition-colors font-bold text-lg"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    submissionDetail?.status === 'graded' ? 'bg-primary/10 text-primary' : 
                    submissionDetail?.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-muted text-muted-foreground'
                  }`}>
                    {submissionDetail?.status || 'loading...'}
                  </div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AI Judge Feedback</h3>
                </div>
                {submissionDetail?.status === 'graded' && (
                  <div className="text-2xl font-display text-primary leading-none">+{submissionDetail?.awarded_points}</div>
                )}
              </div>
              
              <p className="text-sm leading-relaxed text-foreground/80 italic bg-muted/50 p-4 rounded-2xl border border-dashed">
                "{submissionDetail?.ai_feedback || 'The AI is still processing your capture...'}"
              </p>

              <button 
                onClick={() => setSelectedSubmissionId(null)}
                className="w-full rounded-2xl bg-foreground text-background py-3 text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
