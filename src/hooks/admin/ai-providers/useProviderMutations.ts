
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIProviderConfig } from './types';

export function useProviderMutations() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveProvider = async (provider: AIProviderConfig): Promise<void> => {
    if (!provider.name) {
      toast.error('Provider name is required');
      return;
    }
    
    if (!provider.api_key) {
      toast.error('API key is required');
      return;
    }
    
    if (provider.is_custom && !provider.endpoint_url) {
      toast.error('Endpoint URL is required for custom providers');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = provider.id 
        ? await supabase
            .from('ai_providers')
            .update({
              name: provider.name,
              api_key: provider.api_key,
              endpoint_url: provider.endpoint_url,
              is_custom: provider.is_custom
            })
            .eq('id', provider.id)
        : await supabase
            .from('ai_providers')
            .insert({
              name: provider.name,
              api_key: provider.api_key,
              endpoint_url: provider.endpoint_url,
              is_custom: provider.is_custom
            });
      
      if (error) throw error;
      
      toast.success(`${provider.name} configuration saved successfully`);
    } catch (error) {
      console.error('Error saving AI provider:', error);
      toast.error('Failed to save provider configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProvider = async (providerId: string): Promise<void> => {
    if (!providerId) return;
    
    try {
      const { error } = await supabase
        .from('ai_providers')
        .delete()
        .eq('id', providerId);
      
      if (error) throw error;
      
      toast.success('Provider deleted successfully');
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast.error('Failed to delete provider');
      throw error;
    }
  };

  return {
    isSubmitting,
    saveProvider,
    deleteProvider
  };
}
