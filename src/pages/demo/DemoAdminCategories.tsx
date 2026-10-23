import { useMemo, useState } from "react";
import { Add01Icon, Search01Icon } from "hugeicons-react";
import { toast } from "sonner";
import DemoAdminLayout from "@/components/admin/DemoAdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { seedCategories } from "@/demo/seedData";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const DemoAdminCategories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = useMemo(
    () =>
      seedCategories.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.slug.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );
  const demoAction = () => toast.info("This is a demo — editing is disabled.");

  return (
    <DemoAdminLayout title="Categories" description="Organize your blog content.">
      <div className="sticky top-0 z-10 bg-background pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <Button variant="outline" onClick={demoAction} className="gap-2 w-fit text-[14px] font-light">
          <Add01Icon className="w-4 h-4" />
          New category
        </Button>
        <div className="relative w-full sm:w-72">
          <Search01Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            aria-label="Search categories"
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
              <th className="w-12 p-4"><Checkbox className="rounded-[4px]" checked={false} onCheckedChange={demoAction} aria-label="Select row" /></th>
              <th className="text-left p-4 text-[14px] font-normal text-[#59605A]">Name</th>
              <th className="text-left p-4 text-[14px] font-normal text-[#59605A] hidden md:table-cell whitespace-nowrap">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-t border-border group hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={demoAction}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox className="rounded-[4px]" checked={false} onCheckedChange={demoAction} aria-label="Select row" />
                </td>
                <td className="p-4">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-[16px] truncate">{c.name}</p>
                    <p className="text-[14px] font-extralight text-[#59605A] truncate">{c.slug}</p>
                  </div>
                </td>
                <td className="p-4 text-[14px] font-extralight text-[#59605A] hidden md:table-cell">
                  {formatDate(c.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DemoAdminLayout>
  );
};

export default DemoAdminCategories;