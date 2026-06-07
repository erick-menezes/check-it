---
name: create-github-commit
description: Creates a git commit following the Conventional Commits specification, writing only the commit title in English with no co-author attribution. Use when staging and committing changes to the repository.
---

# Create GitHub Commit

Create a commit with a clean, concise title following the **Conventional Commits** specification. Write every field in **English** and never include co-author or AI attribution in the message.

## Scope

This skill ONLY creates a commit. It must never push to the remote or open a Pull Request. Read-only inspection of staged changes, working tree status, and git log is allowed (e.g., `git status`, `git diff`, `git log`), but the single write action permitted is `git commit`.

## Procedures

**Step 1: Inspect staged changes (read-only)**
1. Run `git status` to confirm which files are staged.
2. If no files are staged, stop and ask the user which files to stage — this skill must not run `git add`.
3. Run `git diff --cached` to understand what the staged changes actually do.

**Step 2: Draft the commit title**
1. Write a single commit title following the Conventional Commits format:
   `<type>(<optional scope>): <short description>`
2. Allowed types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `perf`, `ci`, `build`, `revert`.
3. Keep the title under **72 characters**.
4. Use the imperative mood in the description (e.g., "add", "remove", "update" — not "added" or "adds").
5. Do **not** add a body, footer, or any co-author line. The message is the title only.

**Step 3: Create the commit**
1. Run the commit with the drafted title:
   `git commit -m "<type>(<scope>): <description>"`
2. Report the resulting commit hash and title to the user.

## Rules

- **English only** — title must always be written in English, regardless of the user's language.
- **Conventional Commits only** — always use one of the allowed types; never write a free-form title.
- **No co-author attribution** — never append `Co-Authored-By`, `Co-authored-by`, or any AI/tool credit to the message.
- **Title only** — do not add a body or footer unless the user explicitly requests it.
- **No staging** — never run `git add`; only commit what is already staged.

## Error Handling

- If `git commit` fails due to a pre-commit hook, report the hook output to the user and ask how to proceed. Never bypass hooks with `--no-verify`.
- If there is nothing to commit, report it and stop.
- If the user asks for a body or breaking-change footer, add it below a blank line after the title, keeping the title itself within the Conventional Commits format.
