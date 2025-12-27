import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("Home Page – real UI tests", () => {

  it("renders main section headings", () => {
    render(<HomePage />);
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("renders Urban Planning section image", () => {
    render(<HomePage />);
    expect(
      screen.getByAltText(/urban planning/i)
    ).toBeInTheDocument();
  });

});
