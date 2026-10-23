import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SecurityCheckIcon, SecurityBlockIcon, Search01Icon, ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  isAdmin: boolean;
}

const ITEMS_PER_PAGE = 10;

const AdminUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const adminUserIds = new Set(
        roles?.filter((r) => r.role === "admin").map((r) => r.user_id) || []
      );

      const { data, error } = await supabase.functions.invoke("list-users");
      
      if (error) throw error;

      const usersWithRoles: UserWithRole[] = (data.users || []).map((user: any) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        isAdmin: adminUserIds.has(user.id),
      }));

      return usersWithRoles;
    },
  });

  const adminCount = users?.filter((u) => u.isAdmin).length || 0;

  const filteredUsers = useMemo(() =>
    users?.filter((user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [],
    [users, searchQuery]
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, makeAdmin }: { userId: string; makeAdmin: boolean }) => {
      if (makeAdmin) {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" });
        if (error) throw error;
      } else {
        // Check if this is the last admin
        const { count, error: countError } = await supabase
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "admin");
        
        if (countError) throw countError;
        
        if (count && count <= 1) {
          throw new Error("Cannot revoke the last admin. Assign admin to another user first.");
        }

        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");
        if (error) throw error;
      }
    },
    onSuccess: (_, { makeAdmin }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: makeAdmin ? "Admin granted" : "Admin revoked",
        description: makeAdmin
          ? "User now has admin access"
          : "User no longer has admin access",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
    <AdminLayout title="Users" description="Grant or revoke admin access.">
      <div className="sticky top-0 z-10 bg-background pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-2">
        <div className="relative w-full sm:w-72">
          <Search01Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            aria-label="Search users"
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
              <th className="text-left p-4 text-[14px] font-normal text-[#59605A]">Email</th>
              <th className="text-left p-4 text-[14px] font-normal text-[#59605A] hidden sm:table-cell whitespace-nowrap">Joined</th>
              <th className="text-left p-4 text-[14px] font-normal text-[#59605A] hidden md:table-cell whitespace-nowrap">Status</th>
              <th className="text-right p-4 text-[14px] font-normal text-[#59605A] whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-4"><Skeleton className="h-4 w-48" /></td>
                  <td className="p-4 hidden sm:table-cell"><Skeleton className="h-4 w-20" /></td>
                  <td className="p-4 hidden md:table-cell"><Skeleton className="h-6 w-16" /></td>
                  <td className="p-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                </tr>
              ))
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-[14px] text-muted-foreground">
                  {searchQuery ? "No users match your search" : "No users found"}
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-[16px]">
                    <span className="truncate block">{user.email}</span>
                  </td>
                  <td className="p-4 text-[14px] font-extralight text-[#59605A] hidden sm:table-cell">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {user.isAdmin ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] border border-accent bg-accent/10 text-accent">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-extralight border border-border bg-muted/50 text-[#59605A]">
                        User
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant={user.isAdmin ? "outline" : "default"}
                      size="sm"
                      className="text-[14px]"
                      onClick={() =>
                        toggleAdminMutation.mutate({
                          userId: user.id,
                          makeAdmin: !user.isAdmin,
                        })
                      }
                      disabled={toggleAdminMutation.isPending || (user.isAdmin && adminCount <= 1)}
                      title={user.isAdmin && adminCount <= 1 ? "Cannot revoke the last admin" : undefined}
                    >
                      {user.isAdmin ? (
                        <>
                          <SecurityBlockIcon className="w-4 h-4 mr-2" />
                          Revoke
                        </>
                      ) : (
                        <>
                          <SecurityCheckIcon className="w-4 h-4 mr-2" />
                          Make admin
                        </>
                      )}
                    </Button>
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
    </AdminLayout>
  );
};

export default AdminUsers;
