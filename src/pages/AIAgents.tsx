
import { AICategoriesAgentsContent } from "@/components/ai-agents/AICategoriesAgentsContent";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAccentColor } from '@/hooks/useAccentColor';
import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingFallback } from "@/components/common/LoadingFallback";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { suppressGrafanaErrors } from "@/utils/errorSuppressions";

export default function AIAgents() {
  // Apply accent color
  useAccentColor();
  
  // Set up the network error suppression
  useEffect(() => {
    suppressGrafanaErrors();
  }, []);

  return (
    <AnalyticsProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-background">
          <DashboardSidebar onNewWorkflow={() => {}} />
          <main className="flex-1 w-full h-full overflow-y-auto">
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <AICategoriesAgentsContent />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </SidebarProvider>
    </AnalyticsProvider>
  );
}
