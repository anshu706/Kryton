import type { CitationRef, CitationFormat } from '@/types';

// ── ID / Hash ─────────────────────────────────────────────────────────────────

export function generateId(prefix = 'card'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── Class merging ─────────────────────────────────────────────────────────────

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ── Citation Formatters ───────────────────────────────────────────────────────

export function formatCitation(
  ref: CitationRef,
  format: CitationFormat
): string {
  const authors = ref.authors?.join(', ') ?? 'Unknown Author';
  const year = ref.year ?? new Date().getFullYear();
  const title = ref.title;
  const url = ref.url;
  const publisher = ref.publisher ?? '';

  switch (format) {
    case 'apa':
      return `${authors} (${year}). *${title}*. ${publisher ? publisher + '. ' : ''}${url}`;
    case 'mla':
      return `${authors}. "${title}." ${publisher}${publisher ? ', ' : ''}${year}, ${url}.`;
    case 'bibtex':
      return [
        `@misc{ref${ref.index},`,
        `  author = {${authors}},`,
        `  title  = {${title}},`,
        `  year   = {${year}},`,
        `  url    = {${url}}`,
        `}`,
      ].join('\n');
    default:
      return `[${ref.index}] ${title}. ${url}`;
  }
}

export function formatAllCitations(
  refs: CitationRef[],
  format: CitationFormat
): string {
  return refs.map((r) => formatCitation(r, format)).join('\n\n');
}

// ── Number formatting ─────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

// ── URL helpers ───────────────────────────────────────────────────────────────

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function getFaviconUrl(url: string): string {
  const domain = getDomain(url);
  return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
}

// ── Random float position (for card placement) ────────────────────────────────

export function randomPosition(
  minX = 5,
  maxX = 85,
  minY = 10,
  maxY = 80
): { x: number; y: number } {
  return {
    x: Math.random() * (maxX - minX) + minX,
    y: Math.random() * (maxY - minY) + minY,
  };
}

// ── Truncate text ─────────────────────────────────────────────────────────────

export function truncate(text: string, maxLen = 120): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}
