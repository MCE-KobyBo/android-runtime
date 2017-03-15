"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var view_1 = require("../core/view");
__export(require("../core/view"));
var ContentView = (function (_super) {
    __extends(ContentView, _super);
    function ContentView() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ContentView.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (value) {
            var oldView = this._content;
            if (this._content) {
                this._removeView(this._content);
            }
            this._content = value;
            if (this._content) {
                this._addView(this._content);
            }
            this._onContentChanged(oldView, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentView.prototype, "layoutView", {
        get: function () {
            var result;
            if (this._content) {
                var first_1 = true;
                this._content._eachLayoutView(function (child) {
                    if (first_1) {
                        first_1 = false;
                        result = child;
                    }
                    else {
                        throw new Error("More than one layout child inside a ContentView");
                    }
                });
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentView.prototype, "_childrenCount", {
        get: function () {
            if (this._content) {
                return 1;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    ContentView.prototype._onContentChanged = function (oldView, newView) {
        //
    };
    ContentView.prototype._addChildFromBuilder = function (name, value) {
        if (value instanceof view_1.View) {
            this.content = value;
        }
    };
    ContentView.prototype.eachChildView = function (callback) {
        var content = this._content;
        if (content) {
            callback(content);
        }
    };
    // This method won't be called in Android because we use the native android layout.
    ContentView.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var result = view_1.View.measureChild(this, this.layoutView, widthMeasureSpec, heightMeasureSpec);
        var width = view_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = view_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = view_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = view_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var measureWidth = Math.max(result.measuredWidth, this.effectiveMinWidth);
        var measureHeight = Math.max(result.measuredHeight, this.effectiveMinHeight);
        var widthAndState = view_1.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = view_1.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    // This method won't be called in Android because we use the native android layout.
    ContentView.prototype.onLayout = function (left, top, right, bottom) {
        view_1.View.layoutChild(this, this.layoutView, 0, 0, right - left, bottom - top);
    };
    return ContentView;
}(view_1.CustomLayoutView));
exports.ContentView = ContentView;
