# Prompt Examples

Good prompts give the AI assistant enough product intent and enough constraints to use the UI
library correctly.

## Good Prompt

```txt
Build a compact React form for creating an API token.
Use @frontend-ai-context-kit/ui components only.
Fields: token name, environment select, expiration select.
Show validation messages for missing fields.
Use a loading Button state while submitting.
```

Why it works:

- names the workflow
- lists fields
- asks for existing UI components
- defines validation and loading behavior

## Weak Prompt

```txt
Make a nice token form.
```

Why it is weak:

- no component constraints
- no fields
- no validation behavior
- no submit state

## Good Review Prompt

```txt
Review this React snippet against our UI library rules.
Check whether it should use Button, Input, Select, Modal, Tabs, or Card.
Call out invented props and accessibility issues.
```

## Weak Review Prompt

```txt
Is this code okay?
```

The assistant can answer, but it has no clear review lens.

## Prompt Pattern For Component Usage

```txt
Use get_component_api for <ComponentName>.
Use get_component_examples for <ComponentName>.
Generate a minimal example for <business use case>.
Do not invent props.
Explain any missing behavior that requires custom code.
```

