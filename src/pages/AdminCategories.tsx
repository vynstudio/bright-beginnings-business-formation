import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Add01Icon, Delete02Icon, Search01Icon, ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSheet from "@/components/admin/AdminSheet";
import CategoryForm from "@/components/admin/CategoryForm";
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
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
  });

  const filteredCategories = useMemo(() =>
    categories?.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [],
    [categories, searchQuery]
  );

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedCategories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedCategories.map(c => c.id)));
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

  const isAllSelected = paginatedCategories.length > 0 && selectedIds.size === paginatedCategories.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < paginatedCategories.length;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_categories")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category deleted");
      setDeleteCategoryId(null);
      setSelectedIds(new Set());
      setIsFormOpen(false);
      setEditingCategory(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (categoryIds: string[]) => {
      const { error } = await supabase
        .from("blog_categories")
        .delete()
        .in("id", categoryIds);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success(`${selectedIds.size} categories deleted`);
      setSelectedIds(new Set());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
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
    <AdminLayout title="Categories" description="Organize your blog content.">
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
            New category
          </Button>
        )}
        <div className="relative w-full sm:w-72">
          <Search01Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            aria-label="Search categories"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 text-[14px] font-light placeholder:text-[14px] placeholder:font-light"
          />
        </div>
      </div>

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
              <th className="text-left p-4 text-[14px] font-normal text-[#59605A]">Name</th>
              <th className="text-left p-4 text-[14px] font-normal text-[#59605A] hidden md:table-cell whitespace-nowrap">Created</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-4"><Skeleton className="h-4 w-4" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="p-4 hidden md:table-cell"><Skeleton className="h-4 w-20" /></td>
                </tr>
              ))
            ) : paginatedCategories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-[14px] text-muted-foreground">
                  {searchQuery ? "No categories match your search" : "No categories yet"}
                </td>
              </tr>
            ) : (
              paginatedCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t border-border group hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleEdit(category)}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(category.id)}
                      onCheckedChange={() => toggleSelect(category.id)}
                      className="rounded-[4px]"
                    />
                  </td>
                  <td className="p-4">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-[16px] truncate">{category.name}</p>
                      <p className="text-[14px] font-extralight text-[#59605A] truncate">{category.slug}</p>
                    </div>
                  </td>
                  <td className="p-4 text-[14px] font-extralight text-[#59605A] hidden md:table-cell">
                    {formatDate(category.created_at)}
                  </td>
                </tr>
              ))
            )}
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

      {/* Category Form Sidebar */}
      <AdminSheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <CategoryForm
          key={editingCategory?.id || 'new'}
          category={editingCategory}
          onClose={handleFormClose}
          onDelete={editingCategory ? () => setDeleteCategoryId(editingCategory.id) : undefined}
        />
      </AdminSheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Posts using this category will be unaffected but will no longer have a category assigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteCategoryId && deleteMutation.mutate(deleteCategoryId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminCategories;
