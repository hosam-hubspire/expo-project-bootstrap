import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
    <View className="gap-xs border-t border-stroke-default pt-sm">
      <ThemedText variant="global-body-small-bold">{label}</ThemedText>
      <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
        {loading
          ? loadingLabel
          : error
            ? `${errorLabel}: ${error.message}`
            : `data: ${JSON.stringify(data ?? null)}`}
      </ThemedText>
      <Pressable
        onPress={() => {
          void refetch();
        }}
        className="min-h-10 items-center justify-center rounded-input border border-stroke-default bg-surface-default px-sm py-xs active:opacity-80"
        accessibilityRole="button"
      >
        <ThemedText variant="global-body-small-bold">{label}</ThemedText>
      </Pressable>
    </View>
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
    <View className="gap-xs border-t border-stroke-default pt-sm">
      <ThemedText variant="global-body-small-bold">{label}</ThemedText>
      <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
        {hint}
      </ThemedText>
      <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
        {error
          ? error.message
          : data
            ? `data: ${JSON.stringify(data)}`
            : loading
              ? "…"
              : "—"}
      </ThemedText>
      <Pressable
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
        className="min-h-10 items-center justify-center rounded-input border border-stroke-default bg-surface-default px-sm py-xs active:opacity-80"
        accessibilityRole="button"
      >
        <ThemedText variant="global-body-small-bold">{runLabel}</ThemedText>
      </Pressable>
    </View>
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
    <View className="gap-xs border-t border-stroke-default pt-sm">
      <ThemedText variant="global-body-small-bold">{label}</ThemedText>
      <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
        {hint}
      </ThemedText>
      <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
        {error
          ? error.message
          : data
            ? `data: ${JSON.stringify(data)}`
            : loading
              ? listeningLabel
              : idleLabel}
      </ThemedText>
    </View>
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
    <ThemedView colorToken="surface-secondary" className="w-full gap-sm rounded-panel p-base">
      <View className="gap-2xs">
        <ThemedText variant="global-body-small-bold">{title}</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          {description}
        </ThemedText>
      </View>

      <QueryExample label={queryLabel} loadingLabel={queryLoading} errorLabel={queryError} />
      <MutationExample label={mutationLabel} runLabel={mutationRun} hint={mutationHint} />
      <SubscriptionExample
        label={subscriptionLabel}
        listeningLabel={subscriptionListening}
        idleLabel={subscriptionIdle}
        hint={subscriptionHint}
      />
    </ThemedView>
  );
}
