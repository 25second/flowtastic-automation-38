
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function AIProvidersLoading() {
  return (
    <div className="w-full">
      <div className="flex-1 p-8 overflow-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <Skeleton className="h-7 w-60 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
