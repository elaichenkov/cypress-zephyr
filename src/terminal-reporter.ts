import { bold, green, blue, gray } from 'colors';
import { table, getBorderCharacters } from 'table';

export function printReport(testCycle: { url: string; key: string }) {
  const tableData = [
    [bold(green(`✅ Test cycle ${testCycle.key} has been created`))],
    [bold(gray('👇 Check out the test result'))],
    [bold(blue(`🔗 ${testCycle.url}`))],
  ];

  const report = table(tableData, {
    border: getBorderCharacters('norc'),
    singleLine: true,
  });

  console.log(bold('\n📋 Zephyr Scale Report details:'));
  console.log(report);
}
