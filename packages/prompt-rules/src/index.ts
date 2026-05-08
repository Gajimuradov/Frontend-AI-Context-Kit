export const frontendUsageRules = [
  'Use components from @frontend-ai-context-kit/ui before creating custom controls.',
  'Prefer Button for actions, Input and Select for forms, Modal for focused blocking decisions, Tabs for related panels, and Card for grouped content.',
  'Keep primary Button usage limited to the main action in the current workflow section.',
  'Always provide labels for Input and Select unless an adjacent visible label already exists.',
  'Use error props for validation feedback instead of rendering ad hoc red text.',
  'Use Modal only for focused tasks that require user attention; avoid nesting modals.',
  'Use Card for repeated summaries and metadata, not as a generic page section wrapper.',
  'When generating examples, include imports, realistic state handling, and accessible labels.',
] as const;

export const promptTemplates = {
  createComponentUsageExample: `Create a React example using the selected UI component.
Include imports from @frontend-ai-context-kit/ui, realistic props, and a short explanation of why this component fits the use case.`,
  reviewComponentUsage: `Review the provided React snippet against the UI library rules.
Call out missing labels, incorrect variants, unnecessary custom controls, and accessibility risks.`,
  generateFormWithUiLibrary: `Generate a compact React form using @frontend-ai-context-kit/ui.
Use Input, Select, Button, and Card where appropriate. Include validation copy and loading state handling.`,
} as const;

export type PromptTemplateName = keyof typeof promptTemplates;

