import type { ZephyrTestResult } from './types';

import { Runner, Test } from 'mocha';
import { spawnSync } from 'child_process';
import { gray } from 'colors';

const { EVENT_RUN_END, EVENT_TEST_FAIL, EVENT_TEST_PASS, EVENT_TEST_PENDING } = Runner.constants;

export class Reporter {
  private readonly projectKey: string;
  private readonly testResults: ZephyrTestResult[] = [];
  private readonly testCaseKeyRegex = /\[(.*?)\]/;
  private readonly mochaRunner: Runner;

  constructor(mochaRunner: Runner, projectKey: string) {
    this.mochaRunner = mochaRunner;
    this.projectKey = projectKey;
  }

  private convertStatus(status: string) {
    if (status === 'failed') return 'Fail';
    if (status === 'passed') return 'Pass';
    if (status === 'timedOut') return 'Blocked';

    return 'Not Executed';
  }

  public storeTestResult(test: Test) {
    const title = test.fullTitle();
    const matchedTestCaseKey = title.match(this.testCaseKeyRegex);

    if (matchedTestCaseKey && matchedTestCaseKey.length > 1) {
      const [, testCaseId] = matchedTestCaseKey;
      const testCaseKey = `${this.projectKey}-${testCaseId}`;
      const result = this.convertStatus(test.state!);

      const comment = test.isFailed()
        ? `<b>❌ Error Message: </b> <br> <span style="color: rgb(226, 80, 65);">${test.err?.name} - ${
            test.err?.message
            // @ts-expect-error - TODO: fix this
          }</span> <br> <br> <b>📍 Code Frame:</b> <br> <span style="color: rgb(226, 80, 65);">${test.err?.codeFrame?.frame?.replaceAll(
            '\n',
            '<br>',
            // @ts-expect-error - TODO: fix this
          )}</span> <br> <br> <b> 📂 File Path:</b> <br>${test.err?.codeFrame?.absoluteFile}`
        : undefined;

      this.testResults.push({
        result,
        testCase: {
          key: testCaseKey,
          comment,
        },
      });
    }
  }

  public createReport() {
    if (this.testResults.length) {
      spawnSync('node', [`${__dirname}/create-report.js`], {
        stdio: 'inherit',
        env: Object.assign(process.env, {
          ZEPHYR_PROJECT_KEY: this.projectKey,
          ZEPHYR_TEST_RESULTS: JSON.stringify(this.testResults),
        }),
      });
    } else {
      console.log(gray(`[zephyr reporter] There's no Zephyr test case id in this spec file`));
    }
  }

  setupZephyrReporter() {
    this.mochaRunner
      .on(EVENT_TEST_PASS, (test) => this.storeTestResult(test))
      .on(EVENT_TEST_FAIL, (test) => this.storeTestResult(test))
      .on(EVENT_TEST_PENDING, (test) => this.storeTestResult(test))
      .once(EVENT_RUN_END, () => this.createReport());
  }
}
