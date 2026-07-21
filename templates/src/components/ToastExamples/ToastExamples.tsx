import { SettingsActionButton, SettingsButtonRow, SettingsPanel } from "@/components/SettingsUI";
import { toast } from "@/services/toast";

type ToastExamplesProps = {
  title: string;
  description: string;
  successLabel: string;
  errorLabel: string;
  infoLabel: string;
};

export function ToastExamples({
  title,
  description,
  successLabel,
  errorLabel,
  infoLabel,
}: ToastExamplesProps) {
  return (
    <SettingsPanel title={title} description={description}>
      <SettingsButtonRow>
        <SettingsActionButton label={successLabel} onPress={() => toast.success(successLabel)} />
        <SettingsActionButton label={errorLabel} onPress={() => toast.error(errorLabel)} />
        <SettingsActionButton label={infoLabel} onPress={() => toast.info(infoLabel)} />
      </SettingsButtonRow>
    </SettingsPanel>
  );
}
