import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: [
      "src/app/contact/page.tsx",
      "src/app/membership-agreement/page.tsx",
      "src/app/page.tsx",
      "src/app/privacy-policy/page.tsx",
      "src/app/shop-maintenance/page.tsx",
      "src/app/terms-of-service/page.tsx",
      "src/components/YouTubePlayer.tsx",
    ],
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;