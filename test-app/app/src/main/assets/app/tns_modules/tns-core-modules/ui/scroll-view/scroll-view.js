"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var scroll_view_common_1 = require("./scroll-view-common");
__export(require("./scroll-view-common"));
var ScrollView = (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView() {
        _super.apply(this, arguments);
        this._androidViewId = -1;
        this._lastScrollX = -1;
        this._lastScrollY = -1;
    }
    Object.defineProperty(ScrollView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "_nativeView", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "horizontalOffset", {
        get: function () {
            if (!this._android) {
                return 0;
            }
            return this._android.getScrollX() / scroll_view_common_1.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "verticalOffset", {
        get: function () {
            if (!this._android) {
                return 0;
            }
            return this._android.getScrollY() / scroll_view_common_1.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableWidth", {
        get: function () {
            if (!this._android || this.orientation !== "horizontal") {
                return 0;
            }
            return this._android.getScrollableLength() / scroll_view_common_1.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableHeight", {
        get: function () {
            if (!this._android || this.orientation !== "vertical") {
                return 0;
            }
            return this._android.getScrollableLength() / scroll_view_common_1.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    ScrollView.prototype.scrollToVerticalOffset = function (value, animated) {
        if (this._android && this.orientation === "vertical") {
            value *= scroll_view_common_1.layout.getDisplayDensity();
            if (animated) {
                this._android.smoothScrollTo(0, value);
            }
            else {
                this._android.scrollTo(0, value);
            }
        }
    };
    ScrollView.prototype.scrollToHorizontalOffset = function (value, animated) {
        if (this._android && this.orientation === "horizontal") {
            value *= scroll_view_common_1.layout.getDisplayDensity();
            if (animated) {
                this._android.smoothScrollTo(value, 0);
            }
            else {
                this._android.scrollTo(value, 0);
            }
        }
    };
    ScrollView.prototype._createNativeView = function () {
        if (this.orientation === "horizontal") {
            this._android = new org.nativescript.widgets.HorizontalScrollView(this._context);
        }
        else {
            this._android = new org.nativescript.widgets.VerticalScrollView(this._context);
        }
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        this._android.setId(this._androidViewId);
        return this._android;
    };
    ScrollView.prototype._onOrientationChanged = function () {
        if (this._android) {
            var parent_1 = this.parent;
            if (parent_1) {
                parent_1._removeView(this);
            }
            if (parent_1) {
                parent_1._addView(this);
            }
        }
    };
    ScrollView.prototype.attachNative = function () {
        var that = new WeakRef(this);
        this.handler = new android.view.ViewTreeObserver.OnScrollChangedListener({
            onScrollChanged: function () {
                var owner = that.get();
                if (owner) {
                    owner._onScrollChanged();
                }
            }
        });
        this._android.getViewTreeObserver().addOnScrollChangedListener(this.handler);
    };
    ScrollView.prototype._onScrollChanged = function () {
        if (this.android) {
            // Event is only raised if the scroll values differ from the last time in order to wokraround a native Android bug.
            // https://github.com/NativeScript/NativeScript/issues/2362
            var newScrollX = this.android.getScrollX();
            var newScrollY = this.android.getScrollY();
            if (newScrollX !== this._lastScrollX || newScrollY !== this._lastScrollY) {
                this.notify({
                    object: this,
                    eventName: ScrollView.scrollEvent,
                    scrollX: newScrollX / scroll_view_common_1.layout.getDisplayDensity(),
                    scrollY: newScrollY / scroll_view_common_1.layout.getDisplayDensity()
                });
                this._lastScrollX = newScrollX;
                this._lastScrollY = newScrollY;
            }
        }
    };
    ScrollView.prototype.dettachNative = function () {
        this._android.getViewTreeObserver().removeOnScrollChangedListener(this.handler);
        this.handler = null;
    };
    return ScrollView;
}(scroll_view_common_1.ScrollViewBase));
exports.ScrollView = ScrollView;
