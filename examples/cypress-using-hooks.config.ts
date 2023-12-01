import { defineConfig } from 'cypress';
// @ts-expect-error - no types
import { beforeRunHook as awesomeBeforeHook, afterRunHook as awesomeAfterHook } from 'cypress-mochawesome-reporter/lib';
import { beforeRunHook as zephyrBeforeHook } from '../src/before-hook';
import { afterRunHook as zephyrAfterHook } from '../src/after-hook';

export default defineConfig({
  screenshotOnRunFailure: false,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'cypress-mochawesome-reporter, cypress-zephyr',
    projectKey: 'BAE',
    authorizationToken: process.env.ZEPHYR_AUTHORIZATION_TOKEN,
  },
  e2e: {
    setupNodeEvents(on: Cypress.PluginEvents) {
      on('before:run', async (details) => {
        await awesomeBeforeHook(details);
        zephyrBeforeHook(details);
      });

      on('after:run', async (results: CypressCommandLine.CypressRunResult | CypressCommandLine.CypressFailedRunResult) => {
          await awesomeAfterHook();
          zephyrAfterHook(results);
        },
      );
    },
  },
});
