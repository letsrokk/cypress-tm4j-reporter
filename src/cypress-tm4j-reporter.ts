import {Tm4jUtils} from "./tm4j-utils"
import {TestResult, TestRun} from "./test-results";

module.exports = CypressTm4jReporter

function CypressTm4jReporter(runner, options) {

    var testRun: TestRun = new TestRun()
    var tm4jUtils: Tm4jUtils = new Tm4jUtils(options.reporterOptions)

    runner.on('suite', suite => {
        if (suite.root === false) {
            testRun.name = suite.title
            testRun.results = []
        }
    });

    runner.on('test end', test => {
        let result = new TestResult()
        result.name = test.title
        result.status = test.state
        result.duration = extractDuration(test)
        result.comment = extractErrorMessage(test)
        testRun.results.push(result)
    })

    runner.on('suite end', suite => {
        if (suite.root === false) {
            tm4jUtils.publishReporterResults(testRun).then(testRun => {
                console.log("Results Published:")
                console.log(testRun)
            })
        }
    });

    function extractDuration(test) {
        let duration = test.duration
        if (test.prevAttempts && test.prevAttempts.length > 0) {
            test.prevAttempts.forEach(a => {
                duration += a.duration
            })
        }
        return duration
    }

    function extractErrorMessage(test) {
        if (test.err) {
            return test.err.sourceMappedStack
        } else {
            return undefined
        }
    }

}