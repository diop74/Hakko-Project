import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Mail, 
  Building, 
  Calendar,
  Check,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import { adminMessagesAPI, authAPI } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [messagesRes, userRes] = await Promise.all([
        adminMessagesAPI.getAll(),
        authAPI.getMe()
      ]);
      setMessages(messagesRes.data);
      setUser(userRes.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (messageId) => {
    try {
      await adminMessagesAPI.markRead(messageId);
      setMessages(prev => prev.map(m => 
        m.message_id === messageId ? { ...m, read: true } : m
      ));
      toast.success('Message marqué comme lu');
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Erreur');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await adminMessagesAPI.delete(deleteId);
      setMessages(prev => prev.filter(m => m.message_id !== deleteId));
      toast.success('Message supprimé');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteId(null);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      handleMarkRead(message.message_id);
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <AdminLayout user={user}>
      <div className="p-6 lg:p-8" data-testid="admin-messages">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-manrope text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
            Messages
          </h1>
          <p className="font-dm-sans text-slate-600">
            {unreadCount > 0 ? `${unreadCount} message(s) non lu(s)` : 'Tous les messages sont lus'}
          </p>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : messages.length > 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {messages.map((message) => (
              <motion.div
                key={message.message_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-6 hover:bg-slate-50 transition-colors cursor-pointer ${
                  !message.read ? 'bg-haako-50/30' : ''
                }`}
                onClick={() => handleViewMessage(message)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-dm-sans font-semibold text-slate-900 truncate">
                        {message.name}
                      </h3>
                      {!message.read && (
                        <Badge className="bg-haako-100 text-haako-900">Nouveau</Badge>
                      )}
                    </div>
                    <p className="font-dm-sans font-medium text-slate-700 mb-1">
                      {message.subject}
                    </p>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                      {message.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {message.email}
                      </span>
                      {message.organization && (
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {message.organization}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewMessage(message)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!message.read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMarkRead(message.message_id)}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDeleteId(message.message_id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-xl border border-slate-200"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-manrope text-xl font-semibold text-slate-900 mb-2">
              Aucun message
            </h3>
            <p className="font-dm-sans text-slate-600">
              Vous n'avez pas encore reçu de messages.
            </p>
          </motion.div>
        )}

        {/* Message Detail Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-manrope text-xl">
                {selectedMessage?.subject}
              </DialogTitle>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">De :</span>
                    {selectedMessage.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a 
                      href={`mailto:${selectedMessage.email}`}
                      className="text-haako-900 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.organization && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {selectedMessage.organization}
                    </div>
                  )}
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-slate-700">
                    {selectedMessage.message}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm text-slate-500">
                    Reçu le {formatDate(selectedMessage.created_at)}
                  </span>
                  <Button asChild variant="outline">
                    <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Répondre
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer ce message ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le message sera définitivement supprimé.
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
