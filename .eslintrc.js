module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "jest"],
  extends: ["eslint:recommended", "plugin:import/typescript"],
  rules: {
    "import/first": "error",
    "import/named": "error",
    "import/no-absolute-path": "error",
    // "import/no-cycle": "error",
    "import/no-mutable-exports": "error",
    "import/no-self-import": "error",
    "import/no-unused-modules": "error",
    "import/no-useless-path-segments": [
      "error",
      {
        noUselessIndex: true,
      },
    ],
    "import/no-default-export": "error",
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        // "groups": ["index", "sibling", "parent", "internal", "external", "builtin", "object"],
        "newlines-between": "always",
      },
    ],
    "no-extra-semi": "off",
    "no-undef": "off",
    "no-unused-vars": "off",
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
      ],
      rules: {
        "@typescript-eslint/explicit-function-return-type": [
          "warn",
          {
            allowExpressions: true,
          },
        ],
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": [
          "error",
          {
            allowSingleExtends: true,
          },
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-use-before-define": [
          "error",
          { functions: false },
        ],
        "prefer-spread": "off",
      },
    },
    {
      files: ["*.test.ts", "*.test.tsx"],
      extends: ["plugin:jest/recommended"],
      rules: {
        "no-empty": "warn",
        "@typescript-eslint/ban-ts-comment": "warn",
      },
    },
  ],
}
