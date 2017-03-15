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
var DatePickerBase = (function (_super) {
    __extends(DatePickerBase, _super);
    function DatePickerBase() {
        _super.apply(this, arguments);
    }
    return DatePickerBase;
}(view_1.View));
exports.DatePickerBase = DatePickerBase;
exports.yearProperty = new view_1.Property({ name: "year", valueConverter: function (v) { return parseInt(v); } });
exports.yearProperty.register(DatePickerBase);
exports.monthProperty = new view_1.Property({ name: "month", valueConverter: function (v) { return parseInt(v); } });
exports.monthProperty.register(DatePickerBase);
exports.dayProperty = new view_1.Property({ name: "day", valueConverter: function (v) { return parseInt(v); } });
exports.dayProperty.register(DatePickerBase);
function dateComparer(x, y) {
    return (x <= y && x >= y) ? true : false;
}
// TODO: Make CoercibleProperties
exports.maxDateProperty = new view_1.Property({ name: "maxDate", equalityComparer: dateComparer, valueConverter: function (v) { return new Date(v); } });
exports.maxDateProperty.register(DatePickerBase);
exports.minDateProperty = new view_1.Property({ name: "minDate", equalityComparer: dateComparer, valueConverter: function (v) { return new Date(v); } });
exports.minDateProperty.register(DatePickerBase);
exports.dateProperty = new view_1.Property({ name: "date", equalityComparer: dateComparer, valueConverter: function (v) { return new Date(v); } });
exports.dateProperty.register(DatePickerBase);
