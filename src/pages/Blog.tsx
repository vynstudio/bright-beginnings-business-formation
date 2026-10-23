import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ChevronDown, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Author profile images
import authorSarah from "@/assets/author-sarah.jpg";
import authorMarcus from "@/assets/author-marcus.jpg";
import authorEmily from "@/assets/author-emily.jpg";
import authorDavid from "@/assets/author-david.jpg";

// Blog post featured images - specific topics
import blogHealthcareAi from "@/assets/blog-healthcare-ai.jpg";
import blogFutureWork from "@/assets/blog-future-work.jpg";
import blogSustainableAi from "@/assets/blog-sustainable-ai.jpg";
import blogRealtimeAi from "@/assets/blog-realtime-ai.jpg";
import blogDeepLearning from "@/assets/blog-deep-learning.jpg";
import blogAutomation from "@/assets/blog-automation.jpg";
import blogCybersecurity from "@/assets/blog-cybersecurity.jpg";
import blogCloud from "@/assets/blog-cloud.jpg";
import blogNlp from "@/assets/blog-nlp.jpg";
import blogGenerativeAi from "@/assets/blog-generative-ai.jpg";
import blogPrivacy from "@/assets/blog-privacy.jpg";
import blogVision from "@/assets/blog-vision.jpg";
import blogMl from "@/assets/blog-ml.jpg";
import blogScalable from "@/assets/blog-scalable.jpg";
import blogEthics from "@/assets/blog-ethics.jpg";
import blogInnovation from "@/assets/blog-innovation.jpg";
import blogAnalytics from "@/assets/blog-analytics.jpg";
import blogBestPractices from "@/assets/blog-best-practices.jpg";
// Generic AI images for variety
import blogAi1 from "@/assets/blog-ai-1.jpg";
import blogAi2 from "@/assets/blog-ai-2.jpg";
import blogAi3 from "@/assets/blog-ai-3.jpg";
import blogAi4 from "@/assets/blog-ai-4.jpg";
import blogAi5 from "@/assets/blog-ai-5.jpg";
import blogAi6 from "@/assets/blog-ai-6.jpg";

// Author data
const authors = [
  { name: "Sarah Mitchell", image: authorSarah },
  { name: "Marcus Chen", image: authorMarcus },
  { name: "Emily Wong", image: authorEmily },
  { name: "David Brooks", image: authorDavid },
];

// Get author based on post index for consistent assignment
const getAuthor = (index: number) => authors[index % authors.length];

// Generic AI images pool for titles without specific matches
const genericAiImages = [
  blogAi1, blogAi2, blogAi3, blogAi4, blogAi5, blogAi6,
  blogInnovation, blogScalable, blogMl, blogAnalytics
];

// Simple hash function to get consistent image per title
const hashTitle = (title: string): number => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Specific keyword to image mapping (only for very specific matches)
const specificImageMap: Record<string, string> = {
  "healthcare": blogHealthcareAi,
  "patient care": blogHealthcareAi,
  "future of work": blogFutureWork,
  "human collaboration": blogFutureWork,
  "sustainable": blogSustainableAi,
  "green computing": blogSustainableAi,
  "real-time": blogRealtimeAi,
  "realtime": blogRealtimeAi,
  "deep learning": blogDeepLearning,
  "predictive analytics": blogDeepLearning,
  "automation strategies": blogAutomation,
  "cybersecurity": blogCybersecurity,
  "cloud computing": blogCloud,
  "natural language processing": blogNlp,
  "generative ai": blogGenerativeAi,
  "data privacy": blogPrivacy,
  "computer vision": blogVision,
  "machine learning fundamentals": blogMl,
  "ethics of ai": blogEthics,
  "best practices for ai": blogBestPractices,
  "industry report": blogAnalytics,
};

// Get fallback image based on title - specific match first, then hash-based selection
const getFallbackImage = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  
  // Check for specific matches first
  for (const [keyword, image] of Object.entries(specificImageMap)) {
    if (lowerTitle.includes(keyword)) {
      return image;
    }
  }
  
  // Use hash-based selection for consistent but varied images
  const hash = hashTitle(title);
  return genericAiImages[hash % genericAiImages.length];
};
// Sanitize search input to prevent abuse and improve defense-in-depth
const sanitizeSearchQuery = (query: string): string => {
  const maxLength = 100;
  let sanitized = query.trim().slice(0, maxLength);
  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>]/g, '');
  return sanitized;
};
const Blog = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const LOAD_MORE_COUNT = 5;

  // Debounce search input - wait 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);
  const {
    data: categories
  } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("blog_categories").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });
  const {
    data: posts,
    isLoading
  } = useQuery({
    queryKey: ["blog-posts", selectedCategory, debouncedSearch],
    queryFn: async () => {
      let query = supabase.from("blog_posts").select(`
          *,
          blog_categories (
            id,
            name,
            slug
          )
        `).eq("published", true).order("published_at", {
        ascending: false
      });
      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }
      if (debouncedSearch.trim()) {
        const sanitized = sanitizeSearchQuery(debouncedSearch);
        query = query.or(`title.ilike.%${sanitized}%,excerpt.ilike.%${sanitized}%`);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      return data;
    }
  });
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Split posts into sections
  const latestPosts = posts?.slice(0, 3) || [];
  const recentPosts = posts?.slice(3, 9) || [];
  const remainingPosts = posts?.slice(9) || [];
  return <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" tabIndex={-1} className="container mx-auto px-4 pt-32 pb-12 md:pb-16">
        {/* Hero Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="text-center mb-16">
          <span className="inline-block mb-6 text-sm text-muted-foreground bg-muted/50 border border-border rounded-full py-[4px] px-[12px] font-light">
            AxiomAI's blog
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Blog & Insights
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Explore innovative strategies, insights, and a wealth of inspiration every week on the AxiomAI blog, where we empower businesses with cutting-edge AI solutions.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.1
      }} className="mb-12">
          <div className="flex flex-col gap-4">
            {/* Search - top row, hidden on mobile */}
            <div className="hidden sm:flex justify-end">
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  type="text" 
                  aria-label="Search articles"
                  placeholder="Search articles..." 
                  value={searchInput} 
                  onChange={e => setSearchInput(e.target.value)} 
                  maxLength={100} 
                  className="pl-9 pr-9 h-10 text-sm rounded-full border-border bg-muted focus-visible:ring-1 focus-visible:ring-ring" 
                />
                {searchInput && (
                  <button 
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category dropdown - below search */}
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-full transition-colors w-fit">
                  {selectedCategory 
                    ? categories?.find(c => c.id === selectedCategory)?.name 
                    : "All categories"}
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[200px] p-2 bg-background border border-border shadow-lg rounded-xl" 
                align="start"
                sideOffset={8}
              >
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => {
                      setSelectedCategory(null);
                      setCategoryOpen(false);
                    }} 
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === null 
                        ? "bg-muted font-medium text-foreground" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    All categories
                  </button>
                  {categories?.map(category => (
                    <button 
                      key={category.id} 
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setCategoryOpen(false);
                      }} 
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedCategory === category.id 
                          ? "bg-muted font-medium text-foreground" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </motion.div>

        {/* Section 1: Latest Articles (visible on all screens) */}
        {isLoading ? <div className="grid md:grid-cols-2 gap-6">
            <div className="animate-pulse">
              <div className="h-80 bg-muted rounded-2xl mb-4" />
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-full" />
            </div>
            <div className="space-y-6 hidden md:block">
              {[1, 2].map(i => <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-48 h-32 bg-muted rounded-xl flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>)}
            </div>
          </div> : latestPosts.length > 0 ? <motion.section initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }} className="mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6 md:mb-8">Latest Articles</h2>
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Featured Large Card */}
              {latestPosts[0] && <Link to={`/blog/${latestPosts[0].slug}`} className="group h-full">
                  <div className="bg-muted rounded-2xl overflow-hidden h-full p-2 flex flex-col">
                    <div className="flex-1 min-h-0 overflow-hidden rounded-xl">
                      <img src={latestPosts[0].featured_image_url || getFallbackImage(latestPosts[0].title)} alt={latestPosts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="bg-background rounded-xl p-4 mt-2 flex-shrink-0">
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {latestPosts[0].title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {latestPosts[0].excerpt}
                      </p>
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[8px]">
                          <img 
                            src={getAuthor(0).image} 
                            alt={getAuthor(0).name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{getAuthor(0).name}</span>
                            <span>•</span>
                            <span>{latestPosts[0].published_at && formatDate(latestPosts[0].published_at)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {latestPosts[0].blog_categories && <span className="px-3 py-1 text-xs font-medium rounded-full border border-border bg-background">
                              {latestPosts[0].blog_categories.name}
                            </span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>}

              {/* Two Horizontal Cards Stacked */}
              <div className="flex flex-col gap-3 h-full">
                {latestPosts.slice(1, 3).map((post, idx) => <Link key={post.id} to={`/blog/${post.slug}`} className="group flex-1">
                    <div className="flex flex-col sm:flex-row bg-muted rounded-2xl overflow-hidden p-2 gap-2 h-full">
                      <div className="w-full sm:w-48 md:w-64 h-[160px] sm:h-[200px] flex-shrink-0 overflow-hidden rounded-xl">
                        <img src={post.featured_image_url || getFallbackImage(post.title)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="flex flex-col justify-between flex-1 bg-background rounded-xl p-3">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 hidden sm:block">
                            {post.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-[8px]">
                            <img 
                              src={getAuthor(idx + 1).image} 
                              alt={getAuthor(idx + 1).name}
                              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                            />
                            <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">{getAuthor(idx + 1).name}</span>
                              <span>•</span>
                              <span>{post.published_at && formatDate(post.published_at)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {post.blog_categories && <span className="px-2 sm:px-3 py-1 text-xs font-medium rounded-full border border-border bg-background">
                                {post.blog_categories.name}
                              </span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>)}
              </div>
            </div>
          </motion.section> : null}

        {/* Mobile: Unified table for Recent + All articles (excludes Latest 3) */}
        {!isLoading && posts && posts.length > 3 && (
          <motion.section 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.6, delay: 0.3 }} 
            className="md:hidden"
          >
            <div className="border-t border-dashed border-border">
              {posts.slice(3).map((post, index) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`} 
                  className="group block py-5 border-b border-dashed border-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Category and Date */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>{post.blog_categories?.name || 'Uncategorized'}</span>
                        <span>•</span>
                        <span>{post.published_at && formatDate(post.published_at)}</span>
                      </div>
                      {/* Title */}
                      <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>
                    </div>
                    {/* Author Avatar */}
                    <img 
                      src={getAuthor(index + 3).image} 
                      alt={getAuthor(index + 3).name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Section 2: Recent Articles - 3 column grid with vertical cards (hidden on mobile) */}
        {recentPosts.length > 0 && <motion.section initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.6,
        delay: 0.3
      }} className="mb-16 hidden md:block">
            <h2 className="text-2xl font-semibold text-foreground mb-8">Recent Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPosts.map((post, index) => <motion.div key={post.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.4,
            delay: index * 0.1
          }}>
                  <Link to={`/blog/${post.slug}`} className="group block h-full">
                    <div className="bg-muted rounded-2xl p-2 h-full flex flex-col">
                      {/* Image */}
                      <div className="aspect-[4/3] overflow-hidden rounded-xl">
                        <img src={post.featured_image_url || getFallbackImage(post.title)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      
                      {/* Content */}
                      <div className="bg-background rounded-xl p-4 mt-2 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                          {post.excerpt}
                        </p>
                        
                        {/* Author, date, and category tags */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <img 
                              src={getAuthor(index + 3).image} 
                              alt={getAuthor(index + 3).name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">{getAuthor(index + 3).name}</span>
                              <span>•</span>
                              <span>{post.published_at && formatDate(post.published_at)}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {post.blog_categories && <span className="px-3 py-1 text-xs font-medium rounded-full border border-border bg-background">
                                {post.blog_categories.name}
                              </span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>)}
            </div>
          </motion.section>}

        {/* Section 3: All Articles - Table layout with load more (desktop only) */}
        {remainingPosts.length > 0 && (() => {
          const visiblePosts = remainingPosts.slice(0, visibleCount);
          const hasMore = visibleCount < remainingPosts.length;

          return (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="hidden md:block">
              <h2 className="text-2xl font-semibold text-foreground mb-8">All Articles</h2>
              
              {/* Table */}
              <div className="border-t border-border">
                {visiblePosts.map((post, index) => (
                  <Link 
                    key={post.id} 
                    to={`/blog/${post.slug}`} 
                    className="group grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_100px_auto] md:grid-cols-[1fr_280px_100px_auto] items-center gap-4 py-5 border-b border-border hover:bg-muted/30 transition-colors px-2 -mx-2"
                  >
                    {/* Title */}
                    <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {post.title}
                    </h3>
                    
                    {/* Category - hidden on mobile */}
                    <span className="text-sm text-muted-foreground hidden md:block pr-4">
                      {post.blog_categories?.name || 'Uncategorized'}
                    </span>
                    
                    {/* Date - hidden on mobile */}
                    <span className="text-sm text-muted-foreground hidden sm:block">
                      {post.published_at && formatDate(post.published_at)}
                    </span>
                    
                    {/* Author Avatar */}
                    <img 
                      src={getAuthor(index + 9).image} 
                      alt={getAuthor(index + 9).name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-background"
                    />
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount(prev => prev + LOAD_MORE_COUNT)}
                    className="rounded-full px-8"
                  >
                    Load more
                  </Button>
                </div>
              )}
            </motion.section>
          );
        })()}

        {!isLoading && (!posts || posts.length === 0) && <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No articles found. Try adjusting your search or filters.
            </p>
            {(searchInput || selectedCategory) && <button type="button" onClick={() => {
              setSearchInput("");
              setDebouncedSearch("");
              setSelectedCategory(null);
            }} className="mt-4 text-sm font-medium text-foreground underline underline-offset-4">
                Clear filters
              </button>}
          </div>}
      </main>
      <Footer />
    </div>;
};
export default Blog;