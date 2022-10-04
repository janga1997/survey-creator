import { ApolloClient, InMemoryCache } from "@apollo/client";

const surveyClient = new ApolloClient({
  uri: "https://survey-creator-api.herokuapp.com/v1/graphql",
  cache: new InMemoryCache(),
});

export default surveyClient;
