import Sidebar from '@/components/sidebar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tiến Đặng collection',
  description: 'All TienDang\'s app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* left page */}
        <div>
          {/* page icon */}

          <Sidebar />
        </div>

        {/* right page */}
        <div>
          <header>Main page title</header>
          {/* main page */}
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
