import { defineConfig } from 'cypress';
// @ts-expect-error - no types
import plugin from 'cypress-zephyr/dist/plugin';

export default defineConfig({
  screenshotOnRunFailure: false,
  reporter: 'cypress-zephyr',
  reporterOptions: {
    projectKey: 'BRE',
    authorizationToken: process.env.ZEPHYR_AUTHORIZATION_TOKEN,
  },
  e2e: {
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      plugin(on, config);
    },
  },
});
