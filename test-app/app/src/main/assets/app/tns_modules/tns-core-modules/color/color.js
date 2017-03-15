"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var common = require("./color-common");
var Color = (function (_super) {
    __extends(Color, _super);
    function Color() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Color.prototype, "android", {
        get: function () {
            return this.argb >> 0;
        },
        enumerable: true,
        configurable: true
    });
    return Color;
}(common.Color));
exports.Color = Color;
