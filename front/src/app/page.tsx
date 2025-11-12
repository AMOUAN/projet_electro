'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setScrollY(window.scrollY);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-soft border-b border-gray-100/50'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => scrollToSection('home')}
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 transition-all duration-500 group-hover:scale-110 group-hover:shadow-soft flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LoRaWAN Platform
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('home')}
                className="text-sm font-medium text-gray-600 hover:text-blue-500 transition-all duration-300 relative group"
              >
                Accueil
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('features')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-sm font-medium text-gray-600 hover:text-blue-500 transition-all duration-300 flex items-center gap-1 group">
                  Fonctionnalités
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'features' && (
                  <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl shadow-soft border border-gray-100/50 py-3 animate-fade-in">
                    <button
                      onClick={() => scrollToSection('features')}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 transition-all duration-300 rounded-lg"
                    >
                      Applications
                    </button>
                    <button
                      onClick={() => scrollToSection('services')}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 transition-all duration-300 rounded-lg"
                    >
                      Services
                    </button>
                    <button
                      onClick={() => scrollToSection('stats')}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 transition-all duration-300 rounded-lg"
                    >
                      Statistiques
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => scrollToSection('about')}
                className="text-sm font-medium text-gray-600 hover:text-blue-500 transition-all duration-300 relative group"
              >
                À propos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-sm font-medium text-gray-600 hover:text-blue-500 transition-all duration-300 relative group"
              >
                Témoignages
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              <button
                onClick={() => scrollToSection('faq')}
                className="text-sm font-medium text-gray-600 hover:text-blue-500 transition-all duration-300 relative group"
              >
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => router.push('/auth/request-access')}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 transition-all duration-300"
              >
                Demander un accès
              </button>
              <button
                onClick={() => router.push('/login')}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-soft transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Connexion
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-blue-50/50 transition-all duration-300"
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
            <div className="md:hidden py-4 space-y-2 animate-fade-in bg-white/95 backdrop-blur-xl rounded-2xl mt-2">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-all duration-300"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-all duration-300"
              >
                Fonctionnalités
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-all duration-300"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-all duration-300"
              >
                À propos
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-all duration-300"
              >
                Témoignages
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-all duration-300"
              >
                FAQ
              </button>
              <div className="pt-4 border-t border-gray-100/50 space-y-2">
                <button
                  onClick={() => router.push('/auth/request-access')}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-all duration-300"
                >
                  Demander un accès
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="block w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl hover:shadow-md transition-all duration-300"
                >
                  Connexion
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20">
        <div className="absolute inset-0 -z-10">
          <div 
            className="absolute left-1/2 top-0 -translate-x-1/2 transition-transform duration-1000 ease-out"
            style={{ 
              transform: `translate(-50%, ${scrollY * 0.1}px)`,
            }}
          >
            <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-r from-blue-100/40 to-indigo-100/40 blur-3xl"></div>
          </div>
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-50/30 to-indigo-50/30 blur-2xl transition-transform duration-700 ease-out"
            style={{ 
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            }}
          ></div>
          <div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-50/30 to-blue-50/30 blur-2xl transition-transform duration-700 ease-out"
            style={{ 
              transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
            }}
          ></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="animate-fade-in text-5xl font-light tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
              <span className="block font-light">Gérez votre</span>
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold mt-2">
                réseau LoRaWAN
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-3xl animate-fade-in-delay text-lg leading-relaxed text-gray-600 sm:text-xl">
              La solution professionnelle pour gérer, surveiller et optimiser vos applications
              ChirpStack et dispositifs IoT. Interface intuitive, sécurité renforcée et performances exceptionnelles.
            </p>
            <div className="mt-12 flex animate-fade-in-delay-2 items-center justify-center gap-x-6 flex-wrap gap-y-4">
              <button
                onClick={() => router.push('/login')}
                className="group relative rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-4 text-base font-medium text-white shadow-soft transition-all duration-500 hover:shadow-lg hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">Commencer</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="group relative rounded-xl border-2 border-blue-500 px-8 py-4 text-base font-medium text-blue-500 transition-all duration-500 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">En savoir plus</span>
              </button>
            </div>
            
            {/* Stats Preview */}
            <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4 max-w-4xl mx-auto animate-fade-in-delay-2">
              {[
                { value: '10K+', label: 'Dispositifs actifs' },
                { value: '500+', label: 'Applications' },
                { value: '99.9%', label: 'Uptime' },
                { value: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="group text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100/50 hover:border-blue-200/50 hover:shadow-soft transition-all duration-500 cursor-pointer hover:scale-105"
                  style={{
                    animation: `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.6 + index * 0.15}s both`,
                  }}
                >
                  <div className="text-3xl font-light text-blue-600 group-hover:scale-110 transition-transform duration-500">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-2 group-hover:text-gray-800 transition-colors duration-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-gradient-to-b from-white to-blue-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll opacity-0">
            <h2 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl">
              Fonctionnalités{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
                principales
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Tout ce dont vous avez besoin pour gérer efficacement votre
              infrastructure IoT
            </p>
          </div>
          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: 'Gestion des applications',
                description:
                  'Créez et gérez facilement vos applications ChirpStack avec une interface intuitive. Gérez plusieurs applications simultanément avec un tableau de bord unifié.',
                icon: '📱',
                color: 'from-blue-50 to-indigo-50',
              },
              {
                title: 'Surveillance en temps réel',
                description:
                  'Suivez l\'état de vos dispositifs et recevez des alertes en temps réel. Visualisez les données avec des graphiques interactifs et des métriques détaillées.',
                icon: '📊',
                color: 'from-cyan-50 to-blue-50',
              },
              {
                title: 'Sécurité renforcée',
                description:
                  'Protégez vos données avec une authentification sécurisée et des contrôles d\'accès granulaires. Conformité RGPD et chiffrement de bout en bout.',
                icon: '🔒',
                color: 'from-indigo-50 to-purple-50',
              },
              {
                title: 'Intégration API',
                description:
                  'Intégrez facilement votre infrastructure existante grâce à nos APIs RESTful complètes. Documentation détaillée et exemples de code inclus.',
                icon: '🔌',
                color: 'from-teal-50 to-green-50',
              },
              {
                title: 'Gestion des dispositifs',
                description:
                  'Configurez, déployez et gérez vos dispositifs IoT en quelques clics. Activation automatique et gestion des clés de sécurité simplifiée.',
                icon: '📡',
                color: 'from-orange-50 to-red-50',
              },
              {
                title: 'Analytics avancés',
                description:
                  'Analysez les performances de votre réseau avec des rapports détaillés. Identifiez les tendances et optimisez votre infrastructure.',
                icon: '📈',
                color: 'from-pink-50 to-rose-50',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl bg-white/60 backdrop-blur-sm p-8 shadow-soft border border-gray-100/50 transition-all duration-500 hover:shadow-lg hover:border-blue-200/50 hover:scale-105 animate-on-scroll opacity-0"
                style={{
                  animation: `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s both`,
                }}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative mb-6 text-5xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">{feature.icon}</div>
                <h3 className="relative text-xl font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-500">
                  {feature.title}
                </h3>
                <p className="relative mt-4 text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-500">{feature.description}</p>
                <div className="relative mt-6 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-sm font-medium">En savoir plus</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
            <div className="animate-slide-in-left animate-on-scroll opacity-0">
              <h2 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl">
                Une plateforme{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
                  moderne
                </span>{' '}
                pour l'IoT
              </h2>
              <p className="mt-8 text-lg leading-relaxed text-gray-500">
                Notre plateforme LoRaWAN révolutionne la gestion des réseaux IoT en offrant une solution complète, 
                intuitive et performante. Conçue pour les entreprises de toutes tailles, elle simplifie la complexité 
                de la gestion de dispositifs connectés.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-gray-500">
                Avec une infrastructure cloud native et une architecture scalable, nous garantissons une disponibilité 
                maximale et des performances optimales pour vos applications critiques.
              </p>
              <div className="mt-10 space-y-4">
                {[
                  'Interface utilisateur intuitive et moderne',
                  'Infrastructure cloud haute disponibilité',
                  'Support technique dédié 24/7',
                  'Conformité aux standards internationaux',
                ].map((item, index) => (
                  <div key={index} className="group flex items-start space-x-3 transform transition-all duration-500 hover:translate-x-2">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-slide-in-right animate-on-scroll opacity-0">
              <div className="relative rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-500 p-8 shadow-soft transform transition-all duration-700 hover:scale-105">
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform transition-all duration-500 hover:bg-white/20 hover:scale-105" style={{ animationDelay: `${i * 0.3}s` }}>
                      <div className="h-4 bg-white/30 rounded-xl w-3/4 mb-2 transition-all duration-300 group-hover:bg-white/40"></div>
                      <div className="h-4 bg-white/20 rounded-xl w-1/2 transition-all duration-300 group-hover:bg-white/30"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-float"></div>
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 sm:py-32 bg-gradient-to-b from-white to-blue-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll opacity-0">
            <h2 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl">
              Nos{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
                services
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-500">
              Une gamme complète de services pour répondre à tous vos besoins IoT
            </p>
          </div>
          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
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
                className="group rounded-3xl bg-white/60 backdrop-blur-sm p-8 shadow-soft transition-all duration-500 hover:shadow-lg hover:scale-105 border border-gray-100/50 hover:border-blue-200/50 animate-on-scroll opacity-0"
                style={{
                  animation: `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s both`,
                }}
              >
                <div className="text-5xl mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">{service.icon}</div>
                <h3 className="text-2xl font-medium text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-500">{service.title}</h3>
                <p className="text-gray-500 mb-6 text-sm group-hover:text-gray-600 transition-colors duration-500">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="group/item flex items-center text-sm text-gray-600 transform transition-all duration-500 hover:translate-x-2">
                      <svg className="w-5 h-5 text-blue-500 mr-3 group-hover/item:scale-125 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="group-hover/item:text-gray-800 transition-colors duration-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 sm:py-32 bg-gradient-to-r from-blue-500 to-indigo-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16 animate-on-scroll opacity-0">
            <h2 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
              Des chiffres qui{' '}
              <span className="font-semibold">parlent</span>
            </h2>
            <p className="mt-6 text-lg text-blue-100">
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
                className="group text-center p-8 rounded-3xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 hover:scale-110 animate-on-scroll opacity-0"
                style={{
                  animation: `scaleIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s both`,
                }}
              >
                <div className="text-5xl mb-4 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">{stat.icon}</div>
                <div className="text-4xl font-light text-white mb-3 group-hover:scale-110 transition-transform duration-500">{stat.value}</div>
                <div className="text-sm text-blue-100 group-hover:text-white transition-colors duration-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 sm:py-32 bg-gradient-to-b from-white to-blue-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16 animate-on-scroll opacity-0">
            <h2 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl">
              Ce que disent nos{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
                clients
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-500">
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
                className="group rounded-3xl bg-white/60 backdrop-blur-sm p-8 shadow-soft transition-all duration-500 hover:shadow-lg hover:scale-105 border border-gray-100/50 hover:border-blue-200/50 animate-on-scroll opacity-0"
                style={{
                  animation: `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s both`,
                }}
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 transform transition-all duration-300 hover:scale-125" style={{ transitionDelay: `${i * 0.1}s` }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-500 mb-6 italic text-sm leading-relaxed group-hover:text-gray-600 transition-colors duration-500">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="text-4xl mr-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">{testimonial.avatar}</div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-500">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16 animate-on-scroll opacity-0">
            <h2 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl">
              Questions{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
                fréquentes
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-500">
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
                className="group rounded-3xl bg-white/60 backdrop-blur-sm p-8 shadow-soft transition-all duration-500 hover:shadow-lg border border-gray-100/50 hover:border-blue-200/50 animate-on-scroll opacity-0"
                style={{
                  animation: `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s both`,
                }}
              >
                <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-500">{faq.question}</h3>
                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600 transition-colors duration-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-white to-blue-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-24 text-center shadow-soft transform transition-all duration-700 hover:scale-105">
            <h2 className="mx-auto max-w-2xl text-4xl font-light tracking-tight text-white sm:text-5xl">
              Prêt à{' '}
              <span className="font-semibold">commencer</span>
              ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-blue-100">
              Rejoignez notre plateforme et commencez à gérer votre réseau
              LoRaWAN dès aujourd'hui.
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-6">
              <button
                onClick={() => router.push('/login')}
                className="group relative rounded-2xl bg-white px-8 py-4 text-base font-medium text-blue-500 shadow-soft transition-all duration-500 hover:bg-blue-50 hover:shadow-lg hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">Se connecter</span>
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
              <button
                onClick={() => router.push('/auth/request-access')}
                className="group relative rounded-2xl border-2 border-white px-8 py-4 text-base font-medium text-white transition-all duration-500 hover:bg-white/10 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">Demander un accès</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            </div>
            <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl">
              <div className="h-[400px] w-[400px] rounded-full bg-white/10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-50 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LoRaWAN</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Plateforme moderne de gestion de réseaux IoT et LoRaWAN.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'github', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
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
              <h3 className="text-sm font-medium text-gray-900 mb-4">Produit</h3>
              <ul className="space-y-3">
                {['Fonctionnalités', 'Tarifs', 'Documentation', 'API'].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Entreprise</h3>
              <ul className="space-y-3">
                {['À propos', 'Blog', 'Carrières', 'Contact'].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Support</h3>
              <ul className="space-y-3">
                {['Centre d\'aide', 'FAQ', 'Support technique', 'Statut'].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-50 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2024 LoRaWAN Platform. Tous droits réservés.
              </p>
              <div className="mt-4 sm:mt-0 flex space-x-6">
                <a href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-300">
                  Confidentialité
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-300">
                  Conditions
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-300">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 0.6s ease-out 0.4s both;
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
        }

        .animate-on-scroll.animate-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .shadow-soft {
          box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}