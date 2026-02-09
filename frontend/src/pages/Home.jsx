import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, FileText, Globe, MessageSquare, Target, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_BG = "https://images.unsplash.com/photo-1722081798151-13bcb3a1c975?crop=entropy&cs=srgb&fm=jpg&q=85";
const MEETING_IMG = "https://images.unsplash.com/photo-1573166364839-1bfe9196c23e?crop=entropy&cs=srgb&fm=jpg&q=85";

const stats = [
  { value: '5+', label: 'Années d\'expertise' },
  { value: '5+', label: 'Études réalisées' },
  { value: '9+', label: 'Pays couverts' },
  { value: '45+', label: 'Décideurs accompagnés' },
];

const services = [
  {
    icon: BarChart3,
    title: 'Analyse de Données',
    description: 'Transformation de données complexes en insights actionnables pour les décideurs.',
    link: '/solutions/recherche-analyse'
  },
  {
    icon: FileText,
    title: 'Recherche Stratégique',
    description: 'Études sectorielles approfondies sur l\'énergie et le développement durable.',
    link: '/solutions/recherche-analyse'
  },
  {
    icon: MessageSquare,
    title: 'Communication',
    description: 'Valorisation des engagements climatiques et des actions RSE.',
    link: '/solutions/communication-strategique'
  },
  {
    icon: Target,
    title: 'Aide à la Décision',
    description: 'Briefs décisionnels et recommandations pour les projets énergétiques.',
    link: '/solutions/recherche-analyse'
  },
];

const themes = [
  { name: 'Accès à l\'énergie', icon: TrendingUp },
  { name: 'Transition énergétique', icon: Globe },
  { name: 'Finance Climat', icon: Target },
  { name: 'Développement durable', icon: Users },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-haako-50/30" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_BG})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-haako-50/95 via-haako-50/90 to-haako-50/60" />
        </div>

        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-haako-100 text-haako-900 text-sm font-medium mb-6 border border-haako-200">
                Intelligence Stratégique
              </span>
              <h1 className="font-manrope text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
                Éclairer les décisions pour une{' '}
                <span className="text-haako-900">Transition energetic Equitable</span>
              </h1>
              <p className="font-dm-sans text-lg md:text-xl text-slate-700 leading-relaxed mb-8 max-w-xl">
                HAAKO transforme les données complexes en analyses rigoureuses sur l'énergie, 
                le climat et le développement durable, au service des décideurs africains.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="h-12 px-8 bg-haako-900 hover:bg-haako-800">
                  <Link to="/solutions" data-testid="hero-cta-solutions">
                    Découvrir nos solutions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 px-8 border-haako-300 bg-white/80 hover:bg-white">
                  <Link to="/about" data-testid="hero-cta-about">
                    En savoir plus
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-haako-100/50 rounded-3xl -rotate-3" />
                <img 
                  src={MEETING_IMG} 
                  alt="Team meeting" 
                  className="relative rounded-2xl shadow-lg w-full aspect-[4/3] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-haako-900">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-manrope text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-haako-200 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-haako-50/50">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Nos domaines d'expertise
            </h2>
            <p className="font-dm-sans text-lg text-slate-600 max-w-2xl mx-auto">
              Une approche complète pour accompagner les acteurs du développement durable en Afrique.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link 
                  to={service.link}
                  className="group block h-full bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-haako-200 transition-all"
                  data-testid={`service-card-${index}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-haako-50 flex items-center justify-center mb-6 group-hover:bg-haako-100 transition-colors">
                    <service.icon className="h-6 w-6 text-haako-900" />
                  </div>
                  <h3 className="font-manrope text-xl font-semibold text-slate-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="font-dm-sans text-slate-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className="py-24 bg-gradient-to-b from-white to-haako-50/30">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-haako-50 text-haako-900 text-sm font-medium mb-6">
                Thématiques
              </span>
              <h2 className="font-manrope text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Au cœur des enjeux energetiques
              </h2>
              <p className="font-dm-sans text-lg text-slate-600 leading-relaxed mb-8">
                HAAKO se concentre sur les défis majeurs du continent africain, avec un ancrage 
                particulier en Mauritanie. Notre expertise couvre l'ensemble du spectre énergétique 
                et environnemental.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {themes.map((theme, index) => (
                  <motion.div
                    key={theme.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-50"
                  >
                    <theme.icon className="h-5 w-5 text-haako-900" />
                    <span className="font-dm-sans text-sm font-medium text-slate-700">
                      {theme.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-haako-100/50 to-transparent rounded-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1660283423633-21bb178b2f2b?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="African city" 
                className="relative rounded-2xl shadow-lg w-full aspect-[4/3] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-haako-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1764263996480-53a167365ee7?crop=entropy&cs=srgb&fm=jpg&q=85')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à transformer vos données en décisions ?
            </h2>
            <p className="font-dm-sans text-lg text-haako-100 mb-8">
              Contactez-nous pour discuter de vos besoins en analyse stratégique 
              et découvrir comment HAAKO peut vous accompagner.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="h-12 px-8 bg-white text-haako-900 hover:bg-haako-50">
                <Link to="/contact" data-testid="cta-contact">
                  Nous contacter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8 border-haako-300 text-white hover:bg-haako-800">
                <Link to="/blog" data-testid="cta-blog">
                  Lire nos analyses
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
