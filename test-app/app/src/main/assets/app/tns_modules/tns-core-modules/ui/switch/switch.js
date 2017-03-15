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
var switch_common_1 = require("./switch-common");
__export(require("./switch-common"));
var CheckedChangeListener;
function initializeCheckedChangeListener() {
    if (CheckedChangeListener) {
        return;
    }
    var CheckedChangeListenerImpl = (function (_super) {
        __extends(CheckedChangeListenerImpl, _super);
        function CheckedChangeListenerImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        CheckedChangeListenerImpl.prototype.onCheckedChanged = function (buttonView, isChecked) {
            var owner = this.owner;
            switch_common_1.checkedProperty.nativeValueChange(owner, isChecked);
        };
        CheckedChangeListenerImpl = __decorate([
            Interfaces([android.widget.CompoundButton.OnCheckedChangeListener])
        ], CheckedChangeListenerImpl);
        return CheckedChangeListenerImpl;
    }(java.lang.Object));
    CheckedChangeListener = CheckedChangeListenerImpl;
}
var Switch = (function (_super) {
    __extends(Switch, _super);
    function Switch() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Switch.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Switch.prototype._createNativeView = function () {
        initializeCheckedChangeListener();
        this._android = new android.widget.Switch(this._context);
        this.listener = this.listener || new CheckedChangeListener(this);
        this._android.setOnCheckedChangeListener(this.listener);
        return this._android;
    };
    Object.defineProperty(Switch.prototype, switch_common_1.checkedProperty.native, {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Switch.prototype, switch_common_1.checkedProperty.native, {
        set: function (value) {
            this._android.setChecked(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Switch.prototype, switch_common_1.colorProperty.native, {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Switch.prototype, switch_common_1.colorProperty.native, {
        set: function (value) {
            if (value instanceof switch_common_1.Color) {
                this._android.getThumbDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
            }
            else {
                this._android.getThumbDrawable().clearColorFilter();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Switch.prototype, switch_common_1.backgroundColorProperty.native, {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Switch.prototype, switch_common_1.backgroundColorProperty.native, {
        set: function (value) {
            if (value instanceof switch_common_1.Color) {
                this._android.getTrackDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
            }
            else {
                this._android.getTrackDrawable().clearColorFilter();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Switch.prototype, switch_common_1.backgroundInternalProperty.native, {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Switch.prototype, switch_common_1.backgroundInternalProperty.native, {
        set: function (value) {
            //
        },
        enumerable: true,
        configurable: true
    });
    return Switch;
}(switch_common_1.SwitchBase));
exports.Switch = Switch;
