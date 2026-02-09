import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, FileText, LineChart, PieChart, MessageSquare, Megaphone, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const solutions = [
  {
    slug: 'recherche-analyse',
    title: 'Recherche & Analyse Stratégique',
    description: 'Transformer les données complexes en intelligence décisionnelle.',
    icon: BarChart3,
    color: 'bg-haako-900',
    features: [
      'Notes d\'analyse',
      'Études sectorielles',
      'Briefs décisionnels',
      'Visualisations de données',
    ],
    image: 'https://images.unsplash.com/photo-1764263996480-53a167365ee7?crop=entropy&cs=srgb&fm=jpg&q=85'
  },
  {
    slug: 'communication-strategique',
    title: 'Communication Stratégique',
    description: 'Valoriser vos engagements et projets auprès des parties prenantes.',
    icon: MessageSquare,
    color: 'bg-slate-900',
    features: [
      'Communication de projets',
      'Valorisation RSE',
      'Engagements climatiques',
      'Contenus institutionnels',
    ],
    image: 'https://images.unsplash.com/photo-1573166364839-1bfe9196c23e?crop=entropy&cs=srgb&fm=jpg&q=85'
  },
];

const deliverables = [
  { icon: FileText, name: 'Notes d\'analyse', description: 'Synthèses concises sur des enjeux clés' },
  { icon: LineChart, name: 'Études sectorielles', description: 'Analyses approfondies par secteur' },
  { icon: PieChart, name: 'Visualisations', description: 'Infographies et tableaux de bord' },
  { icon: Award, name: 'Briefs décisionnels', description: 'Recommandations actionnables' },
  { icon: Megaphone, name: 'Communiqués', description: 'Contenus de communication' },
  { icon: Globe, name: 'Rapports', description: 'Documents stratégiques complets' },
];

export default function Solutions() {
  return (
    <div className="min-h-screen" data-testid="solutions-page">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-haako-100/40 to-haako-50/20">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-haako-100 text-haako-900 text-sm font-medium mb-6">
              Solutions
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Des solutions sur mesure pour vos enjeux stratégiques
            </h1>
            <p className="font-dm-sans text-xl text-slate-600 leading-relaxed">
              HAAKO accompagne les acteurs du développement durable avec deux offres complémentaires : 
              la recherche analytique et la communication stratégique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Cards */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="space-y-16">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`w-14 h-14 rounded-xl ${solution.color} flex items-center justify-center mb-6`}>
                    <solution.icon className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="font-manrope text-3xl font-bold text-slate-900 mb-4">
                    {solution.title}
                  </h2>
                  <p className="font-dm-sans text-lg text-slate-600 leading-relaxed mb-6">
                    {solution.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-haako-900" />
                        <span className="font-dm-sans text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="bg-haako-900 hover:bg-haako-800">
                    <Link to={`/solutions/${solution.slug}`} data-testid={`solution-cta-${solution.slug}`}>
                      En savoir plus
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative">
                    <div className={`absolute -inset-4 ${index % 2 === 0 ? 'bg-haako-100/50' : 'bg-slate-100'} rounded-3xl -rotate-2`} />
                    <img 
                      src={solution.image} 
                      alt={solution.title}
                      className="relative rounded-2xl shadow-lg w-full aspect-[4/3] object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-24 bg-haako-50/50">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Nos livrables
            </h2>
            <p className="font-dm-sans text-lg text-slate-600 max-w-2xl mx-auto">
              Des formats variés adaptés à vos besoins de communication et de décision.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliverables.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-haako-50 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6 text-haako-900" />
                </div>
                <div>
                  <h3 className="font-manrope text-lg font-semibold text-slate-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="font-dm-sans text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-haako-900">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-white mb-6">
              Un projet ? Une question ?
            </h2>
            <p className="font-dm-sans text-lg text-haako-100 mb-8">
              Contactez-nous pour discuter de vos besoins et découvrir comment nous pouvons vous accompagner.
            </p>
            <Button asChild className="h-12 px-8 bg-white text-haako-900 hover:bg-haako-50">
              <Link to="/contact" data-testid="solutions-cta-contact">
                Nous contacter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
