import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { z } from "zod";  // Zod package for type-checking

// We don't need a database schema since we're only analyzing
// URLs and not storing data. The schema is kept minimal.

export const seoRequests = pgTable("seo_requests", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  requestDate: text("request_date").notNull(),
});

// SEO Analysis response types
export const MetaTagType = z.enum([
  "title",
  "description",
  "viewport",
  "robots",
  "canonical",
  "ogTitle",
  "ogDescription",
  "ogImage",
  "ogUrl",
  "ogType",
  "ogSiteName",
  "twitterCard",
  "twitterTitle",
  "twitterDescription",
  "twitterImage",
  "twitterSite",
  "twitterCreator",
  "schema",
  "hreflang",
  "openSearch"
]);

export const MetaTagStatus = z.enum([
  "optimal",
  "good",
  "improve",
  "missing",
  "notApplicable"
]);

export const MetaTag = z.object({
  type: MetaTagType,
  name: z.string(),
  content: z.string().nullable(),
  status: MetaTagStatus,
  statusText: z.string(),
  description: z.string(),
  bestPractices: z.array(z.string()).optional(),
  recommendation: z.string().optional(),
});

export const SeoAnalysisCategory = z.enum([
  "basic",
  "socialMedia",
  "technical"
]);

export const SeoAnalysisSection = z.object({
  category: SeoAnalysisCategory,
  title: z.string(),
  icon: z.string(),
  status: MetaTagStatus,
  statusText: z.string(),
  tags: z.array(MetaTag),
});

export const SeoAnalysisResult = z.object({
  url: z.string(),
  score: z.number(),
  tags: z.record(z.string(), z.array(MetaTag)),
  sections: z.array(SeoAnalysisSection),
  presentCount: z.number(),
  improveCount: z.number(),
  missingCount: z.number(),
  recommendations: z.array(z.object({
    type: z.enum(["critical", "improvement", "additional"]),
    title: z.string(),
    description: z.string(),
    items: z.array(z.string()),
  })),
});

export type MetaTagType = z.infer<typeof MetaTagType>;
export type MetaTagStatus = z.infer<typeof MetaTagStatus>;
export type MetaTag = z.infer<typeof MetaTag>;
export type SeoAnalysisCategory = z.infer<typeof SeoAnalysisCategory>;
export type SeoAnalysisSection = z.infer<typeof SeoAnalysisSection>;
export type SeoAnalysisResult = z.infer<typeof SeoAnalysisResult>;
export type SeoRequest = typeof seoRequests.$inferSelect;
export type InsertSeoRequest = typeof seoRequests.$inferInsert;
