import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/maintenance.html"],
      },
    ],
    sitemap: "https://chaenii.me/sitemap.xml",
    host: "https://chaenii.me",
  };
}
