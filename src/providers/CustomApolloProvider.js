import React from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_HOST, API_PORT} from "@env"

const httpLink = createHttpLink({
  uri: `http://${API_HOST}:${API_PORT}`,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      Authorization: token || ""
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export const CustomApolloProvider = ({children}) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};