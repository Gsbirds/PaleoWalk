import { config, wikiPageUrl } from "./config";
import type { CreatureImage } from "./types";

const { summaryUrl, actionUrl } = config.wikipedia;
const { userAgent, revalidateSeconds, thumbWidth } = config.images;

const SOURCE = "Wikipedia";

// --- API response shapes (only the fields we consume) ---

type SummaryResponse = {
  type?: string;
  originalimage?: { source?: string };
  thumbnail?: { source?: string };
  content_urls?: { desktop?: { page?: string } };
};

type ImagesQueryResponse = {
  query?: {
    pages?: Record<string, { images?: { title: string }[] }>;
  };
};

type ImageInfoQueryResponse = {
  query?: {
    pages?: Record<
      string,
      { title?: string; imageinfo?: { url?: string; thumburl?: string }[] }
    >;
  };
};

/** Shared GET → JSON helper with the Wikimedia-required UA and caching. */
async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": userAgent, Accept: "application/json" },
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function buildImage(url: string, sourcePage: string, caption?: string): CreatureImage {
  return { url, sourcePage, source: SOURCE, caption };
}

// Skip logos, icons, maps, and other non-photographic clutter.
const REJECT = /(logo|icon|commons-logo|wiki|map|locator|range|distribution|silhouette|scale|question_book|ambox|edit-|symbol|flag)/;
const ACCEPT_EXT = /\.(jpe?g|png|webp)$/;
const REJECT_EXT = /\.(svg|gif)$/;

function isUsableFile(filename: string): boolean {
  const f = filename.toLowerCase();
  if (REJECT_EXT.test(f) || REJECT.test(f)) return false;
  return ACCEPT_EXT.test(f);
}

/** The article's lead image, or null if the page is missing/ambiguous. */
export async function fetchLeadImage(title: string): Promise<CreatureImage | null> {
  const data = await getJson<SummaryResponse>(
    summaryUrl + encodeURIComponent(title)
  );
  if (!data || data.type === "disambiguation") return null;

  const url = data.originalimage?.source ?? data.thumbnail?.source;
  if (!url) return null;

  return buildImage(url, data.content_urls?.desktop?.page ?? wikiPageUrl(title));
}

/** Up to `limit` in-article images, resolved to large thumbnail URLs. */
export async function fetchArticleImages(
  title: string,
  limit: number
): Promise<CreatureImage[]> {
  const sourcePage = wikiPageUrl(title);

  const listParams = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "images",
    titles: title,
    imlimit: "40",
    origin: "*",
  });
  const list = await getJson<ImagesQueryResponse>(`${actionUrl}?${listParams}`);
  const listPage = Object.values(list?.query?.pages ?? {})[0];

  const fileTitles = (listPage?.images ?? [])
    .map((i) => i.title)
    .filter(isUsableFile)
    .slice(0, limit);
  if (!fileTitles.length) return [];

  const infoParams = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: String(thumbWidth),
    titles: fileTitles.join("|"),
    origin: "*",
  });
  const info = await getJson<ImageInfoQueryResponse>(
    `${actionUrl}?${infoParams}`
  );

  return Object.values(info?.query?.pages ?? {}).flatMap((page) => {
    const url = page.imageinfo?.[0]?.thumburl ?? page.imageinfo?.[0]?.url;
    if (!url) return [];
    const caption = (page.title ?? "")
      .replace(/^File:/, "")
      .replace(/\.[^.]+$/, "");
    return [buildImage(url, sourcePage, caption)];
  });
}
