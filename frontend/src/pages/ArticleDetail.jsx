import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Eye, Tag, Share2, Linkedin, Twitter, Download, Loader2 } from 'lucide-react';
import { articlesAPI } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';
import html2pdf from 'html2pdf.js';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_sustainable-insights/artifacts/y08gbl8u_20251015_1623_Haako%20Logo%20Design_simple_compose_01k7mavmrke71vr0nt45t3fban.png";

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
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const contentRef = useRef(null);

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

  const handleDownloadPdf = async () => {
    if (!article) return;
    setDownloadingPdf(true);
    
    try {
      // Create a styled container for PDF
      const pdfContent = document.createElement('div');
      pdfContent.innerHTML = `
        <div style="font-family: 'DM Sans', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1B5E20;">
            <img src="${LOGO_URL}" alt="HAAKO" style="height: 50px; margin-bottom: 15px;" />
            <p style="color: #666; font-size: 12px; margin: 0;">Intelligence Stratégique pour une Afrique Durable</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <span style="background: #E8F5E9; color: #1B5E20; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 500;">
              ${article.category}
            </span>
            <span style="background: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 4px; font-size: 12px; margin-left: 8px;">
              ${article.theme}
            </span>
          </div>
          
          <h1 style="font-family: 'Manrope', Arial, sans-serif; font-size: 28px; color: #1a1c1a; margin-bottom: 15px; line-height: 1.3;">
            ${article.title}
          </h1>
          
          <p style="font-size: 16px; color: #64748b; margin-bottom: 20px; font-style: italic;">
            ${article.excerpt}
          </p>
          
          <div style="display: flex; gap: 20px; color: #64748b; font-size: 13px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
            <span>Par ${article.author_name}</span>
            <span>${formatDate(article.published_at)}</span>
          </div>
          
          <div style="font-size: 14px; line-height: 1.8; color: #374151;">
            ${article.content}
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #1B5E20; text-align: center;">
            <p style="color: #666; font-size: 11px; margin: 0;">
              © ${new Date().getFullYear()} HAAKO - www.haako.africa<br/>
              Ce document est la propriété de HAAKO. Toute reproduction est soumise à autorisation.
            </p>
          </div>
        </div>
      `;
      
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `HAAKO-${article.slug}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(pdfContent).save();
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setDownloadingPdf(false);
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
      <section className="pt-32 pb-8 bg-gradient-to-b from-haako-100/40 to-haako-50/20">
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
            
            <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-slate-500 pb-8 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-6">
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
              <Button 
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="bg-haako-900 hover:bg-haako-800"
                data-testid="download-pdf-btn"
              >
                {downloadingPdf ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </>
                )}
              </Button>
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
