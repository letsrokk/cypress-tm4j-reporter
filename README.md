# cypress-tm4j-reporter

## Install

```shell script
$ npm install cypress-tm4j-reporter --save-dev
```

## Usage

### Cypress Reporter Plugin

Not recommended for use. See [Known Issues](#known-issues).  
Example: `cypress.json`
```json5
{
  "projectId": "cypress-example",
  "reporter": "cypress-tm4j-reporter",
  "reporterOptions": {
    "baseUrl": "https://api.tm4j.smartbear.com/rest-api/v2",
    "authToken": "[READACTED]",
    "projectKey": "AQA"
  }
}
```

### Cypress Module API

Programmatic execution example:
`cypress-cli.js`
```js
const cypress = require('cypress')
const {Tm4jUtils} = require('cypress-tm4j-reporter')

cypress.run({
    spec: './cypress/integration/example.spec.js'
}).then(results => {
    let tm4jutils = new Tm4jUtils(results.config.reporterOptions)
    tm4jutils.publishCypressCliResults(results).then(testRuns => {
        console.log("TM4J results published")
        testRuns.forEach(run => {
            console.log(run)
        })
    })
})
```
```shell script
$ node cypress-cli.js
```

## Reporter Options

Following reporter options are available:
- `baseUrl` - base URL for API calls  
Example: `https://api.tm4j.smartbear.com/rest-api/v2`  
- `authToken` - Auth Token for TM4J for Cloud  
- `projectyKey` - Jira project key for test cases and test cycles
- `defaultTestCaseFolderId` - Folder ID for automatically created test cases
- `createTestCases` - create new test case if existing test case key not found
- `createTestCycles` - create new test cycle if existing test cycle key not found
- `specMapping` - define how `*.spec.js` files mapped to TM4J entitiesv  
Example: `execution`, `cycle`
- `cycleName` - test cycle name for `specMapping=execution`
- `environmentProperty` - populate `Environment` for execution with value from property with set name  
Example: `environment` (`cypress run --env "environment=envcode"`)
- `debugOutput` - debug output for reporter

## Known Issues

- Issue with asynchronous reporters in Cypress:  
[Mocha reporter exits before async tasks complete #7139](https://github.com/cypress-io/cypress/issues/7139)