import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";
import SkipLink from "./components/SkipLink";

// Every page except the home page is downloaded only when it's opened, so the first
// visit doesn't pay for the blog editor, admin screens or checkout code.
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminBlog = lazy(() => import("./pages/AdminBlog"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminMessages = lazy(() => import("./pages/AdminMessages"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const Start = lazy(() => import("./pages/Start"));
const CheckoutReturn = lazy(() => import("./pages/CheckoutReturn"));
const PublicInformation = lazy(() => import("./pages/PublicInformation"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminAuth = lazy(() => import("./components/auth/AdminAuth"));
const RequireAdmin = lazy(() => import("./components/auth/RequireAdmin"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
  <LanguageProvider>
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <SkipLink />
          <Suspense fallback={<div className="min-h-dvh bg-background" />}>
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
            <Route element={<AdminAuth />}>
              <Route path="/admin/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/reset-password" element={<ResetPassword />} />
              <Route path="/admin" element={<Navigate to="/admin/posts" replace />} />
              <Route path="/admin/posts" element={<RequireAdmin><AdminBlog /></RequireAdmin>} />
              <Route path="/admin/categories" element={<RequireAdmin><AdminCategories /></RequireAdmin>} />
              <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
              <Route path="/admin/messages" element={<RequireAdmin><AdminMessages /></RequireAdmin>} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
    </TooltipProvider>
  </LanguageProvider>
  </QueryClientProvider>
);

export default App;
