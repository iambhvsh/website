import { createTimeoutSignal, sanitizeHttpsUrl } from './url';

export interface WritingPost {
  title: string;
  description: string;
  link: string;
  formattedDate: string;
  categories: string[];
}

const DEFAULT_RSS_URL = 'https://writing.iambhvsh.in/rss.xml';

function readNodeText(parent: Element, selector: string): string {
  return parent.querySelector(selector)?.textContent?.trim() ?? '';
}

function formatDate(raw: string): string {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export async function fetchWritingPosts(
  limit = 3,
  rssUrl = DEFAULT_RSS_URL,
  timeoutMs = 6000
): Promise<WritingPost[]> {
  const safeRssUrl = sanitizeHttpsUrl(rssUrl, ['iambhvsh.in']);
  if (!safeRssUrl) {
    throw new Error('Invalid RSS feed URL');
  }

  const req = createTimeoutSignal(timeoutMs);

  try {
    const res = await fetch(safeRssUrl, {
      signal: req.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
    if (!res.ok) {
      throw new Error(`RSS fetch failed with status ${res.status}`);
    }

    const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
    const items = Array.from(xml.querySelectorAll('item')).slice(0, limit);

    return items
      .map((item) => {
        const link = sanitizeHttpsUrl(readNodeText(item, 'link'), ['iambhvsh.in']);
        if (!link) return null;

        const categories = Array.from(item.querySelectorAll('category'))
          .map((node) => node.textContent?.trim() ?? '')
          .filter(Boolean)
          .slice(0, 3);

        return {
          title: readNodeText(item, 'title'),
          description: readNodeText(item, 'description'),
          link,
          formattedDate: formatDate(readNodeText(item, 'pubDate')),
          categories,
        };
      })
      .filter((post): post is WritingPost => post !== null);
  } finally {
    req.cleanup();
  }
}
