import { SettingsActionButton, SettingsButtonRow, SettingsPanel } from "@/components/SettingsUI";
import { analytics } from "@/services/analytics";

type AnalyticsExamplesProps = {
  title: string;
  description: string;
  trackLabel: string;
  identifyLabel: string;
  resetLabel: string;
};

export function AnalyticsExamples({
  title,
  description,
  trackLabel,
  identifyLabel,
  resetLabel,
}: AnalyticsExamplesProps) {
  return (
    <SettingsPanel title={title} description={description}>
      <SettingsButtonRow>
        <SettingsActionButton
          label={trackLabel}
          onPress={() => analytics.track("settings_demo_track", { screen: "settings" })}
        />
        <SettingsActionButton
          label={identifyLabel}
          onPress={() => analytics.identify("demo-user", { source: "settings" })}
        />
        <SettingsActionButton label={resetLabel} onPress={() => analytics.reset()} />
      </SettingsButtonRow>
    </SettingsPanel>
  );
}
