# 🎓 StudyHub AI

**The Autonomous Multi-Agent Academic Taskmaster**

> Upload a syllabus. Five specialist AI agents take it from there — sourcing textbooks, blocking exam-prep time on your real Google Calendar, transcribing spoken math into LaTeX, building spaced-repetition flashcards, and drafting the emails you'd otherwise have to write yourself.

Built for the **[All Things Agentic Hackathon](https://allthingsagentichackathon.devpost.com/)** — Taskmaster track — on Gemini and Google Cloud.

---

## Table of Contents

- [🎓 StudyHub AI](#-studyhub-ai)
  - [Table of Contents](#table-of-contents)
  - [The Problem](#the-problem)
  - [The Solution](#the-solution)
  - [How It Works (Process)](#how-it-works-process)
  - [Agent Workflow Diagram](#agent-workflow-diagram)
  - [Key Features](#key-features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Production Build](#production-build)
  - [Environment Variables](#environment-variables)
  - [Project Structure](#project-structure)
  - [Challenges We Ran Into](#challenges-we-ran-into)
  - [Pictures](#pictures)
  - [What's Next](#whats-next)
  - [Hackathon Submission](#hackathon-submission)

---

## The Problem

Students spend a huge share of every semester on academic *logistics* instead of actual learning:

- **Scattered sourcing.** Hours lost hunting for the right textbook edition, a legal free copy, or a trustworthy paper — instead of reading it.
- **Manual scheduling.** Exam windows, "no-backtracking" test rules, and multi-hour uninterrupted testing blocks (often 420 minutes / 7 hours on platforms like Canvas) get missed or mis-scheduled by hand.
- **Tedious transcription.** Rewriting spoken lecture math into properly formatted LaTeX after class eats time that should go toward understanding it.
- **No system for retention.** Notes pile up with no spaced-repetition plan behind them, so review turns into last-minute cramming.

None of this is *learning* — it's overhead. StudyHub AI exists to remove it.

## The Solution

StudyHub AI is a single web app where a student uploads (or pastes) a course syllabus once, and an orchestrator agent fans that syllabus out to five specialist agents that each take *real, autonomous action* — not just a chat reply:

1. **Schedule & 420-Minute Rule Injector** — parses exam policies and reserves dedicated uninterrupted test-prep blocks directly on the student's **Google Calendar**.
2. **Zero-Cost Textbook & Open-Access Procurement** — cross-references required readings against OpenStax, CrossRef, and other OER sources to find free or lowest-cost alternatives, with an estimated dollar savings.
3. **Spoken Audio-to-LaTeX Transcriber** — converts recorded lecture math (integrals, proofs, decision variables) into clean, exportable LaTeX/KaTeX.
4. **Active Recall & Anki SM-2 Deck Builder** — turns syllabus topics and notes into spaced-repetition flashcards, exportable as `.apkg`/TSV, plus an in-app quiz arena.
5. **Policy Guardian & Google Workspace Dispatcher** — audits course policies, then syncs the resulting plan to real **Google Tasks** and drafts a real **Gmail** message to the instructor when one is needed.

A sixth tool, the **Research Assistant**, summarizes literature, extracts methodologies, and generates publication-ready BibTeX citations for supplementary research.

Every run is persisted to **Firebase Firestore**, so a student's courses, decks, and study plans are there the next time they log in.

## How It Works (Process)

1. **Ingest** — the student pastes syllabus text or uploads a file (`.txt`/`.md` read client-side; PDFs are sent to a server endpoint that extracts text via Gemini's multimodal API).
2. **Orchestrate** — the syllabus is sent to the orchestrator, which prompts Gemini to extract exam policies, textbook requirements, quantitative content, and key topics in a single structured pass.
3. **Fan-out** — the orchestrator invokes each specialist agent in sequence (schedule, textbook, LaTeX, flashcards, policy/dispatch), passing the relevant slice of parsed syllabus data to each.
4. **Act, not just answer** — where a real integration exists (Google Calendar, Tasks, Gmail), the agent uses the authenticated Google OAuth session to actually create the event, task, or draft — the student reviews and can edit before anything is sent.
5. **Persist** — the full result (course record, flashcard deck, study plan) is written to Firestore under the signed-in user, and surfaced across dedicated tabs (Calendar, Tasks, Gmail, Textbook, Audio-to-LaTeX, Anki, Research, Architecture).
6. **Observe** — every agent step streams into an in-app **Agent Activity Terminal**, so the multi-step, asynchronous nature of the pipeline is visible while it runs, not hidden behind a spinner.

## Agent Workflow Diagram

![StudyHub AI agent workflow — student uploads a syllabus to an orchestrator agent, which calls Gemini to select the right specialist agent, which in turn calls the matching tool (Calendar API, Gmail & Tasks API, OER textbook search, audio-to-LaTeX, Anki generator), and returns a synthesized result to the student](assets/hackathon-assets/02-workflow-diagram.png)

Picture 1: Agent Workflow

## Key Features

-  **Textbook Procurement Hub** — free/low-cost textbook finder with side-by-side cost comparison.
-  **Research Assistant** — literature summarization, methodology extraction, BibTeX generation.
-  **Voice-to-LaTeX** — speak a formula, get clean, exportable LaTeX back.
-  **Active Recall / Anki Hub** — SM-2 spaced-repetition decks with an interactive quiz arena and `.apkg`/TSV export.
-  **Policy Guardian** — surfaces syllabus rules (no-backtracking, cumulative vs. non-cumulative, timed windows) so nothing gets missed.
-  **Real Google Calendar sync** — actual 420-minute study/exam-prep blocks, not a suggestion in a chat bubble.
-  **Real Google Tasks sync** — action items written to the student's own task list.
-  **Real Gmail drafts** — instructor emails pre-written and left in Drafts for review before sending.
-  **Agent Activity Terminal** — a live, transparent log of what each agent is doing and why.
-  **Saved Orders** — every processed course is stored in Firestore and can be revisited later.
-  **Architecture View** — an in-app, explorable diagram of every agent, its inputs/outputs, and the tools it calls.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Express (via `tsx`/`server.ts`), Node.js |
| AI / Agents | Google Gemini API (`@google/genai`) — multimodal syllabus parsing, audio transcription, structured JSON generation |
| Data & Auth | Firebase / Cloud Firestore, Google Identity Services (OAuth) |
| Google Workspace Integrations | Google Calendar API, Google Tasks API, Gmail API |
| Package Manager | Bun (with npm as a fallback) |
| Build/Deploy | Vite build + esbuild bundle, deployable to Google Cloud Run / Firebase Hosting |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/apikey)
- A [Firebase project](https://console.firebase.google.com/) with Firestore enabled
- A Google Cloud OAuth Client ID with the Calendar, Tasks, and Gmail scopes enabled (for the Workspace sync features)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/nanpiyaporn/studyhubai.git
cd studyhubai

# 2. Install dependencies
bun install
# — or —
npm install

# 3. Configure environment variables
cp .env.example .env
# then fill in the values described below

# 4. Run the app (single command runs both API + frontend on one port)
bun run dev
# — or —
npm run dev
```

The app will be available at **http://localhost:3000**.

### Production Build

```bash
npm run build   # builds the Vite frontend and bundles server.ts to dist/server.cjs
npm run start   # runs the production server from dist/
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY`  | Powers every agent's calls to the Gemini API | Yes|
| `APP_URL` | Recommended | Public URL of the deployed app (auto-injected on Cloud Run) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | For Workspace sync | OAuth credentials used for Calendar/Tasks/Gmail scopes |
| `FIREBASE_PROJECT_ID`, `FIREBASE_APP_ID`, `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_FIRESTORE_DATABASE_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID` | Yes | Firestore persistence for saved courses, decks, and study plans |
| `VITE_FIREBASE_*` equivalents |  Yes (client-side) | Same Firebase config, exposed to the Vite-built frontend |

None of these are committed to the repo — see `.env.example` for the full template.

## Project Structure

```
studyhubai/
├── server.ts                        # Express API + Gemini agent endpoints + Vite middleware
├── src/
│   ├── App.tsx                      # Tab routing and top-level session state
│   ├── components/
│   │   ├── TaskmasterWorkflow.tsx   # Main orchestrator UI — upload, run, review
│   │   ├── TextbookProcurementHub.tsx
│   │   ├── AudioLatexTranscriber.tsx
│   │   ├── AnkiActiveRecallHub.tsx / ActiveRecallArena.tsx
│   │   ├── PolicyGuardianView.tsx
│   │   ├── ResearchScraperView.tsx
│   │   ├── CalendarView.tsx / TasksManager.tsx / GmailComms.tsx
│   │   ├── AgentActivityTerminal.tsx
│   │   └── WorkflowArchitectureView.tsx  # In-app architecture explorer
│   └── services/
│       ├── agentOrchestrator.ts     # Runs the agent pipeline + persists to Firestore
│       ├── geminiAgents.ts          # Individual agent prompt/response functions
│       ├── googleWorkspace.ts       # OAuth + Calendar/Tasks/Gmail API calls
│       └── firebase.ts
└── assets/hackathon-assets/         # Submission images (cover, architecture diagram, script cards)
```

## Challenges We Ran Into

- **Do by learning it** When I double check this project, some of the request still stuck. It may not perfect, at least we learn something. Let's check it out at [StudyHub.ai.studio](https://studyhuba.ai.studio/)
- **There will be some error happen** we will ask Gemini to fix that
  ![how to fix error](https://github.com/nanpiyaporn/studyhubai/blob/main/assets/hackathon-assets/error2.png)

  Picture 3: how to fix error
  
- **Some of the book search may not have direct link** some of the free tool to find the book may not available. For example: from the library, we need to lock-in to the website first that we could not do it yet.
  
- **Keeping Gemini's output reliably structured.** Five agents each depend on a specific JSON shape coming back from one syllabus parse — getting consistent, schema-valid output across wildly different syllabus formats took prompt iteration.
  
- **Real OAuth scopes, not a mock.** Wiring genuine `calendar.events`, `tasks`, and `gmail.compose` scopes through Google Identity Services — and handling token expiry gracefully — took more care than a simulated integration would have.
- **PDF syllabi.** Not every syllabus is plain text; extracting clean structure from scanned/formatted PDFs via a multimodal model call required a dedicated server-side extraction path.
- **420-minute block scheduling around existing commitments.** Reserving a genuinely uninterrupted 7-hour window without just overwriting a student's existing calendar events needed conflict-aware logic, not a naive insert.
  
## Pictures 

  ![Anki flashcard](https://github.com/nanpiyaporn/studyhubai/blob/main/assets/hackathon-assets/ankiflashcard.png)
  Picture 2: Anki Agent helps student build a study flashcard


## What's Next

- Deeper conflict resolution when auto-scheduling around a student's existing calendar.
- Expanding the Textbook Procurement agent to more OER catalogs and campus library systems.
- Agent-to-agent negotiation (e.g., the scheduler and policy guardian reconciling directly) rather than a strictly sequential pipeline.
- Multi-course support in a single run for students juggling a full course load.

## Hackathon Submission

- **Event:** [All Things Agentic Hackathon](https://allthingsagentichackathon.devpost.com/) (Devpost)
- **Track:** Taskmaster — autonomous, multi-step workflow agents
- **Built by:** Piyaporn (Nan) Puangprasert

---

<p align="center">Made with  Gemini, Firebase, and a lot of coffee.</p>
