import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  Plus,
  ArrowRight
} from 'lucide-react';
import { adminStatsAPI, authAPI } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, userRes] = await Promise.all([
        adminStatsAPI.get(),
        authAPI.getMe()
      ]);
      setStats(statsRes.data);
      setUser(userRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout user={user}>
      <div className="p-6 lg:p-8" data-testid="admin-dashboard">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-manrope text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
            Tableau de bord
          </h1>
          <p className="font-dm-sans text-slate-600">
            Bienvenue, {user?.name || 'Administrateur'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Articles publiés
                </CardTitle>
                <FileText className="h-4 w-4 text-haako-900" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {loading ? '...' : stats?.published_articles || 0}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {stats?.draft_articles || 0} brouillon(s)
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Vues totales
                </CardTitle>
                <Eye className="h-4 w-4 text-haako-900" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {loading ? '...' : stats?.total_views || 0}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Sur tous les articles
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Messages
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-haako-900" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {loading ? '...' : stats?.total_messages || 0}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {stats?.unread_messages || 0} non lu(s)
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total articles
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-haako-900" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {loading ? '...' : stats?.total_articles || 0}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Publiés + brouillons
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start gap-2 bg-haako-900 hover:bg-haako-800">
                  <Link to="/admin/articles/new" data-testid="quick-new-article">
                    <Plus className="h-4 w-4" />
                    Nouvel article
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start gap-2">
                  <Link to="/admin/articles" data-testid="quick-articles">
                    <FileText className="h-4 w-4" />
                    Gérer les articles
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start gap-2">
                  <Link to="/admin/messages" data-testid="quick-messages">
                    <MessageSquare className="h-4 w-4" />
                    Voir les messages
                    {stats?.unread_messages > 0 && (
                      <span className="ml-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {stats.unread_messages}
                      </span>
                    )}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Articles récents</CardTitle>
                <Link 
                  to="/admin/articles" 
                  className="text-sm text-haako-900 hover:text-haako-800 flex items-center gap-1"
                >
                  Voir tout
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : stats?.recent_articles?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recent_articles.slice(0, 5).map((article) => (
                      <Link
                        key={article.article_id}
                        to={`/admin/articles/${article.article_id}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-dm-sans font-medium text-slate-900 truncate group-hover:text-haako-900">
                            {article.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDate(article.created_at)}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          article.status === 'published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {article.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-6">
                    Aucun article pour le moment
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
