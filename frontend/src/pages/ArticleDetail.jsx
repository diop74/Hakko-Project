import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Eye, Tag, Share2, Linkedin, Twitter } from 'lucide-react';
import { articlesAPI } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await articlesAPI.getBySlug(slug);
      setArticle(response.data);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Article non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-10 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/2" />
            <div className="h-64 bg-slate-200 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-manrope text-2xl font-bold text-slate-900 mb-4">
            {error || 'Article non trouvé'}
          </h1>
          <Button asChild>
            <Link to="/blog">Retour au blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="article-detail-page">
      {/* Header */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-haako-50/30 to-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-haako-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au blog
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-haako-100 text-haako-900 hover:bg-haako-200">
                {article.category}
              </Badge>
              <Badge variant="outline">{article.theme}</Badge>
            </div>
            
            <h1 className="font-manrope text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
              {article.title}
            </h1>
            
            <p className="font-dm-sans text-xl text-slate-600 leading-relaxed mb-8">
              {article.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {article.author_name}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(article.published_at)}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {article.views} vue{article.views !== 1 ? 's' : ''}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover Image */}
      {article.cover_image && (
        <section className="pb-12">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src={article.cover_image} 
                alt={article.title}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <article 
              className="article-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
            />
          </motion.div>
        </div>
      </section>

      {/* Tags & Share */}
      <section className="pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-8 border-t border-slate-100">
            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-slate-400" />
                {article.tags.map((tag) => (
                  <Link 
                    key={tag} 
                    to={`/blog?tag=${tag}`}
                    className="text-sm text-slate-600 bg-slate-100 hover:bg-haako-50 hover:text-haako-900 px-3 py-1 rounded-full transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            
            {/* Share */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Partager :</span>
              <button 
                onClick={() => handleShare('linkedin')}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Partager sur LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-slate-600" />
              </button>
              <button 
                onClick={() => handleShare('twitter')}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Partager sur Twitter"
              >
                <Twitter className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-haako-900">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="font-manrope text-2xl md:text-3xl font-bold text-white mb-4">
            Vous souhaitez approfondir ce sujet ?
          </h2>
          <p className="font-dm-sans text-haako-100 mb-8">
            Contactez-nous pour discuter de vos besoins en analyse stratégique.
          </p>
          <Button asChild className="bg-white text-haako-900 hover:bg-haako-50">
            <Link to="/contact">
              Nous contacter
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
