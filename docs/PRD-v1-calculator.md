# BlockPlane Integrated — PRD v1 (Calculator + Context-Aware AI)

## 1) Goal (Must hit)
Deliver a clean “Materials → LIS/RIS/CPI (read-only) → InsightBox v2 (context-aware)” loop that renders instantly with our sample dataset and supports CSV import.

## 2) Non-goals (v1)
- No CPI editing or price fetches
- No project triggers learning/tuning
- No MarginShield memo generator (lite comes in v2)

## 3) Must / Should / Could
**Must**
- Load Material Library (seed set) from local JSON/CSV
- Compute & display LIS/RIS, CPI *read-only* with confidence bands
- CSV import (validated; show errors inline)
- InsightBox v2: context-aware hints (per material row + top summary)
- Analytics: activation, TTFV, insight accept/ignore

**Should**
- Filters (region/material type), lifecycle phase chips
- Methods modal (sources, freshness, notes)
- Netlify preview builds on PRs

**Could**
- Theme toggle (light/dark)
- Sample project switcher

## 4) User stories
- As a builder, I upload a CSV and immediately see LIS/RIS/CPI per material.
- As a PM, I see 2–3 prioritized insights with confidence and accept/ignore them.

## 5) UX notes
- One screen: Filters (top), Table (center), InsightBox (right/bottom on mobile)
- Hover reveals quick math; bands: Low/Medium/High

## 6) Analytics (events)
- calc_opened, csv_import_success, insight_view, insight_accept, insight_ignore

## 7) Tech & flags
- Feature flags: INSIGHTBOX_V2, CPI_READONLY
- Vite + TS + Tailwind; Netlify previews required for PRs

## 8) Risks & mitigations
- Data trust: show source + freshness; link to Methods
- Scope creep: PRD gate + feature flags
