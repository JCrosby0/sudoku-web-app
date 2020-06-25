module.exports = {
  root: true,

  env: {
    node: true,
    es6: true
  },

  parserOptions: {
    parser: "babel-eslint"
  },

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "vue/attributes-order": "error",
    "vue/no-confusing-v-for-v-if": "error",
    "vue/this-in-template": "error",
    "vue/match-component-file-name": "warn",
    "vue/no-reserved-component-names": "warn",
    "vue/no-static-inline-styles": "error",
    "vue/require-name-property": "error"
    // "vue/array-bracket-spacing": "warn",
    // "vue/arrow-spacing": "warn",
    // "vue/brace-style": "warn",
    // "vue/object-curly-spacing": "warn",
    // "vue/block-spacing": "warn",
    // "vue/key-spacing": "warn",
    // "object-curly-newline": [2, {
    //   multiline: true
    // }],
    // "object-property-newline": [2, {
    //   allowAllPropertiesOnSameLine: true
    // }]
  },

  extends: [
    // "@vue/prettier",
    "plugin:vue/strongly-recommended",
    // "eslint:recommended",
    "prettier",
    "prettier/vue"
  ],

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
        "**/tests/e2e/**/*.spec.{j,t}s?(x)"
      ]
    }
  ]
};
