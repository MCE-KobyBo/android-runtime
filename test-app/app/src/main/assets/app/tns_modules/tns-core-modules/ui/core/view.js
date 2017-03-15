function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var background_1 = require("ui/styling/background");
var view_common_1 = require("./view-common");
__export(require("./view-common"));
var ANDROID = "_android";
var NATIVE_VIEW = "_nativeView";
var VIEW_GROUP = "_viewGroup";
var DisableUserInteractionListener = (function (_super) {
    __extends(DisableUserInteractionListener, _super);
    function DisableUserInteractionListener() {
        var _this = _super.call(this) || this;
        return global.__native(_this);
    }
    DisableUserInteractionListener.prototype.onTouch = function (view, event) {
        return true;
    };
    return DisableUserInteractionListener;
}(java.lang.Object));
DisableUserInteractionListener = __decorate([
    Interfaces([android.view.View.OnTouchListener])
], DisableUserInteractionListener);
var TouchListener = (function (_super) {
    __extends(TouchListener, _super);
    function TouchListener(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    TouchListener.prototype.onTouch = function (view, event) {
        var owner = this.owner.get();
        if (!owner) {
            return false;
        }
        for (var type in owner._gestureObservers) {
            var list = owner._gestureObservers[type];
            for (var i = 0; i < list.length; i++) {
                list[i].androidOnTouchEvent(event);
            }
        }
        var nativeView = owner._nativeView;
        if (!nativeView || !nativeView.onTouchEvent) {
            return false;
        }
        return nativeView.onTouchEvent(event);
    };
    return TouchListener;
}(java.lang.Object));
TouchListener = __decorate([
    Interfaces([android.view.View.OnTouchListener])
], TouchListener);
var disableUserInteractionListener = new DisableUserInteractionListener();
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    View.prototype.observe = function (type, callback, thisArg) {
        _super.prototype.observe.call(this, type, callback, thisArg);
        if (this.isLoaded && !this.touchListenerIsSet) {
            this.setOnTouchListener();
        }
    };
    View.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.setOnTouchListener();
    };
    View.prototype.onUnloaded = function () {
        if (this.touchListenerIsSet) {
            this._nativeView.setOnTouchListener(null);
            this.touchListenerIsSet = false;
        }
        this._cancelAllAnimations();
        _super.prototype.onUnloaded.call(this);
    };
    View.prototype.hasGestureObservers = function () {
        return this._gestureObservers && Object.keys(this._gestureObservers).length > 0;
    };
    View.prototype.setOnTouchListener = function () {
        if (this._nativeView && this.hasGestureObservers()) {
            this.touchListenerIsSet = true;
            if (this._nativeView.setClickable) {
                this._nativeView.setClickable(true);
            }
            this.touchListener = this.touchListener || new TouchListener(new WeakRef(this));
            this._nativeView.setOnTouchListener(this.touchListener);
        }
    };
    View.prototype._disposeNativeView = function () {
        if (this[NATIVE_VIEW] === this[ANDROID]) {
            this[NATIVE_VIEW] = undefined;
        }
        if (this[VIEW_GROUP] === this[ANDROID]) {
            this[VIEW_GROUP] = undefined;
        }
        this[ANDROID] = undefined;
        this.nativeView = undefined;
    };
    Object.defineProperty(View.prototype, "_nativeView", {
        get: function () {
            return this.android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "isLayoutRequired", {
        get: function () {
            return !this.isLayoutValid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "isLayoutValid", {
        get: function () {
            if (this._nativeView) {
                return !this._nativeView.isLayoutRequested();
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    View.prototype.layoutNativeView = function (left, top, right, bottom) {
        if (this._nativeView) {
            this._nativeView.layout(left, top, right, bottom);
        }
    };
    View.prototype.requestLayout = function () {
        _super.prototype.requestLayout.call(this);
        if (this._nativeView) {
            return this._nativeView.requestLayout();
        }
    };
    View.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        _super.prototype.measure.call(this, widthMeasureSpec, heightMeasureSpec);
        this.onMeasure(widthMeasureSpec, heightMeasureSpec);
    };
    View.prototype.layout = function (left, top, right, bottom) {
        _super.prototype.layout.call(this, left, top, right, bottom);
        this.onLayout(left, top, right, bottom);
    };
    View.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var view = this._nativeView;
        if (view) {
            view.measure(widthMeasureSpec, heightMeasureSpec);
            this.setMeasuredDimension(view.getMeasuredWidth(), view.getMeasuredHeight());
        }
    };
    View.prototype.onLayout = function (left, top, right, bottom) {
        var view = this._nativeView;
        if (view) {
            this.layoutNativeView(left, top, right, bottom);
        }
    };
    View.prototype._getCurrentLayoutBounds = function () {
        if (this._nativeView) {
            return {
                left: this._nativeView.getLeft(),
                top: this._nativeView.getTop(),
                right: this._nativeView.getRight(),
                bottom: this._nativeView.getBottom()
            };
        }
        return _super.prototype._getCurrentLayoutBounds.call(this);
    };
    View.prototype.getMeasuredWidth = function () {
        if (this._nativeView) {
            return this._nativeView.getMeasuredWidth();
        }
        return _super.prototype.getMeasuredWidth.call(this);
    };
    View.prototype.getMeasuredHeight = function () {
        if (this._nativeView) {
            return this._nativeView.getMeasuredHeight();
        }
        return _super.prototype.getMeasuredHeight.call(this);
    };
    View.prototype.focus = function () {
        if (this._nativeView) {
            return this._nativeView.requestFocus();
        }
        return false;
    };
    View.prototype.getLocationInWindow = function () {
        if (!this._nativeView || !this._nativeView.getWindowToken()) {
            return undefined;
        }
        var nativeArray = Array.create("int", 2);
        this._nativeView.getLocationInWindow(nativeArray);
        return {
            x: view_common_1.layout.toDeviceIndependentPixels(nativeArray[0]),
            y: view_common_1.layout.toDeviceIndependentPixels(nativeArray[1]),
        };
    };
    View.prototype.getLocationOnScreen = function () {
        if (!this._nativeView || !this._nativeView.getWindowToken()) {
            return undefined;
        }
        var nativeArray = Array.create("int", 2);
        this._nativeView.getLocationOnScreen(nativeArray);
        return {
            x: view_common_1.layout.toDeviceIndependentPixels(nativeArray[0]),
            y: view_common_1.layout.toDeviceIndependentPixels(nativeArray[1]),
        };
    };
    View.prototype.getLocationRelativeTo = function (otherView) {
        if (!this._nativeView || !this._nativeView.getWindowToken() ||
            !otherView._nativeView || !otherView._nativeView.getWindowToken() ||
            this._nativeView.getWindowToken() !== otherView._nativeView.getWindowToken()) {
            return undefined;
        }
        var myArray = Array.create("int", 2);
        this._nativeView.getLocationOnScreen(myArray);
        var otherArray = Array.create("int", 2);
        otherView._nativeView.getLocationOnScreen(otherArray);
        return {
            x: view_common_1.layout.toDeviceIndependentPixels(myArray[0] - otherArray[0]),
            y: view_common_1.layout.toDeviceIndependentPixels(myArray[1] - otherArray[1]),
        };
    };
    View.resolveSizeAndState = function (size, specSize, specMode, childMeasuredState) {
        var result = size;
        switch (specMode) {
            case view_common_1.layout.UNSPECIFIED:
                result = size;
                break;
            case view_common_1.layout.AT_MOST:
                if (specSize < size) {
                    result = specSize | view_common_1.layout.MEASURED_STATE_TOO_SMALL;
                }
                break;
            case view_common_1.layout.EXACTLY:
                result = specSize;
                break;
        }
        return result | (childMeasuredState & view_common_1.layout.MEASURED_STATE_MASK);
    };
    Object.defineProperty(View.prototype, view_common_1.isEnabledProperty.native, {
        get: function () {
            return this.nativeView.isEnabled();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.isEnabledProperty.native, {
        set: function (value) {
            this.nativeView.setEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.originXProperty.native, {
        get: function () {
            return this.nativeView.getPivotX();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.originXProperty.native, {
        set: function (value) {
            org.nativescript.widgets.OriginPoint.setX(this.nativeView, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.originYProperty.native, {
        get: function () {
            return this.nativeView.getPivotY();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.originYProperty.native, {
        set: function (value) {
            org.nativescript.widgets.OriginPoint.setY(this.nativeView, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.automationTextProperty.native, {
        get: function () {
            return this.nativeView.getContentDescription();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.automationTextProperty.native, {
        set: function (value) {
            this.nativeView.setContentDescription(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.isUserInteractionEnabledProperty.native, {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.isUserInteractionEnabledProperty.native, {
        set: function (value) {
            if (!value) {
                this._nativeView.setOnTouchListener(disableUserInteractionListener);
            }
            else {
                this.setOnTouchListener();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.visibilityProperty.native, {
        get: function () {
            var nativeVisibility = this.nativeView.getVisibility();
            switch (nativeVisibility) {
                case android.view.View.VISIBLE:
                    return view_common_1.Visibility.VISIBLE;
                case android.view.View.INVISIBLE:
                    return view_common_1.Visibility.HIDDEN;
                case android.view.View.GONE:
                    return view_common_1.Visibility.COLLAPSE;
                default:
                    throw new Error("Unsupported android.view.View visibility: " + nativeVisibility + ". Currently supported values are android.view.View.VISIBLE, android.view.View.INVISIBLE, android.view.View.GONE.");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.visibilityProperty.native, {
        set: function (value) {
            switch (value) {
                case view_common_1.Visibility.VISIBLE:
                    this.nativeView.setVisibility(android.view.View.VISIBLE);
                    break;
                case view_common_1.Visibility.HIDDEN:
                    this.nativeView.setVisibility(android.view.View.INVISIBLE);
                    break;
                case view_common_1.Visibility.COLLAPSE:
                    this.nativeView.setVisibility(android.view.View.GONE);
                    break;
                default:
                    throw new Error("Invalid visibility value: " + value + ". Valid values are: \"" + view_common_1.Visibility.VISIBLE + "\", \"" + view_common_1.Visibility.HIDDEN + "\", \"" + view_common_1.Visibility.COLLAPSE + "\".");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.opacityProperty.native, {
        get: function () {
            return this.nativeView.getAlpha();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.opacityProperty.native, {
        set: function (value) {
            this.nativeView.setAlpha(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.horizontalAlignmentProperty.native, {
        get: function () {
            return org.nativescript.widgets.ViewHelper.getHorizontalAlignment(this.nativeView);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.horizontalAlignmentProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setHorizontalAlignment(this.nativeView, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.verticalAlignmentProperty.native, {
        get: function () {
            return org.nativescript.widgets.ViewHelper.getVerticalAlignment(this.nativeView);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.verticalAlignmentProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setVerticalAlignment(this.nativeView, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.rotateProperty.native, {
        get: function () {
            return org.nativescript.widgets.ViewHelper.getRotate(this.nativeView);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.rotateProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setRotate(this.nativeView, float(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.scaleXProperty.native, {
        get: function () {
            return org.nativescript.widgets.ViewHelper.getScaleX(this.nativeView);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.scaleXProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setScaleX(this.nativeView, float(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.scaleYProperty.native, {
        get: function () {
            return org.nativescript.widgets.ViewHelper.getScaleY(this.nativeView);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.scaleYProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setScaleY(this.nativeView, float(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.translateXProperty.native, {
        get: function () {
            return org.nativescript.widgets.ViewHelper.getTranslateX(this.nativeView);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.translateXProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setTranslateX(this.nativeView, view_common_1.Length.toDevicePixels(value, 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.translateYProperty.native, {
        get: function () {
            return org.nativescript.widgets.ViewHelper.getTranslateY(this.nativeView);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.translateYProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setTranslateY(this.nativeView, view_common_1.Length.toDevicePixels(value, 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.zIndexProperty.native, {
        get: function () {
            return org.nativescript.widgets.ViewHelper.getZIndex(this.nativeView);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.zIndexProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setZIndex(this.nativeView, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.backgroundInternalProperty.native, {
        get: function () {
            return this.nativeView.getBackground();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.backgroundInternalProperty.native, {
        set: function (value) {
            if (value instanceof android.graphics.drawable.Drawable) {
                this.nativeView.setBackground(value);
            }
            else {
                background_1.ad.onBackgroundOrBorderPropertyChanged(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.minWidthProperty.native, {
        set: function (value) {
            if (this.parent instanceof CustomLayoutView && this.parent.nativeView) {
                this.parent._setChildMinWidthNative(this);
            }
            else {
                this._minWidthNative = this.minWidth;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, view_common_1.minHeightProperty.native, {
        set: function (value) {
            if (this.parent instanceof CustomLayoutView && this.parent.nativeView) {
                this.parent._setChildMinHeightNative(this);
            }
            else {
                this._minHeightNative = this.minHeight;
            }
        },
        enumerable: true,
        configurable: true
    });
    return View;
}(view_common_1.ViewCommon));
exports.View = View;
var percentNotSupported = function (view, value) { throw new Error("PercentLength is not supported."); };
function createNativePercentLengthProperty(_a) {
    var key = _a.key, _b = _a.auto, auto = _b === void 0 ? 0 : _b, getPixels = _a.getPixels, setPixels = _a.setPixels, _c = _a.setPercent, setPercent = _c === void 0 ? percentNotSupported : _c;
    Object.defineProperty(View.prototype, key, {
        get: function () {
            var value = getPixels(this.nativeView);
            if (value == auto) {
                return "auto";
            }
            else {
                return { value: value, unit: "px" };
            }
        },
        set: function (length) {
            if (length == "auto") {
                setPixels(this.nativeView, auto);
            }
            else if (typeof length === "number") {
                setPixels(this.nativeView, length * view_common_1.layout.getDisplayDensity());
            }
            else if (length.unit == "dip") {
                setPixels(this.nativeView, length.value * view_common_1.layout.getDisplayDensity());
            }
            else if (length.unit == "px") {
                setPixels(this.nativeView, length.value);
            }
            else if (length.unit == "%") {
                setPercent(this.nativeView, length.value);
            }
            else {
                throw new Error("Unsupported PercentLength " + length);
            }
        }
    });
}
var ViewHelper = org.nativescript.widgets.ViewHelper;
createNativePercentLengthProperty({
    key: view_common_1.marginTopProperty.native,
    getPixels: ViewHelper.getMarginTop,
    setPixels: ViewHelper.setMarginTop,
    setPercent: ViewHelper.setMarginTopPercent
});
createNativePercentLengthProperty({
    key: view_common_1.marginRightProperty.native,
    getPixels: ViewHelper.getMarginRight,
    setPixels: ViewHelper.setMarginRight,
    setPercent: ViewHelper.setMarginRightPercent
});
createNativePercentLengthProperty({
    key: view_common_1.marginBottomProperty.native,
    getPixels: ViewHelper.getMarginBottom,
    setPixels: ViewHelper.setMarginBottom,
    setPercent: ViewHelper.setMarginBottomPercent
});
createNativePercentLengthProperty({
    key: view_common_1.marginLeftProperty.native,
    getPixels: ViewHelper.getMarginLeft,
    setPixels: ViewHelper.setMarginLeft,
    setPercent: ViewHelper.setMarginLeftPercent
});
createNativePercentLengthProperty({
    key: view_common_1.widthProperty.native,
    auto: android.view.ViewGroup.LayoutParams.MATCH_PARENT,
    getPixels: ViewHelper.getWidth,
    setPixels: ViewHelper.setWidth,
    setPercent: ViewHelper.setWidthPercent
});
createNativePercentLengthProperty({
    key: view_common_1.heightProperty.native,
    auto: android.view.ViewGroup.LayoutParams.MATCH_PARENT,
    getPixels: ViewHelper.getHeight,
    setPixels: ViewHelper.setHeight,
    setPercent: ViewHelper.setHeightPercent
});
createNativePercentLengthProperty({
    key: "_minWidthNative",
    getPixels: ViewHelper.getMinWidth,
    setPixels: ViewHelper.setMinWidth
});
createNativePercentLengthProperty({
    key: "_minHeightNative",
    getPixels: ViewHelper.getMinHeight,
    setPixels: ViewHelper.setMinHeight
});
var CustomLayoutView = (function (_super) {
    __extends(CustomLayoutView, _super);
    function CustomLayoutView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CustomLayoutView.prototype, "android", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomLayoutView.prototype, "_nativeView", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });
    CustomLayoutView.prototype._createNativeView = function () {
        this._viewGroup = new org.nativescript.widgets.ContentLayout(this._context);
    };
    CustomLayoutView.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        if (atIndex === void 0) { atIndex = -1; }
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (this._nativeView && child.nativeView) {
            if (view_common_1.traceEnabled()) {
                view_common_1.traceWrite(this + ".nativeView.addView(" + child + ".nativeView, " + atIndex + ")", view_common_1.traceCategories.VisualTreeEvents);
            }
            this._nativeView.addView(child.nativeView, atIndex);
            if (child instanceof View) {
                this._updateNativeLayoutParams(child);
            }
            return true;
        }
        return false;
    };
    CustomLayoutView.prototype._updateNativeLayoutParams = function (child) {
        this._setChildMinWidthNative(child);
        this._setChildMinHeightNative(child);
    };
    CustomLayoutView.prototype._setChildMinWidthNative = function (child) {
        child._minWidthNative = child.minWidth;
    };
    CustomLayoutView.prototype._setChildMinHeightNative = function (child) {
        child._minHeightNative = child.minHeight;
    };
    CustomLayoutView.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (this._nativeView && child._nativeView) {
            this._nativeView.removeView(child._nativeView);
            if (view_common_1.traceEnabled()) {
                view_common_1.traceWrite(this + "._nativeView.removeView(" + child + "._nativeView)", view_common_1.traceCategories.VisualTreeEvents);
                view_common_1.traceNotifyEvent(child, "childInLayoutRemovedFromNativeVisualTree");
            }
        }
    };
    return CustomLayoutView;
}(View));
exports.CustomLayoutView = CustomLayoutView;
//# sourceMappingURL=view.js.map