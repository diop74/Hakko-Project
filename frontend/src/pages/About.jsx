import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, Lightbulb, Users, Globe, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const values = [
  {
    icon: Target,
    title: 'Rigueur',
    description: 'Des analyses fondées sur les données et la méthodologie scientifique.'
  },
  {
    icon: Eye,
    title: 'Clarté',
    description: 'Transformer la complexité en insights accessibles et actionnables.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Des approches nouvelles adaptées aux réalités africaines.'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Un travail en partenariat avec les acteurs locaux et internationaux.'
  },
];

const domains = [
  {
    icon: Globe,
    title: 'Accès à l\'énergie',
    description: 'Analyser les obstacles et opportunités pour l\'électrification en Afrique.'
  },
  {
    icon: BarChart3,
    title: 'Transition énergétique',
    description: 'Accompagner le passage vers des mix énergétiques décarbonés.'
  },
  {
    icon: Target,
    title: 'Climat',
    description: 'Évaluer les vulnérabilités et stratégies d\'adaptation climatique.'
  },
  {
    icon: Users,
    title: 'Développement durable',
    description: 'Intégrer les dimensions économiques, sociales et environnementales.'
  },
];

export default function About() {
  return (
    <div className="min-h-screen" data-testid="about-page">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-haako-50/30 to-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-haako-100 text-haako-900 text-sm font-medium mb-6">
              À propos
            </span>
            <h1 className="font-manrope text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              HAAKO : Intelligence stratégique pour une Afrique durable
            </h1>
            <p className="font-dm-sans text-xl text-slate-600 leading-relaxed">
              HAAKO signifie "vert" en peul (pulaar). Ce nom incarne notre engagement 
              pour la durabilité, l'équilibre et la croissance maîtrisée du continent africain.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-haako-900 rounded-2xl p-10 text-white"
            >
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-haako-100" />
              </div>
              <h2 className="font-manrope text-2xl font-bold mb-4">Notre Vision</h2>
              <p className="font-dm-sans text-haako-100 leading-relaxed text-lg">
                Contribuer à une transition énergétique inclusive, crédible et fondée sur les faits, 
                au service du développement durable en Afrique.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-sand rounded-2xl p-10"
            >
              <div className="w-14 h-14 rounded-xl bg-haako-100 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-haako-900" />
              </div>
              <h2 className="font-manrope text-2xl font-bold text-slate-900 mb-4">Notre Mission</h2>
              <p className="font-dm-sans text-slate-600 leading-relaxed text-lg">
                Transformer des données complexes en analyses rigoureuses, structurées et intelligibles, 
                afin d'éclairer la prise de décision des acteurs publics et privés.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="py-24 bg-haako-50/50">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Notre positionnement
            </h2>
            <p className="font-dm-sans text-lg text-slate-600 leading-relaxed">
              HAAKO n'est ni un cabinet de conseil généraliste, ni une simple agence de communication. 
              Nous sommes un <strong className="text-haako-900">outil d'intelligence stratégique et d'aide à la décision</strong>, 
              fondé sur les faits et les données.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 text-center border border-slate-100"
            >
              <div className="text-4xl mb-4">❌</div>
              <p className="font-dm-sans text-slate-600">
                Cabinet de conseil généraliste
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 text-center border border-slate-100"
            >
              <div className="text-4xl mb-4">❌</div>
              <p className="font-dm-sans text-slate-600">
                Agence de communication
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-haako-900 rounded-2xl p-8 text-center"
            >
              <div className="text-4xl mb-4">✅</div>
              <p className="font-dm-sans text-white font-medium">
                Intelligence stratégique & aide à la décision
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gradient-to-b from-white to-haako-50/30">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Nos valeurs
            </h2>
            <p className="font-dm-sans text-lg text-slate-600 max-w-2xl mx-auto">
              Les principes qui guident notre travail au quotidien.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8 hover:bg-haako-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm">
                  <value.icon className="h-6 w-6 text-haako-900" />
                </div>
                <h3 className="font-manrope text-xl font-semibold text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="font-dm-sans text-slate-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Domains */}
      <section className="py-24 bg-haako-50/60">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-manrope text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Champs d'intervention
            </h2>
            <p className="font-dm-sans text-lg text-slate-600 max-w-2xl mx-auto">
              Nos domaines d'expertise pour accompagner la transformation énergétique africaine.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {domains.map((domain, index) => (
              <motion.div
                key={domain.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-slate-100 flex gap-6"
              >
                <div className="w-14 h-14 rounded-xl bg-haako-50 flex items-center justify-center flex-shrink-0">
                  <domain.icon className="h-7 w-7 text-haako-900" />
                </div>
                <div>
                  <h3 className="font-manrope text-xl font-semibold text-slate-900 mb-2">
                    {domain.title}
                  </h3>
                  <p className="font-dm-sans text-slate-600 leading-relaxed">
                    {domain.description}
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
              Travaillons ensemble
            </h2>
            <p className="font-dm-sans text-lg text-haako-100 mb-8">
              Découvrez comment HAAKO peut accompagner vos projets et éclairer vos décisions stratégiques.
            </p>
            <Button asChild className="h-12 px-8 bg-white text-haako-900 hover:bg-haako-50">
              <Link to="/contact" data-testid="about-cta-contact">
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
