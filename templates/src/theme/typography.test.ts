import { colorClassName, isLinkVariant, typographyClassName } from "@/theme/typography";

describe("isLinkVariant", () => {
  it("returns true for underlined link typography tokens", () => {
    expect(isLinkVariant("global-underlined-links-base-link")).toBe(true);
  });

  it("returns false for non-link typography tokens", () => {
    expect(isLinkVariant("global-body-base")).toBe(false);
  });
});

describe("typographyClassName", () => {
  it("uses mobile-first base sizes with lg: overrides per Uniwind breakpoints", () => {
    expect(typographyClassName("global-body-base")).toBe(
      "text-[16px] leading-[21px] font-normal font-[family-name:var(--font-family-system)] lg:text-[18px] lg:leading-[23px]",
    );
  });

  it("does not use Tailwind font-sans or font-mono slots", () => {
    const className = typographyClassName("global-body-base");
    expect(className).not.toContain("font-sans");
    expect(className).not.toContain("font-mono");
  });

  it("includes underline for link variants", () => {
    expect(typographyClassName("global-underlined-links-base-link")).toContain("underline");
  });
});

describe("colorClassName", () => {
  it("maps semantic color tokens to text utilities", () => {
    expect(colorClassName("text-text-default")).toBe("text-text-text-default");
  });
});
