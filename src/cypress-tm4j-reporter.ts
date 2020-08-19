import {reporters} from 'mocha';
import {Tm4jUtils} from "./tm4jUtils"
import {TestResult, TestRun} from "./testresults";

export class CypressTm4jReporter extends reporters.Spec {

    private testRun: TestRun = undefined
    private tm4jUtils: Tm4jUtils = undefined

    constructor(runner: any, options: any) {
        super(runner);
        this.tm4jUtils = new Tm4jUtils(options.reporterOptions)

        runner.on('suite', suite => {
            if (suite.root === false) {
                this.testRun = new TestRun()
                this.testRun.name = suite.title
                this.testRun.results = []
            }
        });

        runner.on('test', test => {
            // do nothing here
        })

        runner.on('test end', test => {
            let result = new TestResult()
            result.name = test.title
            result.status = test.state
            this.testRun.results.push(result)
        })

        runner.on('suite end', async (suite) => {
            if (suite.root === false) {
                await this.tm4jUtils.publishResults(this.testRun).then(testRun => {
                    console.log("Results Published:")
                    console.log(testRun)
                })
            }
        });

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