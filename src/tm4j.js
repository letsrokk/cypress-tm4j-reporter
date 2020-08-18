"use strict";
exports.__esModule = true;
var TestCycle = /** @class */ (function () {
    function TestCycle(key, title) {
        this._executions = [];
        this._key = key;
        this._name = title;
    }
    Object.defineProperty(TestCycle.prototype, "key", {
        get: function () {
            return this._key;
        },
        set: function (value) {
            this._key = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestCycle.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestCycle.prototype, "executions", {
        get: function () {
            return this._executions;
        },
        enumerable: true,
        configurable: true
    });
    TestCycle.prototype.addExecution = function (value) {
        this._executions.push(value);
    };
    return TestCycle;
}());
exports.TestCycle = TestCycle;
var TestCase = /** @class */ (function () {
    function TestCase() {
    }
    Object.defineProperty(TestCase.prototype, "key", {
        get: function () {
            return this._key;
        },
        set: function (value) {
            this._key = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestCase.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    return TestCase;
}());
exports.TestCase = TestCase;
var TestExecution = /** @class */ (function () {
    function TestExecution() {
    }
    Object.defineProperty(TestExecution.prototype, "key", {
        get: function () {
            return this._key;
        },
        set: function (value) {
            this._key = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestExecution.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestExecution.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (value) {
            this._status = value;
        },
        enumerable: true,
        configurable: true
    });
    return TestExecution;
}());
exports.TestExecution = TestExecution;
