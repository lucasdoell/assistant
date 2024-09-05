import pluginQuery from "@tanstack/eslint-plugin-query";

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: {
    "@tanstack/query": pluginQuery,
  },
};
