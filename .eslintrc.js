module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: ["plugin:react/recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  plugins: ["simple-import-sort"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-namespace": "off",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["^react", "^@?\\w"],
          ["^(@|components)(/.*|$)"],
          ["^\\u0000"],
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          ["^.+\\.?(css)$"],
        ],
      },
    ],
    "simple-import-sort/exports": "error",
  },
};
