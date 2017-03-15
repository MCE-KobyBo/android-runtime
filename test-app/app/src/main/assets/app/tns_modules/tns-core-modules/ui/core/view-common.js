function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var color_1 = require("color");
exports.Color = color_1.Color;
var debug_1 = require("utils/debug");
var background_1 = require("ui/styling/background");
exports.Background = background_1.Background;
var view_base_1 = require("./view-base");
var gestures_1 = require("ui/gestures");
exports.GesturesObserver = gestures_1.GesturesObserver;
exports.GestureTypes = gestures_1.GestureTypes;
exports.TouchAction = gestures_1.TouchAction;
var font_1 = require("ui/styling/font");
exports.Font = font_1.Font;
var image_source_1 = require("image-source");
var utils_1 = require("utils/utils");
exports.layout = utils_1.layout;
__export(require("./view-base"));
var animationModule;
function ensureAnimationModule() {
    if (!animationModule) {
        animationModule = require("ui/animation");
    }
}
function PseudoClassHandler() {
    var pseudoClasses = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        pseudoClasses[_i] = arguments[_i];
    }
    var stateEventNames = pseudoClasses.map(function (s) { return ":" + s; });
    var listeners = Symbol("listeners");
    return function (target, propertyKey, descriptor) {
        function update(change) {
            var prev = this[listeners] || 0;
            var next = prev + change;
            if (prev <= 0 && next > 0) {
                this[propertyKey](true);
            }
            else if (prev > 0 && next <= 0) {
                this[propertyKey](false);
            }
        }
        stateEventNames.forEach(function (s) { return target[s] = update; });
    };
}
exports.PseudoClassHandler = PseudoClassHandler;
var ViewCommon = (function (_super) {
    __extends(ViewCommon, _super);
    function ViewCommon() {
        var _this = _super.call(this) || this;
        _this._gestureObservers = {};
        _this._goToVisualState("normal");
        return _this;
    }
    ViewCommon.prototype.observe = function (type, callback, thisArg) {
        if (!this._gestureObservers[type]) {
            this._gestureObservers[type] = [];
        }
        this._gestureObservers[type].push(gestures_1.observe(this, type, callback, thisArg));
    };
    ViewCommon.prototype.getGestureObservers = function (type) {
        return this._gestureObservers[type];
    };
    ViewCommon.prototype.addEventListener = function (arg, callback, thisArg) {
        if (typeof arg === "string") {
            arg = view_base_1.getEventOrGestureName(arg);
            var gesture = view_base_1.gestureFromString(arg);
            if (gesture && !this._isEvent(arg)) {
                this.observe(gesture, callback, thisArg);
            }
            else {
                var events = (arg).split(",");
                if (events.length > 0) {
                    for (var i = 0; i < events.length; i++) {
                        var evt = events[i].trim();
                        var gst = view_base_1.gestureFromString(evt);
                        if (gst && !this._isEvent(arg)) {
                            this.observe(gst, callback, thisArg);
                        }
                        else {
                            _super.prototype.addEventListener.call(this, evt, callback, thisArg);
                        }
                    }
                }
                else {
                    _super.prototype.addEventListener.call(this, arg, callback, thisArg);
                }
            }
        }
        else if (typeof arg === "number") {
            this.observe(arg, callback, thisArg);
        }
    };
    ViewCommon.prototype.removeEventListener = function (arg, callback, thisArg) {
        if (typeof arg === "string") {
            var gesture = view_base_1.gestureFromString(arg);
            if (gesture && !this._isEvent(arg)) {
                this._disconnectGestureObservers(gesture);
            }
            else {
                var events = arg.split(",");
                if (events.length > 0) {
                    for (var i = 0; i < events.length; i++) {
                        var evt = events[i].trim();
                        var gst = view_base_1.gestureFromString(evt);
                        if (gst && !this._isEvent(arg)) {
                            this._disconnectGestureObservers(gst);
                        }
                        else {
                            _super.prototype.removeEventListener.call(this, evt, callback, thisArg);
                        }
                    }
                }
                else {
                    _super.prototype.removeEventListener.call(this, arg, callback, thisArg);
                }
            }
        }
        else if (typeof arg === "number") {
            this._disconnectGestureObservers(arg);
        }
    };
    ViewCommon.prototype._isEvent = function (name) {
        return this.constructor && name + "Event" in this.constructor;
    };
    ViewCommon.prototype._disconnectGestureObservers = function (type) {
        var observers = this.getGestureObservers(type);
        if (observers) {
            for (var i = 0; i < observers.length; i++) {
                observers[i].disconnect();
            }
        }
    };
    Object.defineProperty(ViewCommon.prototype, "borderColor", {
        get: function () {
            return this.style.borderColor;
        },
        set: function (value) {
            this.style.borderColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderTopColor", {
        get: function () {
            return this.style.borderTopColor;
        },
        set: function (value) {
            this.style.borderTopColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderRightColor", {
        get: function () {
            return this.style.borderRightColor;
        },
        set: function (value) {
            this.style.borderRightColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderBottomColor", {
        get: function () {
            return this.style.borderBottomColor;
        },
        set: function (value) {
            this.style.borderBottomColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderLeftColor", {
        get: function () {
            return this.style.borderLeftColor;
        },
        set: function (value) {
            this.style.borderLeftColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderWidth", {
        get: function () {
            return this.style.borderWidth;
        },
        set: function (value) {
            this.style.borderWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderTopWidth", {
        get: function () {
            return this.style.borderTopWidth;
        },
        set: function (value) {
            this.style.borderTopWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderRightWidth", {
        get: function () {
            return this.style.borderRightWidth;
        },
        set: function (value) {
            this.style.borderRightWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderBottomWidth", {
        get: function () {
            return this.style.borderBottomWidth;
        },
        set: function (value) {
            this.style.borderBottomWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderLeftWidth", {
        get: function () {
            return this.style.borderLeftWidth;
        },
        set: function (value) {
            this.style.borderLeftWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderRadius", {
        get: function () {
            return this.style.borderRadius;
        },
        set: function (value) {
            this.style.borderRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderTopLeftRadius", {
        get: function () {
            return this.style.borderTopLeftRadius;
        },
        set: function (value) {
            this.style.borderTopLeftRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderTopRightRadius", {
        get: function () {
            return this.style.borderTopRightRadius;
        },
        set: function (value) {
            this.style.borderTopRightRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderBottomRightRadius", {
        get: function () {
            return this.style.borderBottomRightRadius;
        },
        set: function (value) {
            this.style.borderBottomRightRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "borderBottomLeftRadius", {
        get: function () {
            return this.style.borderBottomLeftRadius;
        },
        set: function (value) {
            this.style.borderBottomLeftRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "color", {
        get: function () {
            return this.style.color;
        },
        set: function (value) {
            this.style.color = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "backgroundColor", {
        get: function () {
            return this.style.backgroundColor;
        },
        set: function (value) {
            this.style.backgroundColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "backgroundImage", {
        get: function () {
            return this.style.backgroundImage;
        },
        set: function (value) {
            this.style.backgroundImage = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "minWidth", {
        get: function () {
            return this.style.minWidth;
        },
        set: function (value) {
            this.style.minWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "minHeight", {
        get: function () {
            return this.style.minHeight;
        },
        set: function (value) {
            this.style.minHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "width", {
        get: function () {
            return this.style.width;
        },
        set: function (value) {
            this.style.width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "height", {
        get: function () {
            return this.style.height;
        },
        set: function (value) {
            this.style.height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "margin", {
        get: function () {
            return this.style.margin;
        },
        set: function (value) {
            this.style.margin = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "marginLeft", {
        get: function () {
            return this.style.marginLeft;
        },
        set: function (value) {
            this.style.marginLeft = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "marginTop", {
        get: function () {
            return this.style.marginTop;
        },
        set: function (value) {
            this.style.marginTop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "marginRight", {
        get: function () {
            return this.style.marginRight;
        },
        set: function (value) {
            this.style.marginRight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "marginBottom", {
        get: function () {
            return this.style.marginBottom;
        },
        set: function (value) {
            this.style.marginBottom = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "horizontalAlignment", {
        get: function () {
            return this.style.horizontalAlignment;
        },
        set: function (value) {
            this.style.horizontalAlignment = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "verticalAlignment", {
        get: function () {
            return this.style.verticalAlignment;
        },
        set: function (value) {
            this.style.verticalAlignment = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "visibility", {
        get: function () {
            return this.style.visibility;
        },
        set: function (value) {
            this.style.visibility = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "opacity", {
        get: function () {
            return this.style.opacity;
        },
        set: function (value) {
            this.style.opacity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "rotate", {
        get: function () {
            return this.style.rotate;
        },
        set: function (value) {
            this.style.rotate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "translateX", {
        get: function () {
            return this.style.translateX;
        },
        set: function (value) {
            this.style.translateX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "translateY", {
        get: function () {
            return this.style.translateY;
        },
        set: function (value) {
            this.style.translateY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "scaleX", {
        get: function () {
            return this.style.scaleX;
        },
        set: function (value) {
            this.style.scaleX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "scaleY", {
        get: function () {
            return this.style.scaleY;
        },
        set: function (value) {
            this.style.scaleY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "isLayoutValid", {
        get: function () {
            return this._isLayoutValid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "cssType", {
        get: function () {
            if (!this._cssType) {
                this._cssType = this.typeName.toLowerCase();
            }
            return this._cssType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewCommon.prototype, "isLayoutRequired", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ViewCommon.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
    };
    ViewCommon.prototype.layout = function (left, top, right, bottom) {
        this._setCurrentLayoutBounds(left, top, right, bottom);
    };
    ViewCommon.prototype.getMeasuredWidth = function () {
        return this._measuredWidth & utils_1.layout.MEASURED_SIZE_MASK || 0;
    };
    ViewCommon.prototype.getMeasuredHeight = function () {
        return this._measuredHeight & utils_1.layout.MEASURED_SIZE_MASK || 0;
    };
    ViewCommon.prototype.getMeasuredState = function () {
        return (this._measuredWidth & utils_1.layout.MEASURED_STATE_MASK)
            | ((this._measuredHeight >> utils_1.layout.MEASURED_HEIGHT_STATE_SHIFT)
                & (utils_1.layout.MEASURED_STATE_MASK >> utils_1.layout.MEASURED_HEIGHT_STATE_SHIFT));
    };
    ViewCommon.prototype.setMeasuredDimension = function (measuredWidth, measuredHeight) {
        this._measuredWidth = measuredWidth;
        this._measuredHeight = measuredHeight;
        if (view_base_1.traceEnabled()) {
            view_base_1.traceWrite(this + " :setMeasuredDimension: " + measuredWidth + ", " + measuredHeight, view_base_1.traceCategories.Layout);
        }
    };
    ViewCommon.prototype.requestLayout = function () {
        this._isLayoutValid = false;
    };
    ViewCommon.resolveSizeAndState = function (size, specSize, specMode, childMeasuredState) {
        var result = size;
        switch (specMode) {
            case utils_1.layout.UNSPECIFIED:
                result = size;
                break;
            case utils_1.layout.AT_MOST:
                if (specSize < size) {
                    result = Math.round(specSize + 0.499) | utils_1.layout.MEASURED_STATE_TOO_SMALL;
                }
                break;
            case utils_1.layout.EXACTLY:
                result = specSize;
                break;
        }
        return Math.round(result + 0.499) | (childMeasuredState & utils_1.layout.MEASURED_STATE_MASK);
    };
    ViewCommon.combineMeasuredStates = function (curState, newState) {
        return curState | newState;
    };
    ViewCommon.layoutChild = function (parent, child, left, top, right, bottom) {
        if (!child || child.isCollapsed) {
            return;
        }
        var childStyle = child.style;
        var childTop;
        var childLeft;
        var childWidth = child.getMeasuredWidth();
        var childHeight = child.getMeasuredHeight();
        var effectiveMarginTop = child.effectiveMarginTop;
        var effectiveMarginBottom = child.effectiveMarginBottom;
        var vAlignment;
        if (child.effectiveHeight >= 0 && childStyle.verticalAlignment === VerticalAlignment.STRETCH) {
            vAlignment = VerticalAlignment.MIDDLE;
        }
        else {
            vAlignment = childStyle.verticalAlignment;
        }
        switch (vAlignment) {
            case VerticalAlignment.TOP:
                childTop = top + effectiveMarginTop;
                break;
            case VerticalAlignment.MIDDLE:
                childTop = top + (bottom - top - childHeight + (effectiveMarginTop - effectiveMarginBottom)) / 2;
                break;
            case VerticalAlignment.BOTTOM:
                childTop = bottom - childHeight - effectiveMarginBottom;
                break;
            case VerticalAlignment.STRETCH:
            default:
                childTop = top + effectiveMarginTop;
                childHeight = bottom - top - (effectiveMarginTop + effectiveMarginBottom);
                break;
        }
        var effectiveMarginLeft = child.effectiveMarginLeft;
        var effectiveMarginRight = child.effectiveMarginRight;
        var hAlignment;
        if (child.effectiveWidth >= 0 && childStyle.horizontalAlignment === HorizontalAlignment.STRETCH) {
            hAlignment = HorizontalAlignment.CENTER;
        }
        else {
            hAlignment = childStyle.horizontalAlignment;
        }
        switch (hAlignment) {
            case HorizontalAlignment.LEFT:
                childLeft = left + effectiveMarginLeft;
                break;
            case HorizontalAlignment.CENTER:
                childLeft = left + (right - left - childWidth + (effectiveMarginLeft - effectiveMarginRight)) / 2;
                break;
            case HorizontalAlignment.RIGHT:
                childLeft = right - childWidth - effectiveMarginRight;
                break;
            case HorizontalAlignment.STRETCH:
            default:
                childLeft = left + effectiveMarginLeft;
                childWidth = right - left - (effectiveMarginLeft + effectiveMarginRight);
                break;
        }
        var childRight = Math.round(childLeft + childWidth);
        var childBottom = Math.round(childTop + childHeight);
        childLeft = Math.round(childLeft);
        childTop = Math.round(childTop);
        if (view_base_1.traceEnabled()) {
            view_base_1.traceWrite(child.parent + " :layoutChild: " + child + " " + childLeft + ", " + childTop + ", " + childRight + ", " + childBottom, view_base_1.traceCategories.Layout);
        }
        child.layout(childLeft, childTop, childRight, childBottom);
    };
    ViewCommon.measureChild = function (parent, child, widthMeasureSpec, heightMeasureSpec) {
        var measureWidth = 0;
        var measureHeight = 0;
        if (child && !child.isCollapsed) {
            var width = utils_1.layout.getMeasureSpecSize(widthMeasureSpec);
            var widthMode = utils_1.layout.getMeasureSpecMode(widthMeasureSpec);
            var height = utils_1.layout.getMeasureSpecSize(heightMeasureSpec);
            var heightMode = utils_1.layout.getMeasureSpecMode(heightMeasureSpec);
            child._updateEffectiveLayoutValues(parent);
            var style = child.style;
            var horizontalMargins = child.effectiveMarginLeft + child.effectiveMarginRight;
            var verticalMargins = child.effectiveMarginTop + child.effectiveMarginBottom;
            var childWidthMeasureSpec = ViewCommon.getMeasureSpec(width, widthMode, horizontalMargins, child.effectiveWidth, style.horizontalAlignment === HorizontalAlignment.STRETCH);
            var childHeightMeasureSpec = ViewCommon.getMeasureSpec(height, heightMode, verticalMargins, child.effectiveHeight, style.verticalAlignment === VerticalAlignment.STRETCH);
            if (view_base_1.traceEnabled()) {
                view_base_1.traceWrite(child.parent + " :measureChild: " + child + " " + utils_1.layout.measureSpecToString(childWidthMeasureSpec) + ", " + utils_1.layout.measureSpecToString(childHeightMeasureSpec), view_base_1.traceCategories.Layout);
            }
            child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
            measureWidth = Math.round(child.getMeasuredWidth() + horizontalMargins);
            measureHeight = Math.round(child.getMeasuredHeight() + verticalMargins);
        }
        return { measuredWidth: measureWidth, measuredHeight: measureHeight };
    };
    ViewCommon.getMeasureSpec = function (parentLength, parentSpecMode, margins, childLength, stretched) {
        var resultSize;
        var resultMode;
        if (childLength >= 0) {
            resultSize = parentSpecMode === utils_1.layout.UNSPECIFIED ? childLength : Math.min(parentLength, childLength);
            resultMode = utils_1.layout.EXACTLY;
        }
        else {
            switch (parentSpecMode) {
                case utils_1.layout.EXACTLY:
                    resultSize = Math.max(0, parentLength - margins);
                    resultMode = stretched ? utils_1.layout.EXACTLY : utils_1.layout.AT_MOST;
                    break;
                case utils_1.layout.AT_MOST:
                    resultSize = Math.max(0, parentLength - margins);
                    resultMode = utils_1.layout.AT_MOST;
                    break;
                case utils_1.layout.UNSPECIFIED:
                    resultSize = 0;
                    resultMode = utils_1.layout.UNSPECIFIED;
                    break;
            }
        }
        return utils_1.layout.makeMeasureSpec(resultSize, resultMode);
    };
    ViewCommon.prototype._setCurrentMeasureSpecs = function (widthMeasureSpec, heightMeasureSpec) {
        var changed = this._currentWidthMeasureSpec !== widthMeasureSpec || this._currentHeightMeasureSpec !== heightMeasureSpec;
        this._currentWidthMeasureSpec = widthMeasureSpec;
        this._currentHeightMeasureSpec = heightMeasureSpec;
        return changed;
    };
    ViewCommon.prototype._getCurrentLayoutBounds = function () {
        return { left: this._oldLeft, top: this._oldTop, right: this._oldRight, bottom: this._oldBottom };
    };
    ViewCommon.prototype._setCurrentLayoutBounds = function (left, top, right, bottom) {
        this._isLayoutValid = true;
        var boundsChanged = this._oldLeft !== left || this._oldTop !== top || this._oldRight !== right || this._oldBottom !== bottom;
        var sizeChanged = (this._oldRight - this._oldLeft !== right - left) || (this._oldBottom - this._oldTop !== bottom - top);
        this._oldLeft = left;
        this._oldTop = top;
        this._oldRight = right;
        this._oldBottom = bottom;
        return { boundsChanged: boundsChanged, sizeChanged: sizeChanged };
    };
    ViewCommon.prototype._createNativeView = function () {
    };
    ViewCommon.prototype.eachChild = function (callback) {
        this.eachChildView(callback);
    };
    ViewCommon.prototype.eachChildView = function (callback) {
    };
    ViewCommon.prototype._getNativeViewsCount = function () {
        return this._isAddedToNativeVisualTree ? 1 : 0;
    };
    ViewCommon.prototype._eachLayoutView = function (callback) {
        return callback(this);
    };
    ViewCommon.prototype._updateLayout = function () {
    };
    Object.defineProperty(ViewCommon.prototype, "_nativeView", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    ViewCommon.prototype.focus = function () {
        return undefined;
    };
    ViewCommon.prototype.getLocationInWindow = function () {
        return undefined;
    };
    ViewCommon.prototype.getLocationOnScreen = function () {
        return undefined;
    };
    ViewCommon.prototype.getLocationRelativeTo = function (otherView) {
        return undefined;
    };
    ViewCommon.prototype.getActualSize = function () {
        var currentBounds = this._getCurrentLayoutBounds();
        if (!currentBounds) {
            return undefined;
        }
        return {
            width: utils_1.layout.toDeviceIndependentPixels(currentBounds.right - currentBounds.left),
            height: utils_1.layout.toDeviceIndependentPixels(currentBounds.bottom - currentBounds.top),
        };
    };
    ViewCommon.prototype.animate = function (animation) {
        return this.createAnimation(animation).play();
    };
    ViewCommon.prototype.createAnimation = function (animation) {
        ensureAnimationModule();
        animation.target = this;
        return new animationModule.Animation([animation]);
    };
    ViewCommon.prototype.toString = function () {
        var str = this.typeName;
        if (this.id) {
            str += "<" + this.id + ">";
        }
        else {
            str += "(" + this._domId + ")";
        }
        var source = debug_1.Source.get(this);
        if (source) {
            str += "@" + source + ";";
        }
        return str;
    };
    ViewCommon.prototype._setNativeViewFrame = function (nativeView, frame) {
    };
    ViewCommon.prototype._getValue = function () {
        throw new Error("The View._setValue is obsolete. There is a new property system.");
    };
    ViewCommon.prototype._setValue = function () {
        throw new Error("The View._setValue is obsolete. There is a new property system.");
    };
    ViewCommon.prototype._updateEffectiveLayoutValues = function (parent) {
        var style = this.style;
        var parentWidthMeasureSpec = parent._currentWidthMeasureSpec;
        var parentWidthMeasureSize = utils_1.layout.getMeasureSpecSize(parentWidthMeasureSpec);
        var parentWidthMeasureMode = utils_1.layout.getMeasureSpecMode(parentWidthMeasureSpec);
        var parentAvailableWidth = parentWidthMeasureMode === utils_1.layout.UNSPECIFIED ? -1 : parentWidthMeasureSize;
        this.effectiveWidth = PercentLength.toDevicePixels(style.width, -2, parentAvailableWidth);
        this.effectiveMarginLeft = PercentLength.toDevicePixels(style.marginLeft, 0, parentAvailableWidth);
        this.effectiveMarginRight = PercentLength.toDevicePixels(style.marginRight, 0, parentAvailableWidth);
        var parentHeightMeasureSpec = parent._currentHeightMeasureSpec;
        var parentHeightMeasureSize = utils_1.layout.getMeasureSpecSize(parentHeightMeasureSpec);
        var parentHeightMeasureMode = utils_1.layout.getMeasureSpecMode(parentHeightMeasureSpec);
        var parentAvailableHeight = parentHeightMeasureMode === utils_1.layout.UNSPECIFIED ? -1 : parentHeightMeasureSize;
        this.effectiveHeight = PercentLength.toDevicePixels(style.height, -2, parentAvailableHeight);
        this.effectiveMarginTop = PercentLength.toDevicePixels(style.marginTop, 0, parentAvailableHeight);
        this.effectiveMarginBottom = PercentLength.toDevicePixels(style.marginBottom, 0, parentAvailableHeight);
    };
    return ViewCommon;
}(view_base_1.ViewBase));
ViewCommon.loadedEvent = "loaded";
ViewCommon.unloadedEvent = "unloaded";
exports.ViewCommon = ViewCommon;
ViewCommon.prototype._oldLeft = 0;
ViewCommon.prototype._oldTop = 0;
ViewCommon.prototype._oldRight = 0;
ViewCommon.prototype._oldBottom = 0;
ViewCommon.prototype.effectiveMinWidth = 0;
ViewCommon.prototype.effectiveMinHeight = 0;
ViewCommon.prototype.effectiveWidth = 0;
ViewCommon.prototype.effectiveHeight = 0;
ViewCommon.prototype.effectiveMarginTop = 0;
ViewCommon.prototype.effectiveMarginRight = 0;
ViewCommon.prototype.effectiveMarginBottom = 0;
ViewCommon.prototype.effectiveMarginLeft = 0;
ViewCommon.prototype.effectivePaddingTop = 0;
ViewCommon.prototype.effectivePaddingRight = 0;
ViewCommon.prototype.effectivePaddingBottom = 0;
ViewCommon.prototype.effectivePaddingLeft = 0;
ViewCommon.prototype.effectiveBorderTopWidth = 0;
ViewCommon.prototype.effectiveBorderRightWidth = 0;
ViewCommon.prototype.effectiveBorderBottomWidth = 0;
ViewCommon.prototype.effectiveBorderLeftWidth = 0;
function equalsCommon(a, b) {
    if (a == "auto") {
        return b == "auto";
    }
    if (typeof a === "number") {
        if (b == "auto") {
            return false;
        }
        if (typeof b === "number") {
            return a == b;
        }
        return b.unit == "dip" && a == b.value;
    }
    if (b == "auto") {
        return false;
    }
    if (typeof b === "number") {
        return a.unit == "dip" && a.value == b;
    }
    return a.value == b.value && a.unit == b.unit;
}
function convertToStringCommon(length) {
    if (length == "auto") {
        return "auto";
    }
    if (typeof length === "number") {
        return length.toString();
    }
    var val = length.value;
    if (length.unit === "%") {
        val *= 100;
    }
    return val + length.unit;
}
function toDevicePixelsCommon(length, auto, parentAvailableWidth) {
    if (length == "auto") {
        return auto;
    }
    if (typeof length === "number") {
        return Math.round(utils_1.layout.getDisplayDensity() * length);
    }
    switch (length.unit) {
        case "px":
            return Math.round(length.value);
        default:
        case "dip":
            return Math.round(utils_1.layout.getDisplayDensity() * length.value);
        case "%":
            return Math.round(parentAvailableWidth * length.value);
    }
}
var PercentLength;
(function (PercentLength) {
    function parse(value) {
        if (value == "auto") {
            return "auto";
        }
        if (typeof value === "string") {
            var type = void 0;
            var numberValue = 0;
            var stringValue = value.trim();
            var percentIndex = stringValue.indexOf("%");
            if (percentIndex !== -1) {
                type = "%";
                if (percentIndex !== (stringValue.length - 1) || percentIndex === 0) {
                    numberValue = Number.NaN;
                }
                else {
                    numberValue = parseFloat(stringValue.substring(0, stringValue.length - 1).trim()) / 100;
                }
            }
            else {
                if (stringValue.indexOf("px") !== -1) {
                    type = "px";
                    stringValue = stringValue.replace("px", "").trim();
                }
                else {
                    type = "dip";
                }
                numberValue = parseFloat(stringValue);
            }
            if (isNaN(numberValue) || !isFinite(numberValue)) {
                throw new Error("Invalid value: " + value);
            }
            return {
                value: numberValue,
                unit: type
            };
        }
        else {
            return value;
        }
    }
    PercentLength.parse = parse;
    PercentLength.equals = equalsCommon;
    PercentLength.toDevicePixels = toDevicePixelsCommon;
    PercentLength.convertToString = convertToStringCommon;
})(PercentLength = exports.PercentLength || (exports.PercentLength = {}));
var Length;
(function (Length) {
    function parse(value) {
        if (value == "auto") {
            return "auto";
        }
        else if (typeof value === "string") {
            var type = void 0;
            var numberValue = 0;
            var stringValue = value.trim();
            if (stringValue.indexOf("px") !== -1) {
                type = "px";
                stringValue = stringValue.replace("px", "").trim();
            }
            else {
                type = "dip";
            }
            numberValue = parseFloat(stringValue);
            if (isNaN(numberValue) || !isFinite(numberValue)) {
                throw new Error("Invalid value: " + value);
            }
            return {
                value: numberValue,
                unit: type
            };
        }
        else {
            return value;
        }
    }
    Length.parse = parse;
    Length.equals = equalsCommon;
    Length.toDevicePixels = toDevicePixelsCommon;
    Length.convertToString = convertToStringCommon;
})(Length = exports.Length || (exports.Length = {}));
function booleanConverter(v) {
    var lowercase = (v + '').toLowerCase();
    if (lowercase === "true") {
        return true;
    }
    else if (lowercase === "false") {
        return false;
    }
    throw new Error("Invalid boolean: " + v);
}
exports.booleanConverter = booleanConverter;
exports.automationTextProperty = new view_base_1.Property({ name: "automationText" });
exports.automationTextProperty.register(ViewCommon);
exports.originXProperty = new view_base_1.Property({ name: "originX", defaultValue: 0.5, valueConverter: function (v) { return parseFloat(v); } });
exports.originXProperty.register(ViewCommon);
exports.originYProperty = new view_base_1.Property({ name: "originY", defaultValue: 0.5, valueConverter: function (v) { return parseFloat(v); } });
exports.originYProperty.register(ViewCommon);
exports.isEnabledProperty = new view_base_1.Property({
    name: "isEnabled",
    defaultValue: true,
    valueConverter: booleanConverter,
    valueChanged: function (target, oldValue, newValue) {
        target._goToVisualState(newValue ? "normal" : "disabled");
    }
});
exports.isEnabledProperty.register(ViewCommon);
exports.isUserInteractionEnabledProperty = new view_base_1.Property({ name: "isUserInteractionEnabled", defaultValue: true, valueConverter: booleanConverter });
exports.isUserInteractionEnabledProperty.register(ViewCommon);
exports.zeroLength = { value: 0, unit: "px" };
exports.minWidthProperty = new view_base_1.CssProperty({
    name: "minWidth", cssName: "min-width", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        if (target.view instanceof ViewCommon) {
            target.view.effectiveMinWidth = Length.toDevicePixels(newValue, 0);
        }
    }, valueConverter: Length.parse
});
exports.minWidthProperty.register(view_base_1.Style);
exports.minHeightProperty = new view_base_1.CssProperty({
    name: "minHeight", cssName: "min-height", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        if (target.view instanceof ViewCommon) {
            target.view.effectiveMinHeight = Length.toDevicePixels(newValue, 0);
        }
    }, valueConverter: Length.parse
});
exports.minHeightProperty.register(view_base_1.Style);
exports.widthProperty = new view_base_1.CssProperty({ name: "width", cssName: "width", defaultValue: "auto", affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.widthProperty.register(view_base_1.Style);
exports.heightProperty = new view_base_1.CssProperty({ name: "height", cssName: "height", defaultValue: "auto", affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.heightProperty.register(view_base_1.Style);
var marginProperty = new view_base_1.ShorthandProperty({
    name: "margin", cssName: "margin",
    getter: function () {
        if (PercentLength.equals(this.marginTop, this.marginRight) &&
            PercentLength.equals(this.marginTop, this.marginBottom) &&
            PercentLength.equals(this.marginTop, this.marginLeft)) {
            return this.marginTop;
        }
        return PercentLength.convertToString(this.marginTop) + " " + PercentLength.convertToString(this.marginRight) + " " + PercentLength.convertToString(this.marginBottom) + " " + PercentLength.convertToString(this.marginLeft);
    },
    converter: convertToMargins
});
marginProperty.register(view_base_1.Style);
exports.marginLeftProperty = new view_base_1.CssProperty({ name: "marginLeft", cssName: "margin-left", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.marginLeftProperty.register(view_base_1.Style);
exports.marginRightProperty = new view_base_1.CssProperty({ name: "marginRight", cssName: "margin-right", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.marginRightProperty.register(view_base_1.Style);
exports.marginTopProperty = new view_base_1.CssProperty({ name: "marginTop", cssName: "margin-top", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.marginTopProperty.register(view_base_1.Style);
exports.marginBottomProperty = new view_base_1.CssProperty({ name: "marginBottom", cssName: "margin-bottom", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals, valueConverter: PercentLength.parse });
exports.marginBottomProperty.register(view_base_1.Style);
var paddingProperty = new view_base_1.ShorthandProperty({
    name: "padding", cssName: "padding",
    getter: function () {
        if (Length.equals(this.paddingTop, this.paddingRight) &&
            Length.equals(this.paddingTop, this.paddingBottom) &&
            Length.equals(this.paddingTop, this.paddingLeft)) {
            return this.paddingTop;
        }
        return Length.convertToString(this.paddingTop) + " " + Length.convertToString(this.paddingRight) + " " + Length.convertToString(this.paddingBottom) + " " + Length.convertToString(this.paddingLeft);
    },
    converter: convertToPaddings
});
paddingProperty.register(view_base_1.Style);
exports.paddingLeftProperty = new view_base_1.CssProperty({
    name: "paddingLeft", cssName: "padding-left", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        if (target.view instanceof ViewCommon) {
            target.view.effectivePaddingLeft = Length.toDevicePixels(newValue, 0);
        }
    }, valueConverter: Length.parse
});
exports.paddingLeftProperty.register(view_base_1.Style);
exports.paddingRightProperty = new view_base_1.CssProperty({
    name: "paddingRight", cssName: "padding-right", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        if (target.view instanceof ViewCommon) {
            target.view.effectivePaddingRight = Length.toDevicePixels(newValue, 0);
        }
    }, valueConverter: Length.parse
});
exports.paddingRightProperty.register(view_base_1.Style);
exports.paddingTopProperty = new view_base_1.CssProperty({
    name: "paddingTop", cssName: "padding-top", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        if (target.view instanceof ViewCommon) {
            target.view.effectivePaddingTop = Length.toDevicePixels(newValue, 0);
        }
    }, valueConverter: Length.parse
});
exports.paddingTopProperty.register(view_base_1.Style);
exports.paddingBottomProperty = new view_base_1.CssProperty({
    name: "paddingBottom", cssName: "padding-bottom", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        if (target.view instanceof ViewCommon) {
            target.view.effectivePaddingBottom = Length.toDevicePixels(newValue, 0);
        }
    }, valueConverter: Length.parse
});
exports.paddingBottomProperty.register(view_base_1.Style);
var HorizontalAlignment;
(function (HorizontalAlignment) {
    HorizontalAlignment.LEFT = "left";
    HorizontalAlignment.CENTER = "center";
    HorizontalAlignment.RIGHT = "right";
    HorizontalAlignment.STRETCH = "stretch";
    HorizontalAlignment.isValid = view_base_1.makeValidator(HorizontalAlignment.LEFT, HorizontalAlignment.CENTER, HorizontalAlignment.RIGHT, HorizontalAlignment.STRETCH);
    HorizontalAlignment.parse = view_base_1.makeParser(HorizontalAlignment.isValid);
})(HorizontalAlignment = exports.HorizontalAlignment || (exports.HorizontalAlignment = {}));
exports.horizontalAlignmentProperty = new view_base_1.CssProperty({ name: "horizontalAlignment", cssName: "horizontal-align", defaultValue: HorizontalAlignment.STRETCH, affectsLayout: view_base_1.isIOS, valueConverter: HorizontalAlignment.parse });
exports.horizontalAlignmentProperty.register(view_base_1.Style);
var VerticalAlignment;
(function (VerticalAlignment) {
    VerticalAlignment.TOP = "top";
    VerticalAlignment.MIDDLE = "middle";
    VerticalAlignment.BOTTOM = "bottom";
    VerticalAlignment.STRETCH = "stretch";
    VerticalAlignment.isValid = view_base_1.makeValidator(VerticalAlignment.TOP, VerticalAlignment.MIDDLE, VerticalAlignment.BOTTOM, VerticalAlignment.STRETCH);
    VerticalAlignment.parse = function (value) { return value.toLowerCase() === "center" ? VerticalAlignment.MIDDLE : parseStrict(value); };
    var parseStrict = view_base_1.makeParser(VerticalAlignment.isValid);
})(VerticalAlignment = exports.VerticalAlignment || (exports.VerticalAlignment = {}));
exports.verticalAlignmentProperty = new view_base_1.CssProperty({ name: "verticalAlignment", cssName: "vertical-align", defaultValue: VerticalAlignment.STRETCH, affectsLayout: view_base_1.isIOS, valueConverter: VerticalAlignment.parse });
exports.verticalAlignmentProperty.register(view_base_1.Style);
function parseThickness(value) {
    if (typeof value === "string") {
        var arr = value.split(/[ ,]+/);
        var top_1;
        var right = void 0;
        var bottom = void 0;
        var left = void 0;
        if (arr.length === 1) {
            top_1 = arr[0];
            right = arr[0];
            bottom = arr[0];
            left = arr[0];
        }
        else if (arr.length === 2) {
            top_1 = arr[0];
            bottom = arr[0];
            right = arr[1];
            left = arr[1];
        }
        else if (arr.length === 3) {
            top_1 = arr[0];
            right = arr[1];
            left = arr[1];
            bottom = arr[2];
        }
        else if (arr.length === 4) {
            top_1 = arr[0];
            right = arr[1];
            bottom = arr[2];
            left = arr[3];
        }
        else {
            throw new Error("Expected 1, 2, 3 or 4 parameters. Actual: " + value);
        }
        return {
            top: top_1,
            right: right,
            bottom: bottom,
            left: left
        };
    }
    else {
        return value;
    }
}
function convertToMargins(value) {
    if (typeof value === "string" && value !== "auto") {
        var thickness = parseThickness(value);
        return [
            [exports.marginTopProperty, PercentLength.parse(thickness.top)],
            [exports.marginRightProperty, PercentLength.parse(thickness.right)],
            [exports.marginBottomProperty, PercentLength.parse(thickness.bottom)],
            [exports.marginLeftProperty, PercentLength.parse(thickness.left)]
        ];
    }
    else {
        return [
            [exports.marginTopProperty, value],
            [exports.marginRightProperty, value],
            [exports.marginBottomProperty, value],
            [exports.marginLeftProperty, value]
        ];
    }
}
function convertToPaddings(value) {
    if (typeof value === "string" && value !== "auto") {
        var thickness = parseThickness(value);
        return [
            [exports.paddingTopProperty, Length.parse(thickness.top)],
            [exports.paddingRightProperty, Length.parse(thickness.right)],
            [exports.paddingBottomProperty, Length.parse(thickness.bottom)],
            [exports.paddingLeftProperty, Length.parse(thickness.left)]
        ];
    }
    else {
        return [
            [exports.paddingTopProperty, value],
            [exports.paddingRightProperty, value],
            [exports.paddingBottomProperty, value],
            [exports.paddingLeftProperty, value]
        ];
    }
}
exports.rotateProperty = new view_base_1.CssAnimationProperty({ name: "rotate", cssName: "rotate", defaultValue: 0, valueConverter: parseFloat });
exports.rotateProperty.register(view_base_1.Style);
exports.scaleXProperty = new view_base_1.CssAnimationProperty({ name: "scaleX", cssName: "scaleX", defaultValue: 1, valueConverter: parseFloat });
exports.scaleXProperty.register(view_base_1.Style);
exports.scaleYProperty = new view_base_1.CssAnimationProperty({ name: "scaleY", cssName: "scaleY", defaultValue: 1, valueConverter: parseFloat });
exports.scaleYProperty.register(view_base_1.Style);
exports.translateXProperty = new view_base_1.CssAnimationProperty({ name: "translateX", cssName: "translateX", defaultValue: 0, valueConverter: Length.parse, equalityComparer: Length.equals });
exports.translateXProperty.register(view_base_1.Style);
exports.translateYProperty = new view_base_1.CssAnimationProperty({ name: "translateY", cssName: "translateY", defaultValue: 0, valueConverter: Length.parse, equalityComparer: Length.equals });
exports.translateYProperty.register(view_base_1.Style);
var transformProperty = new view_base_1.ShorthandProperty({
    name: "transform", cssName: "transform",
    getter: function () {
        var scaleX = this.scaleX;
        var scaleY = this.scaleY;
        var translateX = this.translateX;
        var translateY = this.translateY;
        var rotate = this.rotate;
        var result = "";
        if (translateX !== 0 || translateY !== 0) {
            result += "translate(" + translateX + ", " + translateY + ") ";
        }
        if (scaleX !== 1 || scaleY !== 1) {
            result += "scale(" + scaleX + ", " + scaleY + ") ";
        }
        if (rotate !== 0) {
            result += "rotate (" + rotate + ")";
        }
        return result.trim();
    },
    converter: convertToTransform
});
transformProperty.register(view_base_1.Style);
function transformConverter(value) {
    if (value.indexOf("none") !== -1) {
        var operations_1 = {};
        operations_1[value] = value;
        return operations_1;
    }
    var operations = {};
    var operator = "";
    var pos = 0;
    while (pos < value.length) {
        if (value[pos] === " " || value[pos] === ",") {
            pos++;
        }
        else if (value[pos] === "(") {
            var start = pos + 1;
            while (pos < value.length && value[pos] !== ")") {
                pos++;
            }
            var operand = value.substring(start, pos);
            operations[operator] = operand.trim();
            operator = "";
            pos++;
        }
        else {
            operator += value[pos++];
        }
    }
    return operations;
}
function convertToTransform(value) {
    var newTransform = value === view_base_1.unsetValue ? { "none": "none" } : transformConverter(value);
    var array = [];
    var values;
    for (var transform in newTransform) {
        switch (transform) {
            case "scaleX":
                array.push([exports.scaleXProperty, newTransform[transform]]);
                break;
            case "scaleY":
                array.push([exports.scaleYProperty, newTransform[transform]]);
                break;
            case "scale":
            case "scale3d":
                values = newTransform[transform].split(",");
                if (values.length >= 2) {
                    array.push([exports.scaleXProperty, values[0]]);
                    array.push([exports.scaleYProperty, values[1]]);
                }
                else if (values.length === 1) {
                    array.push([exports.scaleXProperty, values[0]]);
                    array.push([exports.scaleYProperty, values[0]]);
                }
                break;
            case "translateX":
                array.push([exports.translateXProperty, newTransform[transform]]);
                break;
            case "translateY":
                array.push([exports.translateYProperty, newTransform[transform]]);
                break;
            case "translate":
            case "translate3d":
                values = newTransform[transform].split(",");
                if (values.length >= 2) {
                    array.push([exports.translateXProperty, values[0]]);
                    array.push([exports.translateYProperty, values[1]]);
                }
                else if (values.length === 1) {
                    array.push([exports.translateXProperty, values[0]]);
                    array.push([exports.translateYProperty, values[0]]);
                }
                break;
            case "rotate":
                var text = newTransform[transform];
                var val = parseFloat(text);
                if (text.slice(-3) === "rad") {
                    val = val * (180.0 / Math.PI);
                }
                array.push([exports.rotateProperty, val]);
                break;
            case "none":
                array.push([exports.scaleXProperty, 1]);
                array.push([exports.scaleYProperty, 1]);
                array.push([exports.translateXProperty, 0]);
                array.push([exports.translateYProperty, 0]);
                array.push([exports.rotateProperty, 0]);
                break;
        }
    }
    return array;
}
exports.backgroundInternalProperty = new view_base_1.CssProperty({
    name: "backgroundInternal",
    cssName: "_backgroundInternal",
    defaultValue: background_1.Background.default
});
exports.backgroundInternalProperty.register(view_base_1.Style);
var pattern = /url\(('|")(.*?)\1\)/;
exports.backgroundImageProperty = new view_base_1.CssProperty({
    name: "backgroundImage", cssName: "background-image", valueChanged: function (target, oldValue, newValue) {
        var style = target;
        var currentBackground = target.backgroundInternal;
        var url = newValue;
        var isValid = false;
        if (url === undefined) {
            style.backgroundInternal = currentBackground.withImage(undefined);
            return;
        }
        var match = url.match(pattern);
        if (match && match[2]) {
            url = match[2];
        }
        if (utils_1.isDataURI(url)) {
            var base64Data = url.split(",")[1];
            if (typeof base64Data !== "undefined") {
                style.backgroundInternal = currentBackground.withImage(image_source_1.fromBase64(base64Data));
                isValid = true;
            }
            else {
                style.backgroundInternal = currentBackground.withImage(undefined);
            }
        }
        else if (utils_1.isFileOrResourcePath(url)) {
            style.backgroundInternal = currentBackground.withImage(image_source_1.fromFileOrResource(url));
            isValid = true;
        }
        else if (url.indexOf("http") !== -1) {
            style["_url"] = url;
            style.backgroundInternal = currentBackground.withImage(undefined);
            image_source_1.fromUrl(url).then(function (r) {
                if (style && style["_url"] === url) {
                    currentBackground = target.backgroundInternal;
                    target.backgroundInternal = currentBackground.withImage(r);
                }
            });
            isValid = true;
        }
        if (!isValid) {
            style.backgroundInternal = currentBackground.withImage(undefined);
        }
    }
});
exports.backgroundImageProperty.register(view_base_1.Style);
exports.backgroundColorProperty = new view_base_1.CssAnimationProperty({
    name: "backgroundColor", cssName: "background-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withColor(newValue);
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.backgroundColorProperty.register(view_base_1.Style);
var BackgroundRepeat;
(function (BackgroundRepeat) {
    BackgroundRepeat.REPEAT = "repeat";
    BackgroundRepeat.REPEAT_X = "repeat-x";
    BackgroundRepeat.REPEAT_Y = "repeat-y";
    BackgroundRepeat.NO_REPEAT = "no-repeat";
    BackgroundRepeat.isValid = view_base_1.makeValidator(BackgroundRepeat.REPEAT, BackgroundRepeat.REPEAT_X, BackgroundRepeat.REPEAT_Y, BackgroundRepeat.NO_REPEAT);
    BackgroundRepeat.parse = view_base_1.makeParser(BackgroundRepeat.isValid);
})(BackgroundRepeat = exports.BackgroundRepeat || (exports.BackgroundRepeat = {}));
exports.backgroundRepeatProperty = new view_base_1.CssProperty({
    name: "backgroundRepeat", cssName: "background-repeat", valueConverter: BackgroundRepeat.parse,
    valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withRepeat(newValue);
    }
});
exports.backgroundRepeatProperty.register(view_base_1.Style);
exports.backgroundSizeProperty = new view_base_1.CssProperty({
    name: "backgroundSize", cssName: "background-size", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withSize(newValue);
    }
});
exports.backgroundSizeProperty.register(view_base_1.Style);
exports.backgroundPositionProperty = new view_base_1.CssProperty({
    name: "backgroundPosition", cssName: "background-position", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withPosition(newValue);
    }
});
exports.backgroundPositionProperty.register(view_base_1.Style);
function parseBorderColor(value) {
    var result = { top: undefined, right: undefined, bottom: undefined, left: undefined };
    if (value.indexOf("rgb") === 0) {
        result.top = result.right = result.bottom = result.left = new color_1.Color(value);
        return result;
    }
    var arr = value.split(/[ ,]+/);
    if (arr.length === 1) {
        var arr0 = new color_1.Color(arr[0]);
        result.top = arr0;
        result.right = arr0;
        result.bottom = arr0;
        result.left = arr0;
    }
    else if (arr.length === 2) {
        var arr0 = new color_1.Color(arr[0]);
        var arr1 = new color_1.Color(arr[1]);
        result.top = arr0;
        result.right = arr1;
        result.bottom = arr0;
        result.left = arr1;
    }
    else if (arr.length === 3) {
        var arr0 = new color_1.Color(arr[0]);
        var arr1 = new color_1.Color(arr[1]);
        var arr2 = new color_1.Color(arr[2]);
        result.top = arr0;
        result.right = arr1;
        result.bottom = arr2;
        result.left = arr1;
    }
    else if (arr.length === 4) {
        var arr0 = new color_1.Color(arr[0]);
        var arr1 = new color_1.Color(arr[1]);
        var arr2 = new color_1.Color(arr[2]);
        var arr3 = new color_1.Color(arr[3]);
        result.top = arr0;
        result.right = arr1;
        result.bottom = arr2;
        result.left = arr3;
    }
    else {
        throw new Error("Expected 1, 2, 3 or 4 parameters. Actual: " + value);
    }
    return result;
}
var borderColorProperty = new view_base_1.ShorthandProperty({
    name: "borderColor", cssName: "border-color",
    getter: function () {
        if (color_1.Color.equals(this.borderTopColor, this.borderRightColor) &&
            color_1.Color.equals(this.borderTopColor, this.borderBottomColor) &&
            color_1.Color.equals(this.borderTopColor, this.borderLeftColor)) {
            return this.borderTopColor;
        }
        else {
            return this.borderTopColor + " " + this.borderRightColor + " " + this.borderBottomColor + " " + this.borderLeftColor;
        }
    },
    converter: function (value) {
        if (typeof value === "string") {
            var fourColors = parseBorderColor(value);
            return [
                [exports.borderTopColorProperty, fourColors.top],
                [exports.borderRightColorProperty, fourColors.right],
                [exports.borderBottomColorProperty, fourColors.bottom],
                [exports.borderLeftColorProperty, fourColors.left]
            ];
        }
        else {
            return [
                [exports.borderTopColorProperty, value],
                [exports.borderRightColorProperty, value],
                [exports.borderBottomColorProperty, value],
                [exports.borderLeftColorProperty, value]
            ];
        }
    }
});
borderColorProperty.register(view_base_1.Style);
exports.borderTopColorProperty = new view_base_1.CssProperty({
    name: "borderTopColor", cssName: "border-top-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderTopColor(newValue);
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.borderTopColorProperty.register(view_base_1.Style);
exports.borderRightColorProperty = new view_base_1.CssProperty({
    name: "borderRightColor", cssName: "border-right-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderRightColor(newValue);
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.borderRightColorProperty.register(view_base_1.Style);
exports.borderBottomColorProperty = new view_base_1.CssProperty({
    name: "borderBottomColor", cssName: "border-bottom-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderBottomColor(newValue);
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.borderBottomColorProperty.register(view_base_1.Style);
exports.borderLeftColorProperty = new view_base_1.CssProperty({
    name: "borderLeftColor", cssName: "border-left-color", valueChanged: function (target, oldValue, newValue) {
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderLeftColor(newValue);
    }, equalityComparer: color_1.Color.equals, valueConverter: function (value) { return new color_1.Color(value); }
});
exports.borderLeftColorProperty.register(view_base_1.Style);
var borderWidthProperty = new view_base_1.ShorthandProperty({
    name: "borderWidth", cssName: "border-width",
    getter: function () {
        if (Length.equals(this.borderTopWidth, this.borderRightWidth) &&
            Length.equals(this.borderTopWidth, this.borderBottomWidth) &&
            Length.equals(this.borderTopWidth, this.borderLeftWidth)) {
            return this.borderTopWidth;
        }
        else {
            return Length.convertToString(this.borderTopWidth) + " " + Length.convertToString(this.borderRightWidth) + " " + Length.convertToString(this.borderBottomWidth) + " " + Length.convertToString(this.borderLeftWidth);
        }
    },
    converter: function (value) {
        if (typeof value === "string" && value !== "auto") {
            var borderWidths = parseThickness(value);
            return [
                [exports.borderTopWidthProperty, borderWidths.top],
                [exports.borderRightWidthProperty, borderWidths.right],
                [exports.borderBottomWidthProperty, borderWidths.bottom],
                [exports.borderLeftWidthProperty, borderWidths.left]
            ];
        }
        else {
            return [
                [exports.borderTopWidthProperty, value],
                [exports.borderRightWidthProperty, value],
                [exports.borderBottomWidthProperty, value],
                [exports.borderLeftWidthProperty, value]
            ];
        }
    }
});
borderWidthProperty.register(view_base_1.Style);
exports.borderTopWidthProperty = new view_base_1.CssProperty({
    name: "borderTopWidth", cssName: "border-top-width", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-top-width should be Non-Negative Finite number. Value: " + value);
        }
        if (target.view instanceof ViewCommon) {
            target.view.effectiveBorderTopWidth = value;
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderTopWidth(value);
    }, valueConverter: Length.parse
});
exports.borderTopWidthProperty.register(view_base_1.Style);
exports.borderRightWidthProperty = new view_base_1.CssProperty({
    name: "borderRightWidth", cssName: "border-right-width", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-right-width should be Non-Negative Finite number. Value: " + value);
        }
        if (target.view instanceof ViewCommon) {
            target.view.effectiveBorderRightWidth = value;
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderRightWidth(value);
    }, valueConverter: Length.parse
});
exports.borderRightWidthProperty.register(view_base_1.Style);
exports.borderBottomWidthProperty = new view_base_1.CssProperty({
    name: "borderBottomWidth", cssName: "border-bottom-width", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-bottom-width should be Non-Negative Finite number. Value: " + value);
        }
        if (target.view instanceof ViewCommon) {
            target.view.effectiveBorderBottomWidth = value;
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderBottomWidth(value);
    }, valueConverter: Length.parse
});
exports.borderBottomWidthProperty.register(view_base_1.Style);
exports.borderLeftWidthProperty = new view_base_1.CssProperty({
    name: "borderLeftWidth", cssName: "border-left-width", defaultValue: exports.zeroLength, affectsLayout: view_base_1.isIOS, equalityComparer: Length.equals,
    valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-left-width should be Non-Negative Finite number. Value: " + value);
        }
        if (target.view instanceof ViewCommon) {
            target.view.effectiveBorderLeftWidth = value;
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderLeftWidth(value);
    }, valueConverter: Length.parse
});
exports.borderLeftWidthProperty.register(view_base_1.Style);
var borderRadiusProperty = new view_base_1.ShorthandProperty({
    name: "borderRadius", cssName: "border-radius",
    getter: function () {
        if (Length.equals(this.borderTopLeftRadius, this.borderTopRightRadius) &&
            Length.equals(this.borderTopLeftRadius, this.borderBottomRightRadius) &&
            Length.equals(this.borderTopLeftRadius, this.borderBottomLeftRadius)) {
            return this.borderTopLeftRadius;
        }
        return Length.convertToString(this.borderTopLeftRadius) + " " + Length.convertToString(this.borderTopRightRadius) + " " + Length.convertToString(this.borderBottomRightRadius) + " " + Length.convertToString(this.borderBottomLeftRadius);
    },
    converter: function (value) {
        if (typeof value === "string") {
            var borderRadius = parseThickness(value);
            return [
                [exports.borderTopLeftRadiusProperty, borderRadius.top],
                [exports.borderTopRightRadiusProperty, borderRadius.right],
                [exports.borderBottomRightRadiusProperty, borderRadius.bottom],
                [exports.borderBottomLeftRadiusProperty, borderRadius.left]
            ];
        }
        else {
            return [
                [exports.borderTopLeftRadiusProperty, value],
                [exports.borderTopRightRadiusProperty, value],
                [exports.borderBottomRightRadiusProperty, value],
                [exports.borderBottomLeftRadiusProperty, value]
            ];
        }
    }
});
borderRadiusProperty.register(view_base_1.Style);
exports.borderTopLeftRadiusProperty = new view_base_1.CssProperty({
    name: "borderTopLeftRadius", cssName: "border-top-left-radius", defaultValue: 0, affectsLayout: view_base_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-top-left-radius should be Non-Negative Finite number. Value: " + value);
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderTopLeftRadius(value);
    }, valueConverter: Length.parse
});
exports.borderTopLeftRadiusProperty.register(view_base_1.Style);
exports.borderTopRightRadiusProperty = new view_base_1.CssProperty({
    name: "borderTopRightRadius", cssName: "border-top-right-radius", defaultValue: 0, affectsLayout: view_base_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-top-right-radius should be Non-Negative Finite number. Value: " + value);
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderTopRightRadius(value);
    }, valueConverter: Length.parse
});
exports.borderTopRightRadiusProperty.register(view_base_1.Style);
exports.borderBottomRightRadiusProperty = new view_base_1.CssProperty({
    name: "borderBottomRightRadius", cssName: "border-bottom-right-radius", defaultValue: 0, affectsLayout: view_base_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-bottom-right-radius should be Non-Negative Finite number. Value: " + value);
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderBottomRightRadius(value);
    }, valueConverter: Length.parse
});
exports.borderBottomRightRadiusProperty.register(view_base_1.Style);
exports.borderBottomLeftRadiusProperty = new view_base_1.CssProperty({
    name: "borderBottomLeftRadius", cssName: "border-bottom-left-radius", defaultValue: 0, affectsLayout: view_base_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var value = Length.toDevicePixels(newValue, 0);
        if (!isNonNegativeFiniteNumber(value)) {
            throw new Error("border-bottom-left-radius should be Non-Negative Finite number. Value: " + value);
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withBorderBottomLeftRadius(value);
    }, valueConverter: Length.parse
});
exports.borderBottomLeftRadiusProperty.register(view_base_1.Style);
function isNonNegativeFiniteNumber(value) {
    return isFinite(value) && !isNaN(value) && value >= 0;
}
var supportedPaths = ["rect", "circle", "ellipse", "polygon", "inset"];
function isClipPathValid(value) {
    if (!value) {
        return true;
    }
    var functionName = value.substring(0, value.indexOf("(")).trim();
    return supportedPaths.indexOf(functionName) !== -1;
}
exports.clipPathProperty = new view_base_1.CssProperty({
    name: "clipPath", cssName: "clip-path", valueChanged: function (target, oldValue, newValue) {
        if (!isClipPathValid(newValue)) {
            throw new Error("clip-path is not valid.");
        }
        var background = target.backgroundInternal;
        target.backgroundInternal = background.withClipPath(newValue);
    }
});
exports.clipPathProperty.register(view_base_1.Style);
function isFloatValueConverter(value) {
    var newValue = parseFloat(value);
    if (isNaN(newValue)) {
        throw new Error("Invalid value: " + newValue);
    }
    return newValue;
}
exports.zIndexProperty = new view_base_1.CssProperty({ name: "zIndex", cssName: "z-index", defaultValue: Number.NaN, valueConverter: isFloatValueConverter });
exports.zIndexProperty.register(view_base_1.Style);
function opacityConverter(value) {
    var newValue = parseFloat(value);
    if (!isNaN(newValue) && 0 <= newValue && newValue <= 1) {
        return newValue;
    }
    throw new Error("Opacity should be between [0, 1]. Value: " + newValue);
}
exports.opacityProperty = new view_base_1.CssAnimationProperty({ name: "opacity", cssName: "opacity", defaultValue: 1, valueConverter: opacityConverter });
exports.opacityProperty.register(view_base_1.Style);
exports.colorProperty = new view_base_1.InheritedCssProperty({ name: "color", cssName: "color", equalityComparer: color_1.Color.equals, valueConverter: function (v) { return new color_1.Color(v); } });
exports.colorProperty.register(view_base_1.Style);
exports.fontInternalProperty = new view_base_1.CssProperty({ name: "fontInternal", cssName: "_fontInternal", defaultValue: font_1.Font.default });
exports.fontInternalProperty.register(view_base_1.Style);
exports.fontFamilyProperty = new view_base_1.InheritedCssProperty({
    name: "fontFamily", cssName: "font-family", affectsLayout: view_base_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var currentFont = target.fontInternal;
        if (currentFont.fontFamily !== newValue) {
            var newFont = currentFont.withFontFamily(newValue);
            target.fontInternal = font_1.Font.equals(font_1.Font.default, newFont) ? view_base_1.unsetValue : newFont;
        }
    }
});
exports.fontFamilyProperty.register(view_base_1.Style);
exports.fontSizeProperty = new view_base_1.InheritedCssProperty({
    name: "fontSize", cssName: "font-size", affectsLayout: view_base_1.isIOS, valueChanged: function (target, oldValue, newValue) {
        var currentFont = target.fontInternal;
        if (currentFont.fontSize !== newValue) {
            var newFont = currentFont.withFontSize(newValue);
            target.fontInternal = font_1.Font.equals(font_1.Font.default, newFont) ? view_base_1.unsetValue : newFont;
        }
    },
    valueConverter: function (v) { return parseFloat(v); }
});
exports.fontSizeProperty.register(view_base_1.Style);
exports.fontStyleProperty = new view_base_1.InheritedCssProperty({
    name: "fontStyle", cssName: "font-style", affectsLayout: view_base_1.isIOS, defaultValue: font_1.FontStyle.NORMAL, valueConverter: font_1.FontStyle.parse, valueChanged: function (target, oldValue, newValue) {
        var currentFont = target.fontInternal;
        if (currentFont.fontStyle !== newValue) {
            var newFont = currentFont.withFontStyle(newValue);
            target.fontInternal = font_1.Font.equals(font_1.Font.default, newFont) ? view_base_1.unsetValue : newFont;
        }
    }
});
exports.fontStyleProperty.register(view_base_1.Style);
exports.fontWeightProperty = new view_base_1.InheritedCssProperty({
    name: "fontWeight", cssName: "font-weight", affectsLayout: view_base_1.isIOS, defaultValue: font_1.FontWeight.NORMAL, valueConverter: font_1.FontWeight.parse, valueChanged: function (target, oldValue, newValue) {
        var currentFont = target.fontInternal;
        if (currentFont.fontWeight !== newValue) {
            var newFont = currentFont.withFontWeight(newValue);
            target.fontInternal = font_1.Font.equals(font_1.Font.default, newFont) ? view_base_1.unsetValue : newFont;
        }
    }
});
exports.fontWeightProperty.register(view_base_1.Style);
var fontProperty = new view_base_1.ShorthandProperty({
    name: "font", cssName: "font",
    getter: function () {
        return this.fontStyle + " " + this.fontWeight + " " + this.fontSize + " " + this.fontFamily;
    },
    converter: function (value) {
        if (value === view_base_1.unsetValue) {
            return [
                [exports.fontStyleProperty, view_base_1.unsetValue],
                [exports.fontWeightProperty, view_base_1.unsetValue],
                [exports.fontSizeProperty, view_base_1.unsetValue],
                [exports.fontFamilyProperty, view_base_1.unsetValue]
            ];
        }
        else {
            var font = font_1.parseFont(value);
            var fontSize = parseFloat(font.fontSize);
            return [
                [exports.fontStyleProperty, font.fontStyle],
                [exports.fontWeightProperty, font.fontWeight],
                [exports.fontSizeProperty, fontSize],
                [exports.fontFamilyProperty, font.fontFamily]
            ];
        }
    }
});
fontProperty.register(view_base_1.Style);
var Visibility;
(function (Visibility) {
    Visibility.VISIBLE = "visible";
    Visibility.HIDDEN = "hidden";
    Visibility.COLLAPSE = "collapse";
    Visibility.isValid = view_base_1.makeValidator(Visibility.VISIBLE, Visibility.HIDDEN, Visibility.COLLAPSE);
    Visibility.parse = function (value) { return value.toLowerCase() === "collapsed" ? Visibility.COLLAPSE : parseStrict(value); };
    var parseStrict = view_base_1.makeParser(Visibility.isValid);
})(Visibility = exports.Visibility || (exports.Visibility = {}));
exports.visibilityProperty = new view_base_1.CssProperty({
    name: "visibility", cssName: "visibility", defaultValue: Visibility.VISIBLE, affectsLayout: view_base_1.isIOS, valueConverter: Visibility.parse, valueChanged: function (target, oldValue, newValue) {
        target.view.isCollapsed = (newValue === Visibility.COLLAPSE);
    }
});
exports.visibilityProperty.register(view_base_1.Style);
//# sourceMappingURL=view-common.js.map