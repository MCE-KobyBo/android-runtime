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
var slider_common_1 = require("./slider-common");
__export(require("./slider-common"));
var SeekBarChangeListener;
function initializeSeekBarChangeListener() {
    if (SeekBarChangeListener) {
        return;
    }
    var SeekBarChangeListenerImpl = (function (_super) {
        __extends(SeekBarChangeListenerImpl, _super);
        function SeekBarChangeListenerImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        SeekBarChangeListenerImpl.prototype.onProgressChanged = function (seekBar, progress, fromUser) {
            var owner = this.owner;
            if (!owner._supressNativeValue) {
                var newValue = seekBar.getProgress() + owner.minValue;
                slider_common_1.valueProperty.nativeValueChange(owner, newValue);
            }
        };
        SeekBarChangeListenerImpl.prototype.onStartTrackingTouch = function (seekBar) {
            //
        };
        SeekBarChangeListenerImpl.prototype.onStopTrackingTouch = function (seekBar) {
            //
        };
        SeekBarChangeListenerImpl = __decorate([
            Interfaces([android.widget.SeekBar.OnSeekBarChangeListener])
        ], SeekBarChangeListenerImpl);
        return SeekBarChangeListenerImpl;
    }(java.lang.Object));
    SeekBarChangeListener = SeekBarChangeListenerImpl;
}
var Slider = (function (_super) {
    __extends(Slider, _super);
    function Slider() {
        _super.apply(this, arguments);
    }
    Slider.prototype._createNativeView = function () {
        initializeSeekBarChangeListener();
        this.changeListener = this.changeListener || new SeekBarChangeListener(this);
        this._android = new android.widget.SeekBar(this._context);
        this._android.setOnSeekBarChangeListener(this.changeListener);
        return this._android;
    };
    Object.defineProperty(Slider.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * There is no minValue in Android. We simulate this by subtracting the minValue from the native value and maxValue.
     * We need this method to call native setMax and setProgress methods when minValue property is changed,
     * without handling the native value changed callback.
     */
    Slider.prototype.setNativeValuesSilently = function (newValue, newMaxValue) {
        this._supressNativeValue = true;
        try {
            this.android.setMax(newMaxValue);
            this.android.setProgress(newValue);
        }
        finally {
            this._supressNativeValue = false;
        }
    };
    Object.defineProperty(Slider.prototype, slider_common_1.valueProperty.native, {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, slider_common_1.valueProperty.native, {
        set: function (value) {
            this.setNativeValuesSilently(value - this.minValue, this.maxValue - this.minValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, slider_common_1.minValueProperty.native, {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, slider_common_1.minValueProperty.native, {
        set: function (value) {
            this.setNativeValuesSilently(this.value - value, this.maxValue - value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, slider_common_1.maxValueProperty.native, {
        get: function () {
            return 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, slider_common_1.maxValueProperty.native, {
        set: function (value) {
            this._android.setMax(value - this.minValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, slider_common_1.colorProperty.native, {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, slider_common_1.colorProperty.native, {
        set: function (value) {
            if (value instanceof slider_common_1.Color) {
                this._android.getThumb().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
            }
            else {
                this._android.getThumb().clearColorFilter();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, slider_common_1.backgroundColorProperty.native, {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, slider_common_1.backgroundColorProperty.native, {
        set: function (value) {
            if (value instanceof slider_common_1.Color) {
                this._android.getProgressDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
            }
            else {
                this._android.getProgressDrawable().clearColorFilter();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, slider_common_1.backgroundInternalProperty.native, {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, slider_common_1.backgroundInternalProperty.native, {
        set: function (value) {
            //
        },
        enumerable: true,
        configurable: true
    });
    return Slider;
}(slider_common_1.SliderBase));
exports.Slider = Slider;
