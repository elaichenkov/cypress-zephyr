# cypress-zephyr

## Description

This is a Cypress plugin that allows you to link your Cypress tests to Zephyr test cases and upload Cypress test results to Zephyr.

## Installation

```shell
npm install -D cypress-zephyr
```

## Usage

You need to add the following to your `cypress.config.ts` file:

```ts
import zephyrPlugin from 'cypress-zephyr';

export default defineConfig({
  reporter: 'cypress-zephyr',
  reporterOptions: {
    projectKey: 'HEX', // Jira and Zephyr project key
    authorizationToken: process.env.ZEPHYR_AUTHORIZATION_TOKEN,
  },
  e2e: {
    setupNodeEvents(on, config) {
      zephyrPlugin(on, config);
    },
  },
});
```

Do not forget to add `ZEPHYR_AUTHORIZATION_TOKEN` to your environment variables. The token can be generated in Zephyr settings. Read more about it [here](https://support.smartbear.com/zephyr-scale-cloud/docs/rest-api/generating-api-access-tokens.html).

## Test case linking

To link your Cypress test to a Zephyr test case you need to add a `[R432]` tag to your test case title. The tag should contain a test case key.

For example, your test case id in Zephyr is `HEX-R432` then you need to add `[R432]` to your test case title. For instance:

```ts
describe('Main page', () => {
  it('[R432] should do something', () => {
    // ...
  });
});
```

After that you can run your tests as usual and see the results in Zephyr by clicking the link from terminal. The link will be printed after the tests are finished. Something like this:

```shell
📋 Zephyr Scale Report details:
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ✅ Test cycle HEX-R9374 has been created                                                                                                                                        │
│ 👇 Check out the test result                                                                                                                                                    │
│ 🔗 https://company-x.atlassian.net/projects/HEX?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testPlayer/HEX-R9374 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Please take a look at the [examples](./examples/) for different set up.

## Author

Yevhen Laichenkov <elaichenkov@gmail.com>

## License

[MIT](./LICENSE)
