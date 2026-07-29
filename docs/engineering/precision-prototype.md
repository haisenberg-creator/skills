Quickstart:

```bash
npx skills add mattpocock/skills --skill=precision-prototype
```

```bash
npx skills update precision-prototype
```

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/precision-prototype)

## What it does

Builds a single, highly-detailed throwaway UI prototype after an intensive upfront interviewing session. The defining constraint is that it does not generate multiple layout variations or terminal logic apps; it focuses on crafting **exactly one UI prototype** tailored to user specifications around scale, position, and control functions gathered one question at a time.

## When to reach for it

- **Invocation mode.** Type `/precision-prototype`, or the agent reaches for it automatically when a task fits.
- **Trigger boundary.** Reach for this when you need a single, exact UI prototype with custom control mechanisms like sliders and adjustment buttons; for rapid, multiple UI variations or terminal-based logic prototypes, use [prototype](https://aihero.dev/skills-prototype).

## The precision loop

The skill enforces a clear three-stage workflow:

1. **Relentless Interviewing.** The agent grills you one question at a time to clarify the exact page/section, scale and position controls, and live state readouts required.
2. **Targeted Prototype Creation.** The agent builds a single interactive UI route equipped with live state readouts and adjustment controls (sliders, +/- buttons).
3. **Production Application.** The agent extracts the validated state values and applies them directly into production components and styles, ensuring production mode matches prototype mode.

## It's working if

- The agent conducts a step-by-step interview before creating any files.
- Exactly one interactive prototype route is generated.
- A floating state readout displays live scale and position parameters.
- Validated prototype parameters are cleanly folded back into production code.

## Where it fits

- **Role.** A reach-for-it-anytime standalone skill.
- **Neighbours.** Complements [prototype](https://aihero.dev/skills-prototype) (for rapid multi-variant exploration) and [grill-with-docs](https://aihero.dev/skills-grill-with-docs) (for deep domain modeling).
- **The map.** See [ask-matt](https://aihero.dev/skills-ask-matt) for the complete map of engineering skills.
