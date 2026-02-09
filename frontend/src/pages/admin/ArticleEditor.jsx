import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Loader2,
  Image as ImageIcon,
  X
} from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { adminArticlesAPI, authAPI } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

const categories = [
  { value: 'articles', label: 'Articles' },
  { value: 'analyses', label: 'Analyses' },
  { value: 'insights', label: 'Insights' },
];

const themes = [
  { value: 'mauritanie', label: 'Mauritanie' },
  { value: 'afrique', label: 'Afrique' },
  { value: 'energie', label: 'Énergie' },
  { value: 'transition', label: 'Transition Énergétique' },
  { value: 'developpement', label: 'Développement Durable' },
];

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Convert markdown to HTML for storage
function markdownToHtml(markdown) {
  if (!markdown) return '';
  // Basic markdown to HTML conversion
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    // Line breaks and paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  
  // Wrap in paragraph tags if not already wrapped
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>';
  }
  
  return html;
}

// Convert HTML back to markdown for editing
function htmlToMarkdown(html) {
  if (!html) return '';
  return html
    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img src="(.*?)" alt="(.*?)".*?\/>/gi, '![$2]($1)')
    .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p><p>/gi, '\n\n')
    .replace(/<\/?p>/gi, '')
    .replace(/<\/?ul>/gi, '')
    .replace(/<\/?ol>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();
}

export default function AdminArticleEditor() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!articleId;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: 'articles',
    theme: 'energie',
    tags: '',
    status: 'draft'
  });

  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    fetchData();
  }, [articleId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userRes = await authAPI.getMe();
      setUser(userRes.data);

      if (isEditing) {
        const articlesRes = await adminArticlesAPI.getAll();
        const article = articlesRes.data.find(a => a.article_id === articleId);
        if (article) {
          setFormData({
            title: article.title || '',
            slug: article.slug || '',
            excerpt: article.excerpt || '',
            content: article.content || '',
            cover_image: article.cover_image || '',
            category: article.category || 'articles',
            theme: article.theme || 'energie',
            tags: article.tags?.join(', ') || '',
            status: article.status || 'draft'
          });
          // Convert HTML to markdown for the editor
          setMarkdownContent(htmlToMarkdown(article.content || ''));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && !isEditing ? { slug: generateSlug(value) } : {})
    }));
  };

  const handleContentChange = useCallback((value) => {
    setMarkdownContent(value || '');
    // Convert markdown to HTML for storage
    setFormData(prev => ({ ...prev, content: markdownToHtml(value || '') }));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await adminArticlesAPI.uploadImage(file);
      setFormData(prev => ({ ...prev, cover_image: response.data.url }));
      toast.success('Image téléchargée');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (status = formData.status) => {
    if (!formData.title || !formData.slug || !formData.excerpt || !markdownContent) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const data = {
        ...formData,
        content: markdownToHtml(markdownContent),
        status,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (isEditing) {
        await adminArticlesAPI.update(articleId, data);
        toast.success('Article mis à jour');
      } else {
        await adminArticlesAPI.create(data);
        toast.success('Article créé');
        navigate('/admin/articles');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      const message = error.response?.data?.detail || 'Erreur lors de la sauvegarde';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-haako-900" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="p-6 lg:p-8" data-testid="admin-article-editor">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/articles" 
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-manrope text-2xl font-bold text-slate-900">
                {isEditing ? 'Modifier l\'article' : 'Nouvel article'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => handleSubmit('draft')}
              disabled={saving}
              data-testid="save-draft-btn"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Brouillon
            </Button>
            <Button 
              onClick={() => handleSubmit('published')}
              disabled={saving}
              className="bg-haako-900 hover:bg-haako-800"
              data-testid="publish-btn"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              Publier
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Titre de l'article"
                className="text-lg"
                data-testid="article-title"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="url-de-l-article"
                data-testid="article-slug"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Extrait *</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Résumé de l'article (affiché dans les listes)"
                rows={3}
                data-testid="article-excerpt"
              />
            </div>

            {/* Content (Markdown Editor) */}
            <div className="space-y-2">
              <Label>Contenu * (Markdown)</Label>
              <div data-color-mode="light" className="border border-slate-200 rounded-lg overflow-hidden">
                <MDEditor
                  value={markdownContent}
                  onChange={handleContentChange}
                  height={400}
                  preview="live"
                  data-testid="article-content"
                />
              </div>
              <p className="text-xs text-slate-500">
                Utilisez Markdown : # Titre, ## Sous-titre, **gras**, *italique*, [lien](url), ![image](url)
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <Label className="mb-4 block">Image de couverture</Label>
              {formData.cover_image ? (
                <div className="relative">
                  <img 
                    src={formData.cover_image} 
                    alt="Cover" 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, cover_image: '' }))}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-haako-300 transition-colors">
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-500">Cliquer pour ajouter</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    data-testid="cover-image-input"
                  />
                </label>
              )}
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
                >
                  <SelectTrigger data-testid="article-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Thème *</Label>
                <Select 
                  value={formData.theme} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, theme: v }))}
                >
                  <SelectTrigger data-testid="article-theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="énergie, climat, mauritanie"
                  data-testid="article-tags"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
