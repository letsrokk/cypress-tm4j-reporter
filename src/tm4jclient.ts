import {TestCase, TestCycle, TestExecution} from "./tm4j";
import axios, {AxiosPromise} from "axios";
import {Tm4jOptions} from "./tm4joptions";

export class Tm4jClient {

    private options: Tm4jOptions
    private baseUrl: string;
    private authToken: string;
    private projectKey: string;
    private defaultTestCaseFolderId: number;

    constructor(options: Tm4jOptions) {
        this.options = options
        this.baseUrl = options.baseUrl
        this.authToken = options.authToken
        this.projectKey = options.projectKey
        this.defaultTestCaseFolderId = options.defaultTestCaseFolderId
    }

    public async publishResults(testCycle: TestCycle) {
        await this.getOrCreateTestCycle(testCycle)
        await this.getOrCreateTestCases(testCycle)
        await this.publishExecutionResults(testCycle)
        return testCycle
    }

    private async getOrCreateTestCycle(testCycle: TestCycle) {
        let projectTestCycles: TestCycle[] =
            await this.getTestCyclesByProjectKey(this.projectKey).then(response => response.data.values)
        let existingTestCycle =
            projectTestCycles.find(tc => tc.name === testCycle.name)
        if (existingTestCycle) {
            console.log("Test Cycle found")
            testCycle.key = existingTestCycle.key
        } else {
            console.log("Test Cycle does not exist. Creating")
            testCycle.key =
                await this.createTestCycle(this.projectKey, testCycle.name).then(response => response.data.key)
        }
        return testCycle
    }

    private async getOrCreateTestCases(testCycle: TestCycle) {
        let executionsWithMissingKeys =
            testCycle.executions.filter(e => !e.key)
        if (executionsWithMissingKeys.length > 0) {
            let testCases: TestCase[] =
                await this.getTestCasesByProjectKey(this.projectKey).then(response => response.data.values)
            for (const execution of testCycle.executions) {
                if (!execution.key) {
                    let testCase =
                        testCases.find(tc => execution.name === tc.name)
                    if (testCase) {
                        execution.key = testCase.key
                    } else {
                        execution.key =
                            await this.createTestCase(this.projectKey, execution.name, this.defaultTestCaseFolderId)
                                .then(response => response.data.key)
                                .catch(error => console.error(error))
                    }
                }
            }
        }
        return testCycle
    }

    private getTestCyclesByProjectKey(projectKey: String) {
        return axios({
            method: "GET",
            url: `${this.baseUrl}/testcycles`,
            headers: {
                'Authorization': `Bearer ${this.authToken}`
            },
            params: {
                'projectKey': projectKey
            }
        });
    }

    public createTestCycle(projectKey: String, name: String) {
        return axios({
            method: "POST",
            url: `${this.baseUrl}/testcycles`,
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                'projectKey': projectKey,
                'name': name
            })
        });
    }

    private getTestCasesByProjectKey(projectKey: String) {
        return axios({
            method: "GET",
            url: `${this.baseUrl}/testcases`,
            headers: {
                'Authorization': `Bearer ${this.authToken}`
            },
            params: {
                'projectKey': projectKey,
                'maxResults': 50
            }
        });
    }

    public createTestCase(projectKey: String, name: String, folderId: number) {
        return axios({
            method: "POST",
            url: `${this.baseUrl}/testcases`,
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                'projectKey': projectKey,
                'name': name,
                'folderId': folderId
            })
        });
    }

    private async publishExecutionResults(testCycle: TestCycle) {
        let promises: AxiosPromise[] = []
        let projectKey = this.projectKey
        for (const e of testCycle.executions) {
            let payload = new TestExecutionPayload();
            payload.projectKey = projectKey
            payload.testCaseKey = e.key
            payload.testCycleKey = testCycle.key
            payload.statusName = "Pass"
            promises.push(this.publishTestExecution(payload));
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

    private publishTestExecution(testExecution: TestExecutionPayload) {
        return axios({
            method: "POST",
            url: `${this.baseUrl}/testexecutions`,
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(testExecution)
        })
    }
}

class TestExecutionPayload {

    projectKey: String
    testCaseKey: String
    testCycleKey: String
    statusName: String

}