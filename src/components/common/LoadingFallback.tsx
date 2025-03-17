
export const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="animate-pulse flex flex-col gap-4 w-full max-w-3xl p-6">
      <div className="h-8 bg-muted rounded w-1/3"></div>
      <div className="h-24 bg-muted rounded w-full"></div>
      <div className="h-64 bg-muted rounded w-full"></div>
    </div>
  </div>
);
