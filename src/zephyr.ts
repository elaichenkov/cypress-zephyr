import type { MochaOptions } from 'mocha';

import { Runner, reporters } from 'mocha';
import { Reporter } from './reporter';

class BaseReporter extends reporters.Base {
  private readonly reporter: Reporter;

  constructor(runner: Runner, options: MochaOptions) {
    super(runner, options);

    this.reporter = new Reporter(runner, options.reporterOptions.projectKey);
    this.reporter.setupZephyrReporter();
  }
}

export = BaseReporter;
