import { defineConfig } from 'cypress';
import zephyrPlugin from './dist/plugin';

export default defineConfig({
  screenshotOnRunFailure: false,
  reporter: './dist/index',
  reporterOptions: {
    projectKey: 'XEC',
    authorizationToken: process.env.ZEPHYR_AUTHORIZATION_TOKEN,
  },
  e2e: {
    setupNodeEvents(on: Cypress.PluginEvents) {
      zephyrPlugin(on);
    },
  },
});
