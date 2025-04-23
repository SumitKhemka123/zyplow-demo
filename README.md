# Redis-Integrated Next.js Demo

This project demonstrates a Next.js application with Redis caching to improve performance when fetching data from external APIs. The application showcases both server-side and client-side rendering with Redis caching integration.

## Features

- 🚀 Next.js App Router with TypeScript
- 💾 Redis caching for API responses
- 🔄 Demonstration of both server-side and client-side rendering
- 📊 Performance metrics visualization
- 🐳 Docker setup for Redis
- 🎨 TailwindCSS for styling

## Quick Start

### Option 1: Run with Docker (Recommended)

If you have Docker and Docker Compose installed, you can start the entire application (including Redis) with a single command:

```bash
# Clone the repository
git clone https://github.com/SumitKhemka123/redis-nextjs-demo.git
cd redis-nextjs-demo

# Start both Redis and Next.js app
docker-compose up
```

### Option 2: Run with Local Redis

```bash
# Clone the repository
git clone https://github.com/SumitKhemka123/redis-nextjs-demo.git
cd redis-nextjs-demo

# Install dependencies
npm install

# Start Redis using Docker
docker-compose up -d redis

# Start the Next.js development server
npm run dev
```

### Option 3: Run without Redis (Fallback Mode)

If you don't have Docker installed, the application will automatically use an in-memory cache implementation:

```bash
# Clone the repository
git clone https://github.com/SumitKhemka123/redis-nextjs-demo.git
cd redis-nextjs-demo

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

Once running, visit [http://localhost:3000](http://localhost:3000) to view the application.

## Architecture Overview

This application demonstrates how Redis can be used as a caching layer in a Next.js application:

1. **Redis Caching Layer**: Uses Redis to store frequently accessed data from external APIs.
2. **Next.js App Router**: Leverages Next.js App Router for both SSR and CSR capabilities.
3. **API Integration**: Fetches data from JSONPlaceholder API as an example.
4. **Performance Metrics**: Collects and displays performance metrics to demonstrate caching benefits.

### Data Flow

```
Request → Next.js → Redis Cache Check → (Cache Hit) → Return Cached Data
                                     → (Cache Miss) → Fetch from API → Cache Response → Return Data
```

### Component Interaction

The application consists of the following key components that interact with each other:

1. **Page Components (`app/page.tsx`)**:
   - Performs server-side rendering with Redis-cached data
   - Displays server-side rendering performance metrics
   - Integrates client-side components

2. **Client Components (`components/ClientPostsList.tsx`)**:
   - Performs client-side data fetching through API routes
   - Demonstrates client-side caching benefits
   - Updates UI dynamically with loading states

3. **Redis Cache Layer (`lib/redis.ts`)**:
   - Provides caching utilities for API responses
   - Handles TTL (Time To Live) for cached items
   - Offers fallback to in-memory cache when Redis is unavailable

4. **API Routes (`app/api/posts/route.ts`)**:
   - Bridge between client components and cached data
   - Utilize Redis caching for consistent performance
   - Return timing metrics for performance analysis

5. **Cache Management (`app/cache-management/page.tsx`)**:
   - Provides an interface to manually clear cache
   - Allows testing cache hit/miss scenarios
   - Demonstrates cache invalidation mechanics

## Environment Variables

The application uses the following environment variables (optional):

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis server connection string | `redis://localhost:6379` |
| `REDIS_TTL` | Default TTL for cached items (seconds) | `300` (5 minutes) |

Create a `.env.local` file in the project root to set these variables:

```
REDIS_URL=redis://your-redis-host:6379
REDIS_TTL=600
```

## Performance Benchmarking

The application includes built-in performance metrics to visualize the impact of Redis caching. Here are typical results from testing:

### Server-Side Rendering Performance

| Scenario | Without Redis | With Redis (Cache Miss) | With Redis (Cache Hit) |
|----------|--------------|------------------------|----------------------|
| Server-side API Call | 300-500ms | 300-500ms | 5-10ms |
| Client-side API Call | 200-400ms | 200-400ms | 5-10ms |
| Total Page Load | 800-1200ms | 800-1200ms | 400-600ms |

*Note: Actual performance will vary based on network conditions, server location, and client device.*

### Performance Screenshots

![Screenshot 2025-04-23 164749](https://github.com/user-attachments/assets/fa9e9e12-3eba-4a0c-b5b0-86e193a7a31c)
![Screenshot 2025-04-23 163134](https://github.com/user-attachments/assets/e92999e8-cb25-4311-9034-031bdb9ddb6d)
![Screenshot 2025-04-23 162936](https://github.com/user-attachments/assets/3a528647-9455-415b-b1db-bdbd3b04729c)



## Testing the Caching Mechanism

1. Visit the home page at [http://localhost:3000](http://localhost:3000)
2. Note the initial load time (this will be a cache miss)
3. Refresh the page and observe faster load times (cache hit)
4. Visit the Cache Management page at [http://localhost:3000/cache-management](http://localhost:3000/cache-management)
5. Clear the cache
6. Return to the home page and observe slower load times again (cache miss)

## Scaling Vision

To scale this application to handle thousands or millions of daily users, I would implement the following strategy:

### Infrastructure & Horizontal Scaling
The application would be containerized and deployed across multiple regions using Kubernetes for orchestration. Each region would have multiple Next.js instances behind a load balancer (like AWS ALB or Nginx) that would distribute traffic evenly. Auto-scaling groups would automatically adjust the number of instances based on traffic patterns and CPU utilization, ensuring responsive performance even during traffic spikes.

### Caching & Database Strategy
Redis would be implemented as a distributed cluster (Redis Cluster) for high availability and throughput, with read replicas in each region to minimize latency. Frequently accessed data would be cached at multiple levels: Redis for API responses, CDN for static assets, and browser caching for front-end resources. For persistent data, a globally distributed database like Amazon Aurora Global Database or MongoDB Atlas would provide low-latency reads in all regions while maintaining strong consistency.

### Edge Optimization & Performance
We would leverage a global CDN like Cloudflare or AWS CloudFront to cache static assets and API responses at edge locations worldwide, dramatically reducing latency for users regardless of their location. For dynamic content, we would implement Incremental Static Regeneration (ISR) in Next.js to pre-render pages and update them incrementally, reducing server load while maintaining data freshness. Analytics and monitoring systems would continuously measure performance metrics and identify optimization opportunities.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
