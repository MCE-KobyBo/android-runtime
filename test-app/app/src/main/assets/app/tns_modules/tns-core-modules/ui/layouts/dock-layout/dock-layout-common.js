"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var layout_base_1 = require("../layout-base");
function validateArgs(element) {
    if (!element) {
        throw new Error("element cannot be null or undefinied.");
    }
    return element;
}
__export(require("../layout-base"));
var DockLayoutBase = (function (_super) {
    __extends(DockLayoutBase, _super);
    function DockLayoutBase() {
        _super.apply(this, arguments);
    }
    DockLayoutBase.getDock = function (element) {
        return validateArgs(element).dock;
    };
    DockLayoutBase.setDock = function (element, value) {
        validateArgs(element).dock = value;
    };
    DockLayoutBase.prototype.onDockChanged = function (view, oldValue, newValue) {
        //
    };
    return DockLayoutBase;
}(layout_base_1.LayoutBase));
exports.DockLayoutBase = DockLayoutBase;
exports.dockProperty = new layout_base_1.Property({
    name: "dock", defaultValue: "left", valueChanged: function (target, oldValue, newValue) {
        if (target instanceof layout_base_1.View) {
            var layout = target.parent;
            if (layout instanceof DockLayoutBase) {
                layout.onDockChanged(target, oldValue, newValue);
            }
        }
    }, valueConverter: function (v) {
        if (v === "left" || v === "top" || v === "right" || v === "bottom") {
            return v;
        }
        throw new Error("Invalid value for dock property: " + v);
    }
});
exports.dockProperty.register(layout_base_1.View);
exports.stretchLastChildProperty = new layout_base_1.Property({
    name: "stretchLastChild", defaultValue: true, affectsLayout: layout_base_1.isIOS, valueConverter: layout_base_1.booleanConverter
});
exports.stretchLastChildProperty.register(DockLayoutBase);
