module.exports = {
  root: true,

  env: { node: true },

  parserOptions: { parser: "babel-eslint" },

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "vue/attributes-order": "error",
    "vue/no-confusing-v-for-v-if": "error",
    "vue/this-in-template": "error",
    "vue/array-bracket-spacing": "warn",
    "vue/arrow-spacing": "warn",
    "vue/brace-style": "warn",
    "vue/match-component-file-name": "warn",
    "vue/no-reserved-component-names": "warn",
    "vue/no-static-inline-styles": "error",
    "vue/object-curly-spacing": "warn",
    "vue/require-name-property": "error",
    "vue/block-spacing": "warn",
    "vue/key-spacing": "warn",
    "object-curly-newline": [2, { multiline: true }],
    "object-property-newline": [2, { allowAllPropertiesOnSameLine: true }]
  },

  extends: [
    "plugin:vue/strongly-recommended",
    "eslint:recommended",
    "@vue/prettier"
  ],

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
        "**/tests/e2e/**/*.spec.{j,t}s?(x)"
      ],
      env: { jest: true }
    }
  ]
};
