export class TestCycle {

    private _key: String;
    private _name: String;
    private _executions: TestExecution[] = [];

    constructor(key: String, title: String) {
        this._key = key;
        this._name = title;
    }

    get key(): String {
        return this._key;
    }

    set key(value: String) {
        this._key = value;
    }

    get name(): String {
        return this._name;
    }

    set name(value: String) {
        this._name = value;
    }

    get executions(): TestExecution[] {
        return this._executions;
    }

    public addExecution(value: TestExecution) {
        this._executions.push(value);
    }
}

export class TestCase {

    private _key: String;
    private _name: String;

    get key(): String {
        return this._key;
    }

    set key(value: String) {
        this._key = value;
    }

    get name(): String {
        return this._name;
    }

    set name(value: String) {
        this._name = value;
    }
}

export class TestExecution {

    private _key: String;
    private _name: String;
    private _status: String;


    get key(): String {
        return this._key;
    }

    set key(value: String) {
        this._key = value;
    }

    get name(): String {
        return this._name;
    }

    set name(value: String) {
        this._name = value;
    }

    get status(): String {
        return this._status;
    }

    set status(value: String) {
        this._status = value;
    }
}