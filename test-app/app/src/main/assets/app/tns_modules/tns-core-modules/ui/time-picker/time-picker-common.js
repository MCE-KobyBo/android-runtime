"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var view_1 = require("../core/view");
__export(require("../core/view"));
function getValidTime(picker, hour, minute) {
    if (picker.minuteInterval > 1) {
        var minuteFloor = minute - (minute % picker.minuteInterval);
        minute = minuteFloor + (minute === minuteFloor + 1 ? picker.minuteInterval : 0);
        if (minute === 60) {
            hour++;
            minute = 0;
        }
    }
    var time = { hour: hour, minute: minute };
    if (!isGreaterThanMinTime(picker, hour, minute)) {
        time = { hour: picker.minHour, minute: picker.minMinute };
    }
    if (!isLessThanMaxTime(picker, hour, minute)) {
        time = { hour: picker.maxHour, minute: picker.maxMinute };
    }
    return time;
}
exports.getValidTime = getValidTime;
function isValidTime(picker) {
    return isGreaterThanMinTime(picker) && isLessThanMaxTime(picker);
}
function isHourValid(value) {
    return typeof value === "number" && value >= 0 && value <= 23;
}
function isMinuteValid(value) {
    return typeof value === "number" && value >= 0 && value <= 59;
}
function isMinuteIntervalValid(value) {
    return typeof value === "number" && value >= 1 && value <= 30 && 60 % value === 0;
}
function getMinutes(hour) {
    return hour * 60;
}
function isDefined(value) {
    return value !== undefined;
}
exports.isDefined = isDefined;
function isGreaterThanMinTime(picker, hour, minute) {
    if (picker.minHour === undefined || picker.minMinute === undefined) {
        return true;
    }
    return getMinutes(hour !== undefined ? hour : picker.hour) + (minute !== undefined ? minute : picker.minute) >= getMinutes(picker.minHour) + picker.minMinute;
}
function isLessThanMaxTime(picker, hour, minute) {
    if (!isDefined(picker.maxHour) || !isDefined(picker.maxMinute)) {
        return true;
    }
    return getMinutes(isDefined(hour) ? hour : picker.hour) + (isDefined(minute) ? minute : picker.minute) <= getMinutes(picker.maxHour) + picker.maxMinute;
}
function toString(value) {
    if (value instanceof Date) {
        return value + "";
    }
    return value < 10 ? "0" + value : "" + value;
}
function getMinMaxTimeErrorMessage(picker) {
    return "Min time: (" + toString(picker.minHour) + ":" + toString(picker.minMinute) + "), max time: (" + toString(picker.maxHour) + ":" + toString(picker.maxMinute) + ")";
}
function getErrorMessage(picker, propertyName, newValue) {
    return propertyName + " property value (" + toString(newValue) + ":" + toString(picker.minute) + ") is not valid. " + getMinMaxTimeErrorMessage(picker) + ".";
}
var TimePickerBase = (function (_super) {
    __extends(TimePickerBase, _super);
    function TimePickerBase() {
        _super.apply(this, arguments);
    }
    return TimePickerBase;
}(view_1.View));
exports.TimePickerBase = TimePickerBase;
exports.hourProperty = new view_1.Property({
    name: "hour", defaultValue: 0, valueChanged: function (picker, oldValue, newValue) {
        if (!isHourValid(newValue)) {
            throw new Error(getErrorMessage(picker, "Hour", newValue));
        }
        if (isValidTime(picker)) {
            // picker._setNativeTime();
            if (picker.time) {
                picker.time.setHours(picker.hour);
            }
            else {
                picker.time = new Date(0, 0, 0, picker.hour, picker.minute);
            }
        }
        else {
            throw new Error(getErrorMessage(picker, "Hour", newValue));
        }
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.hourProperty.register(TimePickerBase);
exports.minHourProperty = new view_1.Property({
    name: "minHour", defaultValue: 0, valueChanged: function (picker, oldValue, newValue) {
        if (!isHourValid(newValue)) {
            throw new Error(getErrorMessage(picker, "minHour", newValue));
        }
        if (isValidTime(picker)) {
        }
        else {
            throw new Error(getErrorMessage(picker, "Hour", newValue));
        }
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.minHourProperty.register(TimePickerBase);
exports.maxHourProperty = new view_1.Property({
    name: "maxHour", defaultValue: 23, valueChanged: function (picker, oldValue, newValue) {
        if (!isHourValid(newValue)) {
            throw new Error(getErrorMessage(picker, "maxHour", newValue));
        }
        if (isValidTime(picker)) {
        }
        else {
            throw new Error(getErrorMessage(picker, "Hour", newValue));
        }
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.maxHourProperty.register(TimePickerBase);
exports.minuteProperty = new view_1.Property({
    name: "minute", defaultValue: 0, valueChanged: function (picker, oldValue, newValue) {
        if (!isMinuteValid(newValue)) {
            throw new Error(getErrorMessage(picker, "minute", newValue));
        }
        if (isValidTime(picker)) {
            // picker._setNativeTime();
            if (picker.time) {
                picker.time.setMinutes(picker.minute);
            }
            else {
                picker.time = new Date(0, 0, 0, picker.hour, picker.minute);
            }
        }
        else {
            throw new Error(getErrorMessage(picker, "Minute", newValue));
        }
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.minuteProperty.register(TimePickerBase);
exports.minMinuteProperty = new view_1.Property({
    name: "minMinute", defaultValue: 0, valueChanged: function (picker, oldValue, newValue) {
        if (!isMinuteValid(newValue)) {
            throw new Error(getErrorMessage(picker, "minMinute", newValue));
        }
        if (isValidTime(picker)) {
        }
        else {
            throw new Error(getErrorMessage(picker, "Minute", newValue));
        }
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.minMinuteProperty.register(TimePickerBase);
exports.maxMinuteProperty = new view_1.Property({
    name: "maxMinute", defaultValue: 59, valueChanged: function (picker, oldValue, newValue) {
        if (!isMinuteValid(newValue)) {
            throw new Error(getErrorMessage(picker, "maxMinute", newValue));
        }
        if (isValidTime(picker)) {
        }
        else {
            throw new Error(getErrorMessage(picker, "Minute", newValue));
        }
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.maxMinuteProperty.register(TimePickerBase);
exports.minuteIntervalProperty = new view_1.Property({
    name: "minuteInterval", defaultValue: 1, valueChanged: function (picker, oldValue, newValue) {
        if (!isMinuteIntervalValid(newValue)) {
            throw new Error(getErrorMessage(picker, "minuteInterval", newValue));
        }
    }, valueConverter: function (v) { return parseInt(v); }
});
exports.minuteIntervalProperty.register(TimePickerBase);
function dateComparer(x, y) {
    return (x <= y && x >= y) ? true : false;
}
exports.timeProperty = new view_1.Property({
    name: "time", equalityComparer: dateComparer, valueChanged: function (picker, oldValue, newValue) {
        if (!isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, "time", newValue));
        }
        picker.hour = newValue.getHours();
        picker.minute = newValue.getMinutes();
        // picker._set
    }
});
exports.timeProperty.register(TimePickerBase);
