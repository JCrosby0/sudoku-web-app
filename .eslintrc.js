module.exports = {
  root: true,

  env: {
    node: true
  },

  parserOptions: {
    parser: "babel-eslint"
  },

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "vue/attributes-order": "warn",
    "vue/no-confusing-v-for-v-if": "error",
    "vue/this-in-template": "error",
    "vue/array-bracket-spacing": "warn",
    "vue/arrow-spacing": "warn",
    "vue/brace-style": "warn",
    "vue/match-component-file-name": "warn",
    "vue/no-reserved-component-names": "warn",
    "vue/no-static-inline-styles": "error",
    "vue/object-curly-spacing": "error",
    "vue/require-name-property": "error",
    "vue/block-spacing": "warn",
    "vue/component-tags-order": "off",
    "vue/key-spacing": "error"
  },

  extends: [
    "plugin:vue/strongly-recommended",
    "eslint:recommended",
    "@vue/prettier"
  ]
};
