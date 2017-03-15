"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var text_base_1 = require("../text-base");
__export(require("../text-base"));
var ButtonBase = (function (_super) {
    __extends(ButtonBase, _super);
    function ButtonBase() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ButtonBase.prototype, "textWrap", {
        get: function () {
            return this.style.whiteSpace === text_base_1.WhiteSpace.NORMAL;
        },
        set: function (value) {
            this.style.whiteSpace = value ? text_base_1.WhiteSpace.NORMAL : text_base_1.WhiteSpace.NO_WRAP;
        },
        enumerable: true,
        configurable: true
    });
    ButtonBase.tapEvent = "tap";
    return ButtonBase;
}(text_base_1.TextBase));
exports.ButtonBase = ButtonBase;
