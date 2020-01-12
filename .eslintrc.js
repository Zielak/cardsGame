module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  extends: ["eslint:recommended"],
  rules: {
    "no-extra-semi": "off",
    "no-undef": "off",
    "no-unused-vars": "warn",
    "prefer-const": "warn"
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint"
      ],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": [
          "error",
          {
            allowSingleExtends: true
          }
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-use-before-define": [
          "error",
          { functions: false }
        ]
      }
    },
    {
      files: ["*.test.ts", "*.test.tsx"],
      extends: ["plugin:jest/recommended"]
    }
  ]
}
