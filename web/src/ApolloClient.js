// src/ApolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://taskflow-backend-production-6064.up.railway.app/graphql', // your live backend
  }),
  cache: new InMemoryCache(),
});

export default client;
