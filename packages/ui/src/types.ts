export interface ComponentExample {
  title: string;
  description: string;
  code: string;
}

export interface ComponentMeta {
  name: string;
  description: string;
  category: 'Actions' | 'Forms' | 'Overlays' | 'Navigation' | 'Surfaces';
  tags: string[];
}

