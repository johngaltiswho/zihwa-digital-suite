import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",

  testMatch: ["<rootDir>/tests/**/*.test.ts?(x)"],

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",

    // ✅ FULL UI PACKAGE MOCK
    "^@repo/ui$": "<rootDir>/__mocks__/repoUi.tsx",

    // ✅ HARD BLOCK SWIPER COMPLETELY
    "^swiper/.*$": "<rootDir>/__mocks__/swiperMock.ts",

    "^next/font/google$": "<rootDir>/__mocks__/nextFontGoogle.ts",
  },
};

export default config;
