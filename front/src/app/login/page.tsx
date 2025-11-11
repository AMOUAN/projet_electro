'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import ErrorMessage from '@/components/ErrorMessage';
import SuccessMessage from '@/components/SuccessMessage';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Afficher un message de succès si l'utilisateur vient de l'activation
    if (searchParams?.get('activated') === 'true') {
      setSuccess('Votre compte a été activé avec succès ! Vous pouvez maintenant vous connecter.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      const response = await apiClient.login({ email, password });
      // Stocker les informations utilisateur si nécessaire
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur de connexion';
      
      // Messages d'erreur personnalisés
      if (error.response?.status === 401) {
        if (errorMessage.includes('actif')) {
          setError('Votre compte n\'est pas encore actif. Veuillez vérifier votre email pour activer votre compte.');
        } else {
          setError('Email ou mot de passe incorrect. Veuillez réessayer.');
        }
      } else if (error.response?.status === 404) {
        setError('Le serveur est inaccessible. Veuillez vérifier votre connexion.');
      } else if (error.response?.status >= 500) {
        setError('Une erreur serveur est survenue. Veuillez réessayer plus tard.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Section - 3/4 de l'écran */}
      <div className="hidden lg:flex lg:w-3/4 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        {/* Image de fond avec overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            // Vous pouvez remplacer cette URL par une image locale : '/images/login-bg.jpg'
            // ou utiliser le gradient de fond si aucune image n'est disponible
            backgroundImage: 'url(https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80)',
          }}
        >
          {/* Overlay avec gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-purple-600/80 to-pink-600/70"></div>
        </div>
        
        {/* Contenu sur l'image */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <div className="max-w-2xl animate-fade-in">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold">LoRaWAN</h1>
            </div>
            
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Gérez votre réseau IoT
              <span className="block text-4xl mt-2 text-indigo-200">
                avec simplicité
              </span>
            </h2>
            
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Connectez-vous à votre plateforme de gestion LoRaWAN et accédez à toutes vos applications, 
              dispositifs et données en temps réel.
            </p>
            
            {/* Points clés */}
            <div className="space-y-4 mt-12">
              {[
                { icon: '🔒', text: 'Sécurité de niveau entreprise' },
                { icon: '⚡', text: 'Performance optimale' },
                { icon: '📊', text: 'Analytics en temps réel' },
                { icon: '🌐', text: 'Accessible partout' },
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

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenue
            </h2>
            <p className="text-gray-600">
              Connectez-vous à votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Messages d'erreur et de succès */}
            {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
            {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <a
                href="#"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>

            {/* Bouton de connexion */}
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
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>
          </div>

          {/* Lien vers demande d'accès */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{' '}
              <a
                href="/auth/request-access"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Demander un accès
              </a>
            </p>
          </div>

          {/* Retour à l'accueil */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

