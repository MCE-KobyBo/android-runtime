"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var list_view_common_1 = require("./list-view-common");
var stack_layout_1 = require("../layouts/stack-layout");
var proxy_view_container_1 = require("../proxy-view-container");
var layout_base_1 = require("../layouts/layout-base");
__export(require("./list-view-common"));
var ITEMLOADING = list_view_common_1.ListViewBase.itemLoadingEvent;
var LOADMOREITEMS = list_view_common_1.ListViewBase.loadMoreItemsEvent;
var ITEMTAP = list_view_common_1.ListViewBase.itemTapEvent;
var ItemClickListener;
function initializeItemClickListener() {
    if (ItemClickListener) {
        return;
    }
    var ItemClickListenerImpl = (function (_super) {
        __extends(ItemClickListenerImpl, _super);
        function ItemClickListenerImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        ItemClickListenerImpl.prototype.onItemClick = function (parent, convertView, index, id) {
            var owner = this.owner;
            var view = owner._realizedTemplates.get(owner._getItemTemplate(index).key).get(convertView);
            owner.notify({ eventName: ITEMTAP, object: owner, index: index, view: view });
        };
        ItemClickListenerImpl = __decorate([
            Interfaces([android.widget.AdapterView.OnItemClickListener])
        ], ItemClickListenerImpl);
        return ItemClickListenerImpl;
    }(java.lang.Object));
    ItemClickListener = ItemClickListenerImpl;
}
var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        _super.apply(this, arguments);
        this._androidViewId = -1;
        this._realizedItems = new Map();
        this._realizedTemplates = new Map();
    }
    ListView.prototype._createNativeView = function () {
        initializeItemClickListener();
        var listView = this._android = new android.widget.ListView(this._context);
        this._android.setDescendantFocusability(android.view.ViewGroup.FOCUS_AFTER_DESCENDANTS);
        this.updateEffectiveRowHeight();
        // Fixes issue with black random black items when scrolling
        this._android.setCacheColorHint(android.graphics.Color.TRANSPARENT);
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        this._android.setId(this._androidViewId);
        ensureListViewAdapterClass();
        this._android.setAdapter(new ListViewAdapterClass(this));
        this._itemClickListener = this._itemClickListener || new ItemClickListener(this);
        this.android.setOnItemClickListener(this._itemClickListener);
        return listView;
    };
    Object.defineProperty(ListView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.refresh = function () {
        if (!this._android || !this._android.getAdapter()) {
            return;
        }
        // clear bindingContext when it is not observable because otherwise bindings to items won't reevaluate
        this._realizedItems.forEach(function (view, nativeView, map) {
            if (!(view.bindingContext instanceof list_view_common_1.Observable)) {
                view.bindingContext = null;
            }
        });
        this._android.getAdapter().notifyDataSetChanged();
    };
    ListView.prototype.scrollToIndex = function (index) {
        if (this._android) {
            this._android.setSelection(index);
        }
    };
    ListView.prototype._disposeNativeView = function () {
        _super.prototype._disposeNativeView.call(this);
        this.clearRealizedCells();
    };
    Object.defineProperty(ListView.prototype, "_childrenCount", {
        get: function () {
            return this._realizedItems.size;
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.eachChildView = function (callback) {
        this._realizedItems.forEach(function (view, nativeView, map) {
            if (view.parent instanceof ListView) {
                callback(view);
            }
            else {
                // in some cases (like item is unloaded from another place (like angular) view.parent becomes undefined)
                if (view.parent) {
                    callback(view.parent);
                }
            }
        });
    };
    ListView.prototype._dumpRealizedTemplates = function () {
        console.log("Realized Templates:");
        this._realizedTemplates.forEach(function (value, index, map) {
            console.log("\t" + index + ":");
            value.forEach(function (value, index, map) {
                console.log("\t\t" + index.hashCode() + ": " + value);
            });
        });
        console.log("Realized Items Size: " + this._realizedItems.size);
    };
    ListView.prototype.clearRealizedCells = function () {
        var _this = this;
        // clear the cache
        this._realizedItems.forEach(function (view, nativeView, map) {
            if (view.parent) {
                // This is to clear the StackLayout that is used to wrap non LayoutBase & ProxyViewContainer instances.
                if (!(view.parent instanceof ListView)) {
                    _this._removeView(view.parent);
                }
                view.parent._removeView(view);
            }
        });
        this._realizedItems.clear();
        this._realizedTemplates.clear();
    };
    Object.defineProperty(ListView.prototype, list_view_common_1.separatorColorProperty.native, {
        get: function () {
            var nativeView = this._android;
            return {
                dividerHeight: nativeView.getDividerHeight(),
                divider: nativeView.getDivider()
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, list_view_common_1.separatorColorProperty.native, {
        set: function (value) {
            var nativeView = this._android;
            if (value instanceof list_view_common_1.Color) {
                nativeView.setDivider(new android.graphics.drawable.ColorDrawable(value.android));
                nativeView.setDividerHeight(1);
            }
            else {
                nativeView.setDivider(value.divider);
                nativeView.setDividerHeight(value.dividerHeight);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, list_view_common_1.itemTemplatesProperty.native, {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListView.prototype, list_view_common_1.itemTemplatesProperty.native, {
        set: function (value) {
            this._itemTemplatesInternal = new Array(this._defaultTemplate);
            if (value) {
                this._itemTemplatesInternal = this._itemTemplatesInternal.concat(value);
            }
            this.android.setAdapter(new ListViewAdapterClass(this));
            this.refresh();
        },
        enumerable: true,
        configurable: true
    });
    return ListView;
}(list_view_common_1.ListViewBase));
exports.ListView = ListView;
var ListViewAdapterClass;
function ensureListViewAdapterClass() {
    if (ListViewAdapterClass) {
        return;
    }
    var ListViewAdapter = (function (_super) {
        __extends(ListViewAdapter, _super);
        function ListViewAdapter(listView) {
            _super.call(this);
            this._listView = listView;
            return global.__native(this);
        }
        ListViewAdapter.prototype.getCount = function () {
            return this._listView && this._listView.items && this._listView.items.length ? this._listView.items.length : 0;
        };
        ListViewAdapter.prototype.getItem = function (i) {
            if (this._listView && this._listView.items && i < this._listView.items.length) {
                var getItem = this._listView.items.getItem;
                return getItem ? getItem(i) : this._listView.items[i];
            }
            return null;
        };
        ListViewAdapter.prototype.getItemId = function (i) {
            return long(i);
        };
        ListViewAdapter.prototype.hasStableIds = function () {
            return true;
        };
        ListViewAdapter.prototype.getViewTypeCount = function () {
            return this._listView._itemTemplatesInternal.length;
        };
        ListViewAdapter.prototype.getItemViewType = function (index) {
            var template = this._listView._getItemTemplate(index);
            var itemViewType = this._listView._itemTemplatesInternal.indexOf(template);
            return itemViewType;
        };
        ListViewAdapter.prototype.getView = function (index, convertView, parent) {
            //this._listView._dumpRealizedTemplates();
            if (!this._listView) {
                return null;
            }
            var totalItemCount = this._listView.items ? this._listView.items.length : 0;
            if (index === (totalItemCount - 1)) {
                this._listView.notify({ eventName: LOADMOREITEMS, object: this._listView });
            }
            // Recycle an existing view or create a new one if needed.
            var template = this._listView._getItemTemplate(index);
            var view;
            if (convertView) {
                view = this._listView._realizedTemplates.get(template.key).get(convertView);
                if (!view) {
                    throw new Error("There is no entry with key '" + convertView + "' in the realized views cache for template with key'" + template.key + "'.");
                }
            }
            else {
                view = template.createView();
            }
            var args = {
                eventName: ITEMLOADING, object: this._listView, index: index, view: view,
                android: parent,
                ios: undefined
            };
            this._listView.notify(args);
            if (!args.view) {
                args.view = this._listView._getDefaultItemContent(index);
            }
            if (args.view) {
                if (this._listView._effectiveRowHeight > -1) {
                    args.view.height = this._listView.rowHeight;
                }
                else {
                    args.view.height = list_view_common_1.unsetValue;
                }
                this._listView._prepareItem(args.view, index);
                if (!args.view.parent) {
                    // Proxy containers should not get treated as layouts.
                    // Wrap them in a real layout as well.
                    if (args.view instanceof layout_base_1.LayoutBase &&
                        !(args.view instanceof proxy_view_container_1.ProxyViewContainer)) {
                        this._listView._addView(args.view);
                        convertView = args.view.android;
                    }
                    else {
                        var sp = new stack_layout_1.StackLayout();
                        sp.addChild(args.view);
                        this._listView._addView(sp);
                        convertView = sp.android;
                    }
                }
                // Cache the view for recycling
                var realizedItemsForTemplateKey = this._listView._realizedTemplates.get(template.key);
                if (!realizedItemsForTemplateKey) {
                    realizedItemsForTemplateKey = new Map();
                    this._listView._realizedTemplates.set(template.key, realizedItemsForTemplateKey);
                }
                realizedItemsForTemplateKey.set(convertView, args.view);
                this._listView._realizedItems.set(convertView, args.view);
            }
            return convertView;
        };
        return ListViewAdapter;
    }(android.widget.BaseAdapter));
    ListViewAdapterClass = ListViewAdapter;
}
