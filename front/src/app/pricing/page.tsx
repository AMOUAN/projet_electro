'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function PricingPage() {
  const router = useRouter();

  const plans = [
    {
      name: 'Starter',
      description: 'Parfait pour découvrir la plateforme',
      price: 'Gratuit',
      features: [
        'Jusqu\'à 10 dispositifs',
        '1 application',
        'Support par email',
        'Documentation complète',
        '1 GB de stockage',
      ],
      cta: 'Commencer gratuitement',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'Pour les équipes en croissance',
      price: '49€',
      period: '/mois',
      features: [
        'Jusqu\'à 100 dispositifs',
        '5 applications',
        'Support prioritaire 24/7',
        'API complète',
        '10 GB de stockage',
        'Analytics avancés',
        'Intégrations personnalisées',
      ],
      cta: 'Essayer gratuitement',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Pour les grandes organisations',
      price: 'Sur mesure',
      features: [
        'Dispositifs illimités',
        'Applications illimitées',
        'Support dédié 24/7',
        'API avancée',
        'Stockage illimité',
        'SLA garanti',
        'Formation personnalisée',
        'Déploiement on-premise',
      ],
      cta: 'Nous contacter',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-[#0688F9] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Retour</span>
            </button>
            <Button variant="primary" onClick={() => router.push('/login')}>
              Connexion
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="primary" className="mb-4">
              Tarifs
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Des tarifs{' '}
              <span className="bg-gradient-to-r from-[#0688F9] to-[#0563C1] bg-clip-text text-transparent">
                transparents
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Choisissez le plan qui correspond à vos besoins. Tous les plans incluent
              14 jours d'essai gratuit sans carte bancaire.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular ? 'ring-2 ring-[#0688F9] shadow-2xl scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-6 -translate-y-1/2">
                    <Badge variant="primary" size="md">
                      Populaire
                    </Badge>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-4 text-sm text-gray-600">{plan.description}</p>
                  
                  <p className="mt-8">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-lg font-medium text-gray-600">{plan.period}</span>
                    )}
                  </p>
                  
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full mt-8"
                    onClick={() => router.push('/auth/request-access')}
                  >
                    {plan.cta}
                  </Button>
                  
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-[#0688F9] mr-3 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Questions fréquentes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  q: 'Puis-je changer de plan à tout moment ?',
                  a: 'Oui, vous pouvez changer de plan à tout moment. Les changements prennent effet immédiatement.',
                },
                {
                  q: 'Y a-t-il des frais cachés ?',
                  a: 'Non, tous nos tarifs sont transparents. Vous ne payez que ce qui est indiqué.',
                },
                {
                  q: 'Comment fonctionne l\'essai gratuit ?',
                  a: '14 jours d\'essai complet sans carte bancaire. Annulez à tout moment.',
                },
                {
                  q: 'Proposez-vous des remises pour les associations ?',
                  a: 'Oui, contactez-nous pour des tarifs spéciaux éducation et associations.',
                },
              ].map((faq, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
