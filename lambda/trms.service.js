"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.Trms = void 0;
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-west-2',
    endpoint: 'http://dynamodb.us-west-2.amazonaws.com'
});
var Trms = /** @class */ (function () {
    function Trms(nam, dt) {
        this.name = '';
        this.sup_name = '';
        this.role = '';
        this.date_created = '';
        this.event_name = '';
        this.event_type = '';
        this.event_start_date = '';
        this.event_end_date = '';
        this.event_location = '';
        this.event_description = '';
        this.event_cost = 0;
        this.event_grading_format = '';
        this.grade = '';
        this.justification = '';
        this.attachments = '';
        this.approval = {
            sup: { status: '', date: '', reason: '', additional_info: '' },
            head: { status: '', date: '', reason: '', additional_info: '' },
            benco: { status: '', date: '', reason: '', additional_info: '' }
        };
        this.comments = '';
        this.name = nam;
        this.date_created = dt;
    }
    return Trms;
}());
exports.Trms = Trms;
var TrmsService = /** @class */ (function () {
    function TrmsService() {
        this.doc = docClient;
    }
    TrmsService.prototype.getTrmss = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: 'trms'
                        };
                        return [4 /*yield*/, this.doc
                                .scan(params)
                                .promise()
                                .then(function (data) {
                                return data.Items;
                            })["catch"](function (err) {
                                return [];
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TrmsService.prototype.getTrms = function (nam, dt) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: 'trms',
                            Key: {
                                name: nam,
                                date_created: dt
                            }
                        };
                        return [4 /*yield*/, this.doc
                                .get(params)
                                .promise()
                                .then(function (data) {
                                return data.Item;
                            })["catch"](function (err) {
                                return null;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TrmsService.prototype.updateTrms = function (trms) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: 'trms',
                            Key: {
                                name: trms.name,
                                date_created: trms.date_created
                            },
                            UpdateExpression: 'set #approval=:ap, #pro_reimbursement=:p, #attachments=:at, #comments=:co, #grade=:gr',
                            ExpressionAttributeValues: {
                                ':ap': trms.approval,
                                ':p': trms.pro_reimbursement,
                                ':at': trms.attachments,
                                ':co': trms.comments,
                                ':gr': trms.grade
                            },
                            ExpressionAttributeNames: {
                                '#approval': 'approval',
                                '#pro_reimbursement': 'pro_reimbursement',
                                '#attachments': 'attachments',
                                '#comments': 'comments',
                                '#grade': 'grade'
                            },
                            ReturnValue: 'UPDATED_NEW'
                        };
                        return [4 /*yield*/, this.doc
                                .update(params)
                                .promise()
                                .then(function () {
                                return true;
                            })["catch"](function (error) {
                                return false;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TrmsService.prototype.addTrms = function (t) {
        return __awaiter(this, void 0, void 0, function () {
            var datayorb, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datayorb = __assign({}, t);
                        params = {
                            TableName: 'trms',
                            Item: datayorb,
                            ConditionExpression: '#name <> :name AND #d <> :date_created',
                            ExpressionAttributeNames: {
                                '#name': 'name',
                                '#d': 'date_created'
                            },
                            ExpressionAttributeValues: {
                                ':name': datayorb.name,
                                ':date_created': datayorb.date_created
                            }
                        };
                        return [4 /*yield*/, this.doc
                                .put(params)
                                .promise()
                                .then(function (result) {
                                return true;
                            })["catch"](function (err) {
                                return false;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TrmsService.prototype.deleteTrms = function (name, date) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: 'trms',
                            Key: {
                                name: name,
                                date_created: date
                            }
                        };
                        return [4 /*yield*/, this.doc["delete"](params)
                                .promise()
                                .then(function (data) {
                                return true;
                            })["catch"](function (err) {
                                return false;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return TrmsService;
}());
exports["default"] = new TrmsService();
