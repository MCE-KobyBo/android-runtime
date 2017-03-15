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
var HtmlViewBase = (function (_super) {
    __extends(HtmlViewBase, _super);
    function HtmlViewBase() {
        _super.apply(this, arguments);
    }
    return HtmlViewBase;
}(view_1.View));
exports.HtmlViewBase = HtmlViewBase;
// TODO: Can we use Label.ios optimization for affectsLayout???
exports.htmlProperty = new view_1.Property({ name: "html", defaultValue: "", affectsLayout: true });
exports.htmlProperty.register(HtmlViewBase);
