import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Upload04Icon, Cancel01Icon, MoreHorizontalIcon } from "hugeicons-react";
import TiptapEditor from "../editor/TiptapEditor";
import { ContentBlock } from "@/types/blog";

// Convert content_blocks to HTML for TiptapEditor
const blocksToHtml = (blocks: ContentBlock[]): string => {
  if (!blocks || blocks.length === 0) return "";
  
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return `<p>${block.data.text}</p>`;
      case 'heading':
        const level = block.data.level || 2;
        return `<h${level}>${block.data.text}</h${level}>`;
      case 'quote':
        return `<blockquote><p>${block.data.text}</p>${block.data.author ? `<cite>— ${block.data.author}</cite>` : ''}</blockquote>`;
      case 'image':
        return `<figure><img src="${block.data.url}" alt="${block.data.alt || ''}" />${block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : ''}</figure>`;
      case 'code':
        return `<pre><code>${block.data.code}</code></pre>`;
      case 'divider':
        return '<hr />';
      default:
        return '';
    }
  }).join('\n');
};

interface BlogPostFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    content_blocks: ContentBlock[];
    featured_image_url: string | null;
    category_id: string | null;
    published: boolean;
  } | null;
  onClose: () => void;
  onDelete?: () => void;
}

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const BlogPostForm = ({ post, onClose, onDelete }: BlogPostFormProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!post;

  // Compute initial content from content_blocks or content field
  const getInitialContent = (p: typeof post) => {
    if (p?.content_blocks && p.content_blocks.length > 0) {
      return blocksToHtml(p.content_blocks);
    }
    return p?.content || "";
  };

  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    featured_image_url: post?.featured_image_url || "",
    category_ids: post?.category_id ? [post.category_id] : [] as string[],
    published: post?.published || false,
  });

  const [content, setContent] = useState(() => getInitialContent(post));
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const selectedCategories = categories?.filter(c => formData.category_ids.includes(c.id)) || [];

  const handleImageUpload = async (file: File) => {
    const safeExt = ALLOWED_IMAGE_TYPES[file.type];
    if (!safeExt) {
      toast.error("Please upload a JPG, PNG, WEBP, GIF or AVIF image");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${safeExt}`;
      const filePath = `featured/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, featured_image_url: publicUrl }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, featured_image_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      category_ids: prev.category_ids.filter(id => id !== categoryId) 
    }));
  };

  const handleAddCategory = (categoryId: string) => {
    if (!formData.category_ids.includes(categoryId)) {
      setFormData((prev) => ({ 
        ...prev, 
        category_ids: [...prev.category_ids, categoryId] 
      }));
    }
  };

  const handleSaveDraft = () => {
    setFormData((prev) => ({ ...prev, published: false }));
    setTimeout(() => saveMutation.mutate(), 0);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: content,
        content_blocks: [],
        featured_image_url: formData.featured_image_url || null,
        category_id: formData.category_ids[0] || null,
        published: formData.published,
        published_at: formData.published ? new Date().toISOString() : null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([postData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success(isEditing ? "Post updated successfully" : "Post created successfully");
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to save post");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (formData.title.trim().length > 200) {
      toast.error("Title must be less than 200 characters");
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug.trim())) {
      toast.error("Slug can only contain lowercase letters, numbers and dashes");
      return;
    }
    if (formData.excerpt.trim().length > 500) {
      toast.error("Excerpt must be less than 500 characters");
      return;
    }
    if (formData.published && formData.category_ids.length === 0) {
      toast.error("Please select a category before publishing");
      return;
    }
    
    saveMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Header with X, Publish toggle, 3-dot menu, and Save/Publish */}
      <div className="flex items-center justify-between flex-shrink-0 py-3 px-6 bg-background border-b border-border">
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-md hover:bg-muted transition-colors"
        >
          <Cancel01Icon className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, published: checked }))}
            />
            <Label htmlFor="published" className="cursor-pointer text-[15px] font-medium">
              Publish now
            </Label>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="icon" aria-label="More options" className="h-10 w-10">
                <MoreHorizontalIcon className="h-5 w-5" strokeWidth={2.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSaveDraft}>
                Save as draft
              </DropdownMenuItem>
              {isEditing && onDelete && (
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : formData.published ? "Publish" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-[14px] font-medium">
          Title<span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title..."
          className="h-12 text-[16px]"
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug" className="text-[14px] font-medium">
          Slug<span className="text-destructive">*</span>
        </Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
          placeholder="post-url-slug"
          className="h-12 text-[16px]"
        />
        <p className="text-[13px] text-muted-foreground">
          {window.location.origin}/blog/{formData.slug || "your-slug"}
        </p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-[14px] font-medium">
          Category {formData.published && <span className="text-destructive">*</span>}
        </Label>
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {selectedCategories.map((category) => (
              <span 
                key={category.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background text-[14px]"
              >
                {category.name}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(category.id)}
                  aria-label={`Remove ${category.name}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Cancel01Icon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        )}
        <Select
          value=""
          onValueChange={handleAddCategory}
        >
          <SelectTrigger id="category" className="h-12 text-[16px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.filter(c => !formData.category_ids.includes(c.id)).map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.published && formData.category_ids.length === 0 && (
          <p className="text-[12px] text-destructive">Category is required for publishing</p>
        )}
      </div>

      {/* Featured Image */}
      <div className="space-y-2">
        <Label className="text-[14px] font-medium">Image</Label>
        <div className="flex items-center gap-3">
          {formData.featured_image_url && (
            <div className="relative flex-shrink-0">
              <img
                src={formData.featured_image_url}
                alt="Featured preview"
                className="w-16 h-16 object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
              >
                <Cancel01Icon className="h-3 w-3" />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-2 h-10"
          >
            <Upload04Icon className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload an image"}
          </Button>
        </div>
      </div>

      {/* Summary (Excerpt) */}
      <div className="space-y-2">
        <Label htmlFor="excerpt" className="text-[14px] font-medium">Summary</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
          placeholder="Brief description of the post..."
          className="min-h-[120px] resize-none text-[16px]"
        />
        <p className="text-[13px] text-muted-foreground">This appears on blog listing pages and in search results</p>
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <Label className="text-[14px] font-medium">Content</Label>
        <TiptapEditor 
          key={post?.id || 'new'} 
          content={content} 
          onChange={setContent} 
        />
      </div>
      </div>
    </form>
  );
};

export default BlogPostForm;