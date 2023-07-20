import "./globals.css";
import { Inter } from "next/font/google";
import { basePath, getAssetPath } from "@/utils/AssetUtil";
import Script from "next/script";
import Layout from "@/components/layout/Layout";

const inter = Inter({ subsets: ["latin"] });

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

        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
