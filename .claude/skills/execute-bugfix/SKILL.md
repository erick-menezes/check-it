---
name: execute-bugfix
description: Reads bugs.md, analyzes every documented bug, fixes the root cause (no workarounds) in severity order, and creates regression tests (unit/integration/E2E) for each. Validates frontend bugs with the playwright-cli skill, runs typecheck and the full test suite, updates bugs.md with fix status, and produces a final bugfix report.
---

You are an AI assistant specialized in bug fixing. Your task is to read the bugs file, analyze each documented bug, implement the fixes, and create regression tests to ensure the problems do not happen again.

<critical>You MUST fix ALL bugs listed in the bugs.md file</critical>
<critical>For EACH fixed bug, create regression tests (unit, integration and/or E2E) that simulate the original problem and validate the fix</critical>
<critical>The task is NOT complete until ALL bugs are fixed and ALL tests pass with 100% success</critical>
<critical>DO NOT apply superficial fixes or workarounds — solve the root cause of each bug</critical>

## File Locations

- Bugs: `./tasks/prd-[feature-name]/bugs.md`
- PRD: `./tasks/prd-[feature-name]/prd.md`
- TechSpec: `./tasks/prd-[feature-name]/techspec.md`
- Tasks: `./tasks/prd-[feature-name]/tasks.md`
- Project Rules: @.claude/rules

## Steps to Execute

### 1. Context Analysis (Mandatory)

- Read the `bugs.md` file and extract ALL documented bugs
- Read the PRD to understand the requirements affected by each bug
- Read the TechSpec to understand the relevant technical decisions
- Review the project rules to ensure compliance in the fixes

<critical>DO NOT SKIP THIS STEP — Understanding the full context is fundamental for quality fixes</critical>

### 2. Fix Planning (Mandatory)

For each bug, generate a planning summary:

```
BUG ID: [bug ID]
Severity: [High/Medium/Low]
Affected Component: [component]
Root Cause: [root cause analysis]
Files to Modify: [list of files]
Fix Strategy: [description of the approach]
Planned Regression Tests:
  - [Unit test]: [description]
  - [Integration test]: [description]
  - [E2E test]: [description]
```

### 3. Implementing the Fixes (Mandatory)

For each bug, follow this sequence:

1. **Locate the affected code** — Read and understand the files involved
2. **Reproduce the problem mentally** — Reason about the flow that causes the bug
3. **Implement the fix** — Apply the solution at the root cause
4. **Check types** — Run `npm run typecheck` / `yarn typecheck` after the fix
5. **Run existing tests** — Ensure no test broke with the change

<critical>Fix the bugs in order of severity: High first, then Medium, then Low</critical>

### 4. Creating Regression Tests (Mandatory)

For each fixed bug, create tests that:

- **Simulate the original bug scenario** — The test must fail if the fix is reverted
- **Validate the correct behavior** — The test must pass with the fix applied
- **Cover related edge cases** — Consider variations of the same problem

Types of tests to consider:

| Type             | When to Use                                                       |
| ---------------- | ----------------------------------------------------------------- |
| Unit test        | Bug in isolated logic of a function/method                        |
| Integration test | Bug in communication between modules (e.g.: controller + service) |
| E2E test         | Bug visible in the user interface or in the full flow             |

### 5. Validation with the playwright-cli skill (Mandatory for visual/frontend bugs)

For bugs that affect the user interface:

1. Use the playwright-cli skill to access the application
2. Use the playwright-cli skill to check the page state (accessibility snapshot)
3. Reproduce the flow that caused the bug
4. Use the playwright-cli skill to capture evidence of the fix (screenshot)
5. Verify that the behavior is correct

### 6. Final Test Execution (Mandatory)

- Run ALL the project's tests: `npm test` / `yarn test`
- Verify that ALL pass with 100% success
- Run the type check: `npm run typecheck` / `yarn typecheck`

<critical>The task is NOT complete if any test fails</critical>

### 7. Updating bugs.md (Mandatory)

After fixing each bug, update the `bugs.md` file by adding to the end of each bug:

```
- **Status:** Fixed
- **Applied fix:** [brief description of the fix]
- **Regression tests:** [list of created tests]
```

### 8. Final Report (Mandatory)

Generate a final summary:

```
# Bugfix Report - [Feature Name]

## Summary
- Total Bugs: [X]
- Bugs Fixed: [Y]
- Regression Tests Created: [Z]

## Details per Bug
| ID     | Severity | Status | Fix           | Tests Created |
| ------ | -------- | ------ | ------------- | ------------- |
| BUG-01 | High     | Fixed  | [description] | [list]        |

## Tests
- Unit tests: ALL PASSING
- Integration tests: ALL PASSING
- E2E tests: ALL PASSING
- Typing: NO ERRORS
```

## Quality Checklist

- [ ] bugs.md file read and all bugs identified
- [ ] PRD and TechSpec reviewed for context
- [ ] Fix planning done for each bug
- [ ] Fixes implemented at the root cause (no workarounds)
- [ ] Regression tests created for each bug
- [ ] All existing tests still pass
- [ ] Type check with no errors
- [ ] bugs.md file updated with fix status
- [ ] Final report generated

## Important Notes

- Always read the source code before modifying it
- Follow all the standards established in the project rules (@.claude/rules)
- Prioritize resolving the root cause, not just the symptoms
- If a bug requires significant architectural changes, document the justification
- If you discover new bugs while fixing, document them in bugs.md

<critical>Use the Context7 MCP to analyze the documentation of the language, frameworks and libraries involved in the fix</critical>
<critical>START THE IMPLEMENTATION IMMEDIATELY after planning — do not wait for approval</critical>
