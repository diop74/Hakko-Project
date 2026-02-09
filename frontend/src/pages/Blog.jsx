import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowRight, Tag, Filter } from 'lucide-react';
import { articlesAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'articles', label: 'Articles' },
  { value: 'analyses', label: 'Analyses' },
  { value: 'insights', label: 'Insights' },
];

const themes = [
  { value: 'all', label: 'Tous les thèmes' },
  { value: 'mauritanie', label: 'Mauritanie' },
  { value: 'afrique', label: 'Afrique' },
  { value: 'energie', label: 'Énergie' },
  { value: 'transition', label: 'Transition Énergétique' },
  { value: 'developpement', label: 'Développement Durable' },
];

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const category = searchParams.get('category') || 'all';
  const theme = searchParams.get('theme') || 'all';

  useEffect(() => {
    fetchArticles();
  }, [category, theme, page]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (category !== 'all') params.category = category;
      if (theme !== 'all') params.theme = theme;
      
      const [articlesRes, countRes] = await Promise.all([
        articlesAPI.getAll(params),
        articlesAPI.getCount(params)
      ]);
      
      setArticles(articlesRes.data);
      setTotalCount(countRes.data.count);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / 9);

  return (
    <div className="min-h-screen" data-testid="blog-page">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-haako-100/40 to-haako-50/20">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-haako-100 text-haako-900 text-sm font-medium mb-6">
              Blog
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Analyses & Insights
            </h1>
            <p className="font-dm-sans text-xl text-slate-600 leading-relaxed">
              Découvrez nos dernières analyses sur l'énergie, le climat et le développement durable en Afrique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-slate-100 sticky top-16 md:top-20 z-40">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={category} onValueChange={(v) => handleFilterChange('category', v)}>
                <SelectTrigger className="w-full sm:w-[200px]" data-testid="filter-category">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={theme} onValueChange={(v) => handleFilterChange('theme', v)}>
                <SelectTrigger className="w-full sm:w-[200px]" data-testid="filter-theme">
                  <SelectValue placeholder="Thème" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-slate-500">
              {totalCount} article{totalCount !== 1 ? 's' : ''} trouvé{totalCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-haako-50/40">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, index) => (
                  <motion.article
                    key={article.article_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link 
                      to={`/blog/${article.slug}`}
                      className="group block h-full bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-haako-200 hover:shadow-lg transition-all"
                      data-testid={`article-card-${article.slug}`}
                    >
                      {article.cover_image && (
                        <div className="aspect-[16/10] overflow-hidden">
                          <img 
                            src={article.cover_image} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="bg-haako-50 text-haako-900 hover:bg-haako-100">
                            {article.category}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {formatDate(article.published_at)}
                          </span>
                        </div>
                        <h2 className="font-manrope text-xl font-semibold text-slate-900 mb-2 group-hover:text-haako-900 transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                        <p className="font-dm-sans text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {article.tags?.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    data-testid="pagination-prev"
                  >
                    Précédent
                  </Button>
                  <span className="px-4 text-sm text-slate-600">
                    Page {page} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    data-testid="pagination-next"
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="font-manrope text-xl font-semibold text-slate-900 mb-2">
                Aucun article trouvé
              </h3>
              <p className="font-dm-sans text-slate-600 mb-6">
                Essayez de modifier vos filtres ou revenez plus tard.
              </p>
              <Button onClick={() => { setSearchParams({}); setPage(1); }}>
                Réinitialiser les filtres
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
