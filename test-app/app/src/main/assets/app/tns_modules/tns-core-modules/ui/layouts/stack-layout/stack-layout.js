"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var stack_layout_common_1 = require("./stack-layout-common");
__export(require("./stack-layout-common"));
var StackLayout = (function (_super) {
    __extends(StackLayout, _super);
    function StackLayout() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(StackLayout.prototype, "android", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackLayout.prototype, "_nativeView", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    StackLayout.prototype._createNativeView = function () {
        var layout = this._layout = new org.nativescript.widgets.StackLayout(this._context);
        return layout;
    };
    Object.defineProperty(StackLayout.prototype, stack_layout_common_1.orientationProperty.native, {
        get: function () {
            return "vertical";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackLayout.prototype, stack_layout_common_1.orientationProperty.native, {
        set: function (value) {
            this._layout.setOrientation(value === "vertical" ? org.nativescript.widgets.Orientation.vertical : org.nativescript.widgets.Orientation.horizontal);
        },
        enumerable: true,
        configurable: true
    });
    return StackLayout;
}(stack_layout_common_1.StackLayoutBase));
exports.StackLayout = StackLayout;
