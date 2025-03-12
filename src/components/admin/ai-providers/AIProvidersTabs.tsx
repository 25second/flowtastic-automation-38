
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { OpenAIProviderForm } from '@/components/admin/ai-providers/OpenAIProviderForm';
import { GeminiProviderForm } from '@/components/admin/ai-providers/GeminiProviderForm';
import { AnthropicProviderForm } from '@/components/admin/ai-providers/AnthropicProviderForm';
import { CustomProvidersForm } from '@/components/admin/ai-providers/CustomProvidersForm';
import { AIProviderConfig } from '@/hooks/admin/ai-providers/types';

interface AIProvidersTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openaiConfig: AIProviderConfig;
  setOpenaiConfig: (config: AIProviderConfig) => void;
  geminiConfig: AIProviderConfig;
  setGeminiConfig: (config: AIProviderConfig) => void;
  anthropicConfig: AIProviderConfig;
  setAnthropicConfig: (config: AIProviderConfig) => void;
  customProviders: AIProviderConfig[];
  saveProvider: (provider: AIProviderConfig) => Promise<void>;
  deleteCustomProvider: (providerId: string) => Promise<void>;
  addCustomProvider: (provider: AIProviderConfig) => void;
  isSubmitting: boolean;
}

export function AIProvidersTabs({
  activeTab,
  setActiveTab,
  openaiConfig,
  setOpenaiConfig,
  geminiConfig,
  setGeminiConfig,
  anthropicConfig,
  setAnthropicConfig,
  customProviders,
  saveProvider,
  deleteCustomProvider,
  addCustomProvider,
  isSubmitting
}: AIProvidersTabsProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>AI Service Providers</CardTitle>
        <CardDescription>
          Configure API keys for various AI services that can be used by agents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="gemini">Gemini</TabsTrigger>
            <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
            <TabsTrigger value="custom">Custom Providers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="openai">
            <OpenAIProviderForm 
              config={openaiConfig}
              onChange={setOpenaiConfig}
              onSave={saveProvider}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="gemini">
            <GeminiProviderForm 
              config={geminiConfig}
              onChange={setGeminiConfig}
              onSave={saveProvider}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="anthropic">
            <AnthropicProviderForm 
              config={anthropicConfig}
              onChange={setAnthropicConfig}
              onSave={saveProvider}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="custom">
            <CustomProvidersForm 
              customProviders={customProviders}
              onSave={saveProvider}
              onDelete={deleteCustomProvider}
              onAddProvider={addCustomProvider}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <p className="text-sm text-muted-foreground">
          API keys are stored securely. Make sure to use proper access controls to prevent unauthorized access.
        </p>
      </CardFooter>
    </Card>
  );
}
