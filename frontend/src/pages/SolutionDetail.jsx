import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, BarChart3, FileText, LineChart, PieChart, MessageSquare, Megaphone, Globe, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const solutionsData = {
  'recherche-analyse': {
    title: 'Recherche & Analyse Stratégique',
    subtitle: 'Transformer les données complexes en intelligence décisionnelle',
    description: `HAAKO offre des services de recherche et d'analyse stratégique couvrant l'ensemble 
    des enjeux énergétiques et environnementaux africains. Notre approche combine rigueur méthodologique, 
    expertise sectorielle et compréhension fine des contextes locaux.`,
    icon: BarChart3,
    image: 'https://images.unsplash.com/photo-1764263996480-53a167365ee7?crop=entropy&cs=srgb&fm=jpg&q=85',
    domains: [
      {
        title: 'Accès à l\'énergie',
        description: 'Analyse des défis d\'électrification, cartographie des besoins, évaluation des solutions.'
      },
      {
        title: 'Transition énergétique',
        description: 'Études sur les mix énergétiques, potentiel renouvelable, scénarios de décarbonation.'
      },
      {
        title: 'Climat et développement durable',
        description: 'Vulnérabilités climatiques, stratégies d\'adaptation, objectifs ODD.'
      },
      {
        title: 'Gouvernance des ressources naturelles',
        description: 'Cadres réglementaires, transparence, gestion des revenus extractifs.'
      }
    ],
    deliverables: [
      { icon: FileText, name: 'Notes d\'analyse', description: 'Synthèses concises (5-10 pages) sur des enjeux spécifiques' },
      { icon: LineChart, name: 'Études sectorielles', description: 'Analyses approfondies avec données et recommandations' },
      { icon: Award, name: 'Briefs décisionnels', description: 'Documents courts pour la prise de décision rapide' },
      { icon: PieChart, name: 'Visualisations de données', description: 'Infographies, tableaux de bord, cartographies' }
    ],
    methodology: [
      'Collecte et analyse de données primaires et secondaires',
      'Entretiens avec les parties prenantes clés',
      'Benchmarking et analyse comparative',
      'Validation par des experts sectoriels',
      'Restitution et accompagnement'
    ]
  },
  'communication-strategique': {
    title: 'Communication Stratégique',
    subtitle: 'Valoriser vos engagements auprès des parties prenantes',
    description: `HAAKO accompagne les organisations dans leur communication autour des projets énergétiques 
    et des engagements de développement durable. Nous transformons vos actions concrètes en récits 
    crédibles et impactants.`,
    icon: MessageSquare,
    image: 'https://images.unsplash.com/photo-1573166364839-1bfe9196c23e?crop=entropy&cs=srgb&fm=jpg&q=85',
    domains: [
      {
        title: 'Communication de projets énergétiques',
        description: 'Valorisation des impacts positifs des projets d\'infrastructures énergétiques.'
      },
      {
        title: 'Actions sociales et environnementales',
        description: 'Mise en valeur des engagements RSE et des retombées locales.'
      },
      {
        title: 'Engagements climatiques',
        description: 'Communication sur les trajectoires de réduction d\'émissions et les stratégies Net Zero.'
      },
      {
        title: 'Contenus institutionnels',
        description: 'Rapports annuels, communiqués de presse, publications sectorielles.'
      }
    ],
    deliverables: [
      { icon: Megaphone, name: 'Communiqués & articles', description: 'Contenus éditoriaux pour différents supports' },
      { icon: Globe, name: 'Rapports institutionnels', description: 'Documents de référence pour les parties prenantes' },
      { icon: FileText, name: 'Présentations', description: 'Supports visuels pour événements et réunions' },
      { icon: Award, name: 'Storytelling de projets', description: 'Récits engageants autour de vos réalisations' }
    ],
    methodology: [
      'Audit de communication et analyse des parties prenantes',
      'Définition des messages clés et de la stratégie éditoriale',
      'Production de contenus adaptés aux différents canaux',
      'Accompagnement dans la diffusion et le suivi d\'impact',
      'Veille et gestion de la réputation'
    ]
  }
};

export default function SolutionDetail() {
  const { slug } = useParams();
  const solution = solutionsData[slug];

  if (!solution) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="font-manrope text-2xl font-bold text-slate-900 mb-4">Solution non trouvée</h1>
          <Button asChild>
            <Link to="/solutions">Voir toutes les solutions</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="solution-detail-page">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-haako-50/30 to-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <Link 
            to="/solutions" 
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-haako-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Toutes les solutions
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-haako-900 flex items-center justify-center mb-6">
                <solution.icon className="h-7 w-7 text-white" />
              </div>
              <h1 className="font-manrope text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
                {solution.title}
              </h1>
              <p className="font-dm-sans text-xl text-haako-800 mb-6">
                {solution.subtitle}
              </p>
              <p className="font-dm-sans text-lg text-slate-600 leading-relaxed">
                {solution.description}
              </p>
            </div>
            <div>
              <div className="relative">
                <div className="absolute -inset-4 bg-haako-100/50 rounded-3xl -rotate-2" />
                <img 
                  src={solution.image} 
                  alt={solution.title}
                  className="relative rounded-2xl shadow-lg w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Domains */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Domaines couverts
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {solution.domains.map((domain, index) => (
              <motion.div
                key={domain.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-sand rounded-2xl p-8"
              >
                <h3 className="font-manrope text-xl font-semibold text-slate-900 mb-3">
                  {domain.title}
                </h3>
                <p className="font-dm-sans text-slate-600 leading-relaxed">
                  {domain.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-24 bg-sand">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Livrables
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solution.deliverables.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-100"
              >
                <div className="w-12 h-12 rounded-xl bg-haako-50 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-haako-900" />
                </div>
                <h3 className="font-manrope text-lg font-semibold text-slate-900 mb-2">
                  {item.name}
                </h3>
                <p className="font-dm-sans text-sm text-slate-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-manrope text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Notre méthodologie
              </h2>
              <p className="font-dm-sans text-lg text-slate-600 leading-relaxed mb-8">
                Une approche structurée et rigoureuse pour garantir la qualité et la pertinence de nos travaux.
              </p>
              <ul className="space-y-4">
                {solution.methodology.map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-haako-900 mt-0.5 flex-shrink-0" />
                    <span className="font-dm-sans text-slate-700">{step}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-haako-900 rounded-2xl p-10 text-white"
            >
              <h3 className="font-manrope text-2xl font-bold mb-4">
                Besoin d'une analyse personnalisée ?
              </h3>
              <p className="font-dm-sans text-haako-100 leading-relaxed mb-8">
                Contactez-nous pour discuter de vos besoins spécifiques et découvrir comment nous pouvons vous accompagner.
              </p>
              <Button asChild className="bg-white text-haako-900 hover:bg-haako-50">
                <Link to="/contact">
                  Nous contacter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
