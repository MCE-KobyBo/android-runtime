"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var layout_base_1 = require("../layout-base");
__export(require("../layout-base"));
var StackLayoutBase = (function (_super) {
    __extends(StackLayoutBase, _super);
    function StackLayoutBase() {
        _super.apply(this, arguments);
    }
    return StackLayoutBase;
}(layout_base_1.LayoutBase));
exports.StackLayoutBase = StackLayoutBase;
exports.orientationProperty = new layout_base_1.Property({
    name: "orientation", defaultValue: "vertical", affectsLayout: layout_base_1.isIOS,
    valueConverter: function (v) {
        if (v === "horizontal" || v === "vertical") {
            return v;
        }
        throw new Error("Invalid orientation value: " + v);
    }
});
exports.orientationProperty.register(StackLayoutBase);
