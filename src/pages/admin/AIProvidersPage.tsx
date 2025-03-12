
import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from '@/hooks/useUserRole';
import { useAIProviders } from '@/hooks/admin/useAIProviders';
import { OpenAIProviderForm } from '@/components/admin/ai-providers/OpenAIProviderForm';
import { GeminiProviderForm } from '@/components/admin/ai-providers/GeminiProviderForm';
import { AnthropicProviderForm } from '@/components/admin/ai-providers/AnthropicProviderForm';
import { CustomProvidersForm } from '@/components/admin/ai-providers/CustomProvidersForm';

export default function AIProvidersPage() {
  const { role } = useUserRole();
  const [activeTab, setActiveTab] = useState("openai");
  
  const {
    openaiConfig,
    setOpenaiConfig,
    geminiConfig,
    setGeminiConfig,
    anthropicConfig,
    setAnthropicConfig,
    customProviders,
    isSubmitting,
    saveProvider,
    deleteCustomProvider,
    addCustomProvider
  } = useAIProviders();

  return (
    <div className="w-full">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <div className="flex-1 p-8 overflow-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">AI Providers</h1>
              <Badge variant="outline" className="px-3 py-1">
                Role: {role || 'Loading...'}
              </Badge>
            </div>
            
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
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
