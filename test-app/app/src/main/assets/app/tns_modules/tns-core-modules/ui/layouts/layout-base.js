"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var layout_base_common_1 = require("./layout-base-common");
__export(require("./layout-base-common"));
var LayoutBase = (function (_super) {
    __extends(LayoutBase, _super);
    function LayoutBase() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(LayoutBase.prototype, layout_base_common_1.clipToBoundsProperty.native, {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, layout_base_common_1.clipToBoundsProperty.native, {
        set: function (value) {
            // TODO: Use ClipRectangle if API > 16! 
            // We can't implement this without calling setClipChildren(false) on every ancestor up in the visual tree, 
            // which will kill performance. It will also lead to unwanted side effects such as other totally unrelated 
            // views being affected by setting the parents' setClipChildren to false. 
            // The problem in Android is that a ViewGroup either clips ALL of its children or it does not. Unlike iOS, the clipping 
            // cannot be controlled on a per view basis. So clipToBounds=false will have to be somehow achieved with stacking different
            // views on top of one another in an AbsoluteLayout or GridLayout. There is always a workaround when playing with layouts.
            //
            // The following article explains this in detail:
            // http://stackoverflow.com/questions/25044085/when-drawing-outside-the-view-clip-bounds-with-android-how-do-i-prevent-underli
            console.warn("clipToBounds with value false is not supported on Android. You can use this.android.getParent().setClipChildren(false) as an alternative");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, layout_base_common_1.paddingTopProperty.native, {
        get: function () {
            return { value: this._defaultPaddingTop, unit: "px" };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, layout_base_common_1.paddingTopProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setPaddingTop(this.nativeView, layout_base_common_1.Length.toDevicePixels(value, 0) + layout_base_common_1.Length.toDevicePixels(this.style.borderTopWidth, 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, layout_base_common_1.paddingRightProperty.native, {
        get: function () {
            return { value: this._defaultPaddingRight, unit: "px" };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, layout_base_common_1.paddingRightProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setPaddingRight(this.nativeView, layout_base_common_1.Length.toDevicePixels(value, 0) + layout_base_common_1.Length.toDevicePixels(this.style.borderRightWidth, 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, layout_base_common_1.paddingBottomProperty.native, {
        get: function () {
            return { value: this._defaultPaddingBottom, unit: "px" };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, layout_base_common_1.paddingBottomProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setPaddingBottom(this.nativeView, layout_base_common_1.Length.toDevicePixels(value, 0) + layout_base_common_1.Length.toDevicePixels(this.style.borderBottomWidth, 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, layout_base_common_1.paddingLeftProperty.native, {
        get: function () {
            return { value: this._defaultPaddingLeft, unit: "px" };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, layout_base_common_1.paddingLeftProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setPaddingLeft(this.nativeView, layout_base_common_1.Length.toDevicePixels(value, 0) + layout_base_common_1.Length.toDevicePixels(this.style.borderLeftWidth, 0));
        },
        enumerable: true,
        configurable: true
    });
    return LayoutBase;
}(layout_base_common_1.LayoutBaseCommon));
exports.LayoutBase = LayoutBase;
