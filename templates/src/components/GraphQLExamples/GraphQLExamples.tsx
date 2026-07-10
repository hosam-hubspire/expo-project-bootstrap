import { useQuery } from "@apollo/client/react";

import {
  SettingsActionButton,
  SettingsDetailRow,
  SettingsPanel,
} from "@/components/SettingsUI";
import { ExampleQueryDocument } from "@/services/graphql/generated/graphql";

type GraphQLExamplesProps = {
  title: string;
  description: string;
  queryLabel: string;
  queryLoading: string;
  queryError: string;
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

/** Home-screen demo for Apollo query. Copy with GraphQL stack. */
export function GraphQLExamples({
  title,
  description,
  queryLabel,
  queryLoading,
  queryError,
}: GraphQLExamplesProps) {
  return (
    <SettingsPanel title={title} description={description}>
      <QueryExample label={queryLabel} loadingLabel={queryLoading} errorLabel={queryError} />
    </SettingsPanel>
  );
}
