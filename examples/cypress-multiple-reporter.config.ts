import { defineConfig } from 'cypress';
import { initPlugins } from 'cypress-plugin-init';
import awesomeReporter from 'cypress-mochawesome-reporter/plugin';
// @ts-expect-error - no types
import zephyrPlugin from 'cypress-zephyr/dist/plugin';

export default defineConfig({
  screenshotOnRunFailure: false,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'cypress-mochawesome-reporter, cypress-zephyr',
    projectKey: 'BAE',
    authorizationToken: process.env.ZEPHYR_AUTHORIZATION_TOKEN,
  },
  e2e: {
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      // you need to install the cypress-plugin-init package first
      // npm i -D cypress-plugin-init
      initPlugins(on, [awesomeReporter, zephyrPlugin], config);
    },
  },
});
