import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import AdminBlog from "./pages/AdminBlog";
import AdminCategories from "./pages/AdminCategories";
import AdminLogin from "./pages/AdminLogin";
import AdminUsers from "./pages/AdminUsers";
import AdminMessages from "./pages/AdminMessages";
import AdminOrders from "./pages/AdminOrders";
import Start from "./pages/Start";
import CheckoutReturn from "./pages/CheckoutReturn";
import PublicInformation from "./pages/PublicInformation";
import ResetPassword from "./pages/ResetPassword";
import RequireAdmin from "./components/auth/RequireAdmin";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import SkipLink from "./components/SkipLink";
import DemoAdminBlog from "./pages/demo/DemoAdminBlog";
import DemoAdminCategories from "./pages/demo/DemoAdminCategories";
import DemoAdminUsers from "./pages/demo/DemoAdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
  <LanguageProvider>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <SkipLink />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PublicInformation pageKey="privacy" />} />
            <Route path="/legal-disclaimer" element={<PublicInformation pageKey="legal-disclaimer" />} />
            <Route path="/florida-llc-vs-corporation" element={<PublicInformation pageKey="florida-llc-vs-corporation" />} />
            <Route path="/ein-application" element={<PublicInformation pageKey="ein-application" />} />
            <Route path="/registered-agent-renewal" element={<PublicInformation pageKey="registered-agent-renewal" />} />
            <Route path="/start" element={<Start />} />
            <Route path="/checkout/return" element={<CheckoutReturn />} />
            <Route path="/admin/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<Navigate to="/admin/posts" replace />} />
            <Route
              path="/admin/posts"
              element={
                <RequireAdmin>
                  <AdminBlog />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <RequireAdmin>
                  <AdminCategories />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RequireAdmin>
                  <AdminUsers />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <RequireAdmin>
                  <AdminMessages />
                </RequireAdmin>
              }
            />
            {/* Demo routes — no auth, seed data only */}
            <Route path="/demo" element={<Navigate to="/demo/admin/posts" replace />} />
            <Route path="/demo/admin" element={<Navigate to="/demo/admin/posts" replace />} />
            <Route path="/demo/admin/posts" element={<DemoAdminBlog />} />
            <Route path="/demo/admin/categories" element={<DemoAdminCategories />} />
            <Route path="/demo/admin/users" element={<DemoAdminUsers />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </LanguageProvider>
  </QueryClientProvider>
);

export default App;
