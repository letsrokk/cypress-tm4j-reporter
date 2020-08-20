export class Parsers {

    static titleToKeyAndName(title: string) {
        let testCaseIdRegEx = /^([A-Z]+-[TR][0-9]+) (.*)/
        let match = title.match(testCaseIdRegEx)
        if (match != null && match.length === 3) {
            return {key: match[1], name: match[2]}
        } else {
            return {key: undefined, name: title}
        }
    }

}