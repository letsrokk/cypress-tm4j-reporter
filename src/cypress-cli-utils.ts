import {TestResult, TestRun} from "./test-results";
import {Tm4jOptions} from "./tm4j-utils";
import "cypress"

export class CypressCliUtils {
    static convertCypressRunResult(results: CypressCommandLine.CypressRunResult, options: Tm4jOptions) {
        let testRuns: TestRun[]
        if (!options.specMapping || options.specMapping === "cycle") {
            testRuns = this.convertSpecsToTestCycles(results)
        } else {
            testRuns = this.convertSpecsToTests(results, options.cycleName)
        }
        return testRuns
    }

    private static convertSpecsToTests(results: CypressCommandLine.CypressRunResult, testCycleName: string) {
        let testRun = new TestRun()
        testRun.name = testCycleName
            ? testCycleName
            : "Cypress Test Cycle"
        testRun.results = []
        results.runs.forEach(r => {
            let testResult = new TestResult()
            testResult.name = r.tests[0].title[0]
            testResult.status = r.stats.failures > 0
                ? "failed"
                : "passed"
            testRun.results.push(testResult)
        })
        return [testRun]
    }

    private static convertSpecsToTestCycles(results: CypressCommandLine.CypressRunResult) {
        let testRuns: TestRun[] = []
        results.runs.forEach(r => {
            let testRun = new TestRun()
            testRun.name = r.tests[0].title[0]
            testRun.results = []
            r.tests.forEach(tr => {
                let testResult = new TestResult()
                testResult.name = tr.title[1]
                testResult.status = tr.state
                testRun.results.push(testResult)
            })
            testRuns.push(testRun)
        })
        return testRuns
    }
}
