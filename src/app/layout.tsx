import "./globals.css";
import { Inter } from "next/font/google";
import { basePath } from "@/utils/assetUtil";
import { LayoutProvider } from "@/components/layout/LayoutProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <LayoutProvider basePath={basePath}> */}
          {children}
        {/* </LayoutProvider> */}
      </body>
    </html>
  );
}
