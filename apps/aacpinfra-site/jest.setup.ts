import dotenv from "dotenv";
import "@testing-library/jest-dom";

dotenv.config({
  path: ".env.local",
  quiet: true,
});

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));
