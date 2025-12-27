import { render, screen } from "@testing-library/react";
import { Footer } from "@repo/ui";

describe("Footer component", () => {
  it("renders without crashing", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
