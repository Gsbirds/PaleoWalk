/** Return a new array with duplicates removed, keyed by `key`. */
export function dedupeBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const k = key(item);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  }
  return out;
}

/** The first non-nullish result from an array of async lookups, tried in order. */
export async function firstResolved<T>(
  candidates: string[],
  lookup: (candidate: string) => Promise<T | null>
): Promise<T | null> {
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (!trimmed) continue;
    const result = await lookup(trimmed);
    if (result) return result;
  }
  return null;
}

/**
 * Strip common Markdown formatting from model output so it renders as clean
 * plain text in the UI (defensive — the prompt also asks for no Markdown).
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1") // inline / fenced code
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold **x**
    .replace(/__([^_]+)__/g, "$1") // bold __x__
    .replace(/\*([^*]+)\*/g, "$1") // italic *x*
    .replace(/_([^_]+)_/g, "$1") // italic _x_
    .replace(/~~([^~]+)~~/g, "$1") // strikethrough
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // headings
    .replace(/^\s{0,3}>\s?/gm, "") // blockquotes
    .replace(/^\s{0,3}[-*+]\s+/gm, "") // bullet list markers
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links [text](url) -> text
    .trim();
}
