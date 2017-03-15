"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var grid_layout_common_1 = require("./grid-layout-common");
__export(require("./grid-layout-common"));
function setNativeProperty(view, setter) {
    var nativeView = view._nativeView;
    var lp = nativeView.getLayoutParams() || new org.nativescript.widgets.CommonLayoutParams();
    if (lp instanceof org.nativescript.widgets.CommonLayoutParams) {
        setter(lp);
        nativeView.setLayoutParams(lp);
    }
}
// define native getter and setter for rowProperty.
var rowDescriptor = {
    enumerable: true,
    configurable: true,
    get: function () { return 0; },
    set: function (value) {
        setNativeProperty(this, function (lp) { return lp.row = value; });
    }
};
// define native getter and setter for columnProperty.
var colDescriptor = {
    enumerable: true,
    configurable: true,
    get: function () { return 0; },
    set: function (value) {
        setNativeProperty(this, function (lp) { return lp.column = value; });
    }
};
// define native getter and setter for rowSpanProperty.
var rowSpanDescriptor = {
    enumerable: true,
    configurable: true,
    get: function () { return 1; },
    set: function (value) {
        setNativeProperty(this, function (lp) { return lp.rowSpan = value; });
    }
};
// define native getter and setter for columnSpanProperty.
var colSpanDescriptor = {
    enumerable: true,
    configurable: true,
    get: function () { return 1; },
    set: function (value) {
        setNativeProperty(this, function (lp) { return lp.columnSpan = value; });
    }
};
// register native properties on View type.
Object.defineProperties(grid_layout_common_1.View.prototype, (_a = {},
    _a[grid_layout_common_1.rowProperty.native] = rowDescriptor,
    _a[grid_layout_common_1.columnProperty.native] = colDescriptor,
    _a[grid_layout_common_1.rowSpanProperty.native] = rowSpanDescriptor,
    _a[grid_layout_common_1.columnSpanProperty.native] = colSpanDescriptor,
    _a
));
function createNativeSpec(itemSpec) {
    switch (itemSpec.gridUnitType) {
        case grid_layout_common_1.GridUnitType.AUTO:
            return new org.nativescript.widgets.ItemSpec(itemSpec.value, org.nativescript.widgets.GridUnitType.auto);
        case grid_layout_common_1.GridUnitType.STAR:
            return new org.nativescript.widgets.ItemSpec(itemSpec.value, org.nativescript.widgets.GridUnitType.star);
        case grid_layout_common_1.GridUnitType.PIXEL:
            return new org.nativescript.widgets.ItemSpec(itemSpec.value * grid_layout_common_1.layout.getDisplayDensity(), org.nativescript.widgets.GridUnitType.pixel);
        default:
            throw new Error("Invalid gridUnitType: " + itemSpec.gridUnitType);
    }
}
var ItemSpec = (function (_super) {
    __extends(ItemSpec, _super);
    function ItemSpec() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ItemSpec.prototype, "actualLength", {
        get: function () {
            if (this.nativeSpec) {
                return Math.round(this.nativeSpec.getActualLength() / grid_layout_common_1.layout.getDisplayDensity());
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return ItemSpec;
}(grid_layout_common_1.ItemSpec));
exports.ItemSpec = ItemSpec;
var GridLayout = (function (_super) {
    __extends(GridLayout, _super);
    function GridLayout() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(GridLayout.prototype, "android", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridLayout.prototype, "_nativeView", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    GridLayout.prototype._createNativeView = function () {
        var _this = this;
        var layout = this._layout = new org.nativescript.widgets.GridLayout(this._context);
        // Update native GridLayout
        this.getRows().forEach(function (itemSpec, index, rows) { _this._onRowAdded(itemSpec); }, this);
        this.getColumns().forEach(function (itemSpec, index, rows) { _this._onColumnAdded(itemSpec); }, this);
        return layout;
    };
    GridLayout.prototype._onRowAdded = function (itemSpec) {
        if (this._layout) {
            var nativeSpec = createNativeSpec(itemSpec);
            itemSpec.nativeSpec = nativeSpec;
            this._layout.addRow(nativeSpec);
        }
    };
    GridLayout.prototype._onColumnAdded = function (itemSpec) {
        if (this._layout) {
            var nativeSpec = createNativeSpec(itemSpec);
            itemSpec.nativeSpec = nativeSpec;
            this._layout.addColumn(nativeSpec);
        }
    };
    GridLayout.prototype._onRowRemoved = function (itemSpec, index) {
        itemSpec.nativeSpec = null;
        if (this._layout) {
            this._layout.removeRowAt(index);
        }
    };
    GridLayout.prototype._onColumnRemoved = function (itemSpec, index) {
        itemSpec.nativeSpec = null;
        if (this._layout) {
            this._layout.removeColumnAt(index);
        }
    };
    GridLayout.prototype.invalidate = function () {
        // No need to request layout for android because it will be done in the native call.
    };
    return GridLayout;
}(grid_layout_common_1.GridLayoutBase));
exports.GridLayout = GridLayout;
var _a;
