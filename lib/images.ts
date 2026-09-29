import { config } from "./config";
import type { CreatureImage } from "./types";
import { dedupeBy, firstResolved } from "./utils";
import { fetchArticleImages, fetchLeadImage } from "./wikipedia";

/**
 * Build an image gallery for a creature: the article's lead image first,
 * followed by other in-article images, deduped by URL. Tries each candidate
 * title (e.g. wikiTitle → scientific name → common name) until one resolves.
 */
export async function fetchCreatureImages(
  candidates: string[],
  limit = config.images.perCreature
): Promise<CreatureImage[]> {
  return (
    (await firstResolved(candidates, async (title) => {
      const [lead, rest] = await Promise.all([
        fetchLeadImage(title),
        fetchArticleImages(title, limit + 2),
      ]);

      const gallery = dedupeBy(
        [...(lead ? [lead] : []), ...rest],
        (img) => img.url
      ).slice(0, limit);

      return gallery.length ? gallery : null;
    })) ?? []
  );
}
