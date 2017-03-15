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
var action_bar_common_1 = require("./action-bar-common");
var utils_1 = require("../../utils/utils");
var image_source_1 = require("../../image-source");
var application = require("../../application");
__export(require("./action-bar-common"));
var R_ID_HOME = 0x0102002c;
var ACTION_ITEM_ID_OFFSET = 1000;
var actionItemIdGenerator = ACTION_ITEM_ID_OFFSET;
function generateItemId() {
    actionItemIdGenerator++;
    return actionItemIdGenerator;
}
var appResources;
var MenuItemClickListener;
function initializeMenuItemClickListener() {
    if (MenuItemClickListener) {
        return;
    }
    var MenuItemClickListenerImpl = (function (_super) {
        __extends(MenuItemClickListenerImpl, _super);
        function MenuItemClickListenerImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        MenuItemClickListenerImpl.prototype.onMenuItemClick = function (item) {
            var itemId = item.getItemId();
            return this.owner._onAndroidItemSelected(itemId);
        };
        MenuItemClickListenerImpl = __decorate([
            Interfaces([android.support.v7.widget.Toolbar.OnMenuItemClickListener])
        ], MenuItemClickListenerImpl);
        return MenuItemClickListenerImpl;
    }(java.lang.Object));
    MenuItemClickListener = MenuItemClickListenerImpl;
    appResources = application.android.context.getResources();
}
var ActionItem = (function (_super) {
    __extends(ActionItem, _super);
    function ActionItem() {
        _super.call(this);
        this._androidPosition = {
            position: "actionBar",
            systemIcon: undefined
        };
        this._itemId = generateItemId();
    }
    Object.defineProperty(ActionItem.prototype, "android", {
        get: function () {
            return this._androidPosition;
        },
        set: function (value) {
            throw new Error("ActionItem.android is read-only");
        },
        enumerable: true,
        configurable: true
    });
    ActionItem.prototype._getItemId = function () {
        return this._itemId;
    };
    return ActionItem;
}(action_bar_common_1.ActionItemBase));
exports.ActionItem = ActionItem;
var AndroidActionBarSettings = (function () {
    function AndroidActionBarSettings(actionBar) {
        this._iconVisibility = "auto";
        this._actionBar = actionBar;
    }
    Object.defineProperty(AndroidActionBarSettings.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        set: function (value) {
            if (value !== this._icon) {
                this._icon = value;
                this._actionBar._onIconPropertyChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidActionBarSettings.prototype, "iconVisibility", {
        get: function () {
            return this._iconVisibility;
        },
        set: function (value) {
            if (value !== this._iconVisibility) {
                this._iconVisibility = value;
                this._actionBar._onIconPropertyChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    return AndroidActionBarSettings;
}());
exports.AndroidActionBarSettings = AndroidActionBarSettings;
var NavigationButton = (function (_super) {
    __extends(NavigationButton, _super);
    function NavigationButton() {
        _super.apply(this, arguments);
    }
    return NavigationButton;
}(ActionItem));
exports.NavigationButton = NavigationButton;
var ActionBar = (function (_super) {
    __extends(ActionBar, _super);
    function ActionBar() {
        _super.call(this);
        this._android = new AndroidActionBarSettings(this);
    }
    Object.defineProperty(ActionBar.prototype, "android", {
        get: function () {
            return this._android;
        },
        set: function (value) {
            throw new Error("ActionBar.android is read-only");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "_nativeView", {
        get: function () {
            return this._toolbar;
        },
        enumerable: true,
        configurable: true
    });
    ActionBar.prototype._addChildFromBuilder = function (name, value) {
        if (value instanceof NavigationButton) {
            this.navigationButton = value;
        }
        else if (value instanceof ActionItem) {
            this.actionItems.addItem(value);
        }
        else if (value instanceof action_bar_common_1.View) {
            this.titleView = value;
        }
    };
    ActionBar.prototype._createNativeView = function () {
        initializeMenuItemClickListener();
        var toolbar = this._toolbar = new android.support.v7.widget.Toolbar(this._context);
        this._menuItemClickListener = this._menuItemClickListener || new MenuItemClickListener(this);
        this._toolbar.setOnMenuItemClickListener(this._menuItemClickListener);
        return toolbar;
    };
    ActionBar.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.update();
    };
    ActionBar.prototype.update = function () {
        if (!this.nativeView) {
            return;
        }
        var page = this.page;
        if (!page.frame || !page.frame._getNavBarVisible(page)) {
            this.nativeView.setVisibility(android.view.View.GONE);
            // If action bar is hidden - no need to fill it with items.
            return;
        }
        this.nativeView.setVisibility(android.view.View.VISIBLE);
        // Add menu items
        this._addActionItems();
        // Set title
        this._updateTitleAndTitleView();
        // Set home icon
        this._updateIcon();
        // Set navigation button
        this._updateNavigationButton();
    };
    ActionBar.prototype._onAndroidItemSelected = function (itemId) {
        // Handle home button
        if (this.navigationButton && itemId === R_ID_HOME) {
            this.navigationButton._raiseTap();
            return true;
        }
        // Find item with the right ID;
        var menuItem = undefined;
        var items = this.actionItems.getItems();
        for (var i = 0; i < items.length; i++) {
            if (items[i]._getItemId() === itemId) {
                menuItem = items[i];
                break;
            }
        }
        if (menuItem) {
            menuItem._raiseTap();
            return true;
        }
        return false;
    };
    ActionBar.prototype._updateNavigationButton = function () {
        var navButton = this.navigationButton;
        if (navButton && action_bar_common_1.isVisible(navButton)) {
            var systemIcon = navButton.android.systemIcon;
            if (systemIcon !== undefined) {
                // Try to look in the system resources.
                var systemResourceId = getSystemResourceId(systemIcon);
                if (systemResourceId) {
                    this.nativeView.setNavigationIcon(systemResourceId);
                }
            }
            else if (navButton.icon) {
                var drawableOrId = getDrawableOrResourceId(navButton.icon, appResources);
                this.nativeView.setNavigationIcon(drawableOrId);
            }
            var navBtn_1 = new WeakRef(navButton);
            this.nativeView.setNavigationOnClickListener(new android.view.View.OnClickListener({
                onClick: function (v) {
                    var owner = navBtn_1.get();
                    if (owner) {
                        owner._raiseTap();
                    }
                }
            }));
        }
        else {
            this.nativeView.setNavigationIcon(null);
        }
    };
    ActionBar.prototype._updateIcon = function () {
        var visibility = getIconVisibility(this.android.iconVisibility);
        if (visibility) {
            var icon = this.android.icon;
            if (icon !== undefined) {
                var drawableOrId = getDrawableOrResourceId(icon, appResources);
                if (drawableOrId) {
                    this.nativeView.setLogo(drawableOrId);
                }
            }
            else {
                var defaultIcon = application.android.nativeApp.getApplicationInfo().icon;
                this.nativeView.setLogo(defaultIcon);
            }
        }
        else {
            this.nativeView.setLogo(null);
        }
    };
    ActionBar.prototype._updateTitleAndTitleView = function () {
        if (!this.titleView) {
            // No title view - show the title
            var title = this.title;
            if (title !== undefined) {
                this.nativeView.setTitle(title);
            }
            else {
                var appContext = application.android.context;
                var appInfo = appContext.getApplicationInfo();
                var appLabel = appContext.getPackageManager().getApplicationLabel(appInfo);
                if (appLabel) {
                    this.nativeView.setTitle(appLabel);
                }
            }
        }
    };
    ActionBar.prototype._addActionItems = function () {
        var menu = this.nativeView.getMenu();
        var items = this.actionItems.getVisibleItems();
        menu.clear();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var menuItem = menu.add(android.view.Menu.NONE, item._getItemId(), android.view.Menu.NONE, item.text + "");
            if (item.actionView && item.actionView.android) {
                // With custom action view, the menuitem cannot be displayed in a popup menu. 
                item.android.position = "actionBar";
                menuItem.setActionView(item.actionView.android);
                ActionBar._setOnClickListener(item);
            }
            else if (item.android.systemIcon) {
                // Try to look in the system resources.
                var systemResourceId = getSystemResourceId(item.android.systemIcon);
                if (systemResourceId) {
                    menuItem.setIcon(systemResourceId);
                }
            }
            else if (item.icon) {
                var drawableOrId = getDrawableOrResourceId(item.icon, appResources);
                if (drawableOrId) {
                    menuItem.setIcon(drawableOrId);
                }
                else {
                    throw new Error("Error loading icon from " + item.icon);
                }
            }
            var showAsAction = getShowAsAction(item);
            menuItem.setShowAsAction(showAsAction);
        }
    };
    ActionBar._setOnClickListener = function (item) {
        item.actionView.android.setOnClickListener(new android.view.View.OnClickListener({
            onClick: function (v) {
                item._raiseTap();
            }
        }));
    };
    ActionBar.prototype._onTitlePropertyChanged = function () {
        if (this.nativeView) {
            this._updateTitleAndTitleView();
        }
    };
    ActionBar.prototype._onIconPropertyChanged = function () {
        if (this.nativeView) {
            this._updateIcon();
        }
    };
    ActionBar.prototype._disposeNativeView = function () {
        // don't clear _android field!
        this.nativeView = undefined;
    };
    ActionBar.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        if (atIndex === void 0) { atIndex = Number.MAX_VALUE; }
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (this.nativeView && child._nativeView) {
            if (atIndex >= this._nativeView.getChildCount()) {
                this.nativeView.addView(child._nativeView);
            }
            else {
                this.nativeView.addView(child._nativeView, atIndex);
            }
            return true;
        }
        return false;
    };
    ActionBar.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (this.nativeView && child._nativeView) {
            this.nativeView.removeView(child._nativeView);
        }
    };
    Object.defineProperty(ActionBar.prototype, action_bar_common_1.colorProperty.native, {
        get: function () {
            if (!defaultTitleTextColor) {
                var textView = new android.widget.TextView(this._context);
                defaultTitleTextColor = textView.getTextColors().getDefaultColor();
            }
            return defaultTitleTextColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, action_bar_common_1.colorProperty.native, {
        set: function (value) {
            var color = value instanceof action_bar_common_1.Color ? value.android : value;
            this.nativeView.setTitleTextColor(color);
        },
        enumerable: true,
        configurable: true
    });
    return ActionBar;
}(action_bar_common_1.ActionBarBase));
exports.ActionBar = ActionBar;
var defaultTitleTextColor;
function getDrawableOrResourceId(icon, resources) {
    if (typeof icon !== "string") {
        return undefined;
    }
    if (icon.indexOf(utils_1.RESOURCE_PREFIX) === 0) {
        var resourceId = resources.getIdentifier(icon.substr(utils_1.RESOURCE_PREFIX.length), 'drawable', application.android.packageName);
        if (resourceId > 0) {
            return resourceId;
        }
    }
    else {
        var drawable = void 0;
        var is = image_source_1.fromFileOrResource(icon);
        if (is) {
            drawable = new android.graphics.drawable.BitmapDrawable(is.android);
        }
        return drawable;
    }
    return undefined;
}
function getShowAsAction(menuItem) {
    switch (menuItem.android.position) {
        case "actionBarIfRoom":
            return android.view.MenuItem.SHOW_AS_ACTION_IF_ROOM;
        case "popup":
            return android.view.MenuItem.SHOW_AS_ACTION_NEVER;
        case "actionBar":
        default:
            return android.view.MenuItem.SHOW_AS_ACTION_ALWAYS;
    }
}
function getIconVisibility(iconVisibility) {
    switch (iconVisibility) {
        case "always":
            return true;
        case "auto":
        case "never":
        default:
            return false;
    }
}
function getSystemResourceId(systemIcon) {
    return android.content.res.Resources.getSystem().getIdentifier(systemIcon, "drawable", "android");
}
