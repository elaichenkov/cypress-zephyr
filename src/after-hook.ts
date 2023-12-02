import { readdirSync, readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { Service } from './service';
import { archiveReport, cypressReportPath } from './archive';
import { ServiceOptions } from './types';

function mergeZephyrReports(): string | null {
  const mergedReportName = `zephyr-merged-report-${new Date().getTime()}.json`;

  if (existsSync(cypressReportPath)) {
    const files = readdirSync(cypressReportPath);
    const zephyrReports = files.filter((file) => file.startsWith('zephyr-report-') && file.endsWith('.json'));
    const mergedReport = { version: 1, executions: [] };

    for (const report of zephyrReports) {
      const reportData: { executions: [] } = JSON.parse(readFileSync(`./${cypressReportPath}/${report}`, 'utf-8'));

      if (Array.isArray(reportData.executions)) {
        mergedReport.executions.push(...reportData.executions);
      }

      unlinkSync(`./${cypressReportPath}/${report}`);
    }

    if (mergedReport.executions.length) {
      writeFileSync(`./${cypressReportPath}/${mergedReportName}`, JSON.stringify(mergedReport, null, 2));

      return mergedReportName;
    }
  }

  return null;
}

function getZephyrOptions(results: CypressCommandLine.CypressRunResult): ServiceOptions {
  if (
    results.config.reporter === 'cypress-multi-reporters' &&
    results.config.reporterOptions.reporterEnabled.includes('cypress-zephyr')
  ) {
    return {
      projectKey: results.config.reporterOptions.cypressZephyrReporterOptions.projectKey,
      authorizationToken: results.config.reporterOptions.cypressZephyrReporterOptions.authorizationToken,
      testCycle: results.config.reporterOptions.cypressZephyrReporterOptions.testCycle,
      autoCreateTestCases: results.config.reporterOptions.cypressZephyrReporterOptions.autoCreateTestCases,
      nodeInternalTlsRejectUnauthorized:
        results.config.reporterOptions.cypressZephyrReporterOptions.nodeInternalTlsRejectUnauthorized,
    };
  }

  return {
    projectKey: results.config.reporterOptions.projectKey,
    authorizationToken: results.config.reporterOptions.authorizationToken,
    testCycle: results.config.reporterOptions.testCycle,
    autoCreateTestCases: results.config.reporterOptions.autoCreateTestCases,
    nodeInternalTlsRejectUnauthorized: results.config.reporterOptions.nodeInternalTlsRejectUnauthorized,
  };
}

export function afterRunHook(results: CypressCommandLine.CypressRunResult | CypressCommandLine.CypressFailedRunResult) {
  const zephyrReportJsonPath = mergeZephyrReports();

  if (zephyrReportJsonPath) {
    const zephyrReportZipPath = archiveReport(zephyrReportJsonPath, cypressReportPath);
    const zephyrOptions = getZephyrOptions(results as CypressCommandLine.CypressRunResult);
    const zephyrService = new Service(zephyrOptions);

    return zephyrService.createTestCycle(zephyrReportZipPath);
  }

  console.log('[zephyr reporter]: No zephyr reports found. Skipping cycle creation...');
  return;
}
