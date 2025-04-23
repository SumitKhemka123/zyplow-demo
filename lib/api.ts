// Types for our data
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// Server-side API fetching with caching
export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  const posts = await response.json();
  
  // Transform the posts to have more readable content
  return posts.map((post: Post) => ({
    ...post,
    title: transformTitle(post.title, post.id),
    body: transformBody(post.body, post.id)
  }));
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

// Helper to measure execution time (for performance benchmarking)
export async function measureExecutionTime<T>(
  fn: () => Promise<T>
): Promise<{ data: T; executionTime: number }> {
  const start = performance.now();
  const data = await fn();
  const end = performance.now();
  return { 
    data, 
    executionTime: end - start 
  };
}

// Helper functions to transform the placeholder text to more readable English
function transformTitle(title: string, id: number): string {
  const titles = [
    "How Redis Caching Improves Application Performance",
    "Building Scalable Web Applications with Next.js",
    "The Benefits of Server-Side Rendering in React",
    "Understanding Client-Side vs Server-Side Rendering",
    "Implementing Efficient Caching Strategies",
    "Optimizing API Calls with Redis",
    "Modern Web Development with TypeScript",
    "Creating Responsive UIs with Tailwind CSS",
    "The Power of App Router in Next.js",
    "Performance Metrics: What to Measure and Why",
    "Reducing Load Times in Web Applications",
    "Web Optimization Techniques for 2025",
    "Building with the Latest React Features",
    "How to Configure Redis for Production",
    "Scaling Your Web Application to Millions of Users"
  ];
  
  return titles[id % titles.length] || title;
}

function transformBody(body: string, id: number): string {
  const bodies = [
    "Redis caching significantly reduces API response times by storing frequently accessed data in memory. This implementation demonstrates how to integrate Redis in a Next.js application to improve overall performance and user experience.",
    "Next.js provides a powerful framework for building React applications with built-in features like server-side rendering, static site generation, and API routes. This example showcases these capabilities with practical implementation patterns.",
    "Server-side rendering improves initial page load time and SEO by delivering fully rendered HTML to the client. This approach is particularly beneficial for content-heavy applications where first contentful paint is critical.",
    "Understanding when to use client-side vs. server-side rendering is crucial for application architecture. This demo showcases both approaches and highlights their respective benefits and trade-offs.",
    "Implementing efficient caching strategies requires careful consideration of data freshness, TTL settings, and invalidation patterns. This example demonstrates a balanced approach that maintains data accuracy while maximizing performance.",
    "Redis provides low-latency access to cached data, making it an ideal solution for API response caching. This implementation shows how to properly integrate Redis caching with appropriate TTL and invalidation strategies.",
    "TypeScript enhances developer productivity through strong typing, better tooling, and improved code quality. This project demonstrates TypeScript best practices in a Next.js environment.",
    "Tailwind CSS enables rapid UI development with a utility-first approach. This application showcases responsive design patterns and component styling using Tailwind's powerful utility classes.",
    "Next.js App Router introduces a new paradigm for routing and layouts in React applications. This implementation demonstrates nested layouts, route groups, and other advanced routing concepts.",
    "Measuring the right performance metrics is essential for optimizing user experience. This application tracks and displays key metrics like server response time, time to first contentful paint, and cache hit rates.",
    "Reducing load times requires a multi-faceted approach including code splitting, asset optimization, and effective caching. This demo implements several techniques to achieve optimal loading performance.",
    "The web development landscape continues to evolve with new tools and techniques. This application demonstrates cutting-edge approaches to building fast, reliable web applications in 2025.",
    "Modern React features like Server Components, Suspense, and Concurrent Mode enable new patterns for building responsive UIs. This implementation leverages these features for an optimal user experience.",
    "Production Redis deployments require careful configuration for security, high availability, and performance. This example includes best practices for Redis configuration in production environments.",
    "Scaling web applications to millions of users requires thoughtful architecture and infrastructure decisions. This project demonstrates patterns and practices that enable horizontal scaling and high availability."
  ];
  
  return bodies[id % bodies.length] || body;
}