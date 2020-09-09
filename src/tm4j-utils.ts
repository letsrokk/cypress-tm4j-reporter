import {TestCase, TestCycle, TestExecution, Tm4jApi} from "./tm4j-api";
import {AxiosPromise} from "axios";
import {TestRun} from "./test-results";
import {CypressCliUtils} from "./cypress-cli-utils";
import {Parsers} from "./parsers"

import "cypress"

export class Tm4jUtils {

    private options: Tm4jOptions
    private tm4j: Tm4jApi
    private projectKey: string
    private apiMaxResults: number
    private isDebug: boolean


    private cypressToTm4jStatusMap = new Map([
        ["passed","Pass"],
        ["failed","Fail"],
        ["skipped","Not Executed"]
    ])

    constructor(options: Tm4jOptions) {
        this.tm4j = new Tm4jApi(options.baseUrl, options.authToken)
        this.options = options
        this.projectKey = options.projectKey
        this.isDebug = options.debugOutput
        this.apiMaxResults = options.apiMaxResults
            ? options.apiMaxResults
            : 100
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
                await this.tm4j.getTestCasesByProjectKey(this.options.projectKey, 0, this.apiMaxResults)
                    .then(response => response.data.values)

            testRun.results.filter(r => !r.key).forEach(r => {
                if (this.isDebug) {
                    console.log(`Looking for test case key for: ${r.name}`)
                }
                let testCase = testCases.find(tc => tc.name === r.name)
                if (testCase) {
                    r.key = testCase.key
                }
                if (this.isDebug) {
                    if (r.key) {
                        console.log(`Key found: ${r.key}`)
                    } else {
                        console.log('Key was not found')
                    }
                }
            })
        }

        if (this.isDebug) {
            console.log("Test Results:")
            console.log(testRun)
        }

        for (let result of testRun.results.filter(r => !r.key)) {
            result.key = await this.tm4j.createTestCase(this.options.projectKey, result.name, this.options.defaultTestCaseFolderId)
                .then(response => response.data.key)
        }

        return testRun.results.map(r => {
            let execution = new TestExecution()
            execution.projectKey = this.options.projectKey
            execution.testCycleKey = testRun.key
            execution.testCaseKey = r.key
            execution.statusName = this.cypressToTm4jStatusMap.get(r.status)
            execution.executionTime = r.duration
            execution.comment = this.formatComment(r.comment)
            execution.environmentName = r.environment
            return execution
        })
    }

    private formatComment(comment: string) {
        if (comment) {
            return comment.replace(/(?:\r\n|\r|\n)/g, '<br>')
        } else {
            return comment
        }
    }

    // private async getAllTestCasesByProjectKey() {
    //     let testCases: TestCase[] = []
    //     let startAt: number = 0;
    //     let isLast: boolean = false
    //     do {
    //         await this.tm4j.getTestCasesByProjectKey(this.projectKey, startAt, this.apiMaxResults).then(response => {
    //             testCases.push(response.data.values)
    //             isLast = response.data.isLast
    //         })
    //         startAt += this.apiMaxResults
    //     } while (isLast === false)
    //
    //     return testCases
    // }

    private async publishExecutionResults(testExecutions: TestExecution[]) {
        for (const e of testExecutions) {
            await this.tm4j.publishTestExecution(e)
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
    apiMaxResults?: number,
    environmentProperty?: string
    debugOutput?: boolean
}
