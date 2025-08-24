import "./styles/colors.css";
import "./styles/globals.css";
import { Inter } from "next/font/google";
import { GlobalProvider } from "@/provider/GlobalProvider";
import { DefaultLayout } from "@/components/layout/defaultLayout/DefaultLayout";

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
          <DefaultLayout>{children}</DefaultLayout>
        </GlobalProvider>
      </body>
    </html>
  );
}
