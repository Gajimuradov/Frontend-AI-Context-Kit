import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Node,
  Project,
  type ArrayLiteralExpression,
  type ObjectLiteralExpression,
  type PropertySignature,
  type SourceFile,
} from 'ts-morph';
import { frontendUsageRules } from '@frontend-ai-context-kit/prompt-rules';
import { ComponentIndexSchema, type ComponentIndex, type IndexedComponent } from './schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function findRepoRoot(startDirectory: string): string {
  let current = resolve(startDirectory);

  while (current !== dirname(current)) {
    if (existsSync(join(current, 'pnpm-workspace.yaml'))) {
      return current;
    }

    current = dirname(current);
  }

  return resolve(__dirname, '../../..');
}

function lowerFirst(value: string): string {
  return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

function normalizeType(typeText: string): string {
  return typeText.replace(/\s+/g, ' ').replace(/import\("[^"]+"\)\./g, '').trim();
}

function getStringProperty(objectLiteral: ObjectLiteralExpression, propertyName: string): string | undefined {
  const property = objectLiteral.getProperty(propertyName);

  if (!property || !Node.isPropertyAssignment(property)) {
    return undefined;
  }

  const initializer = property.getInitializer();

  if (initializer && (Node.isStringLiteral(initializer) || Node.isNoSubstitutionTemplateLiteral(initializer))) {
    return initializer.getLiteralText();
  }

  return undefined;
}

function getStringArrayProperty(
  objectLiteral: ObjectLiteralExpression,
  propertyName: string,
): string[] {
  const property = objectLiteral.getProperty(propertyName);

  if (!property || !Node.isPropertyAssignment(property)) {
    return [];
  }

  const initializer = property.getInitializer();

  if (!initializer || !Node.isArrayLiteralExpression(initializer)) {
    return [];
  }

  return initializer
    .getElements()
    .map((element) =>
      Node.isStringLiteral(element) || Node.isNoSubstitutionTemplateLiteral(element)
        ? element.getLiteralText()
        : undefined,
    )
    .filter((value): value is string => Boolean(value));
}

function getMeta(sourceFile: SourceFile, componentName: string) {
  const metaDeclaration = sourceFile.getVariableDeclaration(`${lowerFirst(componentName)}Meta`);
  const initializer = metaDeclaration?.getInitializer();

  if (!initializer || !Node.isObjectLiteralExpression(initializer)) {
    return {
      description: `${componentName} component from the UI library.`,
      category: 'General',
      tags: [] as string[],
    };
  }

  return {
    description:
      getStringProperty(initializer, 'description') ??
      `${componentName} component from the UI library.`,
    category: getStringProperty(initializer, 'category') ?? 'General',
    tags: getStringArrayProperty(initializer, 'tags'),
  };
}

function collectDefaultValues(sourceFile: SourceFile): Map<string, string> {
  const defaults = new Map<string, string>();
  const source = sourceFile.getFullText();
  const defaultPattern = /(\w+)\s*=\s*('([^']*)'|"([^"]*)"|`([^`]*)`|true|false|\d+)/g;
  let match: RegExpExecArray | null;

  while ((match = defaultPattern.exec(source))) {
    const [, propName, rawValue] = match;
    defaults.set(propName, rawValue.replace(/^['"`]|['"`]$/g, ''));
  }

  return defaults;
}

function getPropertyDescription(property: PropertySignature): string {
  return property
    .getJsDocs()
    .map((doc) => doc.getCommentText() ?? '')
    .join('\n')
    .trim();
}

function extractProps(sourceFile: SourceFile, componentName: string) {
  const propsInterface =
    sourceFile.getInterface(`${componentName}Props`) ??
    sourceFile.getInterfaces().find((interfaceDeclaration) => interfaceDeclaration.getName().endsWith('Props'));

  if (!propsInterface) {
    return [];
  }

  const defaults = collectDefaultValues(sourceFile);

  return propsInterface.getProperties().map((property) => {
    const name = property.getName();
    const type = normalizeType(property.getTypeNode()?.getText() ?? property.getType().getText(property));
    const defaultValue = defaults.get(name);

    return {
      name,
      type,
      required: !property.hasQuestionToken(),
      description: getPropertyDescription(property),
      ...(defaultValue ? { defaultValue } : {}),
    };
  });
}

function getLiteralProperty(objectLiteral: ObjectLiteralExpression, propertyName: string): string {
  return getStringProperty(objectLiteral, propertyName) ?? '';
}

function extractExamplesFromArray(arrayLiteral: ArrayLiteralExpression) {
  return arrayLiteral
    .getElements()
    .filter(Node.isObjectLiteralExpression)
    .map((example) => ({
      title: getLiteralProperty(example, 'title'),
      description: getLiteralProperty(example, 'description'),
      code: getLiteralProperty(example, 'code'),
    }))
    .filter((example) => example.title && example.code);
}

function extractExamples(project: Project, examplesPath: string) {
  if (!existsSync(examplesPath)) {
    return [];
  }

  const sourceFile = project.addSourceFileAtPath(examplesPath);
  const examplesDeclaration = sourceFile
    .getVariableDeclarations()
    .find((declaration) => declaration.getName().endsWith('Examples'));
  const initializer = examplesDeclaration?.getInitializer();

  if (!initializer || !Node.isArrayLiteralExpression(initializer)) {
    return [];
  }

  return extractExamplesFromArray(initializer);
}

function buildComponentIndex(repoRoot: string): ComponentIndex {
  const componentsRoot = join(repoRoot, 'packages/ui/src/components');
  const project = new Project({
    tsConfigFilePath: join(repoRoot, 'packages/ui/tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });

  const components = readdirSync(componentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((componentName): IndexedComponent | null => {
      const componentPath = join(componentsRoot, componentName, `${componentName}.tsx`);

      if (!existsSync(componentPath)) {
        return null;
      }

      const sourceFile = project.addSourceFileAtPath(componentPath);
      const examplesPath = join(componentsRoot, componentName, `${componentName}.examples.tsx`);
      const storiesPath = join(componentsRoot, componentName, `${componentName}.stories.tsx`);
      const meta = getMeta(sourceFile, componentName);

      return {
        name: componentName,
        description: meta.description,
        category: meta.category,
        tags: meta.tags,
        importPath: '@frontend-ai-context-kit/ui',
        filePath: relative(repoRoot, componentPath),
        ...(existsSync(storiesPath) ? { storyPath: relative(repoRoot, storiesPath) } : {}),
        props: extractProps(sourceFile, componentName),
        examples: extractExamples(project, examplesPath),
      };
    })
    .filter((component): component is IndexedComponent => Boolean(component));

  return ComponentIndexSchema.parse({
    generatedAt: new Date().toISOString(),
    source: {
      uiPackage: 'packages/ui',
      componentsRoot: 'packages/ui/src/components',
    },
    usageRules: [...frontendUsageRules],
    components,
  });
}

function writeIndex(repoRoot: string, index: ComponentIndex) {
  const outputTargets = [
    join(repoRoot, 'apps/mcp-server/data/component-index.json'),
    join(repoRoot, 'apps/web/public/component-index.json'),
  ];
  const payload = `${JSON.stringify(index, null, 2)}\n`;

  for (const outputPath of outputTargets) {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, payload);
  }

  return outputTargets.map((target) => relative(repoRoot, target));
}

const repoRoot = findRepoRoot(process.cwd());
const index = buildComponentIndex(repoRoot);
const writtenFiles = writeIndex(repoRoot, index);

console.log(
  `Generated component index for ${index.components.length} components:\n${writtenFiles
    .map((filePath) => `- ${filePath}`)
    .join('\n')}`,
);

