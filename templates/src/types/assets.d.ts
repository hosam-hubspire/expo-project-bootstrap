declare module "*.ttf" {
  const value: number;
  export default value;
}

declare module "*.css";

declare module "*.glyphmap.json" {
  import type { NanoGlyphMapInput } from "react-native-nano-icons";

  const glyphMap: NanoGlyphMapInput;
  export default glyphMap;
}
