
export function AdminDashboardError() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">We encountered an error loading the admin dashboard</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      </div>
    </div>
  );
}
