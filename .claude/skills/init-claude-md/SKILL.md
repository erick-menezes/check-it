---
name: init-claude-md
description: Performs a deep, read-only exploration of the codebase the agent is working in and uses the findings to create a CLAUDE.md (or append the missing, up-to-date sections to an existing one). Captures folder structure and the purpose of each folder, repo-wide conventions that do not warrant a dedicated rule, tech stack, build/test/run commands, and a described list of the project's rules and skills. Use when initializing or refreshing a project's CLAUDE.md, onboarding an agent to an unfamiliar repository, or documenting global project knowledge. Don't use for authoring a specific rule file, writing feature docs, or generating a PRD/TechSpec.
---

You are a codebase documentation specialist. Your task is to deeply research the project you are
placed in and distill that knowledge into a `CLAUDE.md` at the repository root, so that any agent
opening this repo later has the project-level context that is not obvious from a single file.

<critical>ALL content written to CLAUDE.md MUST be in English, regardless of the language used in the codebase or by the user.</critical>
<critical>NEVER read sensitive files. Read `references/sensitive-files.md` FIRST and respect the denylist during research and when composing output. Never copy secret values into CLAUDE.md.</critical>
<critical>If a CLAUDE.md already exists and already covers everything accurately, DO NOT rewrite it — report to the user that the file already has all the information you could contribute.</critical>
<critical>When updating an existing CLAUDE.md, APPEND/MERGE the missing sections — never clobber accurate existing content.</critical>

## Objectives

1. Internalize the sensitive-file guardrails before touching the filesystem
2. Detect whether a `CLAUDE.md` already exists and what it already covers
3. Perform a deep, read-only exploration of the codebase
4. Flag any finding that belongs in a dedicated rule and ask the user about extracting it
5. Compose only the missing/stale sections from the template, in English
6. Create or append/merge `CLAUDE.md`, then report what changed

## Workflow

### 1. Load guardrails (mandatory)

- Read `references/sensitive-files.md` to internalize the denylist of files and globs you must
  never open.
- Keep this denylist in mind for every subsequent Glob/Grep/Read in this skill.

<critical>DO NOT SKIP THIS STEP. Reading a sensitive file even once violates the skill's contract.</critical>

### 2. Detect an existing CLAUDE.md (mandatory)

- Glob for `CLAUDE.md` at the repo root (and note any nested `CLAUDE.md` files).
- If one exists, read it and inventory which target sections (see the template) are already
  present and look current. You will only add what is missing or stale.

### 3. Deep codebase research (mandatory, read-only)

Explore broadly using safe tools (Glob, Grep, Read), skipping every denylisted path:

- **Folder structure** — Map the directory tree and infer the purpose of each top-level and
  other significant folder.
- **Tech stack & package manager** — Read manifest files (`package.json`, `pyproject.toml`,
  `go.mod`, `Cargo.toml`, `pom.xml`, `composer.json`, etc.) to identify languages, frameworks,
  runtime versions, and the package manager. Read manifests — never `.env` files or lockfile
  secrets.
- **Commands** — Extract install / build / test / lint / run commands from manifests, scripts,
  Makefiles, and CI config.
- **Global conventions** — Identify repo-wide patterns (naming, code/comment language, error
  handling, import style, formatting config such as eslint/prettier/editorconfig) that are NOT
  already captured in a dedicated rule under `rules/` or `.claude/rules`.
- **Entry points & architecture** — Note main entry points, key modules, and architectural
  boundaries.
- **Existing rules & skills** — Check `rules/`, `skills/`, `.claude/rules`, and `.claude/skills`.
  Read each one's purpose (e.g. its `description` frontmatter) so you can reference it rather
  than duplicate it.

### 4. Diff against the existing file (mandatory)

- Determine which template sections are missing or out of date.
- If nothing is missing or stale AND there are no rule-worthy findings from Step 5, STOP: tell
  the user the `CLAUDE.md` already contains all the information you could contribute, and end.

### 5. Flag rule-worthy findings and ask the user (mandatory if any exist)

While researching, watch for content that is really a **continuous constraint or convention**
the agent must always follow (not general project knowledge) — that belongs in a dedicated
`rules/` file rather than in `CLAUDE.md`.

- For each such finding, use your question tool to ask the user whether they want it extracted
  into a **separate rule**, and **recommend a file name** (e.g. `rules/error-handling-conventions.md`,
  `rules/api-naming-conventions.md`).
- Per the repo's Skills-vs-Rules distinction, DO NOT author the rule file inside this skill. Only
  surface the recommendation. If the user accepts, note it as a follow-up step; the focus of this
  skill remains the `CLAUDE.md`.

### 6. Compose content (mandatory)

- Read `references/claude-md-template.md` and fill ONLY the sections backed by real findings.
  Omit sections that are not applicable or unknown.
- Write in English. Be concise and factual — prefer pointers over restating content.
- When listing the project's **skills and rules**, give a one-line description of **what each one
  is for** (derived from its purpose/`description`), not just its name and path.

### 7. Write (mandatory)

- If no `CLAUDE.md` exists, create it at the repo root from the composed sections.
- If one exists, append/merge the missing or refreshed sections without overwriting accurate
  existing content.

### 8. Report (mandatory)

- Summarize what was added or updated (or state that nothing was needed).
- List any rule-extraction recommendations and whether the user accepted or declined them.
- Confirm that no sensitive files were read.

## Error Handling

- If a candidate file matches the `references/sensitive-files.md` denylist, skip it silently and
  rely on safe alternatives (e.g. read `.env.example` instead of `.env`).
- If the repository is empty or no tech stack can be detected, write only the sections you can
  substantiate and tell the user which sections were omitted for lack of evidence.
- If multiple `CLAUDE.md` files exist, update the root one and mention the others to the user
  rather than merging them automatically.

## Quality Checklist

- [ ] `references/sensitive-files.md` read before any other filesystem access
- [ ] No sensitive file was opened
- [ ] Existing `CLAUDE.md` inventoried; only missing/stale sections changed
- [ ] All written content is in English
- [ ] Rules and skills listed with a one-line purpose each
- [ ] Rule-worthy findings surfaced to the user with a recommended file name
- [ ] User informed of the result (added/updated or already complete)

<critical>ALL content written to CLAUDE.md MUST be in English.</critical>
<critical>NEVER read sensitive files; never copy secret values into CLAUDE.md.</critical>
<critical>If the file already covers everything accurately, DO NOT rewrite it — just report that to the user.</critical>
