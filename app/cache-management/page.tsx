'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CacheManagement() {
  const [isClearing, setIsClearing] = useState(false);
  const [clearResult, setClearResult] = useState<{success: boolean; message: string} | null>(null);

  const clearCache = async () => {
    setIsClearing(true);
    setClearResult(null);
    
    try {
      const response = await fetch('/api/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      setClearResult({
        success: response.ok,
        message: response.ok ? 'Cache cleared successfully!' : result.error || 'Failed to clear cache',
      });
    } catch (error) {
      setClearResult({
        success: false,
        message: 'An error occurred while clearing the cache.',
      });
      console.error('Error clearing cache:', error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6">Cache Management</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold mb-4">Redis Cache Controls</h2>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              This page allows you to manage the Redis cache for this application. 
              Clearing the cache will remove all cached API responses, forcing the application
              to fetch fresh data from the external API on the next request.
            </p>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
              <p className="font-medium">How Caching Works</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>API responses are cached in Redis with a TTL (Time To Live)</li>
                <li>Default TTL is 5 minutes for this demo</li>
                <li>Cached data is returned immediately without hitting the external API</li>
                <li>After TTL expires, a fresh copy is fetched from the API</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <button
              onClick={clearCache}
              disabled={isClearing}
              className="px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50 
                         hover:bg-red-600 transition flex items-center justify-center"
            >
              {isClearing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Clearing...
                </>
              ) : 'Clear All Cache'}
            </button>
            
            {clearResult && (
              <div className={`p-3 rounded-md text-sm ${
                clearResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {clearResult.message}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">Testing Instructions</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
            <li>Visit the <Link href="/" className="text-blue-600 hover:underline">home page</Link> to see the current response times</li>
            <li>Clear the cache using the button above</li>
            <li>Return to the home page and observe the longer response time (cache miss)</li>
            <li>Refresh the page again to see faster response time (cache hit)</li>
          </ol>
        </div>
      </div>
    </main>
  );
}