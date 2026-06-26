import type { ApolloClient } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { type ReactNode, useEffect, useState } from "react";

import { ensureApolloClient } from "@/services/graphql/client";

export function AppApolloProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<ApolloClient | null>(null);

  useEffect(() => {
    ensureApolloClient().then(setClient);
  }, []);

  if (!client) {
    return null;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
