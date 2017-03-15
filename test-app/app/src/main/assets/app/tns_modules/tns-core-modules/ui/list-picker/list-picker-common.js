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
var ListPickerBase = (function (_super) {
    __extends(ListPickerBase, _super);
    function ListPickerBase() {
        _super.apply(this, arguments);
    }
    ListPickerBase.prototype._getItemAsString = function (index) {
        var items = this.items;
        if (!items) {
            return " ";
        }
        var item = this.isItemsSource ? this.items.getItem(index) : this.items[index];
        return (item === undefined || item === null) ? index + "" : item + "";
    };
    return ListPickerBase;
}(view_1.View));
exports.ListPickerBase = ListPickerBase;
exports.selectedIndexProperty = new view_1.CoercibleProperty({
    name: "selectedIndex", defaultValue: -1,
    valueConverter: function (v) { return parseInt(v); },
    coerceValue: function (target, value) {
        var items = target.items;
        if (items) {
            var max = items.length - 1;
            if (value < 0) {
                value = 0;
            }
            if (value > max) {
                value = max;
            }
        }
        else {
            value = -1;
        }
        return value;
    }
});
exports.selectedIndexProperty.register(ListPickerBase);
exports.itemsProperty = new view_1.Property({
    name: "items", valueChanged: function (target, oldValue, newValue) {
        var getItem = newValue && newValue.getItem;
        target.isItemsSource = typeof getItem === "function";
        exports.selectedIndexProperty.coerce(target);
    }
});
exports.itemsProperty.register(ListPickerBase);
