# cypress-tm4j-reporter

## Install

```shell script
$ npm install cypress-tm4j-reporter --save-dev
```

## Usage

### Cypress Reporter Plugin

Not recommended for use. See [Known Issues](#known-issues).  
`cypress.json` example:
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

## Known Issues

- Issue with asynchronous reporters in Cypress:  
[Mocha reporter exits before async tasks complete #7139](https://github.com/cypress-io/cypress/issues/7139)