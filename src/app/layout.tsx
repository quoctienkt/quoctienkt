import Sidebar from '@/components/Sidebar/Sidebar'
import Image from "next/image"
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getAssetPath } from '@/utils/AssetUtil'
import styles from "./layout.module.css"

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
        <div className={styles.appWrapper}>
          {/* left page */}
          <div className={styles.sidebar}>
            {/* page icon */}
            <Image
              src={getAssetPath("vercel.svg")}
              alt="App Logo"
              className="dark:invert m-auto"
              width={200}
              height={24}
              priority />
              <hr className="mt-8" />
            <Sidebar />
          </div>

          {/* right page */}
          <div className={styles.mainPage}>
            <header>Main page header</header>
            {/* main page */}
            <main>
              {children}
            </main>
            <footer className="bg-amber-900 color-white w-full h-9">TienDang Apps</footer>
          </div>
        </div>
      </body>
    </html>
  )
}
