import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Sign-in state for the /admin pages only. Kept out of the public pages so visitors
// don't download the Supabase auth code.
const AdminAuth = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

export default AdminAuth;
