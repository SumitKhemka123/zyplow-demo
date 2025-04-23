import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Redis-Integrated Next.js Demo',
  description: 'A Next.js application with Redis caching to improve API performance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-slate-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl">Redis Demo</Link>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-blue-300 transition">Home</Link>
              <Link href="/cache-management" className="hover:text-blue-300 transition">Cache Management</Link>
            </div>
          </div>
        </nav>
        {children}
        <footer className="bg-slate-100 p-4 mt-auto">
          <div className="container mx-auto text-center text-gray-600 text-sm">
            <p>Redis-Integrated Next.js Demo | Performance Benchmarking Application</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
