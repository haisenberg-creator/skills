---
name: pro-max-design-system
description: Generate a premium, highly-opinionated UI/UX design system. Use when the user wants to start a new web app, design a UI, or requests a design system.
---

Generate a foundational design system to lock in the aesthetic rules before writing any UI code.

1. **Mode Selection**
   Ask the user to choose an operation mode, waiting for their response before continuing:
   - _Search/Auto Mode_: You will analyze the project domain and recommend a tailored design pattern, color palette, and typography.
   - _Manual Mode_: Accept specific ideas, reference sites, or existing brand guidelines from the user. If their request is vague or incomplete, invoke the `grilling` skill to interview them relentlessly (asking one question at a time) to extract exact details about their preferred aesthetic, colors, and typography until you reach a shared understanding.
     _Completion criterion: The user has explicitly selected a mode and provided any necessary context._

2. **Visual Prototype**
   Once the theme and mode are decided, you MUST invoke the `prototype` skill (specifically the UI branch) to create a throwaway UI visualizing the design.
   - Generate a realistic mock page relevant to the user's project context (e.g., a dashboard page if they are building a dashboard, or a landing page hero). Do not just build a generic component library page.
   - This prototype should showcase the selected typography, colors, and key effects.
   - Wait for the user to review the prototype. If they want changes to the aesthetic, iterate and update the prototype until they approve it.
     _Completion criterion: The user has visually approved the throwaway prototype._

3. **Generate Markdown Spec**
   Output a structured Markdown artifact named `design_system_spec.md` containing:
   - **Pattern & Style**: (e.g., Soft UI, Brutalism, Clean Modern).
   - **Colors**: Primary, Secondary, CTA, Background, and Text (with exact hex codes).
   - **Typography**: Font families, weights, and the intended mood.
   - **Key Effects**: Shadow styles, border radiuses, micro-animations.
   - **Constraints & Anti-patterns**: Explicitly list banned elements.
   - **Pre-delivery Checklist**: A checkable list for accessibility and responsiveness.
     _Completion criterion: The `design_system_spec.md` artifact is created and you have paused to ask the user for approval._

4. **Enforce Strict Constraints**
   When generating the spec, ruthlessly apply these premium design rules:
   - Ban generic AI purple/pink gradients.
   - Ban harsh neon colors unless explicitly requested.
   - Ban emojis as icons (use SVG like Lucide or Heroicons).
   - Require smooth hover transitions (150-300ms).
   - Require WCAG AA minimum contrast.
     _Completion criterion: Every constraint is explicitly documented in the spec._

5. **Token Generation (Hybrid Output)**
   Upon user approval of the Markdown spec, translate the rules into code-ready tokens.
   - Write or update `index.css` (or `tailwind.config.js`) in the workspace with the CSS variables matching the spec.
     _Completion criterion: Code tokens are written to the project workspace and match the approved spec exactly._
