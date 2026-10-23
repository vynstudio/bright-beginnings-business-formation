import { useMemo, useState } from "react";
import { Add01Icon, Search01Icon } from "hugeicons-react";
import { toast } from "sonner";
import DemoAdminLayout from "@/components/admin/DemoAdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { seedPosts } from "@/demo/seedData";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const DemoAdminBlog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const posts = seedPosts;

  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.blog_categories?.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [posts, searchQuery],
  );

  const demoAction = () => toast.info("This is a demo — editing is disabled.");

  return (
    <DemoAdminLayout title="Blog posts" description="Create and manage your blog content here.">
      <div className="sticky top-0 z-10 bg-background pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <Button variant="outline" onClick={demoAction} className="gap-2 w-fit text-[14px] font-light">
          <Add01Icon className="w-4 h-4" />
          New post
        </Button>
        <div className="relative w-full sm:w-72">
          <Search01Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            aria-label="Search posts"
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
              <th className="w-12 p-4">
                <Checkbox className="rounded-[4px]" checked={false} onCheckedChange={demoAction} aria-label="Select row" />
              </th>
              <th className="text-left p-4 text-[14px] font-normal text-[#59605A]">Title</th>
              <th className="text-left p-4 text-[14px] font-normal text-[#59605A] hidden md:table-cell whitespace-nowrap">Category</th>
              <th className="text-left p-4 text-[14px] font-normal text-[#59605A] hidden lg:table-cell whitespace-nowrap">Created</th>
              <th className="text-left p-4 text-[14px] font-normal text-[#59605A] hidden xl:table-cell whitespace-nowrap">Last edited</th>
              <th className="text-left p-4 text-[14px] font-normal text-[#59605A] hidden sm:table-cell whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => (
              <tr
                key={post.id}
                className="border-t border-border group hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={demoAction}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox className="rounded-[4px]" checked={false} onCheckedChange={demoAction} aria-label="Select row" />
                </td>
                <td className="p-4 max-w-0 w-full">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-[16px] truncate">{post.title}</p>
                    <p className="text-[14px] font-extralight text-[#59605A] truncate">{post.slug}</p>
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
    </DemoAdminLayout>
  );
};

export default DemoAdminBlog;