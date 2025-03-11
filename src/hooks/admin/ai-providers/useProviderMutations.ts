
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIProviderConfig } from './types';

export function useProviderMutations() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveProvider = async (provider: AIProviderConfig) => {
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
      const { data, error } = provider.id 
        ? await supabase
            .from('ai_providers')
            .update({
              name: provider.name,
              api_key: provider.api_key,
              endpoint_url: provider.endpoint_url,
              is_custom: provider.is_custom
            })
            .eq('id', provider.id)
            .select()
        : await supabase
            .from('ai_providers')
            .insert({
              name: provider.name,
              api_key: provider.api_key,
              endpoint_url: provider.endpoint_url,
              is_custom: provider.is_custom
            })
            .select();
      
      if (error) throw error;
      
      toast.success(`${provider.name} configuration saved successfully`);
      return data;
    } catch (error) {
      console.error('Error saving AI provider:', error);
      toast.error('Failed to save provider configuration');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCustomProvider = async (providerId: string) => {
    if (!providerId) return false;
    
    try {
      const { error } = await supabase
        .from('ai_providers')
        .delete()
        .eq('id', providerId);
      
      if (error) throw error;
      
      toast.success('Provider deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast.error('Failed to delete provider');
      return false;
    }
  };

  return {
    isSubmitting,
    saveProvider,
    deleteCustomProvider
  };
}
