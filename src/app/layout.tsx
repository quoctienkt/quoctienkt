import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { basePath, getAssetPath } from "@/utils/AssetUtil";
import styles from "./layout.module.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tiến Đặng collection",
  description: "All TienDang's app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          <div id="basePath" className="hidden">
            {basePath}
          </div>
          <Script src={getAssetPath("js/utils.js")}></Script>
        </>

        <div className={styles.appWrapper}>
          {/* left page */}
          <div className={styles.sidebar}>
            {/* page icon */}
            <Image
              src={getAssetPath("vercel.svg")}
              alt="App Logo"
              className="dark:invert"
              width={200}
              height={24}
              priority
            />

            <button
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm
                      text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none
                        focus:ring-2 focus:ring-gray-200 dark:text-gray-400
                      dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>

            <hr className="mt-8 hidden lg:block" />

            <Navbar id="navbar-default" />
          </div>

          {/* right page */}
          <div className={styles.mainPage}>
            <header className="hidden">Main page header</header>
            {/* main page */}
            <main>{children}</main>
            <footer className="bg-amber-900 color-white w-full h-9">
              TienDang Apps
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
