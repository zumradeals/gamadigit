import type { BlogContentBlock, BlogContentItem } from '@/types/content';

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseBlogEditorText(value: string): BlogContentBlock[] {
  const lines = value.replace(/\r\n/g, '\n').split('\n');
  const blocks: BlogContentBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  function flushParagraph() {
    const text = paragraph.join(' ').trim();
    if (text) blocks.push({ type: 'paragraph', text });
    paragraph = [];
  }

  function flushList() {
    if (list.length) blocks.push({ type: 'list', items: list });
    list = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 3, text: line.slice(4).trim() });
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 2, text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith('- ')) {
      flushParagraph();
      list.push(line.slice(2).trim());
      continue;
    }

    if (line.startsWith('> ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'callout', text: line.slice(2).trim() });
      continue;
    }

    if (line.startsWith('[CTA]')) {
      flushParagraph();
      flushList();
      const [label, href] = line.slice(5).split('|').map((item) => item.trim());
      if (label && href) blocks.push({ type: 'cta', label, href });
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function blogContentToEditorText(value: unknown): string {
  if (!Array.isArray(value)) return '';

  return value
    .flatMap((item): string[] => {
      if (typeof item === 'string') return [item];
      if (!item || typeof item !== 'object') return [];
      const block = item as Record<string, unknown>;

      if (block.type === 'paragraph') return [cleanText(block.text)];
      if (block.type === 'heading') return [`${block.level === 3 ? '###' : '##'} ${cleanText(block.text)}`];
      if (block.type === 'list' && Array.isArray(block.items)) return block.items.map((entry) => `- ${String(entry)}`);
      if (block.type === 'callout') return [`> ${cleanText(block.text)}`];
      if (block.type === 'cta') return [`[CTA] ${cleanText(block.label)} | ${cleanText(block.href)}`];
      return [];
    })
    .filter(Boolean)
    .join('\n\n');
}

export function articleResultToBlocks(result: Record<string, unknown>): BlogContentBlock[] {
  const blocks: BlogContentBlock[] = [];
  const introduction = cleanText(result.introduction);
  if (introduction) blocks.push({ type: 'paragraph', text: introduction });

  if (Array.isArray(result.sections)) {
    for (const section of result.sections) {
      if (!section || typeof section !== 'object') continue;
      const row = section as Record<string, unknown>;
      const heading = cleanText(row.heading);
      if (heading) blocks.push({ type: 'heading', level: 2, text: heading });
      if (Array.isArray(row.paragraphs)) {
        for (const paragraph of row.paragraphs) {
          const text = cleanText(paragraph);
          if (text) blocks.push({ type: 'paragraph', text });
        }
      }
      if (Array.isArray(row.list)) {
        const items = row.list.map(String).map((item) => item.trim()).filter(Boolean);
        if (items.length) blocks.push({ type: 'list', items });
      }
    }
  }

  const conclusion = cleanText(result.conclusion);
  if (conclusion) {
    blocks.push({ type: 'heading', level: 2, text: 'Conclusion' });
    blocks.push({ type: 'paragraph', text: conclusion });
  }

  return blocks;
}

export function normalizeBlogContentItems(value: unknown): BlogContentItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is BlogContentItem => typeof item === 'string' || Boolean(item && typeof item === 'object'));
}
