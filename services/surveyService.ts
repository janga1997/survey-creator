import { ApolloClient, InMemoryCache } from "@apollo/client";

const surveyClient = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
});

export default surveyClient;
