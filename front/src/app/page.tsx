'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Vérifier que nous sommes côté client
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => scrollToSection('home')}
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"></div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                LoRaWAN
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('home')}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors relative group"
              >
                Accueil
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('features')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1">
                  Fonctionnalités
                  <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'features' && (
                  <div className="absolute top-full left-0 mt-2 w-56 rounded-lg bg-white shadow-xl border border-gray-100 py-2 animate-scale-in">
                    <button
                      onClick={() => scrollToSection('features')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      Applications
                    </button>
                    <button
                      onClick={() => scrollToSection('services')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      Services
                    </button>
                    <button
                      onClick={() => scrollToSection('stats')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      Statistiques
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => scrollToSection('about')}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                À propos
              </button>
              
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Témoignages
              </button>
              
              <button
                onClick={() => scrollToSection('faq')}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                FAQ
              </button>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => router.push('/auth/request-access')}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Demander un accès
              </button>
              <button
                onClick={() => router.push('/login')}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Connexion
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 animate-fade-in">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                Fonctionnalités
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                À propos
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                Témoignages
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                FAQ
              </button>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => router.push('/auth/request-access')}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  Demander un accès
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="block w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Connexion
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2">
            <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-r from-indigo-200/30 to-purple-200/30 blur-3xl animate-pulse"></div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="animate-fade-in text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
              <span className="block">Gérez votre</span>
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                réseau LoRaWAN
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl animate-fade-in-delay text-lg leading-8 text-gray-600 sm:text-xl">
              Une plateforme moderne et intuitive pour gérer vos applications
              ChirpStack et vos dispositifs IoT avec simplicité et efficacité.
            </p>
            <div className="mt-10 flex animate-fade-in-delay-2 items-center justify-center gap-x-6 flex-wrap gap-y-4">
              <button
                onClick={() => router.push('/login')}
                className="rounded-lg bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:scale-105 active:scale-95 animate-pulse-glow"
              >
                Commencer
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="rounded-lg border-2 border-indigo-600 px-8 py-3 text-base font-semibold text-indigo-600 transition-all duration-200 hover:bg-indigo-50 hover:scale-105 active:scale-95"
              >
                En savoir plus
              </button>
              <button
                onClick={() => router.push('/auth/request-access')}
                className="rounded-lg border-2 border-indigo-600 px-8 py-3 text-base font-semibold text-indigo-600 transition-all duration-200 hover:bg-indigo-50 hover:scale-105 active:scale-95"
              >
                Demander un accès
              </button>
            </div>
            
            {/* Stats Preview */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 max-w-4xl mx-auto animate-fade-in-delay-2">
              {[
                { value: '10K+', label: 'Dispositifs actifs' },
                { value: '500+', label: 'Applications' },
                { value: '99.9%', label: 'Uptime' },
                { value: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-300 hover:scale-110"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${0.6 + index * 0.1}s both`,
                  }}
                >
                  <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Fonctionnalités principales
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tout ce dont vous avez besoin pour gérer efficacement votre
              infrastructure IoT
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: 'Gestion des applications',
                description:
                  'Créez et gérez facilement vos applications ChirpStack avec une interface intuitive. Gérez plusieurs applications simultanément avec un tableau de bord unifié.',
                icon: '📱',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                title: 'Surveillance en temps réel',
                description:
                  'Suivez l\'état de vos dispositifs et recevez des alertes en temps réel. Visualisez les données avec des graphiques interactifs et des métriques détaillées.',
                icon: '📊',
                color: 'from-purple-500 to-pink-500',
              },
              {
                title: 'Sécurité renforcée',
                description:
                  'Protégez vos données avec une authentification sécurisée et des contrôles d\'accès granulaires. Conformité RGPD et chiffrement de bout en bout.',
                icon: '🔒',
                color: 'from-green-500 to-emerald-500',
              },
              {
                title: 'Intégration API',
                description:
                  'Intégrez facilement votre infrastructure existante grâce à nos APIs RESTful complètes. Documentation détaillée et exemples de code inclus.',
                icon: '🔌',
                color: 'from-orange-500 to-red-500',
              },
              {
                title: 'Gestion des dispositifs',
                description:
                  'Configurez, déployez et gérez vos dispositifs IoT en quelques clics. Activation automatique et gestion des clés de sécurité simplifiée.',
                icon: '📡',
                color: 'from-indigo-500 to-purple-500',
              },
              {
                title: 'Analytics avancés',
                description:
                  'Analysez les performances de votre réseau avec des rapports détaillés. Identifiez les tendances et optimisez votre infrastructure.',
                icon: '📈',
                color: 'from-teal-500 to-blue-500',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl bg-white/60 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-300`}></div>
                <div className="relative mb-4 text-5xl animate-float" style={{ animationDelay: `${index * 0.2}s` }}>{feature.icon}</div>
                <h3 className="relative text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="relative mt-4 text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="relative mt-6 flex items-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">En savoir plus</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 sm:py-32 bg-white/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Une plateforme{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  moderne
                </span>{' '}
                pour l'IoT
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Notre plateforme LoRaWAN révolutionne la gestion des réseaux IoT en offrant une solution complète, 
                intuitive et performante. Conçue pour les entreprises de toutes tailles, elle simplifie la complexité 
                de la gestion de dispositifs connectés.
              </p>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Avec une infrastructure cloud native et une architecture scalable, nous garantissons une disponibilité 
                maximale et des performances optimales pour vos applications critiques.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'Interface utilisateur intuitive et moderne',
                  'Infrastructure cloud haute disponibilité',
                  'Support technique dédié 24/7',
                  'Conformité aux standards internationaux',
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-slide-in-right">
              <div className="relative rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 shadow-2xl">
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                      <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-white/20 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-2xl animate-float"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nos services
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Une gamme complète de services pour répondre à tous vos besoins IoT
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {[
              {
                title: 'Hébergement cloud',
                description: 'Infrastructure cloud scalable et sécurisée pour vos applications LoRaWAN',
                features: ['99.9% uptime garanti', 'Scalabilité automatique', 'Sauvegardes quotidiennes'],
                icon: '☁️',
              },
              {
                title: 'Support technique',
                description: 'Équipe d\'experts disponible 24/7 pour vous accompagner',
                features: ['Support par email et chat', 'Documentation complète', 'Formation personnalisée'],
                icon: '🛟',
              },
              {
                title: 'Migration de données',
                description: 'Aide à la migration depuis d\'autres plateformes',
                features: ['Migration sans interruption', 'Validation des données', 'Support dédié'],
                icon: '🔄',
              },
              {
                title: 'Consulting IoT',
                description: 'Conseil stratégique pour optimiser votre infrastructure IoT',
                features: ['Audit de sécurité', 'Optimisation des performances', 'Roadmap personnalisée'],
                icon: '💡',
              },
            ].map((service, index) => (
              <div
                key={service.title}
                className="group rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-gray-100"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 sm:py-32 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Des chiffres qui parlent
            </h2>
            <p className="mt-4 text-lg text-indigo-100">
              Une croissance constante et une satisfaction client élevée
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: '10K+', label: 'Dispositifs connectés', icon: '📡' },
              { value: '500+', label: 'Applications actives', icon: '📱' },
              { value: '99.9%', label: 'Taux de disponibilité', icon: '⚡' },
              { value: '50+', label: 'Pays desservis', icon: '🌍' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110"
                style={{
                  animation: `scaleIn 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-indigo-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ce que disent nos clients
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Des témoignages authentiques de nos utilisateurs satisfaits
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                name: 'Marie Dubois',
                role: 'CTO, TechCorp',
                content: 'Cette plateforme a transformé notre gestion IoT. L\'interface est intuitive et les performances sont exceptionnelles.',
                rating: 5,
                avatar: '👩‍💼',
              },
              {
                name: 'Jean Martin',
                role: 'Directeur IoT, SmartCity',
                content: 'Un outil indispensable pour notre infrastructure. Le support technique est réactif et professionnel.',
                rating: 5,
                avatar: '👨‍💻',
              },
              {
                name: 'Sophie Laurent',
                role: 'Responsable Innovation, GreenTech',
                content: 'La migration a été sans accroc. L\'équipe nous a accompagnés à chaque étape. Je recommande vivement !',
                rating: 5,
                avatar: '👩‍🔬',
              },
            ].map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Questions fréquentes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tout ce que vous devez savoir sur notre plateforme
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                question: 'Comment puis-je démarrer avec la plateforme ?',
                answer: 'C\'est très simple ! Créez un compte, demandez un accès si nécessaire, et commencez à configurer vos applications ChirpStack. Notre équipe vous accompagne à chaque étape.',
              },
              {
                question: 'Quels sont les tarifs ?',
                answer: 'Nous proposons plusieurs formules adaptées à vos besoins, de la version gratuite pour les projets personnels aux solutions entreprise avec support dédié. Contactez-nous pour plus d\'informations.',
              },
              {
                question: 'La plateforme est-elle sécurisée ?',
                answer: 'Absolument. Nous utilisons un chiffrement de bout en bout, une authentification multi-facteurs, et respectons les standards de sécurité les plus stricts. Nous sommes conformes RGPD.',
              },
              {
                question: 'Puis-je migrer depuis une autre plateforme ?',
                answer: 'Oui, nous proposons un service d\'assistance à la migration. Notre équipe vous aide à transférer vos données et configurations sans interruption de service.',
              },
              {
                question: 'Quel support technique est disponible ?',
                answer: 'Nous offrons un support 24/7 par email et chat pour tous nos clients. Les clients entreprise bénéficient d\'un support prioritaire et d\'un contact dédié.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-24 text-center shadow-2xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à commencer ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Rejoignez notre plateforme et commencez à gérer votre réseau
              LoRaWAN dès aujourd'hui.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => router.push('/login')}
                className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-indigo-600 shadow-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Se connecter
              </button>
              <button
                onClick={() => router.push('/auth/request-access')}
                className="rounded-lg border-2 border-white px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:scale-105 active:scale-95"
              >
                Demander un accès
              </button>
            </div>
            <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl">
              <div className="h-[300px] w-[300px] rounded-full bg-white/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                <span className="text-xl font-bold text-gray-900">LoRaWAN</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Plateforme moderne de gestion de réseaux IoT et LoRaWAN.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'github', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                    aria-label={social}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Produit</h3>
              <ul className="space-y-3">
                {['Fonctionnalités', 'Tarifs', 'Documentation', 'API'].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Entreprise</h3>
              <ul className="space-y-3">
                {['À propos', 'Blog', 'Carrières', 'Contact'].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-3">
                {['Centre d\'aide', 'FAQ', 'Support technique', 'Statut'].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">
                © 2024 Application LoRaWAN. Tous droits réservés.
              </p>
              <div className="mt-4 sm:mt-0 flex space-x-6">
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                  Confidentialité
                </a>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                  Conditions
                </a>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

