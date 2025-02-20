const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    fixturesFolder: 'cypress/fixtures',
    supportFile: 'cypress/support/index.js',
    specPattern: 'cypress/integration/**/*_spec.{js,jsx,ts,tsx}',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
  },
  projectId: 'central',
});
