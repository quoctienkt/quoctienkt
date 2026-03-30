import './styles/colors.css';
import './styles/globals.css';
import { Inter } from 'next/font/google';
import { GlobalProvider } from '@/provider/GlobalProvider';
import { DefaultLayout } from '@/components/layout/defaultLayout/DefaultLayout';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <GlobalProvider>
          <DefaultLayout>{children}</DefaultLayout>
        </GlobalProvider>
      </body>
    </html>
  );
}
