
import { useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useAIProviders } from '@/hooks/admin/useAIProviders';
import { AIProvidersLayout } from '@/components/admin/ai-providers/AIProvidersLayout';
import { AIProvidersLoading } from '@/components/admin/ai-providers/AIProvidersLoading';
import { AIProvidersError } from '@/components/admin/ai-providers/AIProvidersError';
import { AIProvidersTabs } from '@/components/admin/ai-providers/AIProvidersTabs';

export default function AIProvidersPage() {
  const { role, loading: roleLoading } = useUserRole();
  const [activeTab, setActiveTab] = useState("openai");
  
  const {
    openaiConfig,
    setOpenaiConfig,
    geminiConfig,
    setGeminiConfig,
    anthropicConfig,
    setAnthropicConfig,
    customProviders,
    isLoading,
    isSubmitting,
    saveProvider,
    deleteCustomProvider,
    addCustomProvider,
    isOffline,
    error
  } = useAIProviders();

  // Show loading state
  if (isLoading || roleLoading) {
    return <AIProvidersLoading />;
  }

  // Handle error states
  if (isOffline || error) {
    return (
      <AIProvidersLayout role={role}>
        <AIProvidersError 
          error={error} 
          role={role} 
          isOffline={isOffline} 
        />
      </AIProvidersLayout>
    );
  }

  // Main content
  return (
    <AIProvidersLayout role={role}>
      <AIProvidersTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openaiConfig={openaiConfig}
        setOpenaiConfig={setOpenaiConfig}
        geminiConfig={geminiConfig}
        setGeminiConfig={setGeminiConfig}
        anthropicConfig={anthropicConfig}
        setAnthropicConfig={setAnthropicConfig}
        customProviders={customProviders}
        saveProvider={saveProvider}
        deleteCustomProvider={deleteCustomProvider}
        addCustomProvider={addCustomProvider}
        isSubmitting={isSubmitting}
      />
    </AIProvidersLayout>
  );
}
