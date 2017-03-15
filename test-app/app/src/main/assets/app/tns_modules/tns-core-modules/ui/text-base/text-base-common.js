"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
// Types.
var view_1 = require("../core/view");
var formatted_string_1 = require("../../text/formatted-string");
exports.FormattedString = formatted_string_1.FormattedString;
exports.Span = formatted_string_1.Span;
__export(require("../core/view"));
var CHILD_SPAN = "Span";
var CHILD_FORMATTED_TEXT = "formattedText";
var CHILD_FORMATTED_STRING = "FormattedString";
var TextBaseCommon = (function (_super) {
    __extends(TextBaseCommon, _super);
    function TextBaseCommon() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TextBaseCommon.prototype, "fontSize", {
        get: function () {
            return this.style.fontSize;
        },
        set: function (value) {
            this.style.fontSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBaseCommon.prototype, "letterSpacing", {
        get: function () {
            return this.style.letterSpacing;
        },
        set: function (value) {
            this.style.letterSpacing = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBaseCommon.prototype, "textAlignment", {
        get: function () {
            return this.style.textAlignment;
        },
        set: function (value) {
            this.style.textAlignment = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBaseCommon.prototype, "textDecoration", {
        get: function () {
            return this.style.textDecoration;
        },
        set: function (value) {
            this.style.textDecoration = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBaseCommon.prototype, "textTransform", {
        get: function () {
            return this.style.textTransform;
        },
        set: function (value) {
            this.style.textTransform = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBaseCommon.prototype, "whiteSpace", {
        get: function () {
            return this.style.whiteSpace;
        },
        set: function (value) {
            this.style.whiteSpace = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBaseCommon.prototype, "padding", {
        get: function () {
            return this.style.padding;
        },
        set: function (value) {
            this.style.padding = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBaseCommon.prototype, "paddingTop", {
        get: function () {
            return this.style.paddingTop;
        },
        set: function (value) {
            this.style.paddingTop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBaseCommon.prototype, "paddingRight", {
        get: function () {
            return this.style.paddingRight;
        },
        set: function (value) {
            this.style.paddingRight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBaseCommon.prototype, "paddingBottom", {
        get: function () {
            return this.style.paddingBottom;
        },
        set: function (value) {
            this.style.paddingBottom = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBaseCommon.prototype, "paddingLeft", {
        get: function () {
            return this.style.paddingLeft;
        },
        set: function (value) {
            this.style.paddingLeft = value;
        },
        enumerable: true,
        configurable: true
    });
    TextBaseCommon.prototype._onFormattedTextContentsChanged = function (data) {
        if (this._nativeView) {
            // Notifications from the FormattedString start arriving before the Android view is even created.
            this[exports.formattedTextProperty.native] = data.value;
        }
    };
    TextBaseCommon.prototype._addChildFromBuilder = function (name, value) {
        if (name === CHILD_SPAN) {
            if (!this.formattedText) {
                var formattedText = new formatted_string_1.FormattedString();
                formattedText.spans.push(value);
                this.formattedText = formattedText;
            }
            else {
                this.formattedText.spans.push(value);
            }
        }
        else if (name === CHILD_FORMATTED_TEXT || name === CHILD_FORMATTED_STRING) {
            this.formattedText = value;
        }
    };
    TextBaseCommon.prototype._requestLayoutOnTextChanged = function () {
        this.requestLayout();
    };
    TextBaseCommon.prototype.eachChild = function (callback) {
        var text = this.formattedText;
        if (text) {
            callback(text);
        }
    };
    TextBaseCommon.prototype._setNativeText = function () {
        //
    };
    return TextBaseCommon;
}(view_1.View));
exports.TextBaseCommon = TextBaseCommon;
function isBold(fontWeight) {
    return fontWeight === "bold" || fontWeight === "700" || fontWeight === "800" || fontWeight === "900";
}
exports.isBold = isBold;
exports.textProperty = new view_1.Property({ name: "text", defaultValue: "" });
exports.textProperty.register(TextBaseCommon);
exports.formattedTextProperty = new view_1.Property({
    name: "formattedText",
    affectsLayout: view_1.isIOS,
    valueChanged: onFormattedTextPropertyChanged
});
exports.formattedTextProperty.register(TextBaseCommon);
function onFormattedTextPropertyChanged(textBase, oldValue, newValue) {
    if (oldValue) {
        oldValue.off(view_1.Observable.propertyChangeEvent, textBase._onFormattedTextContentsChanged, textBase);
        textBase._removeView(oldValue);
    }
    if (newValue) {
        textBase._addView(newValue);
        newValue.on(view_1.Observable.propertyChangeEvent, textBase._onFormattedTextContentsChanged, textBase);
    }
}
var TextAlignment;
(function (TextAlignment) {
    TextAlignment.LEFT = "left";
    TextAlignment.CENTER = "center";
    TextAlignment.RIGHT = "right";
    TextAlignment.isValid = view_1.makeValidator(TextAlignment.LEFT, TextAlignment.CENTER, TextAlignment.RIGHT);
    TextAlignment.parse = view_1.makeParser(TextAlignment.isValid);
})(TextAlignment = exports.TextAlignment || (exports.TextAlignment = {}));
exports.textAlignmentProperty = new view_1.InheritedCssProperty({
    name: "textAlignment",
    cssName: "text-align",
    valueConverter: TextAlignment.parse
});
exports.textAlignmentProperty.register(view_1.Style);
var TextDecoration;
(function (TextDecoration) {
    TextDecoration.NONE = "none";
    TextDecoration.UNDERLINE = "underline";
    TextDecoration.LINE_THROUGH = "line-through";
    TextDecoration.UNDERLINE_LINE_THROUGH = "underline line-through";
    TextDecoration.isValid = view_1.makeValidator(TextDecoration.NONE, TextDecoration.UNDERLINE, TextDecoration.LINE_THROUGH, TextDecoration.UNDERLINE_LINE_THROUGH);
    TextDecoration.parse = view_1.makeParser(TextDecoration.isValid);
})(TextDecoration = exports.TextDecoration || (exports.TextDecoration = {}));
exports.textDecorationProperty = new view_1.CssProperty({
    name: "textDecoration",
    cssName: "text-decoration",
    defaultValue: "none",
    valueConverter: TextDecoration.parse
});
exports.textDecorationProperty.register(view_1.Style);
var TextTransform;
(function (TextTransform) {
    TextTransform.NONE = "none";
    TextTransform.CAPITALIZE = "capitalize";
    TextTransform.UPPERCASE = "uppercase";
    TextTransform.LOWERCASE = "lowercase";
    TextTransform.isValid = view_1.makeValidator(TextTransform.NONE, TextTransform.CAPITALIZE, TextTransform.UPPERCASE, TextTransform.LOWERCASE);
    TextTransform.parse = view_1.makeParser(TextTransform.isValid);
})(TextTransform = exports.TextTransform || (exports.TextTransform = {}));
exports.textTransformProperty = new view_1.CssProperty({
    name: "textTransform",
    cssName: "text-transform",
    defaultValue: "none",
    valueConverter: TextTransform.parse
});
exports.textTransformProperty.register(view_1.Style);
var WhiteSpace;
(function (WhiteSpace) {
    WhiteSpace.NORMAL = "normal";
    WhiteSpace.NO_WRAP = "nowrap";
    WhiteSpace.isValid = view_1.makeValidator(WhiteSpace.NORMAL, WhiteSpace.NO_WRAP);
    WhiteSpace.parse = view_1.makeParser(WhiteSpace.isValid);
})(WhiteSpace = exports.WhiteSpace || (exports.WhiteSpace = {}));
exports.whiteSpaceProperty = new view_1.CssProperty({
    name: "whiteSpace",
    cssName: "white-space",
    valueConverter: WhiteSpace.parse
});
exports.whiteSpaceProperty.register(view_1.Style);
exports.letterSpacingProperty = new view_1.CssProperty({
    name: "letterSpacing",
    cssName: "letter-spacing",
    defaultValue: 0,
    affectsLayout: view_1.isIOS,
    valueConverter: function (v) { return parseFloat(v); }
});
exports.letterSpacingProperty.register(view_1.Style);
