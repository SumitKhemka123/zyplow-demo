import { fetchWithCache } from '@/lib/redis';
import { Post, fetchPosts } from '@/lib/api';
import ClientPostsList from '@/components/ClientPostsList';
import PerformanceMetrics from '@/components/PerformanceMetrics';

export default async function Home() {
  // Server-side fetch with caching
  const startTime = Date.now();
  const posts: Post[] = await fetchWithCache('posts', fetchPosts, 300); // Cache for 5 minutes
  const serverFetchTime = Date.now() - startTime;
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-8">
      <div className="max-w-6xl w-full">
        <h1 className="text-4xl font-bold mb-6">
          Zyplow Demo with Redis Caching
        </h1>
        
        <PerformanceMetrics serverFetchTime={serverFetchTime} />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Server-Side Rendered Posts</h2>
            <p className="text-gray-500 mb-4">
              These posts are fetched during server-side rendering with Redis caching
            </p>
            <div className="grid gap-4">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="border p-4 rounded shadow-sm">
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">{post.body.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Client-Side Rendered Posts</h2>
            <p className="text-gray-500 mb-4">
              These posts are fetched client-side and benefit from the same Redis caching
            </p>
            <ClientPostsList />
          </div>
        </div>
      </div>
    </main>
  );
}
