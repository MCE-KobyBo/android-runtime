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
var knownCollections;
(function (knownCollections) {
    knownCollections.items = "items";
})(knownCollections = exports.knownCollections || (exports.knownCollections = {}));
var SegmentedBarItemBase = (function (_super) {
    __extends(SegmentedBarItemBase, _super);
    function SegmentedBarItemBase() {
        _super.apply(this, arguments);
        this._title = "";
    }
    Object.defineProperty(SegmentedBarItemBase.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            var strValue = (value !== null && value !== undefined) ? value.toString() : "";
            if (this._title !== strValue) {
                this._title = strValue;
                this._update();
            }
        },
        enumerable: true,
        configurable: true
    });
    return SegmentedBarItemBase;
}(view_1.ViewBase));
exports.SegmentedBarItemBase = SegmentedBarItemBase;
var SegmentedBarBase = (function (_super) {
    __extends(SegmentedBarBase, _super);
    function SegmentedBarBase() {
        _super.apply(this, arguments);
    }
    SegmentedBarBase.prototype._addArrayFromBuilder = function (name, value) {
        if (name === "items") {
            this.items = value;
        }
    };
    SegmentedBarBase.prototype._addChildFromBuilder = function (name, value) {
        if (name === "SegmentedBarItem") {
            if (!this.items) {
                this.items = new Array();
            }
            var item = value;
            this.items.push(item);
            this._addView(item);
            exports.selectedIndexProperty.coerce(this);
        }
    };
    SegmentedBarBase.prototype.onItemsChanged = function (oldItems, newItems) {
        if (oldItems) {
            for (var i = 0, count = oldItems.length; i < count; i++) {
                this._removeView(oldItems[i]);
            }
        }
        if (newItems) {
            for (var i = 0, count = newItems.length; i < count; i++) {
                this._addView(newItems[i]);
            }
        }
    };
    // TODO: Make _addView to keep its children so this method is not needed!
    SegmentedBarBase.prototype.eachChild = function (callback) {
        var items = this.items;
        if (items) {
            items.forEach(function (item, i) {
                callback(item);
            });
        }
    };
    SegmentedBarBase.selectedIndexChangedEvent = "selectedIndexChanged";
    return SegmentedBarBase;
}(view_1.View));
exports.SegmentedBarBase = SegmentedBarBase;
/**
 * Gets or sets the selected index dependency property of the SegmentedBar.
 */
exports.selectedIndexProperty = new view_1.CoercibleProperty({
    name: "selectedIndex", defaultValue: -1,
    valueChanged: function (target, oldValue, newValue) {
        target.notify({ eventName: SegmentedBarBase.selectedIndexChangedEvent, object: target, oldIndex: oldValue, newIndex: newValue });
    },
    coerceValue: function (target, value) {
        var items = target.items;
        if (items) {
            var max = items.length - 1;
            if (value < 0) {
                value = 0;
            }
            if (value > max) {
                value = max;
            }
        }
        else {
            value = -1;
        }
        return value;
    },
    valueConverter: function (v) { return parseInt(v); }
});
exports.selectedIndexProperty.register(SegmentedBarBase);
exports.itemsProperty = new view_1.Property({
    name: "items", valueChanged: function (target, oldValue, newValue) {
        target.onItemsChanged(oldValue, newValue);
        exports.selectedIndexProperty.coerce(target);
    }
});
exports.itemsProperty.register(SegmentedBarBase);
exports.selectedBackgroundColorProperty = new view_1.InheritedCssProperty({ name: "selectedBackgroundColor", cssName: "selected-background-color", equalityComparer: view_1.Color.equals, valueConverter: function (v) { return new view_1.Color(v); } });
exports.selectedBackgroundColorProperty.register(view_1.Style);
