import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apolloClient } from "./lib/api/apiSlice";
import { ApolloProvider } from "@apollo/client";
import { store } from "./store";
import { Provider } from "react-redux";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
            <App />
        </ApolloProvider>
      </QueryClientProvider>
    </Provider>
);
