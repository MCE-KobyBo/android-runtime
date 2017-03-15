"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var font_1 = require("../styling/font");
var tab_view_common_1 = require("./tab-view-common");
var text_base_1 = require("../text-base");
var image_source_1 = require("../../image-source");
var utils_1 = require("../../utils/utils");
__export(require("./tab-view-common"));
var VIEWS_STATES = "_viewStates";
var ACCENT_COLOR = "colorAccent";
var PRIMARY_COLOR = "colorPrimary";
var DEFAULT_ELEVATION = 4;
var PagerAdapter;
var PageChangedListener;
function initializeNativeClasses() {
    if (PagerAdapter) {
        return;
    }
    var PagerAdapterImpl = (function (_super) {
        __extends(PagerAdapterImpl, _super);
        function PagerAdapterImpl(owner, items) {
            _super.call(this);
            this.owner = owner;
            this.items = items;
            return global.__native(this);
        }
        PagerAdapterImpl.prototype.getCount = function () {
            return this.items ? this.items.length : 0;
        };
        PagerAdapterImpl.prototype.getPageTitle = function (index) {
            if (index < 0 || index >= this.items.length) {
                return "";
            }
            return this.items[index].title;
        };
        PagerAdapterImpl.prototype.instantiateItem = function (container, index) {
            if (tab_view_common_1.traceEnabled()) {
                tab_view_common_1.traceWrite("TabView.PagerAdapter.instantiateItem; container: " + container + "; index: " + index, tab_view_common_1.traceCategory);
            }
            var item = this.items[index];
            // if (item.view.parent !== this.owner) {
            //     this.owner._addView(item.view);
            // }
            if (this[VIEWS_STATES]) {
                if (tab_view_common_1.traceEnabled()) {
                    tab_view_common_1.traceWrite("TabView.PagerAdapter.instantiateItem; restoreHierarchyState: " + item.view, tab_view_common_1.traceCategory);
                }
                item.view._nativeView.restoreHierarchyState(this[VIEWS_STATES]);
            }
            if (item.view._nativeView) {
                container.addView(item.view._nativeView);
            }
            return item.view._nativeView;
        };
        PagerAdapterImpl.prototype.destroyItem = function (container, index, _object) {
            if (tab_view_common_1.traceEnabled()) {
                tab_view_common_1.traceWrite("TabView.PagerAdapter.destroyItem; container: " + container + "; index: " + index + "; _object: " + _object, tab_view_common_1.traceCategory);
            }
            var item = this.items[index];
            var nativeView = item.view._nativeView;
            if (!nativeView || !_object) {
                return;
            }
            if (nativeView.toString() !== _object.toString()) {
                throw new Error("Expected " + nativeView.toString() + " to equal " + _object.toString());
            }
            container.removeView(nativeView);
            // Note: this.owner._removeView will clear item.view._nativeView.
            // So call this after the native instance is removed form the container. 
            // if (item.view.parent === this.owner) {
            //     this.owner._removeView(item.view);
            // }
        };
        PagerAdapterImpl.prototype.isViewFromObject = function (view, _object) {
            return view === _object;
        };
        PagerAdapterImpl.prototype.saveState = function () {
            if (tab_view_common_1.traceEnabled()) {
                tab_view_common_1.traceWrite("TabView.PagerAdapter.saveState", tab_view_common_1.traceCategory);
            }
            var owner = this.owner;
            if (owner._childrenCount === 0) {
                return null;
            }
            if (!this[VIEWS_STATES]) {
                this[VIEWS_STATES] = new android.util.SparseArray();
            }
            var viewStates = this[VIEWS_STATES];
            var childCallback = function (view) {
                var nativeView = view._nativeView;
                if (nativeView && nativeView.isSaveFromParentEnabled && nativeView.isSaveFromParentEnabled()) {
                    nativeView.saveHierarchyState(viewStates);
                }
                return true;
            };
            owner.eachChildView(childCallback);
            var bundle = new android.os.Bundle();
            bundle.putSparseParcelableArray(VIEWS_STATES, viewStates);
            return bundle;
        };
        PagerAdapterImpl.prototype.restoreState = function (state, loader) {
            if (tab_view_common_1.traceEnabled()) {
                tab_view_common_1.traceWrite("TabView.PagerAdapter.restoreState", tab_view_common_1.traceCategory);
            }
            var bundle = state;
            bundle.setClassLoader(loader);
            this[VIEWS_STATES] = bundle.getSparseParcelableArray(VIEWS_STATES);
        };
        return PagerAdapterImpl;
    }(android.support.v4.view.PagerAdapter));
    ;
    var PageChangedListenerImpl = (function (_super) {
        __extends(PageChangedListenerImpl, _super);
        function PageChangedListenerImpl(owner) {
            _super.call(this);
            this._owner = owner;
            return global.__native(this);
        }
        PageChangedListenerImpl.prototype.onPageSelected = function (position) {
            this._owner.selectedIndex = position;
        };
        return PageChangedListenerImpl;
    }(android.support.v4.view.ViewPager.SimpleOnPageChangeListener));
    PagerAdapter = PagerAdapterImpl;
    PageChangedListener = PageChangedListenerImpl;
}
function createTabItemSpec(item) {
    var result = new org.nativescript.widgets.TabItemSpec();
    result.title = item.title;
    if (item.iconSource) {
        if (item.iconSource.indexOf(utils_1.RESOURCE_PREFIX) === 0) {
            result.iconId = utils_1.ad.resources.getDrawableId(item.iconSource.substr(utils_1.RESOURCE_PREFIX.length));
        }
        else {
            var is = image_source_1.fromFileOrResource(item.iconSource);
            if (is) {
                // TODO: Make this native call that accepts string so that we don't load Bitmap in JS.
                result.iconDrawable = new android.graphics.drawable.BitmapDrawable(is.android);
            }
        }
    }
    return result;
}
var defaultAccentColor = undefined;
function getDefaultAccentColor(context) {
    if (defaultAccentColor === undefined) {
        //Fallback color: https://developer.android.com/samples/SlidingTabsColors/src/com.example.android.common/view/SlidingTabStrip.html
        defaultAccentColor = utils_1.ad.resources.getPalleteColor(ACCENT_COLOR, context) || 0xFF33B5E5;
    }
    return defaultAccentColor;
}
var TabViewItem = (function (_super) {
    __extends(TabViewItem, _super);
    function TabViewItem() {
        _super.apply(this, arguments);
    }
    TabViewItem.prototype.setNativeView = function (textView) {
        this.nativeView = textView;
        if (textView) {
            tab_view_common_1.initNativeView(this);
        }
    };
    TabViewItem.prototype._update = function () {
        var tv = this.nativeView;
        if (tv) {
            var tabLayout = tv.getParent();
            tabLayout.updateItemAt(this.index, this.tabItemSpec);
        }
    };
    Object.defineProperty(TabViewItem.prototype, tab_view_common_1.fontSizeProperty.native, {
        get: function () {
            return { nativeSize: this.nativeView.getTextSize() };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewItem.prototype, tab_view_common_1.fontSizeProperty.native, {
        set: function (value) {
            if (typeof value === "number") {
                this.nativeView.setTextSize(value);
            }
            else {
                this.nativeView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewItem.prototype, tab_view_common_1.fontInternalProperty.native, {
        get: function () {
            return this.nativeView.getTypeface();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewItem.prototype, tab_view_common_1.fontInternalProperty.native, {
        set: function (value) {
            this.nativeView.setTypeface(value instanceof font_1.Font ? value.getAndroidTypeface() : value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewItem.prototype, text_base_1.textTransformProperty.native, {
        get: function () {
            return "none";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabViewItem.prototype, text_base_1.textTransformProperty.native, {
        set: function (value) {
            var tv = this.nativeView;
            var result = text_base_1.getTransformedText(this.title, value);
            tv.setText(result);
        },
        enumerable: true,
        configurable: true
    });
    return TabViewItem;
}(tab_view_common_1.TabViewItemBase));
exports.TabViewItem = TabViewItem;
var TabView = (function (_super) {
    __extends(TabView, _super);
    function TabView() {
        _super.apply(this, arguments);
        this._androidViewId = -1;
    }
    Object.defineProperty(TabView.prototype, "android", {
        get: function () {
            return this._grid;
        },
        enumerable: true,
        configurable: true
    });
    TabView.prototype.onItemsChanged = function (oldItems, newItems) {
        _super.prototype.onItemsChanged.call(this, oldItems, newItems);
        if (oldItems) {
            oldItems.forEach(function (item, i, arr) {
                item.index = 0;
                item.tabItemSpec = null;
                item.setNativeView(null);
            });
        }
    };
    TabView.prototype._createNativeView = function () {
        initializeNativeClasses();
        if (tab_view_common_1.traceEnabled()) {
            tab_view_common_1.traceWrite("TabView._createUI(" + this + ");", tab_view_common_1.traceCategory);
        }
        this._grid = new org.nativescript.widgets.GridLayout(this._context);
        this._grid.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
        this._grid.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
        this._tabLayout = new org.nativescript.widgets.TabLayout(this._context);
        this._grid.addView(this._tabLayout);
        this.setElevation();
        var accentColor = getDefaultAccentColor(this._context);
        if (accentColor) {
            this._tabLayout.setSelectedIndicatorColors([accentColor]);
        }
        var primaryColor = utils_1.ad.resources.getPalleteColor(PRIMARY_COLOR, this._context);
        if (primaryColor) {
            this._tabLayout.setBackgroundColor(primaryColor);
        }
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        this._viewPager = new android.support.v4.view.ViewPager(this._context);
        this._viewPager.setId(this._androidViewId);
        var lp = new org.nativescript.widgets.CommonLayoutParams();
        lp.row = 1;
        this._viewPager.setLayoutParams(lp);
        this._grid.addView(this._viewPager);
        this._pageChagedListener = new PageChangedListener(this);
        this._viewPager.addOnPageChangeListener(this._pageChagedListener);
        this.nativeView = this._viewPager;
        this._nativeView = this._viewPager;
        return this._grid;
    };
    TabView.prototype.setElevation = function () {
        var compat = android.support.v4.view.ViewCompat;
        if (compat.setElevation) {
            var val = DEFAULT_ELEVATION * tab_view_common_1.layout.getDisplayDensity();
            compat.setElevation(this._grid, val);
            compat.setElevation(this._tabLayout, val);
        }
    };
    TabView.prototype.setAdapter = function (items) {
        var length = items ? items.length : 0;
        if (length === 0) {
            this._viewPager.setAdapter(null);
            this._pagerAdapter = null;
            this._tabLayout.setItems(null, null);
            return;
        }
        var tabItems = new Array();
        items.forEach(function (item, i, arr) {
            var tabItemSpec = createTabItemSpec(item);
            item.index = i;
            item.tabItemSpec = tabItemSpec;
            tabItems.push(tabItemSpec);
        });
        // TODO: optimize by reusing the adapter and calling setAdapter(null) then the same adapter.
        this._pagerAdapter = new PagerAdapter(this, items);
        this._viewPager.setAdapter(this._pagerAdapter);
        var tabLayout = this._tabLayout;
        tabLayout.setItems(tabItems, this._viewPager);
        items.forEach(function (item, i, arr) {
            var tv = tabLayout.getTextViewForItemAt(i);
            item.setNativeView(tv);
        });
    };
    Object.defineProperty(TabView.prototype, tab_view_common_1.androidOffscreenTabLimitProperty.native, {
        get: function () {
            return this._viewPager.getOffscreenPageLimit();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.androidOffscreenTabLimitProperty.native, {
        set: function (value) {
            this._viewPager.setOffscreenPageLimit(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.selectedIndexProperty.native, {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.selectedIndexProperty.native, {
        set: function (value) {
            if (tab_view_common_1.traceEnabled()) {
                tab_view_common_1.traceWrite("TabView this._viewPager.setCurrentItem(" + value + ", true);", tab_view_common_1.traceCategory);
            }
            this._viewPager.setCurrentItem(value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.itemsProperty.native, {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.itemsProperty.native, {
        set: function (value) {
            this.setAdapter(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.tabBackgroundColorProperty.native, {
        get: function () {
            return this._tabLayout.getBackground().getConstantState();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.tabBackgroundColorProperty.native, {
        set: function (value) {
            if (value instanceof tab_view_common_1.Color) {
                this._tabLayout.setBackgroundColor(value.android);
            }
            else {
                this._tabLayout.setBackground(value ? value.newDrawable() : null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.tabTextColorProperty.native, {
        get: function () {
            return this._tabLayout.getTabTextColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.tabTextColorProperty.native, {
        set: function (value) {
            var color = value instanceof tab_view_common_1.Color ? value.android : value;
            this._tabLayout.setTabTextColor(color);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.selectedTabTextColorProperty.native, {
        get: function () {
            return this._tabLayout.getSelectedTabTextColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.selectedTabTextColorProperty.native, {
        set: function (value) {
            var color = value instanceof tab_view_common_1.Color ? value.android : value;
            this._tabLayout.setSelectedTabTextColor(color);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.androidSelectedTabHighlightColorProperty.native, {
        get: function () {
            return getDefaultAccentColor(this._context);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, tab_view_common_1.androidSelectedTabHighlightColorProperty.native, {
        set: function (value) {
            var tabLayout = this._tabLayout;
            var color = value instanceof tab_view_common_1.Color ? value.android : value;
            tabLayout.setSelectedIndicatorColors([color]);
        },
        enumerable: true,
        configurable: true
    });
    return TabView;
}(tab_view_common_1.TabViewBase));
exports.TabView = TabView;
