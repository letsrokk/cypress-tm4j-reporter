import {TestCase, TestCycle, TestExecution, Tm4jApi} from "./tm4j-api";
import {AxiosPromise} from "axios";
import {TestRun} from "./test-results";
import {CypressCliUtils} from "./cypress-cli-utils";
import {Parsers} from "./parsers"

import "cypress"

export class Tm4jUtils {

    private tm4j: Tm4jApi
    private options: Tm4jOptions

    constructor(options: Tm4jOptions) {
        this.options = options
        this.tm4j = new Tm4jApi(options.baseUrl, options.authToken)
    }

    public async publishReporterResults(testRun: TestRun) {
        let testCycle = await this.prepareTestCycle(testRun)
        let testExecutions = await this.prepareTestExecutions(testRun)
        await this.publishExecutionResults(testExecutions)
        return testRun
    }

    public async publishCypressCliResults(cypressRunResult: CypressCommandLine.CypressRunResult) {
        let testRuns: TestRun[] = []
        for (const testRun of CypressCliUtils.convertCypressRunResult(cypressRunResult, this.options)) {
            testRuns.push(
                await this.publishReporterResults(testRun).then(testRun => { return testRun })
            )
        }
        return testRuns
    }

    private async prepareTestCycle(testRun: TestRun) {
        let { key, name } = Parsers.titleToKeyAndName(testRun.name)
        testRun.key = key
        testRun.name = name

        if (!testRun.key) {
            let projectTestCycles: TestCycle[] =
                await this.tm4j.getTestCyclesByProjectKey(this.options.projectKey).then(response => response.data.values)
            let existingTestCycle =
                projectTestCycles.find(tc => tc.name === testRun.name)
            if (existingTestCycle) {
                testRun.key = existingTestCycle.key
            } else {
                testRun.key =
                    await this.tm4j.createTestCycle(this.options.projectKey, testRun.name).then(response => response.data.key)
            }
        }

        return new TestCycle(testRun.key, testRun.name)
    }

    private async prepareTestExecutions(testRun: TestRun) {
        testRun.results.forEach(r => {
            let {key, name} = Parsers.titleToKeyAndName(r.name)
            r.key = key
            r.name = name
        })
        if (testRun.results.find(r => !r.key)) {
            let testCases: TestCase[] =
                await this.tm4j.getTestCasesByProjectKey(this.options.projectKey).then(response => response.data.values)
            testRun.results.filter(r => !r.key).forEach(r => {
                let testCase = testCases.find(tc => tc.name === r.name)
                if (testCase) {
                    r.key = testCase.key
                }
            })
        }

        for (const result of testRun.results.filter(r => !r.key)) {
            result.key = await this.tm4j.createTestCase(this.options.projectKey, result.name, this.options.defaultTestCaseFolderId)
                .then(response => response.data.key)
        }

        return testRun.results.map(r => {
            let execution = new TestExecution()
            execution.projectKey = this.options.projectKey
            execution.testCycleKey = testRun.key
            execution.testCaseKey = r.key
            execution.statusName = r.status === "passed"
                ? "Pass"
                : "Fail"
            return execution
        })
    }

    private async publishExecutionResults(testExecutions: TestExecution[]) {
        let promises: AxiosPromise[] = []
        for (const e of testExecutions) {
            promises.push(this.tm4j.publishTestExecution(e));
        }
        let errors = (await Promise.all(promises))
            .filter(r => r.status != 201)
        if (errors.length > 0) {
            console.error("Error while posting Execution results:")
            errors.forEach(e => {
                console.log(e.config.data)
                console.log(`${e.status} ${e.statusText}`)
            })
        }
    }

}

export interface Tm4jOptions {
    baseUrl?: string,
    authToken: string,
    projectKey: string,
    defaultTestCaseFolderId?: number,
    specMapping?: string,
    cycleName?: string,
    debugOutput?: boolean
}
