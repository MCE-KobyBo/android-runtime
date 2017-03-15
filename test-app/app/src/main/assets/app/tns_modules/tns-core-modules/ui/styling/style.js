var observable_1 = require("data/observable");
var Style = (function (_super) {
    __extends(Style, _super);
    function Style(view) {
        var _this = _super.call(this) || this;
        _this.view = view;
        return _this;
    }
    return Style;
}(observable_1.Observable));
exports.Style = Style;
Style.prototype.effectiveMinWidth = 0;
Style.prototype.effectiveMinHeight = 0;
Style.prototype.effectiveWidth = 0;
Style.prototype.effectiveHeight = 0;
Style.prototype.effectiveMarginTop = 0;
Style.prototype.effectiveMarginRight = 0;
Style.prototype.effectiveMarginBottom = 0;
Style.prototype.effectiveMarginLeft = 0;
Style.prototype.effectivePaddingTop = 0;
Style.prototype.effectivePaddingRight = 0;
Style.prototype.effectivePaddingBottom = 0;
Style.prototype.effectivePaddingLeft = 0;
Style.prototype.effectiveBorderTopWidth = 0;
Style.prototype.effectiveBorderRightWidth = 0;
Style.prototype.effectiveBorderBottomWidth = 0;
Style.prototype.effectiveBorderLeftWidth = 0;
//# sourceMappingURL=style.js.map