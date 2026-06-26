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
      "text-[16px] leading-[22px] font-normal font-sans lg:text-[18px] lg:leading-[25px]",
    );
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
