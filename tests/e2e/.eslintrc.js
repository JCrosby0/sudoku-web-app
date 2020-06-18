module.exports = {
  plugins: ["cypress"],
  env: {
    mocha: true,
    "cypress/globals": true
  },
  rules: {
    strict: "off",
    "object-curly-newline": [
      0,
      {
        multiline: false
      }
    ],
    "object-property-newline": [
      2,
      {
        allowAllPropertiesOnSameLine: true
      }
    ]
  }
};
