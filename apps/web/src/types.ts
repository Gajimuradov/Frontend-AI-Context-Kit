export interface IndexedProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

export interface IndexedExample {
  title: string;
  description: string;
  code: string;
}

export interface IndexedComponent {
  name: string;
  description: string;
  category: string;
  tags: string[];
  importPath: string;
  filePath: string;
  storyPath?: string;
  props: IndexedProp[];
  examples: IndexedExample[];
}

export interface ComponentIndex {
  generatedAt: string;
  usageRules: string[];
  components: IndexedComponent[];
}

