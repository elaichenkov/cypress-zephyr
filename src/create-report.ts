import { createJsonReport, cypressReportPath } from './archive';

const testResults = JSON.parse(process.env['ZEPHYR_TEST_RESULTS']!);
const zephyrReportName = `zephyr-report-${new Date().getTime()}.json`;

createJsonReport(zephyrReportName, cypressReportPath, testResults);
