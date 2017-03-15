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
__export(require("../editable-text-base"));
var TextFieldBase = (function (_super) {
    __extends(TextFieldBase, _super);
    function TextFieldBase() {
        _super.apply(this, arguments);
    }
    TextFieldBase.returnPressEvent = "returnPress";
    return TextFieldBase;
}(editable_text_base_1.EditableTextBase));
exports.TextFieldBase = TextFieldBase;
exports.secureProperty = new editable_text_base_1.Property({ name: "secure", defaultValue: false, valueConverter: editable_text_base_1.booleanConverter });
exports.secureProperty.register(TextFieldBase);
