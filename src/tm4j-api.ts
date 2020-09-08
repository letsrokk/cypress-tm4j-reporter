import axios from "axios";

export class Tm4jApi {

    private readonly baseUrl: string
    private readonly authToken: string

    constructor(baseUrl: string, authToken: string) {
        this.baseUrl = baseUrl
        this.authToken = authToken
    }

    public getTestCyclesByProjectKey(projectKey: String) {
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

    public getTestCasesByProjectKey(projectKey: String, startAt: number = 0, maxResults: number = 50) {
        return axios({
            method: "GET",
            url: `${this.baseUrl}/testcases`,
            headers: {
                'Authorization': `Bearer ${this.authToken}`
            },
            params: {
                'projectKey': projectKey,
                'startAt': startAt,
                'maxResults': maxResults
            }
        });
    }

    public createTestCase(projectKey: String, name: String, folderId?: number) {
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

    public publishTestExecution(testExecution: TestExecution) {
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

export class TestCycle {

    key: string;
    name: string;

    constructor(key: string, title: string) {
        this.key = key;
        this.name = title;
    }

}

export class TestCase {

    key: string;
    name: string;

    constructor(key: string, title: string) {
        this.key = key;
        this.name = title;
    }

}

export class TestExecution {

    projectKey: string;
    testCaseKey: string;
    testCycleKey: string;
    statusName: string;

}