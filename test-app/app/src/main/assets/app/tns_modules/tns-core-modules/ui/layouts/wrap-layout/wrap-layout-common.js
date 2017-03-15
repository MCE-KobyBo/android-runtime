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
var WrapLayoutBase = (function (_super) {
    __extends(WrapLayoutBase, _super);
    function WrapLayoutBase() {
        _super.apply(this, arguments);
    }
    return WrapLayoutBase;
}(layout_base_1.LayoutBase));
exports.WrapLayoutBase = WrapLayoutBase;
exports.itemWidthProperty = new layout_base_1.Property({
    name: "itemWidth", defaultValue: layout_base_1.zeroLength, affectsLayout: layout_base_1.isIOS, valueConverter: function (v) { return layout_base_1.Length.parse(v); },
    valueChanged: function (target, oldValue, newValue) { return target.effectiveItemWidth = layout_base_1.Length.toDevicePixels(newValue, -1); }
});
exports.itemWidthProperty.register(WrapLayoutBase);
exports.itemHeightProperty = new layout_base_1.Property({
    name: "itemHeight", defaultValue: layout_base_1.zeroLength, affectsLayout: layout_base_1.isIOS, valueConverter: function (v) { return layout_base_1.Length.parse(v); },
    valueChanged: function (target, oldValue, newValue) { return target.effectiveItemHeight = layout_base_1.Length.toDevicePixels(newValue, -1); }
});
exports.itemHeightProperty.register(WrapLayoutBase);
exports.orientationProperty = new layout_base_1.Property({
    name: "orientation", defaultValue: "horizontal", affectsLayout: layout_base_1.isIOS,
    valueConverter: function (v) {
        if (v === "horizontal" || v === "vertical") {
            return v;
        }
        throw new Error("Invalid orientation value: " + v);
    }
});
exports.orientationProperty.register(WrapLayoutBase);
