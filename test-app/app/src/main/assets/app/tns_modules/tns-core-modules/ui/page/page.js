"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var page_common_1 = require("./page-common");
var action_bar_1 = require("../action-bar");
var grid_layout_1 = require("../layouts/grid-layout");
var constants_1 = require("./constants");
var platform_1 = require("../../platform");
__export(require("./page-common"));
var SYSTEM_UI_FLAG_LIGHT_STATUS_BAR = 0x00002000;
var STATUS_BAR_LIGHT_BCKG = -657931;
var STATUS_BAR_DARK_BCKG = 1711276032;
var DialogFragment;
function initializeDialogFragment() {
    if (DialogFragment) {
        return;
    }
    var DialogFragmentImpl = (function (_super) {
        __extends(DialogFragmentImpl, _super);
        function DialogFragmentImpl(_owner, _fullscreen, _shownCallback, _dismissCallback) {
            _super.call(this);
            this._owner = _owner;
            this._fullscreen = _fullscreen;
            this._shownCallback = _shownCallback;
            this._dismissCallback = _dismissCallback;
            return global.__native(this);
        }
        DialogFragmentImpl.prototype.onCreateDialog = function (savedInstanceState) {
            var dialog = new android.app.Dialog(this._owner._context);
            dialog.requestWindowFeature(android.view.Window.FEATURE_NO_TITLE);
            // Hide actionBar and adjust alignment based on _fullscreen value.
            this._owner.horizontalAlignment = this._fullscreen ? "stretch" : "center";
            this._owner.verticalAlignment = this._fullscreen ? "stretch" : "middle";
            this._owner.actionBarHidden = true;
            var nativeView = this._owner._nativeView;
            var layoutParams = nativeView.getLayoutParams();
            if (!layoutParams) {
                layoutParams = new org.nativescript.widgets.CommonLayoutParams();
                nativeView.setLayoutParams(layoutParams);
            }
            dialog.setContentView(this._owner._nativeView, layoutParams);
            var window = dialog.getWindow();
            window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
            if (this._fullscreen) {
                window.setLayout(android.view.ViewGroup.LayoutParams.FILL_PARENT, android.view.ViewGroup.LayoutParams.FILL_PARENT);
            }
            return dialog;
        };
        DialogFragmentImpl.prototype.onStart = function () {
            _super.prototype.onStart.call(this);
            if (!this._owner.isLoaded) {
                this._owner.onLoaded();
            }
            this._shownCallback();
        };
        DialogFragmentImpl.prototype.onDestroyView = function () {
            _super.prototype.onDestroyView.call(this);
            if (this._owner.isLoaded) {
                this._owner.onUnloaded();
            }
            this._owner._isAddedToNativeVisualTree = false;
            this._owner._tearDownUI(true);
        };
        DialogFragmentImpl.prototype.onDismiss = function (dialog) {
            _super.prototype.onDismiss.call(this, dialog);
            this._dismissCallback();
        };
        return DialogFragmentImpl;
    }(android.app.DialogFragment));
    ;
    DialogFragment = DialogFragmentImpl;
}
var Page = (function (_super) {
    __extends(Page, _super);
    function Page() {
        _super.apply(this, arguments);
        this._isBackNavigation = false;
    }
    Object.defineProperty(Page.prototype, "android", {
        get: function () {
            return this._grid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "_nativeView", {
        get: function () {
            return this._grid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "nativeView", {
        get: function () {
            return this._grid;
        },
        enumerable: true,
        configurable: true
    });
    Page.prototype._createNativeView = function () {
        var layout = this._grid = new org.nativescript.widgets.GridLayout(this._context);
        this._grid.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
        this._grid.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
        this.nativeView.setBackgroundColor(new page_common_1.Color("white").android);
        return layout;
    };
    Page.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        // Set the row property for the child 
        if (this._nativeView && child._nativeView) {
            if (child instanceof action_bar_1.ActionBar) {
                grid_layout_1.GridLayout.setRow(child, 0);
                child.horizontalAlignment = "stretch";
                child.verticalAlignment = "top";
            }
            else {
                grid_layout_1.GridLayout.setRow(child, 1);
            }
        }
        return _super.prototype._addViewToNativeVisualTree.call(this, child, atIndex);
    };
    Page.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        if (this.actionBarHidden !== undefined) {
            this.updateActionBar();
        }
    };
    Page.prototype._tearDownUI = function (force) {
        var skipDetached = !force && this.frame.android.cachePagesOnNavigate && !this._isBackNavigation;
        if (!skipDetached) {
            _super.prototype._tearDownUI.call(this);
            this._isAddedToNativeVisualTree = false;
        }
    };
    Page.prototype.onNavigatedFrom = function (isBackNavigation) {
        this._isBackNavigation = isBackNavigation;
        _super.prototype.onNavigatedFrom.call(this, isBackNavigation);
    };
    /* tslint:enable */
    Page.prototype._showNativeModalView = function (parent, context, closeCallback, fullscreen) {
        var _this = this;
        _super.prototype._showNativeModalView.call(this, parent, context, closeCallback, fullscreen);
        if (!this.backgroundColor) {
            this.backgroundColor = new page_common_1.Color("White");
        }
        this._setupUI(parent._context);
        this._isAddedToNativeVisualTree = true;
        initializeDialogFragment();
        this._dialogFragment = new DialogFragment(this, !!fullscreen, function () { return _this._raiseShownModallyEvent(); }, function () { return _this.closeModal(); });
        _super.prototype._raiseShowingModallyEvent.call(this);
        this._dialogFragment.show(parent.frame.android.activity.getFragmentManager(), constants_1.DIALOG_FRAGMENT_TAG);
    };
    Page.prototype._hideNativeModalView = function (parent) {
        this._dialogFragment.dismissAllowingStateLoss();
        this._dialogFragment = null;
        parent._modal = undefined;
        _super.prototype._hideNativeModalView.call(this, parent);
    };
    Page.prototype.updateActionBar = function () {
        this.actionBar.update();
    };
    Object.defineProperty(Page.prototype, page_common_1.actionBarHiddenProperty.native, {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, page_common_1.actionBarHiddenProperty.native, {
        set: function (value) {
            this.updateActionBar();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, page_common_1.statusBarStyleProperty.native, {
        get: function () {
            if (platform_1.device.sdkVersion >= "21") {
                var window_1 = this._context.getWindow();
                var decorView = window_1.getDecorView();
                return {
                    color: window_1.getStatusBarColor(),
                    systemUiVisibility: decorView.getSystemUiVisibility()
                };
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, page_common_1.statusBarStyleProperty.native, {
        set: function (value) {
            if (platform_1.device.sdkVersion >= "21") {
                var window_2 = this._context.getWindow();
                var decorView = window_2.getDecorView();
                if (value === "light") {
                    window_2.setStatusBarColor(STATUS_BAR_LIGHT_BCKG);
                    decorView.setSystemUiVisibility(SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
                }
                else if (value === "dark") {
                    window_2.setStatusBarColor(STATUS_BAR_DARK_BCKG);
                    decorView.setSystemUiVisibility(0);
                }
                else {
                    window_2.setStatusBarColor(value.color);
                    decorView.setSystemUiVisibility(value.systemUiVisibility);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, page_common_1.androidStatusBarBackgroundProperty.native, {
        get: function () {
            if (platform_1.device.sdkVersion >= "21") {
                var window_3 = this._context.getWindow();
                return window_3.getStatusBarColor();
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, page_common_1.androidStatusBarBackgroundProperty.native, {
        set: function (value) {
            if (platform_1.device.sdkVersion >= "21") {
                var window_4 = this._context.getWindow();
                var color = value instanceof page_common_1.Color ? value.android : value;
                window_4.setStatusBarColor(color);
            }
        },
        enumerable: true,
        configurable: true
    });
    return Page;
}(page_common_1.PageBase));
exports.Page = Page;
