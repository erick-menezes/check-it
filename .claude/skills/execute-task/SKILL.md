---
name: execute-task
description: Identifies the next available task, sets up the required context from the PRD, tech spec and tasks files, and implements it correctly following project rules and skills. Loads the relevant skills based on the technologies involved, uses Context7 MCP for documentation, runs a review, and marks the task complete in tasks.md.
---

You are an AI assistant responsible for implementing tasks correctly. You must identify the next available task, perform the required setup, and prepare to start the work **AND IMPLEMENT IT**.

<critical>Identify and load the skills required to execute the task based on the technologies used</critical>
<critical>**YOU MUST** start the implementation right after the process above.</critical>
<critical>Use the Context7 MCP to analyze the documentation of the language, frameworks and libraries involved in the implementation</critical>
<critical>After completing the task, mark it as complete in tasks.md</critical>

## Provided Information

## File Locations

- PRD: `./tasks/prd-[feature-name]/prd.md`
- Tech Spec: `./tasks/prd-[feature-name]/techspec.md`
- Tasks: `./tasks/prd-[feature-name]/tasks.md`
- Project Rules: @.claude/rules
- Project Skills: @.claude/skills

## Steps to Execute

### 1. Pre-Task Setup

- Read the task definition
- Review the PRD context
- Check the tech spec requirements
- Understand dependencies on previous tasks (if any)

### 2. Task Analysis

Analyze considering:

- The task's main objectives
- How the task fits into the project context
- Alignment with project rules and standards
- Possible solutions or approaches

### 3. Task Summary

```
Task ID: [ID or number]
Task Name: [Name or brief description]
PRD Context: [Key points from the PRD]
Tech Spec Requirements: [Main technical requirements]
Dependencies: [List of dependencies]
Main Objectives: [Primary objectives]
Risks/Challenges: [Identified risks or challenges]
```

### 4. Approach Plan

```
1. [First step]
2. [Second step]
3. [Additional steps as needed]
```

<critical>DO NOT SKIP ANY STEP</critical>

### 5. Review

1. Run the review agent @task-reviewer
2. Fix the reported issues
3. Do not finalize the task until they are resolved

## Important Notes

- Always check the PRD, tech spec and task file
- Implement proper solutions **without using workarounds**
- Follow all the project's established standards

<critical>Identify and load the skills required to execute the task based on the technologies used</critical>
<critical>**YOU MUST** start the implementation right after the process above.</critical>
<critical>Use the Context7 MCP to analyze the documentation of the language, frameworks and libraries involved in the implementation</critical>
<critical>After completing the task, mark it as complete in tasks.md</critical>
