# Budget Summary - April 2026

## Monthly Overview

**Period**: April 1-30, 2026
**Total Sessions**: 2
**Total Cost**: $5.583 USD

---

## Daily Breakdown

| Date | Sessions | Total Tokens | Cost (USD) | Notes |
|------|----------|--------------|------------|-------|
| 2026-04-05 | 1 | 64,345 | $0.193 | Data model restructure, documentation update |
| 2026-04-08 | 1 | 52,200 | $5.390 | Simplified MVP structure, 4 tables, updated docs (includes cache costs) |

---

## Session Details

### 2026-04-05

#### Session 1: session-2026-04-05-211553-sonnet
- **Model**: Sonnet (claude-4.5-sonnet)
- **Input Tokens**: 52,245
- **Output Tokens**: 12,100
- **Total Tokens**: 64,345
- **Cost**: $0.193
- **Task**: Restructured Google Sheets data model with 5 parking types, hourly rental model (1-48h), updated all documentation files, created comprehensive sample data for 2 buildings with 36 apartments

#### Session 2: session-2026-04-08-223710-sonnet
- **Model**: Sonnet (claude-4.5-sonnet)
- **Input Tokens**: 2,200
- **Output Tokens**: 50,000
- **Cache Read Tokens**: 2,100,000
- **Cache Write Tokens**: 496,500
- **Total Tokens**: 52,200
- **Cost**: $5.390
- **Task**: Simplified MVP to single building, 4 tables, 3 parking types. Complete rewrite of google-sheets-setup.md and sample-data.md. Updated development-plan.md. Context continuation session with heavy cache usage.

### By Model

| Model | Sessions | Tokens | Cost | Percentage |
|-------|----------|--------|------|------------|
| Sonnet | 2 | 116,545 | $5.583 | 100% |
| Haiku | 0 | 0 | $0.000 | 0% |
| Opus | 0 | 0 | $0.000 | 0% |

### Projection

- **Average per session**: $2.79
- **If maintained for 30 days** (1 session/day): ~$83.70/month
- **Budget remaining** (assuming $50/month): -$33.70 (over budget due to cache costs)

---

## Notes

- Session 1 (2026-04-05): Initial data model, low cost
- Session 2 (2026-04-08): Context continuation after compaction - very high cache usage
  - Cache read: 2.1M tokens ($0.63)
  - Cache write: 496.5K tokens ($1.86)
  - Output: 50K tokens ($0.75)
  - **Cache costs dominate**: $2.49 out of $5.39 (46%)
- Model choice (Sonnet) appropriate for documentation work
- Context compaction triggered high cache costs in Session 2
- Future sessions should benefit from cached context (lower cache write costs)

---

## Recommendations

1. **Continue with Sonnet** for:
   - Architecture decisions
   - Complex documentation
   - Multi-file refactoring
   - API design

2. **Switch to Haiku** for:
   - Simple file edits
   - Reading documentation
   - Basic bug fixes
   - Testing

3. **Reserve Opus** for:
   - Critical security issues
   - Complex algorithm development
   - Debugging difficult bugs
   - Production deployment decisions

---

## Next Session Planning

Suggested model based on likely tasks:
- Google Apps Script development: **Sonnet** (medium complexity)
- Sample data insertion: **Haiku** (copy-paste operations)
- API endpoint testing: **Sonnet** (logic validation)
- Frontend HTML/CSS: **Haiku** (straightforward markup)
- Authentication logic: **Sonnet** (security-sensitive)

---

Last updated: 2026-04-08
