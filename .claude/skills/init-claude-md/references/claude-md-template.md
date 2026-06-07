# CLAUDE.md Template

Fill in only the sections backed by real findings. Omit any section that is not applicable or
cannot be substantiated. Write everything in English. Keep entries concise — prefer pointers to
existing files over restating their content. Remove these instruction comments from the final
output.

---

# CLAUDE.md

<!-- One-paragraph summary of what this project is and why it exists. -->
## Project Overview

[What the project does and its purpose.]

<!-- Languages, frameworks, package manager, runtime versions. Omit unknowns. -->
## Tech Stack

- **Language(s):** [e.g. TypeScript, Python]
- **Framework(s):** [e.g. React, Express]
- **Package manager:** [e.g. npm, pnpm, uv, cargo]
- **Runtime / versions:** [e.g. Node 20, Python 3.12]

<!-- Tree of significant folders with a one-line meaning each. Omit trivial folders. -->
## Folder Structure

```
[dir]/        — [what it holds / its responsibility]
[dir]/[sub]/  — [purpose]
```

<!-- Install / build / test / lint / run commands found in manifests, scripts, Makefiles, CI. -->
## Commands

- **Install:** `[command]`
- **Build:** `[command]`
- **Test:** `[command]`
- **Lint / format:** `[command]`
- **Run / dev:** `[command]`

<!-- Repo-wide patterns that apply across the board and are NOT already in a dedicated rule. -->
## Global Conventions

- [Naming, code/comment language, error handling, imports, formatting config, etc.]

<!-- Main entry points, key modules, and architectural boundaries. -->
## Entry Points & Architecture

- **Entry point(s):** [file(s)]
- **Key modules:** [module — responsibility]
- **Boundaries:** [how layers/modules are separated]

<!-- List each rule and skill with a one-line description of what it is for. Name + purpose + path. -->
## Rules & Skills

**Rules** (continuous constraints the agent must always follow):
- `rules/[name].md` — [what it enforces]

**Skills** (on-demand step-by-step procedures):
- `skills/[name]/` — [what task it performs]

<!-- Non-obvious caveats, gotchas, or things that commonly trip people up. -->
## Notes / Gotchas

- [Caveat or non-obvious detail.]
