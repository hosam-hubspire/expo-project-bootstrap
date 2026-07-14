import { render, screen } from "@testing-library/react-native";

import { ThemedText } from "./ThemedText";

describe("ThemedText", () => {
  it("renders children", async () => {
    await render(<ThemedText>Hello</ThemedText>);
    expect(screen.getByText("Hello")).toBeOnTheScreen();
  });
});
