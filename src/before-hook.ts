import { readdirSync, unlinkSync, existsSync } from 'node:fs';
import { cypressReportPath } from './archive';

type Options = {
  projectKey: string;
  authorizationToken: string;
};

function validateOptions(options: Options) {
  if (!options.projectKey) throw new Error('[zephyr reporter] "projectKey" is required');
  if (!options.authorizationToken) throw new Error('[zephyr reporter] "authorizationToken" env is required');
}

export function beforeRunHook(details: Cypress.BeforeRunDetails) {
  validateOptions(details.config.reporterOptions as Options);

  try {
    if (!existsSync(cypressReportPath)) return;

    const files = readdirSync(cypressReportPath);

    for (const file of files) {
      unlinkSync(`${cypressReportPath}/${file}`);
    }
  } catch (error) {
    console.error(`[zephyr reporter] Failed to clean up previous reports: ${error}`);
  }
}
