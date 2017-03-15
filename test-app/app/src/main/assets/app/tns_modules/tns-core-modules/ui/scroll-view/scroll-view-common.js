"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var content_view_1 = require("../content-view");
__export(require("../content-view"));
var ScrollViewBase = (function (_super) {
    __extends(ScrollViewBase, _super);
    function ScrollViewBase() {
        _super.apply(this, arguments);
        this._scrollChangeCount = 0;
    }
    ScrollViewBase.prototype.addEventListener = function (arg, callback, thisArg) {
        _super.prototype.addEventListener.call(this, arg, callback, thisArg);
        if (arg === ScrollViewBase.scrollEvent) {
            this._scrollChangeCount++;
            this.attach();
        }
    };
    ScrollViewBase.prototype.removeEventListener = function (arg, callback, thisArg) {
        _super.prototype.addEventListener.call(this, arg, callback, thisArg);
        if (arg === ScrollViewBase.scrollEvent) {
            this._scrollChangeCount--;
            this.dettach();
        }
    };
    ScrollViewBase.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.attach();
    };
    ScrollViewBase.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
        this.dettach();
    };
    ScrollViewBase.prototype.attach = function () {
        if (this._scrollChangeCount > 0 && this.isLoaded) {
            this.attachNative();
        }
    };
    ScrollViewBase.prototype.dettach = function () {
        if (this._scrollChangeCount === 0 && this.isLoaded) {
            this.dettachNative();
        }
    };
    ScrollViewBase.prototype.attachNative = function () {
        //
    };
    ScrollViewBase.prototype.dettachNative = function () {
        //
    };
    Object.defineProperty(ScrollViewBase.prototype, "horizontalOffset", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollViewBase.prototype, "verticalOffset", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollViewBase.prototype, "scrollableWidth", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollViewBase.prototype, "scrollableHeight", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    ScrollViewBase.scrollEvent = "scroll";
    return ScrollViewBase;
}(content_view_1.ContentView));
exports.ScrollViewBase = ScrollViewBase;
exports.orientationProperty = new content_view_1.Property({
    name: "orientation", defaultValue: "vertical", affectsLayout: true,
    valueChanged: function (target, oldValue, newValue) {
        target._onOrientationChanged();
    },
    valueConverter: function (value) {
        if (value === "vertical") {
            return "vertical";
        }
        else if (value === "horizontal") {
            return "horizontal";
        }
        throw new Error("Orientation should be 'horizontal' or 'vertical'. Given: " + value);
    }
});
exports.orientationProperty.register(ScrollViewBase);
