import { createNanoIconSet, type IconProps as NanoIconProps } from "react-native-nano-icons";
import { withUniwind } from "uniwind";

import glyphMap from "@/assets/icons/app-icons.glyphmap.json";
import type { ColorTokenName } from "@/theme";
import { accentColorClassName } from "@/theme/typography";

const NanoIcon = createNanoIconSet(glyphMap);
const StyledNanoIcon = withUniwind(NanoIcon);

export type IconName = keyof typeof glyphMap.i;

export const iconFontFamily = glyphMap.m.f;

type CustomIconProps = Omit<NanoIconProps<IconName>, "color"> & {
  size?: number;
  color?: string;
  colorToken?: ColorTokenName;
};

export function Icon({ color, colorToken = "text-text-default", ...props }: CustomIconProps) {
  if (color != null) {
    return <NanoIcon {...props} color={color} />;
  }

  return <StyledNanoIcon {...props} colorClassName={accentColorClassName(colorToken)} />;
}

export { NanoIcon };
