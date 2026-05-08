# AI Component Context

AI assistants can generate better frontend code when they understand the local component system.
Without that context, they tend to invent props, recreate existing controls, or miss accessibility
rules that are already encoded in the UI library.

## What The Assistant Needs

- Component names and when to use them.
- Public prop APIs with types and defaults.
- Examples that show realistic composition.
- Usage rules that explain design-system intent.
- Source and Storybook paths for follow-up review.

## Why JSON Context Helps

Raw source search is useful, but it forces the assistant to infer which details matter. A generated
component index gives the assistant a compact contract:

- this component exists
- these props are supported
- these variants are intended
- these examples are approved
- these rules should guide generation

The result is more consistent generated JSX and more useful review feedback.

## Example Flow

1. User asks the assistant to build a settings form.
2. Assistant calls `search_components` with `form`.
3. Assistant calls `get_component_api` for `Input`, `Select`, and `Button`.
4. Assistant calls `get_usage_rules`.
5. Assistant generates JSX using existing components instead of custom controls.
6. Assistant can call `review_component_usage` to check the final snippet.

## Production Extensions

- Include design tokens and theme metadata.
- Track deprecated components and migration suggestions.
- Add accessibility notes and keyboard behavior.
- Index examples from Storybook CSF and MDX.
- Add owner team, package version, stability, and release notes.

