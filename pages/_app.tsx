import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import surveyClient from "../services/surveyService";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={surveyClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
