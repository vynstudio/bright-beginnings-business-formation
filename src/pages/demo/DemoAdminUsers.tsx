import { useMemo, useState } from "react";
import { SecurityCheckIcon, SecurityBlockIcon, Search01Icon } from "hugeicons-react";
import { toast } from "sonner";
import DemoAdminLayout from "@/components/admin/DemoAdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { seedUsers } from "@/demo/seedData";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const DemoAdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = useMemo(
    () => seedUsers.filter((u) => u.email.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  );
  const demoAction = () => toast.info("This is a demo — editing is disabled.");

  return (
    <DemoAdminLayout title="Users" description="Grant or revoke admin access.">
      <div className="sticky top-0 z-10 bg-background pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-2">
        <div className="relative w-full sm:w-72">
          <Search01Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            aria-label="Search users"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-[16px]">
                  <span className="truncate block">{u.email}</span>
                </td>
                <td className="p-4 text-[14px] font-extralight text-[#59605A] hidden sm:table-cell">
                  {formatDate(u.created_at)}
                </td>
                <td className="p-4 hidden md:table-cell">
                  {u.isAdmin ? (
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
                  <Button variant={u.isAdmin ? "outline" : "default"} size="sm" className="text-[14px]" onClick={demoAction}>
                    {u.isAdmin ? (
                      <><SecurityBlockIcon className="w-4 h-4 mr-2" />Revoke</>
                    ) : (
                      <><SecurityCheckIcon className="w-4 h-4 mr-2" />Make admin</>
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DemoAdminLayout>
  );
};

export default DemoAdminUsers;