
import { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, PlusCircle, Trash } from "lucide-react";
import { toast } from "sonner";
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';

interface AIProviderConfig {
  id?: string;
  name: string;
  api_key: string;
  endpoint_url?: string;
  is_custom: boolean;
}

export default function AIProvidersPage() {
  const { role } = useUserRole();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("openai");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Provider configs
  const [openaiConfig, setOpenaiConfig] = useState<AIProviderConfig>({
    name: "OpenAI",
    api_key: "",
    is_custom: false
  });
  
  const [geminiConfig, setGeminiConfig] = useState<AIProviderConfig>({
    name: "Gemini",
    api_key: "",
    is_custom: false
  });
  
  const [anthropicConfig, setAnthropicConfig] = useState<AIProviderConfig>({
    name: "Anthropic",
    api_key: "",
    is_custom: false
  });
  
  const [customProviders, setCustomProviders] = useState<AIProviderConfig[]>([]);
  const [newCustomProvider, setNewCustomProvider] = useState<AIProviderConfig>({
    name: "",
    api_key: "",
    endpoint_url: "",
    is_custom: true
  });

  // Fetch existing providers
  const { data: providers, isLoading, refetch } = useQuery({
    queryKey: ['ai-providers'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('ai_providers')
        .select('*');
      
      if (error) {
        console.error('Error fetching AI providers:', error);
        toast.error('Failed to load AI providers');
        return [];
      }
      
      return data || [];
    }
  });

  // Initialize form with existing data
  useEffect(() => {
    if (providers && providers.length > 0) {
      providers.forEach((provider: AIProviderConfig) => {
        if (provider.name === "OpenAI") {
          setOpenaiConfig(provider);
        } else if (provider.name === "Gemini") {
          setGeminiConfig(provider);
        } else if (provider.name === "Anthropic") {
          setAnthropicConfig(provider);
        } else if (provider.is_custom) {
          setCustomProviders(prev => {
            // Check if the provider already exists in the array
            const exists = prev.some(p => p.id === provider.id);
            if (!exists) {
              return [...prev, provider];
            }
            return prev;
          });
        }
      });
    }
  }, [providers]);

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
      refetch();
    } catch (error) {
      console.error('Error saving AI provider:', error);
      toast.error('Failed to save provider configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCustomProvider = async (providerId: string) => {
    if (!providerId) return;
    
    try {
      const { error } = await supabase
        .from('ai_providers')
        .delete()
        .eq('id', providerId);
      
      if (error) throw error;
      
      setCustomProviders(providers => providers.filter(p => p.id !== providerId));
      toast.success('Provider deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast.error('Failed to delete provider');
    }
  };

  const addCustomProvider = () => {
    setCustomProviders([...customProviders, { ...newCustomProvider, id: undefined }]);
    setNewCustomProvider({
      name: "",
      api_key: "",
      endpoint_url: "",
      is_custom: true
    });
  };

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
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                        <Input 
                          id="openai-api-key" 
                          type="password"
                          value={openaiConfig.api_key} 
                          onChange={(e) => setOpenaiConfig({...openaiConfig, api_key: e.target.value})}
                          placeholder="sk-..." 
                          className="mt-1"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter your OpenAI API key to use models like GPT-4o, GPT-4o-mini.
                        </p>
                      </div>
                      <Button 
                        onClick={() => saveProvider(openaiConfig)} 
                        disabled={isSubmitting || !openaiConfig.api_key}
                        className="mt-4"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save OpenAI Configuration
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gemini">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="gemini-api-key">Gemini API Key</Label>
                        <Input 
                          id="gemini-api-key" 
                          type="password"
                          value={geminiConfig.api_key} 
                          onChange={(e) => setGeminiConfig({...geminiConfig, api_key: e.target.value})}
                          placeholder="AIza..." 
                          className="mt-1"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter your Google Gemini API key to use models like Gemini Pro.
                        </p>
                      </div>
                      <Button 
                        onClick={() => saveProvider(geminiConfig)} 
                        disabled={isSubmitting || !geminiConfig.api_key}
                        className="mt-4"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Gemini Configuration
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="anthropic">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="anthropic-api-key">Anthropic API Key</Label>
                        <Input 
                          id="anthropic-api-key" 
                          type="password"
                          value={anthropicConfig.api_key} 
                          onChange={(e) => setAnthropicConfig({...anthropicConfig, api_key: e.target.value})}
                          placeholder="sk-ant-..." 
                          className="mt-1"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter your Anthropic API key to use Claude models.
                        </p>
                      </div>
                      <Button 
                        onClick={() => saveProvider(anthropicConfig)} 
                        disabled={isSubmitting || !anthropicConfig.api_key}
                        className="mt-4"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Anthropic Configuration
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="custom">
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-medium">Add Custom Provider</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="custom-name">Provider Name</Label>
                            <Input 
                              id="custom-name" 
                              value={newCustomProvider.name} 
                              onChange={(e) => setNewCustomProvider({...newCustomProvider, name: e.target.value})}
                              placeholder="Custom LLM" 
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="custom-api-key">API Key</Label>
                            <Input 
                              id="custom-api-key" 
                              type="password"
                              value={newCustomProvider.api_key} 
                              onChange={(e) => setNewCustomProvider({...newCustomProvider, api_key: e.target.value})}
                              placeholder="Enter API key" 
                              className="mt-1"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label htmlFor="custom-endpoint">Endpoint URL</Label>
                            <Input 
                              id="custom-endpoint" 
                              value={newCustomProvider.endpoint_url} 
                              onChange={(e) => setNewCustomProvider({...newCustomProvider, endpoint_url: e.target.value})}
                              placeholder="https://api.example.com/v1/chat/completions" 
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <Button 
                          onClick={addCustomProvider} 
                          disabled={!newCustomProvider.name || !newCustomProvider.api_key || !newCustomProvider.endpoint_url}
                          className="mt-2"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Provider
                        </Button>
                      </div>
                      
                      {customProviders.length > 0 ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Existing Custom Providers</h3>
                          {customProviders.map((provider, index) => (
                            <Card key={provider.id || index} className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <h4 className="font-semibold">{provider.name}</h4>
                                  <p className="text-sm text-muted-foreground truncate max-w-md">
                                    Endpoint: {provider.endpoint_url}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => saveProvider(provider)}
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => provider.id && deleteCustomProvider(provider.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-muted-foreground">No custom providers added yet.</p>
                        </div>
                      )}
                    </div>
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
