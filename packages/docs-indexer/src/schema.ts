import { z } from 'zod';

export const PropSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  description: z.string(),
  defaultValue: z.string().optional(),
});

export const ExampleSchema = z.object({
  title: z.string(),
  description: z.string(),
  code: z.string(),
});

export const ComponentSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  importPath: z.string(),
  filePath: z.string(),
  storyPath: z.string().optional(),
  props: z.array(PropSchema),
  examples: z.array(ExampleSchema),
});

export const ComponentIndexSchema = z.object({
  generatedAt: z.string(),
  source: z.object({
    uiPackage: z.string(),
    componentsRoot: z.string(),
  }),
  usageRules: z.array(z.string()),
  components: z.array(ComponentSchema),
});

export type ComponentIndex = z.infer<typeof ComponentIndexSchema>;
export type IndexedComponent = z.infer<typeof ComponentSchema>;

