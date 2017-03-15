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
var button_common_1 = require("./button-common");
var gestures_1 = require("../gestures");
__export(require("./button-common"));
var ClickListener;
function initializeClickListener() {
    if (ClickListener) {
        return;
    }
    var ClickListenerImpl = (function (_super) {
        __extends(ClickListenerImpl, _super);
        function ClickListenerImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        ClickListenerImpl.prototype.onClick = function (v) {
            this.owner._emit(button_common_1.ButtonBase.tapEvent);
        };
        ClickListenerImpl = __decorate([
            Interfaces([android.view.View.OnClickListener])
        ], ClickListenerImpl);
        return ClickListenerImpl;
    }(java.lang.Object));
    ClickListener = ClickListenerImpl;
}
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        _super.apply(this, arguments);
    }
    Button.prototype._createNativeView = function () {
        initializeClickListener();
        var button = this._button = new android.widget.Button(this._context);
        button.setOnClickListener(new ClickListener(this));
        return button;
    };
    Button.prototype._updateHandler = function (subscribe) {
        var _this = this;
        if (subscribe) {
            this._highlightedHandler = this._highlightedHandler || (function (args) {
                switch (args.action) {
                    case gestures_1.TouchAction.up:
                        _this._goToVisualState("normal");
                        break;
                    case gestures_1.TouchAction.down:
                        _this._goToVisualState("highlighted");
                        break;
                }
            });
            this.on(gestures_1.GestureTypes.touch, this._highlightedHandler);
        }
        else {
            this.off(gestures_1.GestureTypes.touch, this._highlightedHandler);
        }
    };
    Object.defineProperty(Button.prototype, button_common_1.paddingTopProperty.native, {
        get: function () {
            return { value: this._defaultPaddingTop, unit: "px" };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, button_common_1.paddingTopProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setPaddingTop(this.nativeView, button_common_1.Length.toDevicePixels(value, 0) + button_common_1.Length.toDevicePixels(this.style.borderTopWidth, 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, button_common_1.paddingRightProperty.native, {
        get: function () {
            return { value: this._defaultPaddingRight, unit: "px" };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, button_common_1.paddingRightProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setPaddingRight(this.nativeView, button_common_1.Length.toDevicePixels(value, 0) + button_common_1.Length.toDevicePixels(this.style.borderRightWidth, 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, button_common_1.paddingBottomProperty.native, {
        get: function () {
            return { value: this._defaultPaddingBottom, unit: "px" };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, button_common_1.paddingBottomProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setPaddingBottom(this.nativeView, button_common_1.Length.toDevicePixels(value, 0) + button_common_1.Length.toDevicePixels(this.style.borderBottomWidth, 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, button_common_1.paddingLeftProperty.native, {
        get: function () {
            return { value: this._defaultPaddingLeft, unit: "px" };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, button_common_1.paddingLeftProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setPaddingLeft(this.nativeView, button_common_1.Length.toDevicePixels(value, 0) + button_common_1.Length.toDevicePixels(this.style.borderLeftWidth, 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, button_common_1.zIndexProperty.native, {
        get: function () {
            return org.nativescript.widgets.ViewHelper.getZIndex(this.nativeView);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, button_common_1.zIndexProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setZIndex(this.nativeView, value);
            // API >= 21
            if (this.nativeView.setStateListAnimator) {
                this.nativeView.setStateListAnimator(null);
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        button_common_1.PseudoClassHandler("normal", "highlighted", "pressed", "active")
    ], Button.prototype, "_updateHandler");
    return Button;
}(button_common_1.ButtonBase));
exports.Button = Button;
