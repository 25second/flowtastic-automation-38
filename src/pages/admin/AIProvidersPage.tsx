
import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserRole } from '@/hooks/useUserRole';
import { useAIProviders } from '@/hooks/admin/useAIProviders';
import { OpenAIProviderForm } from '@/components/admin/ai-providers/OpenAIProviderForm';
import { GeminiProviderForm } from '@/components/admin/ai-providers/GeminiProviderForm';
import { AnthropicProviderForm } from '@/components/admin/ai-providers/AnthropicProviderForm';
import { CustomProvidersForm } from '@/components/admin/ai-providers/CustomProvidersForm';
import { Skeleton } from '@/components/ui/skeleton';

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

  // Показываем состояние загрузки
  if (isLoading || roleLoading) {
    return (
      <div className="w-full">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AdminSidebar />
            <div className="flex-1 p-8 overflow-auto w-full">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-7 w-60 mb-2" />
                  <Skeleton className="h-5 w-96" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  // Show network error if offline
  if (isOffline) {
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
              
              <Alert variant="destructive" className="mb-6">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Network Error</AlertTitle>
                <AlertDescription>
                  You appear to be offline. Please check your internet connection and try again.
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()}
                    >
                      Refresh Page
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  // Show general error
  if (error) {
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
              
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was an error loading the AI providers: {error instanceof Error ? error.message : String(error)}
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </SidebarProvider>
      </div>
    );
  }

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
