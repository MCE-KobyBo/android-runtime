"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var text_field_common_1 = require("./text-field-common");
__export(require("./text-field-common"));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
    }
    TextField.prototype._configureEditText = function () {
        var nativeView = this.android;
        nativeView.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_NORMAL | android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);
        nativeView.setLines(1);
        nativeView.setMaxLines(1);
        nativeView.setHorizontallyScrolling(true);
    };
    TextField.prototype._onReturnPress = function () {
        this.notify({ eventName: TextField.returnPressEvent, object: this });
    };
    Object.defineProperty(TextField.prototype, text_field_common_1.secureProperty.native, {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, text_field_common_1.secureProperty.native, {
        set: function (value) {
            var nativeView = this.nativeView;
            var currentInputType = nativeView.getInputType();
            var currentClass = currentInputType & android.text.InputType.TYPE_MASK_CLASS;
            var currentFlags = currentInputType & android.text.InputType.TYPE_MASK_FLAGS;
            var newInputType = currentInputType;
            // Password variations are supported only for Text and Number classes.
            if (value) {
                if (currentClass === android.text.InputType.TYPE_CLASS_TEXT) {
                    newInputType = currentClass | currentFlags | android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD;
                }
                else if (currentClass === android.text.InputType.TYPE_CLASS_NUMBER) {
                    newInputType = currentClass | currentFlags | android.text.InputType.TYPE_NUMBER_VARIATION_PASSWORD;
                }
                // Lower all autocapitalization bits, because password bits don't like them and we will receive "Unsupported input type: 16513" error for example.
                newInputType = newInputType & ~28672; //28672 (0x0070000) 13,14,15 bits (111 0000 0000 0000)
            }
            else {
                if (currentClass === android.text.InputType.TYPE_CLASS_TEXT) {
                    newInputType = currentClass | currentFlags | android.text.InputType.TYPE_TEXT_VARIATION_NORMAL;
                }
                else if (currentClass === android.text.InputType.TYPE_CLASS_NUMBER) {
                    newInputType = currentClass | currentFlags | android.text.InputType.TYPE_NUMBER_VARIATION_NORMAL;
                }
            }
            nativeView.setInputType(newInputType);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, text_field_common_1.whiteSpaceProperty.native, {
        get: function () {
            return "nowrap";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, text_field_common_1.whiteSpaceProperty.native, {
        set: function (value) {
            // Don't change it otherwise TextField will go to multiline mode.
        },
        enumerable: true,
        configurable: true
    });
    return TextField;
}(text_field_common_1.TextFieldBase));
exports.TextField = TextField;
