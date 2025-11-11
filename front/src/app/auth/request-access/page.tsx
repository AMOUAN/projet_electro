'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import ErrorMessage from '@/components/ErrorMessage';

export default function RequestAccessPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    usageDescription: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Effacer l'erreur du champ modifié
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      // Préparer les données selon le DTO backend
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        phone: formData.phone || undefined,
        usageDescription: formData.usageDescription || 'Demande d\'accès à la plateforme LoRaWAN',
      };

      await apiClient.requestAccess(requestData);
      setIsSubmitted(true);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'envoi de la demande';
      
      // Gestion des erreurs de validation
      if (error.response?.status === 400 && error.response?.data?.message) {
        const message = error.response.data.message;
        if (message.includes('email')) {
          setFieldErrors({ email: 'Cet email est déjà utilisé ou invalide' });
        } else if (message.includes('firstName') || message.includes('prénom')) {
          setFieldErrors({ firstName: 'Le prénom est requis' });
        } else if (message.includes('lastName') || message.includes('nom')) {
          setFieldErrors({ lastName: 'Le nom est requis' });
        } else if (message.includes('company') || message.includes('entreprise')) {
          setFieldErrors({ company: 'Le nom de l\'entreprise est requis' });
        } else if (message.includes('usageDescription') || message.includes('utilisation')) {
          setFieldErrors({ usageDescription: 'La description doit contenir au moins 10 caractères' });
        } else {
          setError(message);
        }
      } else if (error.response?.status === 409) {
        setError('Un compte avec cet email existe déjà. Veuillez vous connecter ou utiliser un autre email.');
      } else if (error.response?.status >= 500) {
        setError('Une erreur serveur est survenue. Veuillez réessayer plus tard.');
      } else {
        setError(errorMessage);
      }
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-scale-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Demande envoyée !
          </h2>
          <p className="text-gray-600 mb-6">
            Votre demande d'accès a été envoyée avec succès. Un administrateur va examiner votre demande et vous recevrez un email de confirmation sous peu.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Demander un accès
          </h1>
          <p className="text-lg text-gray-600">
            Remplissez le formulaire ci-dessous pour demander l'accès à la plateforme LoRaWAN
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message d'erreur global */}
            {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
            
            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 ${
                    fieldErrors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Jean"
                />
                {fieldErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 ${
                    fieldErrors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Dupont"
                />
                {fieldErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 ${
                  fieldErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="jean.dupont@example.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            {/* Entreprise */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 ${
                  fieldErrors.company ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nom de votre entreprise"
              />
              {fieldErrors.company && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.company}</p>
              )}
            </div>

            {/* Description de l'utilisation */}
            <div>
              <label htmlFor="usageDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Description de l'utilisation <span className="text-red-500">*</span>
              </label>
              <textarea
                id="usageDescription"
                name="usageDescription"
                rows={4}
                required
                minLength={10}
                value={formData.usageDescription}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-gray-900 ${
                  fieldErrors.usageDescription ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Décrivez votre projet ou vos besoins (minimum 10 caractères)..."
              />
              {fieldErrors.usageDescription && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.usageDescription}</p>
              )}
              <p className={`mt-1 text-xs ${
                formData.usageDescription.length < 10 ? 'text-gray-500' : 'text-green-600'
              }`}>
                {formData.usageDescription.length}/10 caractères minimum
              </p>
            </div>

            {/* Bouton de soumission */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer la demande'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Vous avez déjà un compte ?{' '}
            <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

