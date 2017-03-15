"use strict";
function lazy(action) {
    var _value;
    return function () { return _value || (_value = action()); };
}
exports.__esModule = true;
exports["default"] = lazy;
