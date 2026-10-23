import { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Loading03Icon } from "hugeicons-react";

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <Loading03Icon className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <main className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access denied</h1>
          <p className="text-muted-foreground">
            You're signed in as {user.email}, but this account is not an admin. Ask an existing admin to grant you access.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
            <Button asChild variant="ghost"><Link to="/">Back to site</Link></Button>
          </div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
