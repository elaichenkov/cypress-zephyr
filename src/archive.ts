import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import AdmZip from 'adm-zip';

export const cypressReportPath = 'cypress/reports/zephyr';

export function archiveReport(filename: string, reportPath: string) {
  try {
    const zip = new AdmZip();
    const jsonReportPath = join(process.cwd(), reportPath, filename);
    const zipPath = join(process.cwd(), reportPath, `${filename}.zip`);

    zip.addLocalFile(jsonReportPath);
    zip.writeZip(zipPath);

    return zipPath;
  } catch (error) {
    console.error(`Failed to prepare reporter archive: ${error}`);

    throw error;
  }
}

function createReporterDirectory(filePath: string) {
  if (!existsSync(filePath)) {
    mkdirSync(filePath, { recursive: true });
  }
}

export function createJsonReport(filename: string, filePath: string, executions: unknown) {
  const jsonReport = JSON.stringify({ version: 1, executions: executions }, null, 2);
  const jsonReportPath = join(process.cwd(), filePath, filename);

  try {
    createReporterDirectory(filePath);
    writeFileSync(jsonReportPath, jsonReport);

    return jsonReportPath;
  } catch (error) {
    console.error(`Failed to create reporter JSON: ${error}`);

    throw error;
  }
}
