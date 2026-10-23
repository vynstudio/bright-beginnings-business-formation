import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreHorizontalIcon } from "hugeicons-react";
import AdminSheetHeader from "./AdminSheetHeader";
import AdminSheetContent from "./AdminSheetContent";

interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
  onDelete?: () => void;
}

const CategoryForm = ({ category, onClose, onDelete }: CategoryFormProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!category;

  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
    } else {
      setName("");
      setSlug("");
    }
  }, [category]);

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        name: name.trim(),
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      };

      if (isEditing && category) {
        const { error } = await supabase
          .from("blog_categories")
          .update(data)
          .eq("id", category.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("blog_categories")
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      toast.success(isEditing ? "Category updated" : "Category created");
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    saveMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <AdminSheetHeader onClose={onClose}>
        {isEditing && onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="icon" aria-label="More options" className="h-10 w-10">
                <MoreHorizontalIcon className="h-5 w-5" strokeWidth={2.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </AdminSheetHeader>

      <AdminSheetContent>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[14px] font-medium">
            Name<span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g., Technology"
            className="h-12 text-[16px]"
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="text-[14px] font-medium">
            Slug<span className="text-destructive">*</span>
          </Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            placeholder="e.g., technology"
            className="h-12 text-[16px]"
            maxLength={50}
          />
          <p className="text-[13px] text-muted-foreground">
            URL-friendly identifier
          </p>
        </div>
      </AdminSheetContent>
    </form>
  );
};

export default CategoryForm;
