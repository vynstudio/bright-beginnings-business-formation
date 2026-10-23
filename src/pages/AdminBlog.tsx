import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Add01Icon, Edit02Icon, Delete02Icon, ViewIcon, Search01Icon, ArrowLeft01Icon, ArrowRight01Icon, ArrowUp01Icon, ArrowDown01Icon } from "hugeicons-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSheet from "@/components/admin/AdminSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import BlogPostForm from "@/components/blog/admin/BlogPostForm";
import { ContentBlock } from "@/types/blog";

interface BlogPostData {
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
  blog_categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

type SortField = "updated_at" | "created_at" | "category";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

const AdminBlog = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostData | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          blog_categories (
            id,
            name,
            slug
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data || []).map(post => ({
        ...post,
        content_blocks: (post.content_blocks as unknown as ContentBlock[]) || [],
      })) as BlogPostData[];
    },
  });

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts?.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.blog_categories?.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
    
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === "updated_at") {
        comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      } else if (sortField === "created_at") {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === "category") {
        const catA = a.blog_categories?.name || "";
        const catB = b.blog_categories?.name || "";
        comparison = catA.localeCompare(catB);
      }
      
      return sortDirection === "desc" ? -comparison : comparison;
    });
  }, [posts, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedPosts, currentPage]);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    const isActive = sortField === field;
    const Icon = sortDirection === "desc" ? ArrowDown01Icon : ArrowUp01Icon;
    return (
      <Icon className={`w-3 h-3 inline ml-1 transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
    );
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedPosts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedPosts.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const isAllSelected = paginatedPosts.length > 0 && selectedIds.size === paginatedPosts.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < paginatedPosts.length;

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Post deleted successfully");
      setDeletePostId(null);
      setSelectedIds(new Set());
      setIsFormOpen(false);
      setEditingPost(null);
    },
    onError: (error) => {
      toast.error("Failed to delete post");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (postIds: string[]) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .in("id", postIds);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success(`${selectedIds.size} posts deleted successfully`);
      setSelectedIds(new Set());
    },
    onError: (error) => {
      toast.error("Failed to delete posts");
    },
  });

  const handleEdit = (post: BlogPostData) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <AdminLayout title="Blog posts" description="Create and manage your blog content here.">
      <div className="sticky top-0 z-10 bg-background pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-muted-foreground">
              {selectedIds.size} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => bulkDeleteMutation.mutate(Array.from(selectedIds))}
              disabled={bulkDeleteMutation.isPending}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 text-[14px] font-light"
            >
              <Delete02Icon className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
              className="text-[14px] font-light text-muted-foreground hover:text-muted-foreground hover:bg-muted/50"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={handleCreate} className="gap-2 w-fit text-[14px] font-light">
            <Add01Icon className="w-4 h-4" />
            New post
          </Button>
        )}
        <div className="relative w-full sm:w-72">
          <Search01Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            aria-label="Search posts"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 text-[14px] font-light placeholder:text-[14px] placeholder:font-light"
          />
        </div>
      </div>

      {/* Posts Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredAndSortedPosts.length > 0 ? (
        <>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="w-12 p-4">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={toggleSelectAll}
                      className="rounded-[4px]"
                      {...(isSomeSelected ? { "data-state": "indeterminate" } : {})}
                    />
                  </th>
                  <th className="text-left p-4 text-[14px] font-normal text-[#59605A]">
                    Title
                  </th>
                  <th 
                    className="text-left p-4 text-[14px] font-normal text-[#59605A] hidden md:table-cell cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
                    onClick={() => handleSort("category")}
                  >
                    Category
                    <SortIcon field="category" />
                  </th>
                  <th 
                    className="text-left p-4 text-[14px] font-normal text-[#59605A] hidden lg:table-cell cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
                    onClick={() => handleSort("created_at")}
                  >
                    Created
                    <SortIcon field="created_at" />
                  </th>
                  <th 
                    className="text-left p-4 text-[14px] font-normal text-[#59605A] hidden xl:table-cell cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
                    onClick={() => handleSort("updated_at")}
                  >
                    Last edited
                    <SortIcon field="updated_at" />
                  </th>
                  <th className="text-left p-4 text-[14px] font-normal text-[#59605A] hidden sm:table-cell whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-t border-border group hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => handleEdit(post)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(post.id)}
                        onCheckedChange={() => toggleSelect(post.id)}
                        className="rounded-[4px]"
                      />
                    </td>
                    <td className="p-4 max-w-0 w-full">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-[16px] truncate">
                          {post.title}
                        </p>
                        <p className="text-[14px] font-extralight text-[#59605A] truncate">
                          {post.slug}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-[14px] font-extralight text-[#59605A] truncate">
                      {post.blog_categories?.name || "—"}
                    </td>
                    <td className="p-4 text-[14px] font-extralight text-[#59605A] hidden lg:table-cell">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="p-4 text-[14px] font-extralight text-[#59605A] hidden xl:table-cell">
                      {formatDate(post.updated_at)}
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      {post.published ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] border border-[#34D399] bg-[#D1FAE5] text-[#10B981]">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-extralight border border-border bg-muted/50 text-[#59605A]">
                          Draft
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ArrowLeft01Icon className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) => (
                  typeof page === "number" ? (
                    <Button
                      key={idx}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      className="w-9 h-9"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ) : (
                    <span key={idx} className="px-2 text-muted-foreground">...</span>
                  )
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next
                <ArrowRight01Icon className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-xl">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "No posts match your search" : "No blog posts yet"}
          </p>
          {!searchQuery && (
            <Button variant="outline" onClick={handleCreate} className="gap-2">
              <Add01Icon className="w-4 h-4" />
              Create your first post
            </Button>
          )}
        </div>
      )}

      {/* Post Form Sidebar */}
      <AdminSheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <BlogPostForm
          key={editingPost?.id || 'new'}
          post={editingPost}
          onClose={handleFormClose}
          onDelete={editingPost ? () => setDeletePostId(editingPost.id) : undefined}
        />
      </AdminSheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletePostId && deleteMutation.mutate(deletePostId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBlog;
