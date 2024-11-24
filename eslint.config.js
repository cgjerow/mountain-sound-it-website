import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

// eslint.config.js
export default [
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended
  ),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      semi: "error",
      "prefer-const": "error",
    },
  },
  eslintConfigPrettier,
];
