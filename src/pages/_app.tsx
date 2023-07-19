import type { AppProps } from 'next/app'
// import global css here

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
