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
var EditableTextBase = (function (_super) {
    __extends(EditableTextBase, _super);
    function EditableTextBase() {
        _super.apply(this, arguments);
    }
    return EditableTextBase;
}(text_base_1.TextBase));
exports.EditableTextBase = EditableTextBase;
// TODO: Why not name it - hintColor property??
// TODO: Or rename hintProperty to 'placeholder' and make it CSSProperty??
// https://developer.mozilla.org/en-US/docs/Web/CSS/:-moz-placeholder
exports.placeholderColorProperty = new text_base_1.CssProperty({ name: "placeholderColor", cssName: "placeholder-color", equalityComparer: text_base_1.Color.equals, valueConverter: function (v) { return new text_base_1.Color(v); } });
exports.placeholderColorProperty.register(text_base_1.Style);
exports.keyboardTypeProperty = new text_base_1.Property({ name: "keyboardType" });
exports.keyboardTypeProperty.register(EditableTextBase);
exports.returnKeyTypeProperty = new text_base_1.Property({ name: "returnKeyType" });
exports.returnKeyTypeProperty.register(EditableTextBase);
exports.editableProperty = new text_base_1.Property({ name: "editable", defaultValue: true, valueConverter: text_base_1.booleanConverter });
exports.editableProperty.register(EditableTextBase);
exports.updateTextTriggerProperty = new text_base_1.Property({ name: "updateTextTrigger", defaultValue: "textChanged" });
exports.updateTextTriggerProperty.register(EditableTextBase);
exports.autocapitalizationTypeProperty = new text_base_1.Property({ name: "autocapitalizationType", defaultValue: "sentences" });
exports.autocapitalizationTypeProperty.register(EditableTextBase);
exports.autocorrectProperty = new text_base_1.Property({ name: "autocorrect", valueConverter: text_base_1.booleanConverter });
exports.autocorrectProperty.register(EditableTextBase);
exports.hintProperty = new text_base_1.Property({ name: "hint", defaultValue: "" });
exports.hintProperty.register(EditableTextBase);
