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
var ProgressBase = (function (_super) {
    __extends(ProgressBase, _super);
    function ProgressBase() {
        _super.apply(this, arguments);
    }
    return ProgressBase;
}(view_1.View));
exports.ProgressBase = ProgressBase;
/**
 * Represents the observable property backing the value property of each Progress instance.
 */
exports.valueProperty = new view_1.CoercibleProperty({
    name: "value",
    defaultValue: 0,
    coerceValue: function (t, v) {
        return v < 0 ? 0 : Math.min(v, t.maxValue);
    },
    valueConverter: function (v) { return parseInt(v); }
});
exports.valueProperty.register(ProgressBase);
/**
 * Represents the observable property backing the maxValue property of each Progress instance.
 */
exports.maxValueProperty = new view_1.Property({
    name: "maxValue",
    defaultValue: 100,
    valueChanged: function (target, oldValue, newValue) {
        exports.valueProperty.coerce(target);
    },
    valueConverter: function (v) { return parseInt(v); }
});
exports.maxValueProperty.register(ProgressBase);
