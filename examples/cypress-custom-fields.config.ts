import { defineConfig } from 'cypress';
// @ts-expect-error - no types
import plugin from './dist/src/plugin';

export default defineConfig({
  screenshotOnRunFailure: false,
  reporter: './dist/src/zephyr',
  reporterOptions: {
    projectKey: 'BAE',
    authorizationToken: process.env.ZEPHYR_AUTHORIZATION_TOKEN,
    testCycle: {
      name: `Cypress Automated Tests - ${process.env.CIRCLE_BUILD_NUM}`,
      description: 'This is a test cycle created by Cypress automated tests.',
      customFields: {
        Browser: 'Firefox',
        Device: 'Windows',
      },
    },
  },
  e2e: {
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      plugin(on, config);
    },
  },
});
