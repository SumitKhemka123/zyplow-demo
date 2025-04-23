import { fetchWithCache } from '@/lib/redis';
import { fetchPosts, measureExecutionTime } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Measure execution time for cached vs. non-cached requests
    const result = await measureExecutionTime(async () => {
      return fetchWithCache('posts', fetchPosts, 300); // Cache for 5 minutes
    });

    return NextResponse.json({
      data: result.data,
      meta: {
        executionTime: result.executionTime,
        cached: true,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}