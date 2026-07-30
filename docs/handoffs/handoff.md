# Handoff Document: Pro Max UI/UX Workflow

## Context
The user and the previous agent collaborated to design a premium UI/UX workflow consisting of 4 specialized AI skills. We used a "grilling" interview process to lock in the exact constraints and architecture. 

Step 1 of the workflow (`pro-max-design-system`) has already been completely written and is active. The overarching workflow architecture for the remaining 3 skills has been established and approved in the implementation plan.

## Artifacts to Reference
- **Completed Skill (Step 1):** [pro-max-design-system](file:///C:/Users/USER/.gemini/config/skills/pro-max-design-system/SKILL.md)
- **Workflow Plan (Approved):** [implementation_plan.md](file:///C:/Users/USER/.gemini/antigravity/brain/83350f80-0202-42ce-874c-00787c613aee/implementation_plan.md) - This artifact contains the defined roles and constraints for the next 3 skills that need to be built.

## Next Session Focus
The next session should focus on actually writing and saving the remaining 3 skills to the user's `config/skills` directory based on the approved plan:
1. `pro-max-ui-builder` (The Constructor - turns design tokens into code)
2. `pro-max-assets` (The Asset Sourcer - restricted to SVG libraries and stock photos, strictly no AI generation)
3. `pro-max-ui-audit` (The QA Inspector - checks contrast, micro-animations, and responsiveness)

## Suggested Skills
- `writing-great-skills` (`C:\Users\USER\.gemini\config\skills\writing-great-skills\SKILL.md`): Invoke this skill before writing the 3 new skills to ensure they are predictable, have clear completion criteria, and use strong leading words.
