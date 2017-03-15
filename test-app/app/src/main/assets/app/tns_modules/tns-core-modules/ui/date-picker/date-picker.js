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
var date_picker_common_1 = require("./date-picker-common");
__export(require("./date-picker-common"));
var DateChangedListener;
function initializeDateChangedListener() {
    if (DateChangedListener) {
        return;
    }
    var DateChangedListenerImpl = (function (_super) {
        __extends(DateChangedListenerImpl, _super);
        function DateChangedListenerImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        DateChangedListenerImpl.prototype.onDateChanged = function (picker, year, month, day) {
            var owner = this.owner;
            var dateIsChanged = false;
            if (year !== owner.year) {
                date_picker_common_1.yearProperty.nativeValueChange(owner, year);
                dateIsChanged = true;
            }
            if ((month + 1) !== owner.month) {
                date_picker_common_1.monthProperty.nativeValueChange(owner, month + 1);
                dateIsChanged = true;
            }
            if (day !== owner.day) {
                date_picker_common_1.dayProperty.nativeValueChange(owner, day);
                dateIsChanged = true;
            }
            if (dateIsChanged) {
                date_picker_common_1.dateProperty.nativeValueChange(owner, new Date(year, month, day));
            }
        };
        DateChangedListenerImpl = __decorate([
            Interfaces([android.widget.DatePicker.OnDateChangedListener])
        ], DateChangedListenerImpl);
        return DateChangedListenerImpl;
    }(java.lang.Object));
    DateChangedListener = DateChangedListenerImpl;
}
var DatePicker = (function (_super) {
    __extends(DatePicker, _super);
    function DatePicker() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(DatePicker.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    DatePicker.prototype._createNativeView = function () {
        initializeDateChangedListener();
        var picker = this._android = new android.widget.DatePicker(this._context);
        picker.setCalendarViewShown(false);
        this._listener = this._listener = new DateChangedListener(this);
        picker.init(0, 0, 0, this._listener);
        return picker;
    };
    DatePicker.prototype.updateNativeDate = function () {
        var year = typeof this.year === "number" ? this.year : this.android.getYear();
        var month = typeof this.month === "number" ? (this.month - 1) : this.android.getMonth();
        var day = typeof this.day === "number" ? this.day : this.android.getDayOfMonth();
        this.date = new Date(year, month, day);
    };
    Object.defineProperty(DatePicker.prototype, date_picker_common_1.yearProperty.native, {
        get: function () {
            return this.android.getYear();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, date_picker_common_1.yearProperty.native, {
        set: function (value) {
            if (this.android.getYear() !== value) {
                this.updateNativeDate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, date_picker_common_1.monthProperty.native, {
        get: function () {
            return this.android.getMonth();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, date_picker_common_1.monthProperty.native, {
        set: function (value) {
            if (this.android.getMonth() !== (value - 1)) {
                this.updateNativeDate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, date_picker_common_1.dayProperty.native, {
        get: function () {
            return this.android.getDayOfMonth();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, date_picker_common_1.dayProperty.native, {
        set: function (value) {
            if (this.android.getDayOfMonth() !== value) {
                this.updateNativeDate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, date_picker_common_1.dateProperty.native, {
        get: function () {
            return new Date(this.android.getYear(), this.android.getMonth(), this.android.getDayOfMonth());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, date_picker_common_1.dateProperty.native, {
        set: function (value) {
            if (this.android.getDayOfMonth() !== value.getDay()
                || this.android.getMonth() !== value.getMonth()
                || this.android.getYear() !== value.getFullYear()) {
                this.android.updateDate(value.getFullYear(), value.getMonth(), value.getDate());
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, date_picker_common_1.maxDateProperty.native, {
        get: function () {
            return this.android.getMaxDate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, date_picker_common_1.maxDateProperty.native, {
        set: function (value) {
            var newValue = value.getTime();
            if (this.android.getMaxDate() !== newValue) {
                this.android.setMaxDate(newValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, date_picker_common_1.minDateProperty.native, {
        get: function () {
            return this.android.getMinDate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePicker.prototype, date_picker_common_1.minDateProperty.native, {
        set: function (value) {
            var picker = this.android;
            var newValue = value.getTime();
            if (picker.getMinDate() !== newValue) {
                picker.setMinDate(newValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    return DatePicker;
}(date_picker_common_1.DatePickerBase));
exports.DatePicker = DatePicker;
