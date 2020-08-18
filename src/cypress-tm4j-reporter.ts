import {reporters} from 'mocha';
import {TestCycle, TestExecution} from "./tm4j";
import {Tm4jClient} from "./tm4jclient"

export class CypressTm4jReporter extends reporters.Spec {

    private tm4jclient: Tm4jClient = undefined
    private testCycle: TestCycle = undefined

    constructor(runner: any, options: any) {
        super(runner);
        this.tm4jclient = new Tm4jClient(options.reporterOptions)

        runner.on('suite', suite => {
            if (suite.root === false) {
                this.testCycle = new TestCycle(undefined, suite.title)
            }
        });

        runner.on('test', test => {
            let testExecution = new TestExecution()
            let {key, title} = titleToKeyAndTitle(test.title)
            testExecution.key = key
            testExecution.name = title
            this.testCycle.addExecution(testExecution)
        })

        runner.on('test end', test => {
            let testExecution =
                this.testCycle.executions.find(e => {
                    let {key, title} = titleToKeyAndTitle(test.title)
                    if (key) {
                        return e.key === key
                    } else {
                        return e.name === title
                    }
                })
            testExecution.status = test.state
        })

        runner.on('suite end', async (suite) => {
            if (suite.root === false) {
                await this.tm4jclient.publishResults(this.testCycle).then(testCycle => {
                    console.log("Results Published:")
                    console.log(testCycle)
                })
            }
        });

    }

}

function titleToKeyAndTitle(title: string) {
    let testCaseIdRegEx = /^([A-Z]+-T[0-9]+) (.*)/
    let match = title.match(testCaseIdRegEx)
    if (match != null && match.length === 3) {
        return {key: match[1], title: match[2]}
    } else {
        return {key: undefined, title: title}
    }
}

function stringify(object) {
    return JSON.stringify(object, replacer)
}

function replacer(key,value)
{
    if (key=="parent") return undefined;
    else return value;
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}