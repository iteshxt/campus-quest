# CampusQuest

**Real-world scavenger hunts, validated by AI.**

CampusQuest is a high-performance social platform designed for campus-wide engagement. It transforms physical environments into interactive playgrounds where users discover hidden challenges, submit photographic "Proof of Work," and compete on real-time leaderboards.

---

## 💎 Product Pillars

### 🧠 AI-Judged Proof of Work

Submissions are evaluated in real-time by a specialized **Gemma-powered vision microservice**. This ensures automated, objective grading based on quest-specific rules, preventing cheating and eliminating manual oversight.

### 🕵️ Social Discovery & Privacy

* **Public Hunts:** High-visibility challenges featured on the global explore feed.
* **Private Operations:** Stealth quests accessible only via exact join-code matching, perfect for organizations or friend groups.

### ⚡ Performance-First Architecture

Optimized for mobile-first interaction with system-wide tactile feedback, lazy-loaded binary image streaming, and advanced query caching for near-instant page transitions.

---

## 🛠 Tech Stack

| Layer                | Technology         | Role                                                          |
| :------------------- | :----------------- | :------------------------------------------------------------ |
| **Frontend**   | `TanStack Start` | Full-stack React framework with type-safe routing.            |
| **Backend**    | `Laravel 11`     | Robust PHP 8.3 REST API handling quest logic and persistence. |
| **AI Service** | `Node.js`        | Dedicated Google GenAI (Gemma) orchestration service.         |
| **Database**   | `PostgreSQL`     | Relational storage hosted via Supabase.                       |
| **Auth**       | `Supabase Auth`  | Secure, JWT-based cross-service authentication.               |
| **Styling**    | `Vanilla CSS`    | Bespoke, premium design system with custom micro-animations.  |

---

## 🏗 System Architecture

1. **Client:** React SPA with TanStack Query for state management and aggressive server-side caching.
2. **API Gateway:** Laravel 11 acting as the orchestrator, enforcing RLS and quest business logic.
3. **Validation Engine:** Asynchronous job queue triggers Node.js AI evaluations via high-speed HTTP hooks.
4. **Storage:** Decoupled binary streaming for submission images to ensure low JSON payload latency.

---

## 🚀 Vision

CampusQuest aims to bridge the gap between digital social networks and physical campus life, creating a "gamified reality" layer that encourages exploration, community building, and competitive fun.

---

by Anjali Thakur
