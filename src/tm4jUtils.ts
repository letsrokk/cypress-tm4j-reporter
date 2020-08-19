import {TestCase, TestCycle, TestExecution, Tm4jApi} from "./tm4j";
import axios, {AxiosPromise} from "axios";
import {Tm4jOptions} from "./tm4joptions";
import {TestRun} from "./testresults";

export class Tm4jUtils {

    private tm4j: Tm4jApi
    private options: Tm4jOptions

    constructor(options: Tm4jOptions) {
        this.options = options
        this.tm4j = new Tm4jApi(options.baseUrl, options.authToken)
    }

    public async publishResults(testRun: TestRun) {
        let testCycle = await this.prepareTestCycle(testRun)
        let testExecutions = await this.prepareTestExecutions(testRun)
        await this.publishExecutionResults(testExecutions)
        return testRun
    }

    private async prepareTestCycle(testRun: TestRun) {
        let { key, name } = this.titleToKeyAndName(testRun.name)
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
            let {key, name} = this.titleToKeyAndName(r.name)
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
            execution.statusName = r.status === "passed" ? "Pass" : "Fail"
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

    private titleToKeyAndName(title: string) {
        let testCaseIdRegEx = /^([A-Z]+-[TR][0-9]+) (.*)/
        let match = title.match(testCaseIdRegEx)
        if (match != null && match.length === 3) {
            return {key: match[1], name: match[2]}
        } else {
            return {key: undefined, name: title}
        }
    }
}
