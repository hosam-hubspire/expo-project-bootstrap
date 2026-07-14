import { useCallback, useEffect, useState } from "react";

import { SettingsActionButton, SettingsDetailRow, SettingsPanel } from "@/components/SettingsUI";
import { type ExampleTodo, fetchExampleTodo } from "@/services/rest/client";

type RestExamplesProps = {
  title: string;
  description: string;
  fetchLabel: string;
  fetchLoading: string;
  fetchError: string;
};

/**
 * Home-screen demo for axios GET.
 * Dev placeholder: JSONPlaceholder todo — replace `fetchExampleTodo` with your endpoints.
 */
export function RestExamples({
  title,
  description,
  fetchLabel,
  fetchLoading,
  fetchError,
}: RestExamplesProps) {
  const [data, setData] = useState<ExampleTodo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchExampleTodo(1));
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <SettingsPanel title={title} description={description}>
      <SettingsDetailRow
        title={fetchLabel}
        subtitle={
          loading
            ? fetchLoading
            : error
              ? `${fetchError}: ${error}`
              : `data: ${JSON.stringify(data ?? null)}`
        }
      >
        <SettingsActionButton
          label={fetchLabel}
          onPress={() => {
            void load();
          }}
        />
      </SettingsDetailRow>
    </SettingsPanel>
  );
}
