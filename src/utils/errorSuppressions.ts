/**
 * Suppresses specific network errors to prevent unwanted error messages
 */
export function suppressGrafanaErrors() {
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    // Check if this is the Grafana logging endpoint
    if (typeof input === 'string' && input.includes('pushLogsToGrafana')) {
      // Return a resolved promise with an empty response to avoid the error
      return Promise.resolve(new Response(JSON.stringify({ suppressed: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    // Otherwise, proceed with the original fetch
    return originalFetch.apply(this, [input, init]);
  };
}
