# LangLearn — AI-Powered Language Learning Platform

> Production-ready AI-powered language learning platform built from scratch with clean architecture, modern typography, Apple-inspired aesthetics, and enterprise scalability.

---

## 🏛 Architecture Overview

LangLearn is architected following **Clean Architecture** and **SOLID Principles**, enforcing strict separation of concerns across presentation, state, domain logic, storage, API transport, and AI/speech services.

```
c:\langlearn\
├── public/                     # Static assets and icons
│   └── logo.svg                # Brand emblem
├── src/
│   ├── app/                    # Routing, top-level layout orchestrator, global providers
│   │   ├── App.tsx             # Root component
│   │   ├── AppProviders.tsx    # Context & Error Boundary hierarchy
│   │   └── routes.tsx          # Code-split lazy routes for all 16 modules
│   ├── assets/                 # SVGs and images
│   ├── components/             # Reusable UI component design system
│   │   ├── feedback/           # ErrorBoundary, Toast, LoadingSpinner, ErrorState
│   │   ├── layout/             # AppLayout, Header, Sidebar, MobileNav, ModuleHeader
│   │   └── ui/                 # Button, Card, Input, Badge, Avatar, ProgressBar, Modal, Tabs, Select
│   ├── config/                 # Environment validation, navigation, themes, constants
│   │   ├── constants.ts        # Routes, storage keys, language registries
│   │   ├── env.config.ts       # Typed environment configuration
│   │   ├── navigation.config.ts# Categorized navigation definitions
│   │   └── theme.config.ts     # Dark/light theme definitions
│   ├── context/                # React contexts (Theme, Notifications, Auth)
│   ├── database/               # Relational DDL & client storage engine
│   │   ├── schema.sql          # Full PostgreSQL/SQLite DDL schema
│   │   ├── storage-engine.ts   # Client-side persistent storage engine
│   │   └── repositories/       # Generic & specialized repositories (User, Progress)
│   ├── modules/                # 16 decoupled domain modules
│   │   ├── splash/             # Startup & hydration entry point
│   │   ├── onboarding/         # Goal setting & placement flow
│   │   ├── authentication/     # JWT authentication & session state
│   │   ├── home/               # Central dashboard & momentum overview
│   │   ├── learn/              # Interactive adaptive skill tree
│   │   ├── languages/          # Language directory & switching
│   │   ├── courses/            # CEFR syllabi catalog
│   │   ├── lessons/            # Bite-sized learning units
│   │   ├── vocabulary/         # Spaced Repetition (SRS) vocabulary
│   │   ├── practice/           # Multi-modal AI arena
│   │   ├── quiz/               # Gamified knowledge check
│   │   ├── translator/         # Real-time neural translation
│   │   ├── progress/           # Retention analytics & streak charts
│   │   ├── profile/            # User account & credential management
│   │   ├── settings/           # Audio, theme, and application preferences
│   │   └── admin/              # Staff diagnostics & logging console
│   ├── plugins/                # Dynamic plugin manager & lifecycle interfaces
│   ├── services/               # Isolated external services
│   │   ├── ai/                 # Gemini API-ready tutor & grammar analyzer
│   │   ├── api/                # HTTP client with interceptors & typed endpoints
│   │   ├── auth/               # Token storage & session service
│   │   ├── logging/            # Structured production logger with in-memory tail
│   │   ├── speech/             # Web Speech TTS & STT with browser fallbacks
│   │   └── translation/        # Multi-language translation engine
│   ├── state/                  # Zustand stores (Auth, UI, User state)
│   ├── types/                  # Domain entity definitions
│   └── utils/                  # cn (clsx + tailwind-merge), validators, formatters, storage
├── .env.example                # Documented environment variables
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Apple-inspired design tokens
└── tsconfig.json               # Strict TypeScript configuration
```

---

## ⚡ Getting Started

### Development
```bash
npm run dev
```

### Production Build & Typecheck
```bash
npm run lint
npm run build
npm run preview
```

---

## 🎯 Implementation Roadmap

| Phase | Scope | Status |
|---|---|:---:|
| **Phase 1: Foundation** | Project structure, clean architecture, routing, 16 base modules, navigation, Apple UI design system, theme manager, services, repositories, plugin architecture | **Completed** |
| **Phase 2: Core Auth & Onboarding** | Splash screen animation, interactive Onboarding flow, complete Authentication forms & token exchange | *Next Prompt* |
| **Phase 3: Curriculum & Lessons** | Interactive skill tree, lesson runner, rich dialogue player, CEFR syllabi | *Upcoming* |
| **Phase 4: Spaced Repetition & Quiz** | SuperMemo SM-2 algorithm, flashcard flip deck, adaptive quiz engine | *Upcoming* |
| **Phase 5: AI Tutor & Speech Studio** | Gemini AI chat tutor, grammar diagnostics, phoneme pronunciation scoring | *Upcoming* |
| **Phase 6: Admin, Plugins & Analytics** | Real-time analytics charts, content management, third-party plugin loader | *Upcoming* |
