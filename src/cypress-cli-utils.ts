import {TestResult, TestRun} from "./test-results";
import "cypress"

export class CypressCliUtils {
    static convertCypressRunResult(results: CypressCommandLine.CypressRunResult) {
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
