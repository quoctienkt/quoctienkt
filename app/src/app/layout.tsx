import "./styles/colors.css";
import "./styles/globals.css";
import { Inter } from "next/font/google";
import { basePath } from "@/utils/assetUtil";
import { GlobalProvider } from "@/provider/GlobalProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
