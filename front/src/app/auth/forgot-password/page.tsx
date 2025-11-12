'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await apiClient.forgotPassword(email);
      setIsSubmitted(true);
      setSuccess('Un email de réinitialisation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'envoi de l\'email';
      
      if (error.response?.status === 404) {
        setError('Aucun compte trouvé avec cette adresse email.');
      } else if (error.response?.status >= 500) {
        setError('Une erreur serveur est survenue. Veuillez réessayer plus tard.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Section - 3/4 de l'écran */}
      <div className="hidden lg:flex lg:w-3/4 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
             style={{ backgroundImage: `url(${new Date().getHours() < 18 ? '/assets/jour.avif' : '/assets/fin.jpg'})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-blue-600/80 to-blue-600/70"></div>
        </div>
        
        {/* Contenu sur l'image */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold">LoRaWAN</h1>
            </div>
            
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Réinitialisez votre
              <span className="block text-4xl mt-2 text-indigo-200">
                mot de passe
              </span>
            </h2>
            
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Ne vous inquiétez pas, ça arrive ! Nous vous enverrons un email avec les instructions 
              pour réinitialiser votre mot de passe en quelques étapes simples.
            </p>
            
            {/* Points clés */}
            <div className="space-y-4 mt-12">
              {[
                { icon: '🔐', text: 'Sécurité garantie pour vos données' },
                { icon: '⏱️', text: 'Processus rapide et simple' },
                { icon: '📧', text: 'Email envoyé instantanément' },
                { icon: '🔄', text: 'Accès récupéré rapidement' },
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 text-lg"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${0.3 + index * 0.1}s both`,
                  }}
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-white/90">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Éléments décoratifs */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        </div>
      </div>

      {/* Formulaire Section - 1/4 de l'écran */}
      <div className="w-full lg:w-1/4 flex flex-col justify-center bg-white px-8 py-12 sm:px-12">
        <div className="w-full max-w-md mx-auto">
          {/* Logo pour mobile */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"></div>
            <span className="text-2xl font-bold text-gray-900">LoRaWAN</span>
          </div>

          {/* Bouton retour */}
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la connexion
          </button>

          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Mot de passe oublié ?
                </h2>
                <p className="text-gray-600">
                  Entrez votre email pour recevoir un lien de réinitialisation
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Messages d'erreur et de succès */}
                {error && (
                  <div className="flex flex-col items-center text-center p-4 bg-red-50 rounded-lg">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                
                {success && (
                  <div className="flex flex-col items-center text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                    <p className="text-green-700 text-sm">{success}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Bouton d'envoi */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le lien de réinitialisation'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Email envoyé !
                </h2>
                <p className="text-gray-600 mb-4">
                  Un email de réinitialisation a été envoyé à :
                </p>
                <p className="font-medium text-indigo-600 mb-6">
                  {email}
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Veuillez vérifier votre boîte de réception et suivre les instructions 
                  pour réinitialiser votre mot de passe. Si vous ne recevez pas l'email, 
                  vérifiez votre dossier spam.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleBackToLogin}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Retour à la connexion
                </button>
                
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSuccess(null);
                  }}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Envoyer un autre email
                </button>
              </div>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Besoin d'aide ?</p>
                <p>Si vous ne recevez pas l'email dans les 5 minutes, contactez notre support technique.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
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
      `}</style>
    </div>
  );
}
