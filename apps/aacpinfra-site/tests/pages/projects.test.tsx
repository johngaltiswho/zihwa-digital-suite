import { render, screen } from "@testing-library/react";
import ProjectsPage from "@/app/projects/page";

describe("Projects Page – real UI tests", () => {
  it("renders page headings", () => {
    render(<ProjectsPage />);
    expect(screen.getAllByRole("heading").length).toBeGreaterThan(0);
  });

  it("renders project cards or links", () => {
    render(<ProjectsPage />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });
});
