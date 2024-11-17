import apolloClient from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
// import "@/pages/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
