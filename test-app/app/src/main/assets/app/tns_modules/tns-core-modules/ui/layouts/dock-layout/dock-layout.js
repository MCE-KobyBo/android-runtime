"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var dock_layout_common_1 = require("./dock-layout-common");
__export(require("./dock-layout-common"));
// define native getter and setter for topProperty.
var dockDescriptor = {
    enumerable: true,
    configurable: true,
    get: function () { return "left"; },
    set: function (value) {
        var nativeView = this._nativeView;
        var lp = nativeView.getLayoutParams() || new org.nativescript.widgets.CommonLayoutParams();
        if (lp instanceof org.nativescript.widgets.CommonLayoutParams) {
            switch (value) {
                case "left":
                    lp.dock = org.nativescript.widgets.Dock.left;
                    break;
                case "top":
                    lp.dock = org.nativescript.widgets.Dock.top;
                    break;
                case "right":
                    lp.dock = org.nativescript.widgets.Dock.right;
                    break;
                case "bottom":
                    lp.dock = org.nativescript.widgets.Dock.bottom;
                    break;
                default:
                    throw new Error("Invalid value for dock property: " + value);
            }
            nativeView.setLayoutParams(lp);
        }
    }
};
// register native properties on View type.
Object.defineProperties(dock_layout_common_1.View.prototype, (_a = {},
    _a[dock_layout_common_1.dockProperty.native] = dockDescriptor,
    _a
));
var DockLayout = (function (_super) {
    __extends(DockLayout, _super);
    function DockLayout() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(DockLayout.prototype, "android", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockLayout.prototype, "_nativeView", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    DockLayout.prototype._createNativeView = function () {
        var layout = this._layout = new org.nativescript.widgets.DockLayout(this._context);
        return layout;
    };
    Object.defineProperty(DockLayout.prototype, dock_layout_common_1.stretchLastChildProperty.native, {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockLayout.prototype, dock_layout_common_1.stretchLastChildProperty.native, {
        set: function (value) {
            this._layout.setStretchLastChild(value);
        },
        enumerable: true,
        configurable: true
    });
    return DockLayout;
}(dock_layout_common_1.DockLayoutBase));
exports.DockLayout = DockLayout;
var _a;
