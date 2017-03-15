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
var font_1 = require("../styling/font");
var segmented_bar_common_1 = require("./segmented-bar-common");
__export(require("./segmented-bar-common"));
var R_ID_TABS = 0x01020013;
var R_ID_TABCONTENT = 0x01020011;
var R_ATTR_STATE_SELECTED = 0x010100a1;
var TITLE_TEXT_VIEW_ID = 16908310; // http://developer.android.com/reference/android/R.id.html#title
var apiLevel;
var selectedIndicatorThickness;
var TabHost;
var TabChangeListener;
var TabContentFactory;
function initializeNativeClasses() {
    if (TabChangeListener) {
        return;
    }
    apiLevel = android.os.Build.VERSION.SDK_INT;
    // Indicator thickness for material - 2dip. For pre-material - 5dip. 
    selectedIndicatorThickness = segmented_bar_common_1.layout.toDevicePixels(apiLevel >= 21 ? 2 : 5);
    var TabChangeListenerImpl = (function (_super) {
        __extends(TabChangeListenerImpl, _super);
        function TabChangeListenerImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        TabChangeListenerImpl.prototype.onTabChanged = function (id) {
            var owner = this.owner;
            if (owner.shouldChangeSelectedIndex()) {
                owner.selectedIndex = parseInt(id);
            }
        };
        TabChangeListenerImpl = __decorate([
            Interfaces([android.widget.TabHost.OnTabChangeListener])
        ], TabChangeListenerImpl);
        return TabChangeListenerImpl;
    }(java.lang.Object));
    var TabContentFactoryImpl = (function (_super) {
        __extends(TabContentFactoryImpl, _super);
        function TabContentFactoryImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        TabContentFactoryImpl.prototype.createTabContent = function (tag) {
            var tv = new android.widget.TextView(this.owner._context);
            // This is collapsed by default and made visible 
            // by android when TabItem becomes visible/selected.
            // TODO: Try commenting visibility change.
            tv.setVisibility(android.view.View.GONE);
            tv.setMaxLines(1);
            tv.setEllipsize(android.text.TextUtils.TruncateAt.END);
            return tv;
        };
        TabContentFactoryImpl = __decorate([
            Interfaces([android.widget.TabHost.TabContentFactory])
        ], TabContentFactoryImpl);
        return TabContentFactoryImpl;
    }(java.lang.Object));
    var TabHostImpl = (function (_super) {
        __extends(TabHostImpl, _super);
        function TabHostImpl(context, attrs) {
            _super.call(this, context, attrs);
            return global.__native(this);
        }
        TabHostImpl.prototype.onAttachedToWindow = function () {
            // overriden to remove the code that will steal the focus from edit fields.
        };
        return TabHostImpl;
    }(android.widget.TabHost));
    TabHost = TabHostImpl;
    TabChangeListener = TabChangeListenerImpl;
    TabContentFactory = TabContentFactoryImpl;
}
var SegmentedBarItem = (function (_super) {
    __extends(SegmentedBarItem, _super);
    function SegmentedBarItem() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(SegmentedBarItem.prototype, "nativeView", {
        get: function () {
            return this._textView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBarItem.prototype, "android", {
        get: function () {
            return this._textView;
        },
        enumerable: true,
        configurable: true
    });
    SegmentedBarItem.prototype.setupNativeView = function (tabIndex) {
        // TabHost.TabSpec.setIndicator DOES NOT WORK once the title has been set.
        // http://stackoverflow.com/questions/2935781/modify-tab-indicator-dynamically-in-android
        var titleTextView = this.parent.android.getTabWidget().getChildAt(tabIndex).findViewById(TITLE_TEXT_VIEW_ID);
        this._textView = titleTextView;
        if (titleTextView) {
            segmented_bar_common_1.initNativeView(this);
            if (this.titleDirty) {
                this._update();
            }
        }
    };
    SegmentedBarItem.prototype._update = function () {
        var tv = this._textView;
        if (tv) {
            var title = this.title;
            title = (title === null || title === undefined) ? "" : title;
            tv.setText(title);
            this.titleDirty = false;
        }
        else {
            this.titleDirty = true;
        }
    };
    Object.defineProperty(SegmentedBarItem.prototype, segmented_bar_common_1.colorProperty.native, {
        get: function () {
            return this._textView.getCurrentTextColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBarItem.prototype, segmented_bar_common_1.colorProperty.native, {
        set: function (value) {
            var color = value instanceof segmented_bar_common_1.Color ? value.android : value;
            this._textView.setTextColor(color);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBarItem.prototype, segmented_bar_common_1.fontSizeProperty.native, {
        get: function () {
            return { nativeSize: this._textView.getTextSize() };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBarItem.prototype, segmented_bar_common_1.fontSizeProperty.native, {
        set: function (value) {
            if (typeof value === "number") {
                this._textView.setTextSize(value);
            }
            else {
                this._textView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBarItem.prototype, segmented_bar_common_1.fontInternalProperty.native, {
        get: function () {
            return this._textView.getTypeface();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBarItem.prototype, segmented_bar_common_1.fontInternalProperty.native, {
        set: function (value) {
            this._textView.setTypeface(value instanceof font_1.Font ? value.getAndroidTypeface() : value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBarItem.prototype, segmented_bar_common_1.selectedBackgroundColorProperty.native, {
        get: function () {
            var viewGroup = this._textView.getParent();
            return viewGroup.getBackground().getConstantState();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBarItem.prototype, segmented_bar_common_1.selectedBackgroundColorProperty.native, {
        set: function (value) {
            var viewGroup = this._textView.getParent();
            if (value instanceof segmented_bar_common_1.Color) {
                var color = value.android;
                var backgroundDrawable = viewGroup.getBackground();
                if (apiLevel > 21 && backgroundDrawable && typeof backgroundDrawable.setColorFilter === "function") {
                    var newDrawable = backgroundDrawable.getConstantState().newDrawable();
                    newDrawable.setColorFilter(color, android.graphics.PorterDuff.Mode.SRC_IN);
                    org.nativescript.widgets.ViewHelper.setBackground(viewGroup, newDrawable);
                }
                else {
                    var stateDrawable = new android.graphics.drawable.StateListDrawable();
                    var colorDrawable = new org.nativescript.widgets.SegmentedBarColorDrawable(color, selectedIndicatorThickness);
                    var arr = Array.create("int", 1);
                    arr[0] = R_ATTR_STATE_SELECTED;
                    stateDrawable.addState(arr, colorDrawable);
                    stateDrawable.setBounds(0, 15, viewGroup.getRight(), viewGroup.getBottom());
                    org.nativescript.widgets.ViewHelper.setBackground(viewGroup, stateDrawable);
                }
            }
            else {
                org.nativescript.widgets.ViewHelper.setBackground(viewGroup, value.newDrawable());
            }
        },
        enumerable: true,
        configurable: true
    });
    return SegmentedBarItem;
}(segmented_bar_common_1.SegmentedBarItemBase));
exports.SegmentedBarItem = SegmentedBarItem;
var SegmentedBar = (function (_super) {
    __extends(SegmentedBar, _super);
    function SegmentedBar() {
        _super.apply(this, arguments);
    }
    SegmentedBar.prototype.shouldChangeSelectedIndex = function () {
        return !this._addingTab;
    };
    SegmentedBar.prototype._createNativeView = function () {
        initializeNativeClasses();
        this._android = new TabHost(this._context, null);
        this.listener = this.listener || new TabChangeListener(this);
        this.tabContentFactory = this.tabContentFactory || new TabContentFactory(this);
        var tabHostLayout = new android.widget.LinearLayout(this._context);
        tabHostLayout.setOrientation(android.widget.LinearLayout.VERTICAL);
        var tabWidget = new android.widget.TabWidget(this._context);
        tabWidget.setId(R_ID_TABS);
        tabHostLayout.addView(tabWidget);
        var frame = new android.widget.FrameLayout(this._context);
        frame.setId(R_ID_TABCONTENT);
        frame.setVisibility(android.view.View.GONE);
        tabHostLayout.addView(frame);
        this._android.addView(tabHostLayout);
        this._android.setup();
        this._android.setOnTabChangedListener(this.listener);
        return this._android;
    };
    Object.defineProperty(SegmentedBar.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    SegmentedBar.prototype.insertTab = function (tabItem, index) {
        var tab = this.android.newTabSpec(index + "");
        tab.setIndicator(tabItem.title + "");
        tab.setContent(this.tabContentFactory);
        var tabHost = this.android;
        this._addingTab = true;
        tabHost.addTab(tab);
        tabItem.setupNativeView(index);
        this._addingTab = false;
    };
    Object.defineProperty(SegmentedBar.prototype, segmented_bar_common_1.selectedIndexProperty.native, {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBar.prototype, segmented_bar_common_1.selectedIndexProperty.native, {
        set: function (value) {
            this._android.setCurrentTab(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBar.prototype, segmented_bar_common_1.itemsProperty.native, {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBar.prototype, segmented_bar_common_1.itemsProperty.native, {
        set: function (value) {
            var _this = this;
            this._android.clearAllTabs();
            var newItems = value;
            if (newItems) {
                newItems.forEach(function (item, i, arr) { return _this.insertTab(item, i); });
            }
        },
        enumerable: true,
        configurable: true
    });
    return SegmentedBar;
}(segmented_bar_common_1.SegmentedBarBase));
exports.SegmentedBar = SegmentedBar;
