import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { View } from "react-native";

import {
  SettingsActionButton,
  SettingsDetailRow,
  SettingsPanel,
} from "@/components/SettingsUI";
import { ThemedText } from "@/components/ThemedText";
import {
  ExampleMutationDocument,
  ExampleQueryDocument,
  ExampleSubscriptionDocument,
} from "@/services/graphql/generated/graphql";
import { toast } from "@/utils/toast";

const subscriptionsEnabled =
  process.env.EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED === "true";

type GraphQLExamplesProps = {
  title: string;
  description: string;
  queryLabel: string;
  queryLoading: string;
  queryError: string;
  mutationLabel: string;
  mutationRun: string;
  mutationHint: string;
  subscriptionLabel: string;
  subscriptionListening: string;
  subscriptionIdle: string;
  subscriptionHint: string;
};

function QueryExample({
  label,
  loadingLabel,
  errorLabel,
}: {
  label: string;
  loadingLabel: string;
  errorLabel: string;
}) {
  const { data, loading, error, refetch } = useQuery(ExampleQueryDocument);

  return (
    <SettingsDetailRow
      title={label}
      subtitle={
        loading
          ? loadingLabel
          : error
            ? `${errorLabel}: ${error.message}`
            : `data: ${JSON.stringify(data ?? null)}`
      }
    >
      <SettingsActionButton
        label={label}
        onPress={() => {
          void refetch();
        }}
      />
    </SettingsDetailRow>
  );
}

function MutationExample({
  label,
  runLabel,
  hint,
}: {
  label: string;
  runLabel: string;
  hint: string;
}) {
  const [runMutation, { loading, data, error }] = useMutation(ExampleMutationDocument);

  return (
    <SettingsDetailRow title={label} subtitle={hint}>
      <View className="gap-xs">
        <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
          {error
            ? error.message
            : data
              ? `data: ${JSON.stringify(data)}`
              : loading
                ? "…"
                : "—"}
        </ThemedText>
        <SettingsActionButton
          label={runLabel}
          disabled={loading}
          onPress={() => {
            void runMutation()
              .then((result) => {
                if (result.error) {
                  toast.error(label, result.error.message);
                  return;
                }
                toast.success(label, JSON.stringify(result.data ?? {}));
              })
              .catch((err: unknown) => {
                const message = err instanceof Error ? err.message : String(err);
                toast.error(label, message);
              });
          }}
        />
      </View>
    </SettingsDetailRow>
  );
}

function SubscriptionExample({
  label,
  listeningLabel,
  idleLabel,
  hint,
}: {
  label: string;
  listeningLabel: string;
  idleLabel: string;
  hint: string;
}) {
  const { data, loading, error } = useSubscription(ExampleSubscriptionDocument, {
    skip: !subscriptionsEnabled,
  });

  if (!subscriptionsEnabled) {
    return null;
  }

  return (
    <SettingsDetailRow title={label} subtitle={hint}>
      <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
        {error
          ? error.message
          : data
            ? `data: ${JSON.stringify(data)}`
            : loading
              ? listeningLabel
              : idleLabel}
      </ThemedText>
    </SettingsDetailRow>
  );
}

/**
 * Home-screen demos for Apollo query / mutation / subscription.
 * Copy with GraphQL stack. Subscription UI only when
 * EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true.
 */
export function GraphQLExamples({
  title,
  description,
  queryLabel,
  queryLoading,
  queryError,
  mutationLabel,
  mutationRun,
  mutationHint,
  subscriptionLabel,
  subscriptionListening,
  subscriptionIdle,
  subscriptionHint,
}: GraphQLExamplesProps) {
  return (
    <SettingsPanel title={title} description={description}>
      <QueryExample label={queryLabel} loadingLabel={queryLoading} errorLabel={queryError} />
      <MutationExample label={mutationLabel} runLabel={mutationRun} hint={mutationHint} />
      <SubscriptionExample
        label={subscriptionLabel}
        listeningLabel={subscriptionListening}
        idleLabel={subscriptionIdle}
        hint={subscriptionHint}
      />
    </SettingsPanel>
  );
}
