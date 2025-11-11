import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chirpstackApi, Application } from '@/lib/api/chirpstack';

/**
 * Hook pour récupérer la liste des applications
 */
export function useApplications(organizationId?: string) {
  return useQuery({
    queryKey: ['applications', organizationId],
    queryFn: () => chirpstackApi.applications.list(organizationId),
  });
}

/**
 * Hook pour récupérer une application spécifique
 */
export function useApplication(id: string) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => chirpstackApi.applications.get(id),
    enabled: !!id,
  });
}

/**
 * Hook pour créer une nouvelle application
 */
export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (application: Omit<Application, 'id'>) =>
      chirpstackApi.applications.create(application),
    onSuccess: () => {
      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

/**
 * Hook pour mettre à jour une application
 */
export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) =>
      chirpstackApi.applications.update(id, data),
    onSuccess: (_, variables) => {
      // Invalider le cache pour cette application et la liste
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

/**
 * Hook pour supprimer une application
 */
export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => chirpstackApi.applications.delete(id),
    onSuccess: () => {
      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

