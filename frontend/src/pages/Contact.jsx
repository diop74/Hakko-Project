import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle } from 'lucide-react';
import { contactAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await contactAPI.send(formData);
      setSuccess(true);
      toast.success('Message envoyé avec succès !');
      setFormData({
        name: '',
        email: '',
        organization: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" data-testid="contact-page">
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
              Contact
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Parlons de votre projet
            </h1>
            <p className="font-dm-sans text-xl text-slate-600 leading-relaxed">
              Une question ? Un projet d'analyse ? Contactez-nous pour discuter de vos besoins 
              et découvrir comment HAAKO peut vous accompagner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-haako-50/30">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <h2 className="font-manrope text-2xl font-bold text-slate-900 mb-8">
                Nos coordonnées
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-haako-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-haako-900" />
                  </div>
                  <div>
                    <h3 className="font-manrope font-semibold text-slate-900 mb-1">Email</h3>
                    <a 
                      href="mailto:abdoulayediop9@hotmail.com" 
                      className="font-dm-sans text-slate-600 hover:text-haako-900 transition-colors"
                    >
                      abdoulayediop9@hotmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-haako-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-haako-900" />
                  </div>
                  <div>
                    <h3 className="font-manrope font-semibold text-slate-900 mb-1">Adresse</h3>
                    <p className="font-dm-sans text-slate-600">
                      Nouakchott, Mauritanie
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-haako-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-haako-900" />
                  </div>
                  <div>
                    <h3 className="font-manrope font-semibold text-slate-900 mb-1">Téléphone</h3>
                    <a 
                      href="tel:+22249146332"
                      className="font-dm-sans text-slate-600 hover:text-haako-900 transition-colors"
                    >
                      +222 49 14 63 32
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-haako-50 rounded-2xl">
                <h3 className="font-manrope font-semibold text-slate-900 mb-3">
                  Horaires de disponibilité
                </h3>
                <p className="font-dm-sans text-slate-600 text-sm leading-relaxed">
                  Du lundi au vendredi<br />
                  9h00 - 18h00 (GMT)
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-3"
            >
              {success ? (
                <div className="bg-haako-50 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-haako-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-haako-900" />
                  </div>
                  <h3 className="font-manrope text-2xl font-bold text-slate-900 mb-4">
                    Message envoyé !
                  </h3>
                  <p className="font-dm-sans text-slate-600 mb-8">
                    Merci pour votre message. Nous vous répondrons dans les meilleurs délais.
                  </p>
                  <Button onClick={() => setSuccess(false)}>
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Votre nom"
                        data-testid="contact-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="votre@email.com"
                        data-testid="contact-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organisation</Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Nom de votre organisation"
                      data-testid="contact-organization"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Objet de votre message"
                      data-testid="contact-subject"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Décrivez votre projet ou votre demande..."
                      className="min-h-[180px]"
                      data-testid="contact-message"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full md:w-auto h-12 px-8 bg-haako-900 hover:bg-haako-800"
                    data-testid="contact-submit"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
