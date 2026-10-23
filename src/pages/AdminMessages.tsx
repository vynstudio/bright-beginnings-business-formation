import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const AdminMessages = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as ContactMessage[];
    },
  });

  return (
    <AdminLayout title="Messages" description="Messages sent through the contact form.">
      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : error ? (
        <p className="text-sm text-destructive">Could not load messages.</p>
      ) : !data?.length ? (
        <p className="text-sm text-muted-foreground">No messages yet.</p>
      ) : (
        <ul className="space-y-3" data-testid="contact-messages">
          {data.map((m) => (
            <li key={m.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-foreground">{m.subject}</p>
                <time className="text-xs text-muted-foreground">
                  {new Date(m.created_at).toLocaleString()}
                </time>
              </div>
              <p className="text-[13px] text-muted-foreground">
                {m.name} · <a className="underline" href={`mailto:${m.email}`}>{m.email}</a>
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </AdminLayout>
  );
};

export default AdminMessages;
