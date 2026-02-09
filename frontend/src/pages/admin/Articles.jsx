import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  FileText
} from 'lucide-react';
import { adminArticlesAPI, authAPI } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const [articlesRes, userRes] = await Promise.all([
        adminArticlesAPI.getAll(params),
        authAPI.getMe()
      ]);
      setArticles(articlesRes.data);
      setUser(userRes.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await adminArticlesAPI.delete(deleteId);
      toast.success('Article supprimé');
      fetchData();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout user={user}>
      <div className="p-6 lg:p-8" data-testid="admin-articles">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-manrope text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
              Articles
            </h1>
            <p className="font-dm-sans text-slate-600">
              Gérez vos articles et publications
            </p>
          </div>
          <Button asChild className="bg-haako-900 hover:bg-haako-800">
            <Link to="/admin/articles/new" data-testid="new-article-btn">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel article
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="status-filter">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="published">Publiés</SelectItem>
              <SelectItem value="draft">Brouillons</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Articles Table/List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Titre</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Catégorie</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Statut</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Vues</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Date</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.map((article) => (
                    <tr key={article.article_id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {article.cover_image ? (
                            <img 
                              src={article.cover_image} 
                              alt="" 
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-dm-sans font-medium text-slate-900 truncate max-w-xs">
                              {article.title}
                            </p>
                            <p className="text-xs text-slate-500 truncate max-w-xs">
                              {article.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary">{article.category}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          className={article.status === 'published' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                          }
                        >
                          {article.status === 'published' ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {article.views || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(article.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {article.status === 'published' && (
                              <DropdownMenuItem asChild>
                                <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/articles/${article.article_id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={() => setDeleteId(article.article_id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="md:hidden divide-y divide-slate-100">
              {articles.map((article) => (
                <div key={article.article_id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {article.cover_image ? (
                        <img 
                          src={article.cover_image} 
                          alt="" 
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-dm-sans font-medium text-slate-900 truncate">
                          {article.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            className={`text-xs ${article.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {article.status === 'published' ? 'Publié' : 'Brouillon'}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {formatDate(article.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {article.status === 'published' && (
                          <DropdownMenuItem asChild>
                            <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/articles/${article.article_id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setDeleteId(article.article_id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-xl border border-slate-200"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-manrope text-xl font-semibold text-slate-900 mb-2">
              Aucun article
            </h3>
            <p className="font-dm-sans text-slate-600 mb-6">
              Commencez par créer votre premier article.
            </p>
            <Button asChild className="bg-haako-900 hover:bg-haako-800">
              <Link to="/admin/articles/new">
                <Plus className="h-4 w-4 mr-2" />
                Créer un article
              </Link>
            </Button>
          </motion.div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. L'article sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
