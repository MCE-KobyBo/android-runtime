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
// TODO: Extract base Range class for slider and progress
var SliderBase = (function (_super) {
    __extends(SliderBase, _super);
    function SliderBase() {
        _super.apply(this, arguments);
    }
    return SliderBase;
}(view_1.View));
exports.SliderBase = SliderBase;
/**
 * Represents the observable property backing the value property of each Slider instance.
 */
exports.valueProperty = new view_1.CoercibleProperty({
    name: "value", defaultValue: 0, coerceValue: function (target, value) {
        value = Math.max(value, target.minValue);
        value = Math.min(value, target.maxValue);
        return value;
    }, valueConverter: function (v) { return view_1.isIOS ? parseFloat(v) : parseInt(v); }
});
exports.valueProperty.register(SliderBase);
/**
 * Represents the observable property backing the minValue property of each Slider instance.
 */
exports.minValueProperty = new view_1.Property({
    name: "minValue", defaultValue: 0, valueChanged: function (target, oldValue, newValue) {
        exports.maxValueProperty.coerce(target);
        exports.valueProperty.coerce(target);
    }, valueConverter: function (v) { return view_1.isIOS ? parseFloat(v) : parseInt(v); }
});
exports.minValueProperty.register(SliderBase);
/**
 * Represents the observable property backing the maxValue property of each Slider instance.
 */
exports.maxValueProperty = new view_1.CoercibleProperty({
    name: "maxValue", defaultValue: 100, coerceValue: function (target, value) {
        var minValue = target.minValue;
        if (value < minValue) {
            value = minValue;
        }
        return value;
    },
    valueChanged: function (target, oldValue, newValue) { return exports.valueProperty.coerce(target); },
    valueConverter: function (v) { return view_1.isIOS ? parseFloat(v) : parseInt(v); }
});
exports.maxValueProperty.register(SliderBase);
