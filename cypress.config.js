const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      baseUrl: "https://localhost:5173",
      framework: "react",
      bundler: "vite",
    },
    defaultCommandTimeout: 10000,
  },

  e2e: {
    setupNodeEvents(on, config) {
        baseUrl: "https://localhost:5173"
    },
  },
});
