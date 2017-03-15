"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var wrap_layout_common_1 = require("./wrap-layout-common");
__export(require("./wrap-layout-common"));
var WrapLayout = (function (_super) {
    __extends(WrapLayout, _super);
    function WrapLayout() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(WrapLayout.prototype, "android", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapLayout.prototype, "_nativeView", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    WrapLayout.prototype._createNativeView = function () {
        var layout = this._layout = new org.nativescript.widgets.WrapLayout(this._context);
        return layout;
    };
    Object.defineProperty(WrapLayout.prototype, wrap_layout_common_1.orientationProperty.native, {
        get: function () {
            return "vertical";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapLayout.prototype, wrap_layout_common_1.orientationProperty.native, {
        set: function (value) {
            this._layout.setOrientation(value === "vertical" ? org.nativescript.widgets.Orientation.vertical : org.nativescript.widgets.Orientation.horizontal);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapLayout.prototype, wrap_layout_common_1.itemWidthProperty.native, {
        get: function () {
            return "auto";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapLayout.prototype, wrap_layout_common_1.itemWidthProperty.native, {
        set: function (value) {
            this._layout.setItemWidth(wrap_layout_common_1.Length.toDevicePixels(value, -1));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapLayout.prototype, wrap_layout_common_1.itemHeightProperty.native, {
        get: function () {
            return "auto";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapLayout.prototype, wrap_layout_common_1.itemHeightProperty.native, {
        set: function (value) {
            this._layout.setItemHeight(wrap_layout_common_1.Length.toDevicePixels(value, -1));
        },
        enumerable: true,
        configurable: true
    });
    return WrapLayout;
}(wrap_layout_common_1.WrapLayoutBase));
exports.WrapLayout = WrapLayout;
