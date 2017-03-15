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
var time_picker_common_1 = require("./time-picker-common");
__export(require("./time-picker-common"));
var TimeChangedListener;
function initializeTimeChangedListener() {
    if (TimeChangedListener) {
        return;
    }
    var TimeChangedListenerImpl = (function (_super) {
        __extends(TimeChangedListenerImpl, _super);
        function TimeChangedListenerImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        TimeChangedListenerImpl.prototype.onTimeChanged = function (picker, hour, minute) {
            var timePicker = this.owner;
            var validTime = time_picker_common_1.getValidTime(timePicker, hour, minute);
            timePicker._setNativeValueSilently(validTime.hour, validTime.minute);
            time_picker_common_1.timeProperty.nativeValueChange(timePicker, new Date(0, 0, 0, validTime.hour, validTime.minute));
        };
        TimeChangedListenerImpl = __decorate([
            Interfaces([android.widget.TimePicker.OnTimeChangedListener])
        ], TimeChangedListenerImpl);
        return TimeChangedListenerImpl;
    }(java.lang.Object));
    TimeChangedListener = TimeChangedListenerImpl;
}
var TimePicker = (function (_super) {
    __extends(TimePicker, _super);
    function TimePicker() {
        _super.apply(this, arguments);
    }
    TimePicker.prototype._createNativeView = function () {
        initializeTimeChangedListener();
        this._android = new android.widget.TimePicker(this._context);
        this._listener = this._listener || new TimeChangedListener(this);
        this._android.setOnTimeChangedListener(this._listener);
        var c = java.util.Calendar.getInstance();
        if (this.hour === 0) {
            this.hour = c.get(java.util.Calendar.HOUR_OF_DAY);
        }
        if (this.minute === 0) {
            this.minute = c.get(java.util.Calendar.MINUTE);
        }
        var validTime = time_picker_common_1.getValidTime(this, this.hour, this.minute);
        this._setNativeValueSilently(validTime.hour, validTime.minute);
        return this._android;
    };
    Object.defineProperty(TimePicker.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    TimePicker.prototype._setNativeValueSilently = function (hour, minute) {
        if (this._android) {
            this._android.setOnTimeChangedListener(null);
            this._android.setCurrentHour(new java.lang.Integer(hour));
            this._android.setCurrentMinute(new java.lang.Integer(minute));
            this.minute = minute;
            this.hour = hour;
            this._android.setOnTimeChangedListener(this._listener);
        }
    };
    TimePicker.prototype._setNativeTime = function () {
        this._setNativeValueSilently(this.hour, this.minute);
    };
    Object.defineProperty(TimePicker.prototype, time_picker_common_1.timeProperty.native, {
        get: function () {
            var nativeView = this._android;
            return new Date(0, 0, 0, nativeView.getCurrentHour().intValue(), nativeView.getCurrentMinute().intValue());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, time_picker_common_1.timeProperty.native, {
        set: function (value) {
            this._setNativeValueSilently(this.hour, this.minute);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, time_picker_common_1.minuteProperty.native, {
        get: function () {
            return this._android.getCurrentMinute().intValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, time_picker_common_1.minuteProperty.native, {
        set: function (value) {
            this._setNativeValueSilently(this.hour, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, time_picker_common_1.hourProperty.native, {
        get: function () {
            return this._android.getCurrentHour().intValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, time_picker_common_1.hourProperty.native, {
        set: function (value) {
            this._setNativeValueSilently(value, this.minute);
        },
        enumerable: true,
        configurable: true
    });
    return TimePicker;
}(time_picker_common_1.TimePickerBase));
exports.TimePicker = TimePicker;
