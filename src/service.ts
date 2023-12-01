import type { PathLike } from 'node:fs';
import type { AxiosError } from 'axios';
import type { TestCycle, ServiceOptions } from './types';

import axios from 'axios';
import { inspect } from 'util';
import { createReadStream } from 'fs';
import FormData from 'form-data';
import { printReport } from './terminal-reporter';

function isAxiosError(error: unknown): error is AxiosError {
  return error instanceof Error && 'isAxiosError' in error;
}

export class Service {
  private readonly authorizationToken: string;
  private readonly projectKey: string;
  private readonly testCycle: TestCycle | undefined;
  private readonly url = 'https://api.zephyrscale.smartbear.com/v2';
  private readonly defaultRunName = `Cypress run - [${new Date().toUTCString()}]`;

  constructor(options: ServiceOptions) {
    this.projectKey = options.projectKey;
    this.authorizationToken = options.authorizationToken!;
    this.testCycle = options.testCycle;
  }

  async createTestCycle(testResults: PathLike) {
    const url = `${this.url}/automations/executions/custom?projectKey=${this.projectKey}&autoCreateTestCases=false`;
    const data = new FormData();
    const testCycleDefault = {
      name: this.defaultRunName,
      ...this.testCycle,
    };

    data.append('file', createReadStream(testResults));
    data.append('testCycle', JSON.stringify(testCycleDefault), { contentType: 'application/json' });

    try {
      const response = await axios({
        url,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.authorizationToken}`,
          ...data.getHeaders(),
        },
        data,
      });

      if (response.status !== 200)
        throw new Error(
          `[zephyr reporter]: Failed to create test cycle due to ${response.status} ${response.statusText}\n`,
        );

      const {
        data: { testCycle },
      } = response;

      printReport(testCycle);

      return response.data;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  handleAxiosError(error: unknown): void {
    if (isAxiosError(error)) {
      console.error(`Config: ${inspect(error.config)}`);

      if (error.response) {
        throw new Error(
          `\nStatus: ${error.response.status} \nHeaders: ${inspect(error.response.headers)} \nData: ${inspect(
            error.response.data,
          )}`,
        );
      } else if (error.request) {
        throw new Error(`The request was made but no response was received. \n Error: ${inspect(error.toJSON())}`);
      } else {
        throw new Error(
          `Something happened in setting up the request that triggered an Error\n : ${inspect(error.message)}`,
        );
      }
    }

    throw new Error(`\nUnknown error: ${error}`);
  }
}
