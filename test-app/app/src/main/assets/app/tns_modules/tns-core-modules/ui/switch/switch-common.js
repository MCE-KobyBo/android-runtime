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
var SwitchBase = (function (_super) {
    __extends(SwitchBase, _super);
    function SwitchBase() {
        _super.apply(this, arguments);
    }
    return SwitchBase;
}(view_1.View));
exports.SwitchBase = SwitchBase;
exports.checkedProperty = new view_1.Property({ name: "checked", defaultValue: false, valueConverter: view_1.booleanConverter });
exports.checkedProperty.register(SwitchBase);
