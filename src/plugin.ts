import { beforeRunHook } from './before-hook';
import { afterRunHook } from './after-hook';

export = (on: Cypress.PluginEvents) => {
  on('before:run', beforeRunHook);
  on('after:run', afterRunHook);
};
