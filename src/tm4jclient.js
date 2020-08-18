"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var Tm4jClient = /** @class */ (function () {
    function Tm4jClient() {
        this.baseUrl = 'https://api.tm4j.smartbear.com/rest-api/v2';
        this.authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjYWFjNTVlYi1mZjllLTNmYmItYjA1Mi00MWMxMGYwZDExMDYiLCJjb250ZXh0Ijp7ImJhc2VVcmwiOiJodHRwczpcL1wvZW5jb21wYXNzLmF0bGFzc2lhbi5uZXQiLCJ1c2VyIjp7ImFjY291bnRJZCI6IjVmMTU4OGVhZDY4MDMyMDAyMWFmNTZkMSJ9fSwiaXNzIjoiY29tLmthbm9haC50ZXN0LW1hbmFnZXIiLCJleHAiOjE2Mjg5MzgzMjIsImlhdCI6MTU5NzQwMjMyMn0.zvqq74fwvyh1BkKkOLMYmlvgFy5LeSc8Xm93i9R_0Ek';
        this.projectKey = 'AQA';
        axios_1["default"].interceptors.response.use(function (response) {
            if (response.config.method === "post") {
                console.log('Response:', response);
            }
            return response;
        });
    }
    Tm4jClient.prototype.publishResults = function (testCycle) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOrCreateTestCycle(testCycle)];
                    case 1:
                        testCycle = _a.sent();
                        return [4 /*yield*/, this.getOrCreateTestCases(testCycle)];
                    case 2:
                        testCycle = _a.sent();
                        return [2 /*return*/, testCycle];
                }
            });
        });
    };
    Tm4jClient.prototype.getOrCreateTestCycle = function (testCycle) {
        return __awaiter(this, void 0, void 0, function () {
            var projectTestCycles, existingTestCycle, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getTestCyclesByProjectKey(this.projectKey).then(function (response) { return response.data.values; })];
                    case 1:
                        projectTestCycles = _b.sent();
                        existingTestCycle = projectTestCycles.find(function (tc) { return tc.name === testCycle.name; });
                        if (!existingTestCycle) return [3 /*break*/, 2];
                        console.log("Test Cycle found");
                        testCycle.key = existingTestCycle.key;
                        return [3 /*break*/, 4];
                    case 2:
                        console.log("Test Cycle does not exist. Creating");
                        _a = testCycle;
                        return [4 /*yield*/, this.createTestCycle(this.projectKey, testCycle.name).then(function (response) { return response.data.key; })];
                    case 3:
                        _a.key =
                            _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, testCycle];
                }
            });
        });
    };
    Tm4jClient.prototype.getOrCreateTestCases = function (testCycle) {
        return __awaiter(this, void 0, void 0, function () {
            var executionsWithMissingKeys, testCases, _loop_1, this_1, _i, _a, execution;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        executionsWithMissingKeys = testCycle.executions.filter(function (e) { return !e.key; });
                        console.log(executionsWithMissingKeys);
                        if (!(executionsWithMissingKeys.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getTestCasesByProjectKey(this.projectKey).then(function (response) { return response.data.values; })];
                    case 1:
                        testCases = _b.sent();
                        _loop_1 = function (execution) {
                            var testCase;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!execution.key) return [3 /*break*/, 3];
                                        testCase = testCases.find(function (tc) { return execution.name === tc.name; });
                                        if (!testCase) return [3 /*break*/, 1];
                                        execution.key = testCase.key;
                                        return [3 /*break*/, 3];
                                    case 1: 
                                    // execution.key=
                                    return [4 /*yield*/, this_1.createTestCase(this_1.projectKey, execution.name)]; //.then(resoponse => resoponse.data.key)
                                    case 2:
                                        // execution.key=
                                        _a.sent(); //.then(resoponse => resoponse.data.key)
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = testCycle.executions;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        execution = _a[_i];
                        return [5 /*yield**/, _loop_1(execution)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, testCycle];
                }
            });
        });
    };
    Tm4jClient.prototype.getTestCyclesByProjectKey = function (projectKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1["default"]({
                        method: "GET",
                        url: this.baseUrl + "/testcycles",
                        headers: {
                            'Authorization': "Bearer " + this.authToken
                        },
                        params: {
                            'projectKey': projectKey
                        }
                    })];
            });
        });
    };
    Tm4jClient.prototype.createTestCycle = function (projectKey, name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1["default"]({
                        method: "POST",
                        url: this.baseUrl + "/testcycles",
                        headers: {
                            'Authorization': "Bearer " + this.authToken,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            'projectKey': projectKey,
                            'name': name
                        })
                    })];
            });
        });
    };
    Tm4jClient.prototype.getTestCasesByProjectKey = function (projectKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1["default"]({
                        method: "GET",
                        url: this.baseUrl + "/testcases",
                        headers: {
                            'Authorization': "Bearer " + this.authToken
                        },
                        params: {
                            'projectKey': projectKey,
                            'maxResults': 50
                        }
                    })];
            });
        });
    };
    Tm4jClient.prototype.createTestCase = function (projectKey, name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1["default"]({
                        method: "POST",
                        url: this.baseUrl + "/testcases",
                        headers: {
                            'Authorization': "Bearer " + this.authToken,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            'projectKey': projectKey,
                            'name': name
                        })
                    })];
            });
        });
    };
    return Tm4jClient;
}());
exports.Tm4jClient = Tm4jClient;
var GetTestCyclesResponse = /** @class */ (function () {
    function GetTestCyclesResponse() {
    }
    Object.defineProperty(GetTestCyclesResponse.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (value) {
            this._values = value;
        },
        enumerable: true,
        configurable: true
    });
    return GetTestCyclesResponse;
}());
