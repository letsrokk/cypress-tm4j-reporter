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
            testResult.status = r.stats.tests === r.stats.passes
                ? "passed"
                : "failed"
            let {startedAt, duration} = this.extractStartedDateAndDurationForRunResult(r)
            testResult.startedAt = startedAt
            testResult.duration = duration
            testResult.comment = this.extractErrorMessageForRunResult(r)
            testRun.results.push(testResult)
        })
        return [testRun]
    }

    private static extractStartedDateAndDurationForRunResult(runResult: CypressCommandLine.RunResult) {
        let startedAt = new Date(runResult.stats.startedAt)
        let duration = runResult.stats.duration;
        return {
            startedAt: new Date(startedAt),
            duration: duration
        }
    }

    private static extractErrorMessageForRunResult(runResult: CypressCommandLine.RunResult) {
        return runResult.tests.find(t => t.displayError).displayError
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
                let {startedAt, duration} = this.extractStartedDateAndDurationForTestResult(tr)
                testResult.startedAt = startedAt
                testResult.duration = duration
                testResult.comment = this.extractErrorMessageForTestResult(tr)
                testRun.results.push(testResult)
            })
            testRuns.push(testRun)
        })
        return testRuns
    }

    private static extractErrorMessageForTestResult(testResult: CypressCommandLine.TestResult) {
        return testResult.displayError
    }

    private static extractStartedDateAndDurationForTestResult(testResult: CypressCommandLine.TestResult) {
        let startedAt = testResult.attempts[0].startedAt
        let duration = 0;
        testResult.attempts.forEach(a => {
            duration += a.duration
        })
        return {
            startedAt: new Date(startedAt),
            duration: duration
        }
    }
}
