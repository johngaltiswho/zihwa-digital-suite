import { render, screen } from "@testing-library/react";
import NewsPage from "@/app/news/page";

describe("News Page – real UI tests", () => {
  it("renders news cards", () => {
    render(<NewsPage />);

    // checks at least one news image exists
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("renders news links", () => {
    render(<NewsPage />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });
});
