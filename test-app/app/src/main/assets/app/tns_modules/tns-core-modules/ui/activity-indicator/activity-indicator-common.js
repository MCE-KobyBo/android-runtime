"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var view_1 = require("../core/view");
__export(require("../core/view"));
var ActivityIndicatorBase = (function (_super) {
    __extends(ActivityIndicatorBase, _super);
    function ActivityIndicatorBase() {
        _super.apply(this, arguments);
    }
    return ActivityIndicatorBase;
}(view_1.View));
exports.ActivityIndicatorBase = ActivityIndicatorBase;
exports.busyProperty = new view_1.Property({ name: "busy", defaultValue: false, valueConverter: view_1.booleanConverter });
exports.busyProperty.register(ActivityIndicatorBase);
