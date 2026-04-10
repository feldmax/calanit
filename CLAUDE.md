# Claude Code Instructions for Calanit Project

## Project Overview

**Calanit** is a web application for managing parking spaces and storage rooms in a 36-apartment residential building. This is an MVP learning project focused on short-term parking rental between neighbors.

**Stack**: HTML, CSS, JavaScript, Google Sheets (database), Google Apps Script (backend), GitHub Pages (hosting)

## Communication Language Rules

- **Dialogue with AI**: Russian language with original English technical terms
- **Code comments**: English only
- **Documentation (.md files)**: English only
- **Log files**: Russian for context, English for technical details

## Development Workflow

### Branch Management

**🚨 ABSOLUTE RULE: NEVER WORK IN main OR master BRANCH 🚨**

- **CRITICAL**: Every agent session MUST run in a separate feature branch
- **MANDATORY**: At the start of EVERY session, check current branch with `git branch --show-current`
- **MANDATORY**: If on `main` or `master`, immediately create and switch to a feature branch
- Branch naming: `feature/YYYY-MM-DD-<task-description>`
- Never commit or merge to `main` or `master` directly
- User will manually review and merge all changes

**Workflow**:
1. Start session → check current branch
2. If on `main`/`master` → create feature branch immediately
3. Do all work in feature branch
4. Leave changes unstaged for user review
5. User reviews → commits → merges to main

**Why this rule exists**: Working in `main` pollutes the main branch with unreviewed changes. Feature branches allow user to review, test, and selectively merge changes.

### Custom Commands

#### `/logs` Command

**User input**: When user types `/logs` (exact match, case-insensitive)

**Agent must execute**:
1. Collect current session data:
   - Session start timestamp
   - Model(s) used during session
   - All user prompts (in Russian)
   - All agent responses summary (in Russian with English technical terms)
   - All tools used
   - All files created/modified
   - Token usage from `/cost` command output
   - API duration and wall clock duration
   - Code changes statistics (lines added/removed)

2. Create session log file:
   - Path: `logs/sessions/session-YYYY-MM-DD-HHmmss-<model>.md`
   - Use timestamp from session start
   - Include all collected data in structured markdown format
   - Add sections: Session Info, User Prompts, Agent Actions, Tools Used, Files Modified, Budget Tracking

3. Create/update daily budget file:
   - Path: `logs/budget/budget-YYYY-MM-DD.json`
   - If file exists, append session data to `sessions` array
   - Update `daily_total_tokens` and `daily_total_cost_usd`
   - Include token breakdown by model
   - Include cache usage if applicable

4. Update monthly summary file:
   - Path: `logs/budget/budget-summary-YYYY-MM.md`
   - Add current session to daily breakdown table
   - Add session details to chronological list
   - Recalculate monthly totals
   - Update "By Model" statistics
   - Update "Last updated" date

5. Confirm to user:
   - "✅ Session logs created: `<session-log-filename>`"
   - "✅ Budget updated: daily and monthly summaries"
   - Show brief summary: cost, tokens, files modified

**IMPORTANT**: 
- Do NOT create session logs at the beginning of a session
- Only create/update logs when user explicitly calls `/logs` command
- Session logs should be created at the END of the session via `/logs` command
- If `/logs` called multiple times in same session, update existing files

#### `exit` Command Behavior

**User input**: When user types `exit` or indicates session should end

**Agent must check**:
1. Was `/logs` command executed during this session?
2. Does session log file exist in `logs/sessions/` for current session timestamp?
3. Was daily budget file updated for today's date?

**If logs NOT created or creation failed**:
```
⚠️  Session logs have not been created yet.

Would you like to run /logs before exiting to save:
- Session log with all prompts and responses
- Budget tracking (cost: $X.XX, tokens: XXXXX)
- Files modified: X files

Type 'yes' to create logs, or 'no' to exit without saving logs.
```

**If user confirms** (`yes`):
- Execute `/logs` command steps (see above)
- Then exit session

**If user declines** (`no`):
- Exit without creating logs
- Warn: "⚠️  Session logs not saved. This session will not be tracked in budget."

**If logs already created**:
- Exit normally
- Optionally show: "✅ Session logs saved. Safe to exit."

**Note**: This behavior ensures no session work is lost and budget tracking remains accurate.

### Logging Requirements

Session logging is managed via the `/logs` custom command (see Custom Commands section above).

#### 1. Session Logs (`logs/sessions/`)
**Created via `/logs` command**

Format: `session-YYYY-MM-DD-HHmmss-<model>.md`

Must include:
- Date and timestamp
- Model used (haiku/sonnet/opus)
- User prompts (in Russian)
- Agent responses (in Russian with English technical terms)
- Tools used
- Files modified

#### 2. Agent/Subagent Logs (`logs/agents/`)
**Created automatically when subagents are used**

Format: `agent-<agent-type>-YYYY-MM-DD-HHmmss.md`

Must include:
- Agent type (explore/plan/general-purpose)
- Task description
- Reasoning summary
- Result summary
- Files accessed

#### 3. Budget Tracking (`logs/budget/`)
**Created/updated via `/logs` command**

**Daily file**: `budget-YYYY-MM-DD.json`
```json
{
  "date": "2026-04-03",
  "sessions": [
    {
      "session_id": "session-2026-04-03-140530-sonnet",
      "model": "sonnet",
      "input_tokens": 15000,
      "output_tokens": 3000,
      "total_tokens": 18000,
      "estimated_cost_usd": 0.054
    }
  ],
  "daily_total_tokens": 18000,
  "daily_total_cost_usd": 0.054
}
```

**Monthly summary**: `budget-summary-YYYY-MM.md`

### Model Selection Guidelines

- **Haiku** (cheapest): Simple tasks, file reading, basic edits
- **Sonnet** (balanced): Architecture, planning, moderate complexity - **DEFAULT**
- **Opus** (most capable): Complex algorithms, critical decisions, debugging hard issues

**Rules**:
- Agent should suggest switching to Opus if task is too complex for current model
- Agent can autonomously switch to Haiku for trivial tasks
- Always log model used in session logs

### Confirmation Requirements

- **Automatic (no confirmation)**: Log file writes, reading files, searching code
- **Requires confirmation**: Any modifications to existing code, creating new source files, git operations (except branch creation)
- **Strictly forbidden**: Direct commits/merges to main/master, modifying code without user approval

### Agent Behavior

- Ask clarifying questions when instructions are ambiguous
- Suggest better architectural alternatives if user's approach has issues
- Be concise - no verbose reasoning chains
- Justify recommendations briefly and to the point
- Save subagent work logs with task, reasoning, and results
- Track budget actively - suggest cheaper models when appropriate

## Technical Constraints

### Authentication
- Phone number only (MVP stage)
- Check against Google Sheets registry
- No OAuth or complex auth systems yet

### Database
- Google Sheets in admin's Google account
- Accessed via Google Apps Script
- No direct user access to sheets

### Hosting
- GitHub Pages (free tier)
- Static files only
- No server-side rendering

### External Dependencies
- Minimize external libraries
- Vanilla JavaScript preferred
- CSS without preprocessors

## Code Style

- **JavaScript**: ES6+, async/await, clear variable names
- **HTML**: Semantic HTML5, accessibility considerations
- **CSS**: Mobile-first, responsive design
- **Comments**: English, explain "why" not "what"

## Security Considerations

- No sensitive data in client-side code
- Phone numbers must be hashed/validated server-side (Google Apps Script)
- CORS configuration for Google Apps Script API
- Input validation on both client and server

## Development Priorities

1. **Control**: Full visibility and manual approval of changes
2. **Budget**: Track every token, optimize model usage
3. **Learning**: Document every decision and reasoning
4. **Simplicity**: Avoid over-engineering, keep MVP scope small

## File Permissions

- Source files (`src/`): 644 (rw-r--r--)
- Documentation (`docs/`): 644 (rw-r--r--)
- Logs (`logs/`): 644 (rw-r--r--)
- Scripts (if any): 755 (rwxr-xr-x)

## Next Steps Tracking

After each significant task completion, agent should:
1. Summarize what was accomplished
2. Suggest 2-3 logical next steps
3. Ask user to choose direction

## Questions to Ask User

If any of these are unclear:
- Specific data structure for Google Sheets
- Authentication flow details
- UI/UX preferences and language (Russian/English interface?)
- Priority: parking vs storage features first?
