"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var editable_text_base_1 = require("../editable-text-base");
__export(require("../text-base"));
var TextView = (function (_super) {
    __extends(TextView, _super);
    function TextView() {
        _super.apply(this, arguments);
    }
    TextView.prototype._configureEditText = function () {
        this.android.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_NORMAL | android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES | android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE);
        this.android.setGravity(android.view.Gravity.TOP | android.view.Gravity.LEFT);
    };
    return TextView;
}(editable_text_base_1.EditableTextBase));
exports.TextView = TextView;
