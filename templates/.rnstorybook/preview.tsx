import "@/global.css";

import { withBackgrounds } from "@storybook/addon-ondevice-backgrounds";
import type { Preview } from "@storybook/react-native";

import { withAppProviders } from "@/stories/decorators/with-theme";

const preview: Preview = {
  decorators: [withAppProviders, withBackgrounds],
  parameters: {
    backgrounds: {
      default: "plain",
      values: [
        { name: "plain", value: "transparent" },
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#12284b" },
      ],
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
