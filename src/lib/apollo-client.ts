import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Create an HTTP link to the GraphQL API
const httpLink = new HttpLink({
  uri: '/api/graphql',
});

// Create the Apollo Client instance
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
}); 