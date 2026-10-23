import type { ContentBlock } from "@/types/blog";

export interface SeedCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface SeedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  content_blocks: ContentBlock[];
  featured_image_url: string | null;
  category_id: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  blog_categories: { id: string; name: string; slug: string } | null;
}

export interface SeedUser {
  id: string;
  email: string;
  created_at: string;
  isAdmin: boolean;
}

const iso = (d: string) => new Date(d).toISOString();

export const seedCategories: SeedCategory[] = [
  { id: "cat-1", name: "Product", slug: "product", created_at: iso("2025-11-02") },
  { id: "cat-2", name: "Engineering", slug: "engineering", created_at: iso("2025-11-04") },
  { id: "cat-3", name: "Design", slug: "design", created_at: iso("2025-11-08") },
  { id: "cat-4", name: "Company", slug: "company", created_at: iso("2025-11-12") },
  { id: "cat-5", name: "Customer stories", slug: "customer-stories", created_at: iso("2025-11-15") },
  { id: "cat-6", name: "Tutorials", slug: "tutorials", created_at: iso("2025-11-20") },
  { id: "cat-7", name: "Security", slug: "security", created_at: iso("2025-12-01") },
  { id: "cat-8", name: "AI research", slug: "ai-research", created_at: iso("2025-12-06") },
];

const catBySlug = (slug: string) => {
  const c = seedCategories.find((c) => c.slug === slug)!;
  return { id: c.id, name: c.name, slug: c.slug };
};

export const seedPosts: SeedPost[] = [
  ["intro-axiom-1-5", "Announcing Axiom 1.5: faster, safer, cheaper", "product", true, "2026-07-14"],
  ["shipping-vector-search", "How we shipped vector search in six weeks", "engineering", true, "2026-07-08"],
  ["design-system-tokens", "Rebuilding our design system around tokens", "design", true, "2026-06-28"],
  ["series-b-announcement", "Axiom raises $42M Series B to expand globally", "company", true, "2026-06-20"],
  ["case-study-northwind", "How Northwind cut support tickets by 63%", "customer-stories", true, "2026-06-12"],
  ["build-rag-in-30-min", "Build a RAG pipeline in 30 minutes", "tutorials", true, "2026-06-04"],
  ["soc2-type-2", "Axiom is now SOC 2 Type II certified", "security", true, "2026-05-27"],
  ["evaluating-llms", "Evaluating LLMs beyond leaderboards", "ai-research", true, "2026-05-18"],
  ["prompt-caching-guide", "A practical guide to prompt caching", "tutorials", true, "2026-05-10"],
  ["hiring-remote-eng", "What we look for when hiring engineers", "company", false, null],
  ["migrating-to-tanstack", "Migrating 200k users to TanStack Query", "engineering", true, "2026-04-22"],
  ["accessibility-audit", "Findings from our accessibility audit", "design", false, null],
  ["zero-trust-arch", "Our path to a zero-trust architecture", "security", true, "2026-04-08"],
  ["long-context-window", "Working with long context windows in production", "ai-research", true, "2026-03-30"],
  ["customer-atlas-labs", "Atlas Labs 4x'd conversion with Axiom Copilot", "customer-stories", false, null],
].map(([slug, title, catSlug, published, publishedAt], i) => {
  const created = new Date(2026, 6, 15 - i * 7).toISOString();
  const updated = new Date(2026, 6, 15 - i * 5).toISOString();
  return {
    id: `post-${i + 1}`,
    title: title as string,
    slug: slug as string,
    excerpt: `${title} — a quick look at what changed and why it matters.`,
    content: `<p>${title}</p>`,
    content_blocks: [] as ContentBlock[],
    featured_image_url: null,
    category_id: catBySlug(catSlug as string).id,
    published: published as boolean,
    published_at: publishedAt ? iso(publishedAt as string) : null,
    created_at: created,
    updated_at: updated,
    blog_categories: catBySlug(catSlug as string),
  } satisfies SeedPost;
});

export const seedUsers: SeedUser[] = [
  ["ada@axiom.ai", true, "2025-08-14"],
  ["grace@axiom.ai", true, "2025-09-02"],
  ["linus@axiom.ai", false, "2025-09-18"],
  ["marie@axiom.ai", false, "2025-10-01"],
  ["alan@axiom.ai", false, "2025-10-12"],
  ["katherine@axiom.ai", false, "2025-10-24"],
  ["dennis@axiom.ai", false, "2025-11-03"],
  ["barbara@axiom.ai", false, "2025-11-15"],
  ["donald@axiom.ai", false, "2025-11-28"],
  ["margaret@axiom.ai", false, "2026-01-04"],
  ["tim@axiom.ai", false, "2026-02-11"],
  ["radia@axiom.ai", false, "2026-03-22"],
].map(([email, isAdmin, created], i) => ({
  id: `user-${i + 1}`,
  email: email as string,
  created_at: iso(created as string),
  isAdmin: isAdmin as boolean,
}));