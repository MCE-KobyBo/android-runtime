"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var layout_base_1 = require("./layout-base");
__export(require("./layout-base"));
var OWNER = Symbol("_owner");
var NativeViewGroup;
function initializeNativeViewGroup() {
    if (NativeViewGroup) {
        return;
    }
    var NativeViewGroupImpl = (function (_super) {
        __extends(NativeViewGroupImpl, _super);
        function NativeViewGroupImpl(context) {
            _super.call(this, context);
            return global.__native(this);
        }
        NativeViewGroupImpl.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
            var owner = this[OWNER];
            owner.onMeasure(widthMeasureSpec, heightMeasureSpec);
            this.setMeasuredDimension(owner.getMeasuredWidth(), owner.getMeasuredHeight());
        };
        NativeViewGroupImpl.prototype.onLayout = function (changed, left, top, right, bottom) {
            var owner = this[OWNER];
            owner.onLayout(left, top, right, bottom);
        };
        return NativeViewGroupImpl;
    }(android.view.ViewGroup));
    NativeViewGroup = NativeViewGroupImpl;
}
var Layout = (function (_super) {
    __extends(Layout, _super);
    function Layout() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Layout.prototype, "android", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "_nativeView", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });
    Layout.prototype._createNativeView = function () {
        initializeNativeViewGroup();
        var layout = this._viewGroup = new NativeViewGroup(this._context);
        this._viewGroup[OWNER] = this;
        return layout;
    };
    Layout.prototype._disposeNativeView = function () {
        delete this._viewGroup[OWNER];
        _super.prototype._disposeNativeView.call(this);
    };
    Layout.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
        var view = this._nativeView;
        if (view) {
            if (layout_base_1.traceEnabled()) {
                layout_base_1.traceWrite(this + " :measure: " + layout_base_1.layout.measureSpecToString(widthMeasureSpec) + ", " + layout_base_1.layout.measureSpecToString(heightMeasureSpec), layout_base_1.traceCategories.Layout);
            }
            view.measure(widthMeasureSpec, heightMeasureSpec);
        }
    };
    Layout.prototype.layout = function (left, top, right, bottom) {
        this._setCurrentLayoutBounds(left, top, right, bottom);
        var view = this._nativeView;
        if (view) {
            this.layoutNativeView(left, top, right, bottom);
            if (layout_base_1.traceEnabled()) {
                layout_base_1.traceWrite(this + " :layout: " + left + ", " + top + ", " + (right - left) + ", " + (bottom - top), layout_base_1.traceCategories.Layout);
            }
        }
    };
    Layout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        // Don't call super because it will trigger measure again.
    };
    Layout.prototype.onLayout = function (left, top, right, bottom) {
        // Don't call super because it will trigger layout again.
    };
    // NOTE: overriden so we cache measuredWidth & measuredHeight.
    Layout.prototype.setMeasuredDimension = function (measuredWidth, measuredHeight) {
        _super.prototype.setMeasuredDimension.call(this, measuredWidth, measuredHeight);
        this._measuredWidth = measuredWidth;
        this._measuredHeight = measuredHeight;
    };
    // NOTE: base implementation use the nativeView.getMeasuredWidth which should
    // not be called while we are in onMeasure.
    Layout.prototype.getMeasuredWidth = function () {
        return this._measuredWidth;
    };
    // NOTE: base implementation use the nativeView.getMeasuredWidth which should
    // not be called while we are in onMeasure.
    Layout.prototype.getMeasuredHeight = function () {
        return this._measuredHeight;
    };
    return Layout;
}(layout_base_1.LayoutBase));
exports.Layout = Layout;
