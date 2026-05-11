import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://loudllamas.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/intake/",
          "/confirmation/",
          "/checkout",
          "/burnrate/welcome",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
