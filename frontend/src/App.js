import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Solutions from "@/pages/Solutions";
import SolutionDetail from "@/pages/SolutionDetail";
import Blog from "@/pages/Blog";
import ArticleDetail from "@/pages/ArticleDetail";
import Contact from "@/pages/Contact";

// Auth
import AuthCallback from "@/pages/AuthCallback";
import Login from "@/pages/Login";

// Admin
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminArticles from "@/pages/admin/Articles";
import AdminArticleEditor from "@/pages/admin/ArticleEditor";
import AdminMessages from "@/pages/admin/Messages";
import ProtectedRoute from "@/components/ProtectedRoute";

// Layout
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function AppRouter() {
  const location = useLocation();
  
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  // Check URL fragment for session_id - must be synchronous (before render)
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  // Check if admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/auth/callback';
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/:slug" element={<SolutionDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<ArticleDetail />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/articles" element={
            <ProtectedRoute>
              <AdminArticles />
            </ProtectedRoute>
          } />
          <Route path="/admin/articles/new" element={
            <ProtectedRoute>
              <AdminArticleEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/articles/:articleId" element={
            <ProtectedRoute>
              <AdminArticleEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/messages" element={
            <ProtectedRoute>
              <AdminMessages />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {!isAdminRoute && !isAuthRoute && <Footer />}
      <Toaster position="top-right" richColors />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
