'use client';

import { useState, useEffect } from 'react';

interface PerformanceMetricsProps {
  serverFetchTime: number;
}

export default function PerformanceMetrics({ serverFetchTime }: PerformanceMetricsProps) {
  const [clientLoaded, setClientLoaded] = useState(false);
  const [clientRenderTime, setClientRenderTime] = useState<number | null>(null);

  useEffect(() => {
    // Calculate client-side render time
    const timeToFirstContentfulPaint = performance.getEntriesByType('paint')
      .find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
    
    setClientRenderTime(timeToFirstContentfulPaint);
    setClientLoaded(true);
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded border">
          <h3 className="text-sm font-medium text-gray-500">Server Fetch Time</h3>
          <p className="text-2xl font-bold">{serverFetchTime}ms</p>
          <p className="text-xs text-gray-500 mt-1">Time taken to fetch data on the server with Redis caching</p>
        </div>
        
        {clientLoaded && clientRenderTime && (
          <div className="bg-white p-3 rounded border">
            <h3 className="text-sm font-medium text-gray-500">Time to First Contentful Paint</h3>
            <p className="text-2xl font-bold">{clientRenderTime.toFixed(2)}ms</p>
            <p className="text-xs text-gray-500 mt-1">Time until the first content was painted on screen</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm">
        <p className="font-medium">How This Works:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
          <li>Server-side data is fetched with Redis caching</li>
          <li>First request will be slower (cache miss)</li>
          <li>Subsequent requests will be faster (cache hit)</li>
          <li>TTL ensures data is refreshed periodically</li>
        </ul>
      </div>
      
      <div className="mt-4 text-sm">
        <button
          onClick={() => {
            // Force a refresh to clear client-side cache (browser cache)
            window.location.reload();
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Refresh Page
        </button>
        <span className="ml-2 text-gray-500">Try refreshing to see the caching in action</span>
      </div>
    </div>
  );
}