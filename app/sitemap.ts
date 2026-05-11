import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://loudllamas.org";

// Channels currently sold on the site. Configurator routes for organic-social
// and seo-aeo still exist but are not in the new lineup, so we omit them from
// the sitemap to avoid pointing Google at orphaned pages.
const ACTIVE_CHANNELS = [
  "website-build",
  "paid-social",
  "sem-google-ads",
  "analytics-tracking",
  "email-lifecycle",
  "automation",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/packages`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/burnrate`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/support`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/resources`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const configureRoutes: MetadataRoute.Sitemap = ACTIVE_CHANNELS.map((slug) => ({
    url: `${BASE_URL}/configure/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...configureRoutes];
}
