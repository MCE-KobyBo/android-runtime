"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var html_view_common_1 = require("./html-view-common");
__export(require("./html-view-common"));
var HtmlView = (function (_super) {
    __extends(HtmlView, _super);
    function HtmlView() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(HtmlView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    HtmlView.prototype._createNativeView = function () {
        var textView = this._android = new android.widget.TextView(this._context);
        // This makes the html <a href...> work
        textView.setLinksClickable(true);
        textView.setMovementMethod(android.text.method.LinkMovementMethod.getInstance());
        return textView;
    };
    Object.defineProperty(HtmlView.prototype, html_view_common_1.htmlProperty.native, {
        get: function () {
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlView.prototype, html_view_common_1.htmlProperty.native, {
        set: function (value) {
            // If the data.newValue actually has a <a...> in it; we need to disable autolink mask
            // it internally disables the coloring, but then the <a> links won't work..  So to support both
            // styles of links (html and just text based) we have to manually enable/disable the autolink mask
            var mask = 15;
            if (value.search(/<a\s/i) >= 0) {
                mask = 0;
            }
            this._android.setAutoLinkMask(mask);
            this._android.setText(android.text.Html.fromHtml(value));
        },
        enumerable: true,
        configurable: true
    });
    return HtmlView;
}(html_view_common_1.HtmlViewBase));
exports.HtmlView = HtmlView;
