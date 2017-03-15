"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var absolute_layout_common_1 = require("./absolute-layout-common");
__export(require("./absolute-layout-common"));
// define native getter and setter for leftProperty.
var leftDescriptor = {
    enumerable: true,
    configurable: true,
    get: function () { return absolute_layout_common_1.zeroLength; },
    set: function (value) {
        var _this = this;
        setNativeProperty(this, function (lp) { return lp.left = _this.effectiveLeft; });
    }
};
// define native getter and setter for topProperty.
var topDescriptor = {
    enumerable: true,
    configurable: true,
    get: function () { return absolute_layout_common_1.zeroLength; },
    set: function (value) {
        var _this = this;
        setNativeProperty(this, function (lp) { return lp.top = _this.effectiveTop; });
    }
};
// register native properties on View type.
Object.defineProperties(absolute_layout_common_1.View.prototype, (_a = {},
    _a[absolute_layout_common_1.leftProperty.native] = leftDescriptor,
    _a[absolute_layout_common_1.topProperty.native] = topDescriptor,
    _a
));
function setNativeProperty(view, setter) {
    if (view instanceof absolute_layout_common_1.View) {
        var nativeView = view._nativeView;
        var lp = nativeView.getLayoutParams() || new org.nativescript.widgets.CommonLayoutParams();
        if (lp instanceof org.nativescript.widgets.CommonLayoutParams) {
            setter(lp);
            nativeView.setLayoutParams(lp);
        }
    }
}
var AbsoluteLayout = (function (_super) {
    __extends(AbsoluteLayout, _super);
    function AbsoluteLayout() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(AbsoluteLayout.prototype, "android", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbsoluteLayout.prototype, "_nativeView", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    AbsoluteLayout.prototype._createNativeView = function () {
        var layout = this._layout = new org.nativescript.widgets.AbsoluteLayout(this._context);
        return layout;
    };
    return AbsoluteLayout;
}(absolute_layout_common_1.AbsoluteLayoutBase));
exports.AbsoluteLayout = AbsoluteLayout;
var _a;
