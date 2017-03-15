"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layout_base_1 = require("../layouts/layout-base");
/**
 * Proxy view container that adds all its native children directly to the parent.
 * To be used as a logical grouping container of views.
 */
// Cases to cover:
// * Child is added to the attached proxy. Handled in _addViewToNativeVisualTree.
// * Proxy (with children) is added to the DOM. In _addViewToNativeVisualTree _addViewToNativeVisualTree recursively when the proxy is added to the parent.
// * Child is removed from attached proxy. Handled in _removeViewFromNativeVisualTree.
// * Proxy (with children) is removed form the DOM. In _removeViewFromNativeVisualTree recursively when the proxy is removed from its parent.
var ProxyViewContainer = (function (_super) {
    __extends(ProxyViewContainer, _super);
    function ProxyViewContainer() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ProxyViewContainer.prototype, "ios", {
        // No native view for proxy container.
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyViewContainer.prototype, "android", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyViewContainer.prototype, "_nativeView", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProxyViewContainer.prototype, "isLayoutRequested", {
        get: function () {
            // Always return false so all layout requests from children bubble up.
            return false;
        },
        enumerable: true,
        configurable: true
    });
    ProxyViewContainer.prototype._createNativeView = function () {
        return undefined;
    };
    ProxyViewContainer.prototype._getNativeViewsCount = function () {
        var result = 0;
        this.eachChildView(function (cv) {
            result += cv._getNativeViewsCount();
            return true;
        });
        return result;
    };
    ProxyViewContainer.prototype._eachLayoutView = function (callback) {
        this.eachChildView(function (cv) {
            if (!cv.isCollapsed) {
                cv._eachLayoutView(callback);
            }
            return true;
        });
    };
    ProxyViewContainer.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        if (layout_base_1.traceEnabled()) {
            layout_base_1.traceWrite("ViewContainer._addViewToNativeVisualTree for a child " + child + " ViewContainer.parent: " + this.parent, layout_base_1.traceCategories.ViewHierarchy);
        }
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        var parent = this.parent;
        if (parent instanceof layout_base_1.View) {
            var baseIndex = 0;
            var insideIndex = 0;
            if (parent instanceof layout_base_1.LayoutBase) {
                // Get my index in parent and convert it to native index.
                baseIndex = parent._childIndexToNativeChildIndex(parent.getChildIndex(this));
            }
            if (atIndex !== undefined) {
                insideIndex = this._childIndexToNativeChildIndex(atIndex);
            }
            else {
                // Add last;
                insideIndex = this._getNativeViewsCount();
            }
            if (layout_base_1.traceEnabled()) {
                layout_base_1.traceWrite("ProxyViewContainer._addViewToNativeVisualTree at: " + atIndex + " base: " + baseIndex + " additional: " + insideIndex, layout_base_1.traceCategories.ViewHierarchy);
            }
            return parent._addViewToNativeVisualTree(child, baseIndex + insideIndex);
        }
        return false;
    };
    ProxyViewContainer.prototype._removeViewFromNativeVisualTree = function (child) {
        if (layout_base_1.traceEnabled()) {
            layout_base_1.traceWrite("ProxyViewContainer._removeViewFromNativeVisualTree for a child " + child + " ViewContainer.parent: " + this.parent, layout_base_1.traceCategories.ViewHierarchy);
        }
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        var parent = this.parent;
        if (parent instanceof layout_base_1.View) {
            return parent._removeViewFromNativeVisualTree(child);
        }
    };
    /*
     * Some layouts (e.g. GridLayout) need to get notified when adding and
     * removing children, so that they can update private measure data.
     *
     * We register our children with the parent to avoid breakage.
     */
    ProxyViewContainer.prototype._registerLayoutChild = function (child) {
        var parent = this.parent;
        if (parent instanceof layout_base_1.LayoutBase) {
            parent._registerLayoutChild(child);
        }
    };
    ProxyViewContainer.prototype._unregisterLayoutChild = function (child) {
        var parent = this.parent;
        if (parent instanceof layout_base_1.LayoutBase) {
            parent._unregisterLayoutChild(child);
        }
    };
    /*
     * Register/unregister existing children with the parent layout.
     */
    ProxyViewContainer.prototype._parentChanged = function (oldParent) {
        // call super in order to execute base logic like clear inherited properties, etc.
        _super.prototype._parentChanged.call(this, oldParent);
        var addingToParent = this.parent && !oldParent;
        var newLayout = this.parent;
        var oldLayout = oldParent;
        if (addingToParent && newLayout instanceof layout_base_1.LayoutBase) {
            this.eachChildView(function (child) {
                newLayout._registerLayoutChild(child);
                return true;
            });
        }
        else if (oldLayout instanceof layout_base_1.LayoutBase) {
            this.eachChildView(function (child) {
                oldLayout._unregisterLayoutChild(child);
                return true;
            });
        }
    };
    return ProxyViewContainer;
}(layout_base_1.LayoutBase));
exports.ProxyViewContainer = ProxyViewContainer;
