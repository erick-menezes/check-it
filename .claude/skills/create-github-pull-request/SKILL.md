---
name: create-github-pull-request
description: Creates a GitHub Pull Request using the gh CLI, following a fixed PR template and writing all content in English. Use when opening, drafting, or submitting a pull request from the current branch. Targets the dev branch by default and only targets main when explicitly requested. Do not use for committing code, reviewing existing PRs, or non-GitHub git hosts.
---

# Create GitHub Pull Request

Create a Pull Request with the `gh` CLI. Write every PR field in **English**, keep descriptions clear and concise, and follow the template in `references/pr-template.md`.

## Scope

This skill ONLY creates a Pull Request. It must never commit, push, or otherwise write to the repository. Read-only inspection of commits, branches, diffs, issues, and existing PRs is allowed (e.g., `git status`, `git diff`, `git log`, `gh issue list`, `gh pr view`), but the single creation action permitted is `gh pr create`.

## Procedures

**Step 1: Determine the target branch**
1. Default the base branch to `dev`.
2. Use `main` **only** when the user explicitly requests it (e.g., "open the PR against main"). Never target `main` otherwise.
3. If the user names any other base branch explicitly, honor that request.
4. Confirm the default `dev` branch actually exists before relying on it (e.g., `git ls-remote --heads origin dev`). If `dev` does **not** exist and the user has not already chosen a base branch, do not silently fall back. Instead, resolve the base branch through this ordered set of questions **before** opening the PR:
   a. Ask whether the user wants to target `main` directly. If yes, use `main`.
   b. If no, ask whether the user wants to create a `dev` branch. If yes, ask the user to create and push it themselves (this skill must never push — suggest the `! git switch -c dev && git push -u origin dev` prefix), then continue once `dev` exists on the remote.
   c. If no, ask the user to provide the desired base branch name, and honor that value.

**Step 2: Inspect the changes (read-only)**
1. Run `git status` and `git branch --show-current` to confirm the source branch.
2. Run `git diff <base>...HEAD` and `git log <base>..HEAD` to review the commits and changes the PR will contain.
3. Confirm the source branch already exists on the remote (e.g., `git ls-remote --heads origin <branch>`). If it is not pushed, stop and ask the user to push it — this skill must not push.

**Step 3: Draft the PR body**
1. Read `references/pr-template.md` to load the exact section structure.
2. Fill the three required sections from the template, in English:
   - **Summary**: ALWAYS begin the first sentence with `This PR...` (e.g., "This PR introduces a new integration with our new ERP...").
   - **Changes**: A short bullet list of the concrete code changes.
   - **Testing**: A brief statement of how the changes were tested and that they passed.
3. Keep every section concise. Avoid long prose; prefer tight bullets.

**Step 4: Link related issues**
1. List the repository's open issues with `gh issue list` (read-only).
2. If there are no open issues, skip this step entirely and do not add a `Linked Issues` section.
3. If there are open issues, present them to the user (number and title) and ask which, if any, are related to this PR. Let the user select zero or more.
4. If the user selects none, omit the `Linked Issues` section from the body.
5. If the user selects one or more, add the `Linked Issues` section from the template with one bullet per selected issue, referencing each with a closing keyword and its number (e.g., `- Resolves #23`).

**Step 5: Collect optional metadata**
1. Ask the user whether to set any of the following, unless already provided in the request:
   - **Assignee(s)**: GitHub login(s); use `@me` for the current user.
   - **Label(s)**: must already exist in the repository.
   - **Project(s)**: project title(s) the PR should be added to.
2. Skip any field the user does not want. Do not invent values.

**Step 6: Open the Pull Request**
1. Write the filled body to a temporary file (e.g., `pr-body.md`) to preserve formatting.
2. Create the PR, always setting the base branch explicitly, and append the metadata flags collected in Step 4:
   `gh pr create --base dev --title "<concise English title>" --body-file pr-body.md`
   Optional flags (repeat a flag for multiple values):
   - `--assignee <login>` (e.g., `--assignee @me`)
   - `--label "<label>"`
   - `--project "<project title>"`
   Replace `dev` with `main` only if Step 1 authorized it.
3. Delete the temporary body file.
4. Report the PR URL returned by `gh` to the user.

## Error Handling
* If `gh pr create` reports no commits between branches, verify the source branch is on the remote (Step 2.3) and that the correct base branch is set. Do not push to fix this — ask the user to push.
* If `gh` is not authenticated, instruct the user to run `gh auth login` themselves (suggest the `! gh auth login` prefix), then retry.
* If a PR already exists for the branch, report the existing PR URL instead of creating a duplicate.
* If `gh pr create` fails because a label or project does not exist, report the invalid value to the user and retry without it (or with a corrected value). Never create labels or projects.
* If the user asks to target `main` without an explicit statement, default back to `dev` and ask for confirmation before proceeding.
