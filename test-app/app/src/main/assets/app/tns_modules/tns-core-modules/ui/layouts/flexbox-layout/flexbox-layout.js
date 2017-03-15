"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var flexbox_layout_common_1 = require("./flexbox-layout-common");
__export(require("./flexbox-layout-common"));
var orderDescriptor = {
    enumerable: true,
    configurable: true,
    get: function () { return flexbox_layout_common_1.orderProperty.defaultValue; },
    set: function (value) {
        setLayoutParamsProperty(this, function (lp) { return lp.order = value; });
    }
};
var flexGrowDescriptor = {
    enumerable: true,
    configurable: true,
    get: function () { return flexbox_layout_common_1.flexGrowProperty.defaultValue; },
    set: function (value) {
        setLayoutParamsProperty(this, function (lp) { return lp.flexGrow = value; });
    }
};
var flexShrinkDescriptor = {
    enumerable: true,
    configurable: true,
    get: function () { return flexbox_layout_common_1.flexShrinkProperty.defaultValue; },
    set: function (value) {
        setLayoutParamsProperty(this, function (lp) { return lp.flexShrink = value; });
    }
};
var flexWrapBeforeDescriptor = {
    enumerable: true,
    configurable: true,
    get: function () { return false; },
    set: function (value) {
        setLayoutParamsProperty(this, function (lp) { return lp.wrapBefore = value; });
    }
};
var alignSelfDescriptor = {
    enumerable: true,
    configurable: true,
    get: function () { return flexbox_layout_common_1.AlignSelf.AUTO; },
    set: function (value) {
        setLayoutParamsProperty(this, function (lp) { return lp.alignSelf = alignSelfMap[value]; });
    }
};
// register native properties on View type.
Object.defineProperties(flexbox_layout_common_1.View.prototype, (_a = {},
    _a[flexbox_layout_common_1.orderProperty.native] = orderDescriptor,
    _a[flexbox_layout_common_1.flexGrowProperty.native] = flexGrowDescriptor,
    _a[flexbox_layout_common_1.flexShrinkProperty.native] = flexShrinkDescriptor,
    _a[flexbox_layout_common_1.flexWrapBeforeProperty.native] = flexWrapBeforeDescriptor,
    _a[flexbox_layout_common_1.alignSelfProperty.native] = alignSelfDescriptor,
    _a
));
function setLayoutParamsProperty(view, setter) {
    var nativeView = view._nativeView;
    if (nativeView) {
        var lp = nativeView.getLayoutParams() || new org.nativescript.widgets.FlexboxLayout.LayoutParams();
        if (lp instanceof org.nativescript.widgets.FlexboxLayout.LayoutParams) {
            setter(lp);
            nativeView.setLayoutParams(lp);
        }
    }
}
var flexDirectionMap = (_b = {},
    _b[flexbox_layout_common_1.FlexDirection.ROW] = 0,
    _b[flexbox_layout_common_1.FlexDirection.ROW_REVERSE] = 1,
    _b[flexbox_layout_common_1.FlexDirection.COLUMN] = 2,
    _b[flexbox_layout_common_1.FlexDirection.COLUMN_REVERSE] = 3,
    _b
);
var flexWrapMap = (_c = {},
    _c[flexbox_layout_common_1.FlexWrap.NOWRAP] = 0,
    _c[flexbox_layout_common_1.FlexWrap.WRAP] = 1,
    _c[flexbox_layout_common_1.FlexWrap.WRAP_REVERSE] = 2,
    _c
);
var justifyContentMap = (_d = {},
    _d[flexbox_layout_common_1.JustifyContent.FLEX_START] = 0,
    _d[flexbox_layout_common_1.JustifyContent.FLEX_END] = 1,
    _d[flexbox_layout_common_1.JustifyContent.CENTER] = 2,
    _d[flexbox_layout_common_1.JustifyContent.SPACE_BETWEEN] = 3,
    _d[flexbox_layout_common_1.JustifyContent.SPACE_AROUND] = 4,
    _d
);
var alignItemsMap = (_e = {},
    _e[flexbox_layout_common_1.AlignItems.FLEX_START] = 0,
    _e[flexbox_layout_common_1.AlignItems.FLEX_END] = 1,
    _e[flexbox_layout_common_1.AlignItems.CENTER] = 2,
    _e[flexbox_layout_common_1.AlignItems.BASELINE] = 3,
    _e[flexbox_layout_common_1.AlignItems.STRETCH] = 4,
    _e
);
var alignContentMap = (_f = {},
    _f[flexbox_layout_common_1.AlignContent.FLEX_START] = 0,
    _f[flexbox_layout_common_1.AlignContent.FLEX_END] = 1,
    _f[flexbox_layout_common_1.AlignContent.CENTER] = 2,
    _f[flexbox_layout_common_1.AlignContent.SPACE_BETWEEN] = 3,
    _f[flexbox_layout_common_1.AlignContent.SPACE_AROUND] = 4,
    _f[flexbox_layout_common_1.AlignContent.STRETCH] = 5,
    _f
);
var alignSelfMap = (_g = {},
    _g[flexbox_layout_common_1.AlignSelf.AUTO] = -1,
    _g[flexbox_layout_common_1.AlignSelf.FLEX_START] = 0,
    _g[flexbox_layout_common_1.AlignSelf.FLEX_END] = 1,
    _g[flexbox_layout_common_1.AlignSelf.CENTER] = 2,
    _g[flexbox_layout_common_1.AlignSelf.BASELINE] = 3,
    _g[flexbox_layout_common_1.AlignSelf.STRETCH] = 4,
    _g
);
var FlexboxLayout = (function (_super) {
    __extends(FlexboxLayout, _super);
    function FlexboxLayout() {
        _super.call(this);
    }
    Object.defineProperty(FlexboxLayout.prototype, "android", {
        get: function () { return this._layout; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayout.prototype, "_nativeView", {
        get: function () { return this._layout; },
        enumerable: true,
        configurable: true
    });
    FlexboxLayout.prototype._createNativeView = function () {
        var layout = this._layout = new org.nativescript.widgets.FlexboxLayout(this._context);
        return layout;
    };
    Object.defineProperty(FlexboxLayout.prototype, flexbox_layout_common_1.flexDirectionProperty.native, {
        get: function () {
            return flexbox_layout_common_1.flexDirectionProperty.defaultValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayout.prototype, flexbox_layout_common_1.flexDirectionProperty.native, {
        set: function (flexDirection) {
            this.android.setFlexDirection(flexDirectionMap[flexDirection]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayout.prototype, flexbox_layout_common_1.flexWrapProperty.native, {
        get: function () {
            return flexbox_layout_common_1.flexWrapProperty.defaultValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayout.prototype, flexbox_layout_common_1.flexWrapProperty.native, {
        set: function (flexWrap) {
            this.android.setFlexWrap(flexWrapMap[flexWrap]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayout.prototype, flexbox_layout_common_1.justifyContentProperty.native, {
        get: function () {
            return flexbox_layout_common_1.justifyContentProperty.defaultValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayout.prototype, flexbox_layout_common_1.justifyContentProperty.native, {
        set: function (justifyContent) {
            this.android.setJustifyContent(justifyContentMap[justifyContent]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayout.prototype, flexbox_layout_common_1.alignItemsProperty.native, {
        get: function () {
            return flexbox_layout_common_1.alignItemsProperty.defaultValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayout.prototype, flexbox_layout_common_1.alignItemsProperty.native, {
        set: function (alignItems) {
            this.android.setAlignItems(alignItemsMap[alignItems]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayout.prototype, flexbox_layout_common_1.alignContentProperty.native, {
        get: function () {
            return flexbox_layout_common_1.alignContentProperty.defaultValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexboxLayout.prototype, flexbox_layout_common_1.alignContentProperty.native, {
        set: function (alignContent) {
            this.android.setAlignContent(alignContentMap[alignContent]);
        },
        enumerable: true,
        configurable: true
    });
    FlexboxLayout.prototype._updateNativeLayoutParams = function (child) {
        _super.prototype._updateNativeLayoutParams.call(this, child);
        var lp = child.nativeView.getLayoutParams();
        lp.order = child.order;
        lp.flexGrow = child.flexGrow;
        lp.flexShrink = child.flexShrink;
        lp.wrapBefore = child.flexWrapBefore;
        lp.alignSelf = alignSelfMap[child.alignSelf];
        child.nativeView.setLayoutParams(lp);
    };
    FlexboxLayout.prototype._setChildMinWidthNative = function (child) {
        child._minWidthNative = 0;
        var lp = child.nativeView.getLayoutParams();
        if (lp instanceof org.nativescript.widgets.FlexboxLayout.LayoutParams) {
            lp.minWidth = flexbox_layout_common_1.Length.toDevicePixels(child.minWidth, 0);
            child.nativeView.setLayoutParams(lp);
        }
    };
    FlexboxLayout.prototype._setChildMinHeightNative = function (child) {
        child._minHeightNative = 0;
        var lp = child.nativeView.getLayoutParams();
        if (lp instanceof org.nativescript.widgets.FlexboxLayout.LayoutParams) {
            lp.minHeight = flexbox_layout_common_1.Length.toDevicePixels(child.minHeight, 0);
            child.nativeView.setLayoutParams(lp);
        }
    };
    return FlexboxLayout;
}(flexbox_layout_common_1.FlexboxLayoutBase));
exports.FlexboxLayout = FlexboxLayout;
var _a, _b, _c, _d, _e, _f, _g;
