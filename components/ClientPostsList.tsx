'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/api';

export default function ClientPostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchTime, setFetchTime] = useState<number | null>(null);
  const [isCached, setIsCached] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const startTime = performance.now();
        const response = await fetch('/api/posts');
        const result = await response.json();
        const endTime = performance.now();
        
        setPosts(result.data);
        setFetchTime(endTime - startTime);
        setIsCached(result.meta?.cached || false);
      } catch (error) {
        console.error('Error fetching posts client-side:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="animate-pulse p-4 space-y-4 border rounded">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
    </div>;
  }

  return (
    <div>
      {fetchTime !== null && (
        <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded text-sm">
          Client fetch time: {fetchTime.toFixed(2)}ms 
          {isCached !== null && (
            <span className="ml-2 font-medium">
              {isCached ? '(from cache)' : '(from API)'}
            </span>
          )}
        </div>
      )}
      
      <div className="grid gap-4">
        {posts.slice(0, 5).map((post) => (
          <div key={post.id} className="border p-4 rounded shadow-sm">
            <h3 className="font-medium">{post.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{post.body.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}