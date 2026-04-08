module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
    sourceType: "module",
    ecmaVersion: "latest"
  }
}
