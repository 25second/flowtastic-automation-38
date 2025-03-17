
import { Suspense } from "react";
import { AICategoriesAgentsContent } from "@/components/ai-agents/AICategoriesAgentsContent";
import { LoadingFallback } from "@/components/common/LoadingFallback";

export function AIAgentsContent() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AICategoriesAgentsContent />
    </Suspense>
  );
}
