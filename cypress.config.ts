import { defineConfig } from "cypress";

export default defineConfig({
  video: false,

  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
