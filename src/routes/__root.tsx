import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/AppShell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center tile p-10">
        <div className="text-6xl mb-2">🧭</div>
        <h1 className="font-display text-4xl">Lost on the trail</h1>
        <p className="mt-2 text-sm text-muted-foreground">This quest doesn't exist — let's get you back to camp.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Back to Home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center tile p-10">
        <h1 className="font-display text-2xl">Something glitched</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Retry</button>
          <a href="/" className="rounded-full border px-5 py-2.5 text-sm font-semibold">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CampusQuest — Real-world scavenger hunts for campus" },
      { name: "description", content: "Create gamified scavenger hunts, snap real-world photo proof, climb leaderboards, and win bragging rights on your campus." },
      { property: "og:title", content: "CampusQuest — Real-world scavenger hunts for campus" },
      { property: "og:description", content: "Create gamified scavenger hunts, snap real-world photo proof, climb leaderboards, and win bragging rights on your campus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "CampusQuest — Real-world scavenger hunts for campus" },
      { name: "twitter:description", content: "Create gamified scavenger hunts, snap real-world photo proof, climb leaderboards, and win bragging rights on your campus." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a5302184-ebf0-4b42-ba22-93d7f4231db3/id-preview-d1dc29c1--57252ec6-fa30-4702-879f-cb185d6c8480.lovable.app-1778653402804.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a5302184-ebf0-4b42-ba22-93d7f4231db3/id-preview-d1dc29c1--57252ec6-fa30-4702-879f-cb185d6c8480.lovable.app-1778653402804.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}
