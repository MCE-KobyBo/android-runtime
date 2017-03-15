"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var font_1 = require("../styling/font");
var style_properties_1 = require("../styling/style-properties");
var text_base_common_1 = require("./text-base-common");
__export(require("./text-base-common"));
var TextTransformation;
function initializeTextTransformation() {
    if (TextTransformation) {
        return;
    }
    var TextTransformationImpl = (function (_super) {
        __extends(TextTransformationImpl, _super);
        function TextTransformationImpl(textBase) {
            _super.call(this);
            this.textBase = textBase;
            return global.__native(this);
        }
        TextTransformationImpl.prototype.getTransformation = function (charSeq, view) {
            // NOTE: Do we need to transform the new text here?
            var formattedText = this.textBase.formattedText;
            if (formattedText) {
                return createSpannableStringBuilder(formattedText);
            }
            else {
                return getTransformedText(this.textBase.text, this.textBase.textTransform);
            }
        };
        TextTransformationImpl.prototype.onFocusChanged = function (view, sourceText, focused, direction, previouslyFocusedRect) {
            // Do nothing for now.
        };
        TextTransformationImpl = __decorate([
            Interfaces([android.text.method.TransformationMethod])
        ], TextTransformationImpl);
        return TextTransformationImpl;
    }(java.lang.Object));
    TextTransformation = TextTransformationImpl;
}
var TextBase = (function (_super) {
    __extends(TextBase, _super);
    function TextBase() {
        _super.apply(this, arguments);
    }
    TextBase.prototype._initNativeView = function () {
        this._defaultTransformationMethod = this.nativeView.getTransformationMethod();
        _super.prototype._initNativeView.call(this);
    };
    TextBase.prototype._resetNativeView = function () {
        _super.prototype._resetNativeView.call(this);
        // We reset it here too because this could be changed by multiple properties - whiteSpace, secure, textTransform
        this.nativeView.setTransformationMethod(this._defaultTransformationMethod);
    };
    Object.defineProperty(TextBase.prototype, text_base_common_1.textProperty.native, {
        get: function () {
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.textProperty.native, {
        set: function (value) {
            if (this.formattedText) {
                return;
            }
            this._setNativeText();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.formattedTextProperty.native, {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.formattedTextProperty.native, {
        set: function (value) {
            // Don't change the transformation method if this is secure TextField or we'll lose the hiding characters.
            if (this.secure) {
                return;
            }
            initializeTextTransformation();
            var spannableStringBuilder = createSpannableStringBuilder(value);
            this.nativeView.setText(spannableStringBuilder);
            text_base_common_1.textProperty.nativeValueChange(this, (value === null || value === undefined) ? '' : value.toString());
            if (spannableStringBuilder && this.nativeView instanceof android.widget.Button &&
                !(this.nativeView.getTransformationMethod() instanceof TextTransformation)) {
                // Replace Android Button's default transformation (in case the developer has not already specified a text-transform) method 
                // with our transformation method which can handle formatted text.
                // Otherwise, the default tranformation method of the Android Button will overwrite and ignore our spannableStringBuilder.
                this.nativeView.setTransformationMethod(new TextTransformation(this));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.textTransformProperty.native, {
        get: function () {
            return "default";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.textTransformProperty.native, {
        set: function (value) {
            // In case of reset.
            if (value === "default") {
                this.nativeView.setTransformationMethod(this._defaultTransformationMethod);
                return;
            }
            // Don't change the transformation method if this is secure TextField or we'll lose the hiding characters.
            if (this.secure) {
                return;
            }
            initializeTextTransformation();
            if (typeof value === "string") {
                this.nativeView.setTransformationMethod(new TextTransformation(this));
            }
            else {
                this.nativeView.setTransformationMethod(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.colorProperty.native, {
        get: function () {
            return this.nativeView.getTextColors();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.colorProperty.native, {
        set: function (value) {
            if (!this.formattedText || !(value instanceof text_base_common_1.Color)) {
                if (value instanceof text_base_common_1.Color) {
                    this.nativeView.setTextColor(value.android);
                }
                else {
                    this.nativeView.setTextColor(value);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.fontSizeProperty.native, {
        get: function () {
            return { nativeSize: this.nativeView.getTextSize() };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.fontSizeProperty.native, {
        set: function (value) {
            if (!this.formattedText || (typeof value !== "number")) {
                if (typeof value === "number") {
                    this.nativeView.setTextSize(value);
                }
                else {
                    this.nativeView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.fontInternalProperty.native, {
        get: function () {
            return this.nativeView.getTypeface();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.fontInternalProperty.native, {
        set: function (value) {
            if (!this.formattedText || !(value instanceof font_1.Font)) {
                this.nativeView.setTypeface(value instanceof font_1.Font ? value.getAndroidTypeface() : value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.textAlignmentProperty.native, {
        get: function () {
            var textAlignmentGravity = this.nativeView.getGravity() & android.view.Gravity.HORIZONTAL_GRAVITY_MASK;
            switch (textAlignmentGravity) {
                case android.view.Gravity.CENTER_HORIZONTAL:
                    return "center";
                case android.view.Gravity.RIGHT:
                    return "right";
                case android.view.Gravity.LEFT:
                default:
                    return "left";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.textAlignmentProperty.native, {
        set: function (value) {
            var verticalGravity = this.nativeView.getGravity() & android.view.Gravity.VERTICAL_GRAVITY_MASK;
            switch (value) {
                case "left":
                    this.nativeView.setGravity(android.view.Gravity.LEFT | verticalGravity);
                    break;
                case "center":
                    this.nativeView.setGravity(android.view.Gravity.CENTER_HORIZONTAL | verticalGravity);
                    break;
                case "right":
                    this.nativeView.setGravity(android.view.Gravity.RIGHT | verticalGravity);
                    break;
                default:
                    throw new Error("Invalid text alignment value: " + value + ". Valid values are: 'left', 'center', 'right'.");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.textDecorationProperty.native, {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.textDecorationProperty.native, {
        set: function (value) {
            var isReset = typeof value === "number";
            if (!this.formattedText || isReset) {
                value = isReset ? "none" : value;
                var flags = void 0;
                switch (value) {
                    case "none":
                        flags = 0;
                        break;
                    case "underline":
                        flags = android.graphics.Paint.UNDERLINE_TEXT_FLAG;
                        break;
                    case "line-through":
                        flags = android.graphics.Paint.STRIKE_THRU_TEXT_FLAG;
                        break;
                    case "underline line-through":
                        flags = android.graphics.Paint.UNDERLINE_TEXT_FLAG | android.graphics.Paint.STRIKE_THRU_TEXT_FLAG;
                        break;
                    default:
                        throw new Error("Invalid text decoration value: " + value + ". Valid values are: 'none', 'underline', 'line-through', 'underline line-through'.");
                }
                this.nativeView.setPaintFlags(flags);
            }
            else {
                this._setNativeText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.whiteSpaceProperty.native, {
        // Overriden in TextField becasue setSingleLine(false) will remove methodTransformation.
        // and we don't want to allow TextField to be multiline
        get: function () {
            return "normal";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.whiteSpaceProperty.native, {
        set: function (value) {
            var nativeView = this.nativeView;
            switch (value) {
                case "normal":
                    nativeView.setSingleLine(false);
                    nativeView.setEllipsize(null);
                    break;
                case "nowrap":
                    nativeView.setSingleLine(true);
                    nativeView.setEllipsize(android.text.TextUtils.TruncateAt.END);
                    break;
                default:
                    throw new Error("Invalid whitespace value: " + value + ". Valid values are: 'normal', nowrap'.");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.letterSpacingProperty.native, {
        get: function () {
            return org.nativescript.widgets.ViewHelper.getLetterspacing(this.nativeView);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.letterSpacingProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setLetterspacing(this.nativeView, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.paddingTopProperty.native, {
        get: function () {
            return { value: this._defaultPaddingTop, unit: "px" };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.paddingTopProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setPaddingTop(this.nativeView, text_base_common_1.Length.toDevicePixels(value, 0) + text_base_common_1.Length.toDevicePixels(this.style.borderTopWidth, 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.paddingRightProperty.native, {
        get: function () {
            return { value: this._defaultPaddingRight, unit: "px" };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.paddingRightProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setPaddingRight(this.nativeView, text_base_common_1.Length.toDevicePixels(value, 0) + text_base_common_1.Length.toDevicePixels(this.style.borderRightWidth, 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.paddingBottomProperty.native, {
        get: function () {
            return { value: this._defaultPaddingBottom, unit: "px" };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.paddingBottomProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setPaddingBottom(this.nativeView, text_base_common_1.Length.toDevicePixels(value, 0) + text_base_common_1.Length.toDevicePixels(this.style.borderBottomWidth, 0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.paddingLeftProperty.native, {
        get: function () {
            return { value: this._defaultPaddingLeft, unit: "px" };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, text_base_common_1.paddingLeftProperty.native, {
        set: function (value) {
            org.nativescript.widgets.ViewHelper.setPaddingLeft(this.nativeView, text_base_common_1.Length.toDevicePixels(value, 0) + text_base_common_1.Length.toDevicePixels(this.style.borderLeftWidth, 0));
        },
        enumerable: true,
        configurable: true
    });
    TextBase.prototype._setNativeText = function () {
        var transformedText;
        if (this.formattedText) {
            transformedText = createSpannableStringBuilder(this.formattedText);
        }
        else {
            var text = this.text;
            var stringValue = (text === null || text === undefined) ? '' : text.toString();
            transformedText = getTransformedText(stringValue, this.textTransform);
        }
        this.nativeView.setText(transformedText);
    };
    return TextBase;
}(text_base_common_1.TextBaseCommon));
exports.TextBase = TextBase;
function getCapitalizedString(str) {
    var words = str.split(" ");
    var newWords = [];
    for (var i = 0, length_1 = words.length; i < length_1; i++) {
        var word = words[i].toLowerCase();
        newWords.push(word.substr(0, 1).toUpperCase() + word.substring(1));
    }
    return newWords.join(" ");
}
function getTransformedText(text, textTransform) {
    switch (textTransform) {
        case "none":
            return text;
        case "uppercase":
            return text.toUpperCase();
        case "lowercase":
            return text.toLowerCase();
        case "capitalize":
            return getCapitalizedString(text);
        default:
            throw new Error("Invalid text transform value: " + textTransform + ". Valid values are: 'none', 'capitalize', 'uppercase', 'lowercase'.");
    }
}
exports.getTransformedText = getTransformedText;
function createSpannableStringBuilder(formattedString) {
    if (!formattedString) {
        return null;
    }
    var ssb = new android.text.SpannableStringBuilder();
    for (var i = 0, spanStart = 0, spanLength = 0, length_2 = formattedString.spans.length; i < length_2; i++) {
        var span = formattedString.spans.getItem(i);
        var text = span.text;
        var textTransform = formattedString.parent.textTransform;
        var spanText = (text === null || text === undefined) ? '' : text.toString();
        if (textTransform !== "none") {
            spanText = getTransformedText(spanText, textTransform);
        }
        spanLength = spanText.length;
        if (spanLength > 0) {
            ssb.insert(spanStart, spanText);
            setSpanModifiers(ssb, span, spanStart, spanStart + spanLength);
            spanStart += spanLength;
        }
    }
    return ssb;
}
function setSpanModifiers(ssb, span, start, end) {
    var spanStyle = span.style;
    var bold = text_base_common_1.isBold(spanStyle.fontWeight);
    var italic = spanStyle.fontStyle === "italic";
    if (bold && italic) {
        ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD_ITALIC), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    else if (bold) {
        ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    else if (italic) {
        ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.ITALIC), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var fontFamily = span.fontFamily;
    if (fontFamily) {
        var font = new font_1.Font(fontFamily, 0, (italic) ? "italic" : "normal", (bold) ? "bold" : "normal");
        var typefaceSpan = new org.nativescript.widgets.CustomTypefaceSpan(fontFamily, font.getAndroidTypeface());
        ssb.setSpan(typefaceSpan, start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var realFontSize = span.fontSize;
    if (realFontSize) {
        ssb.setSpan(new android.text.style.AbsoluteSizeSpan(realFontSize * text_base_common_1.layout.getDisplayDensity()), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var color = span.color;
    if (color) {
        ssb.setSpan(new android.text.style.ForegroundColorSpan(color.android), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var backgroundColor;
    if (style_properties_1.backgroundColorProperty.isSet(spanStyle)) {
        backgroundColor = spanStyle.backgroundColor;
    }
    else if (style_properties_1.backgroundColorProperty.isSet(span.parent.style)) {
        // parent is FormattedString
        backgroundColor = span.parent.style.backgroundColor;
    }
    else if (style_properties_1.backgroundColorProperty.isSet(span.parent.parent.style)) {
        // parent.parent is TextBase
        backgroundColor = span.parent.parent.style.backgroundColor;
    }
    if (backgroundColor) {
        ssb.setSpan(new android.text.style.BackgroundColorSpan(backgroundColor.android), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
    }
    var valueSource;
    if (text_base_common_1.textDecorationProperty.isSet(spanStyle)) {
        valueSource = spanStyle;
    }
    else if (text_base_common_1.textDecorationProperty.isSet(span.parent.style)) {
        // span.parent is FormattedString
        valueSource = span.parent.style;
    }
    else if (text_base_common_1.textDecorationProperty.isSet(span.parent.parent.style)) {
        // span.parent.parent is TextBase
        valueSource = span.parent.parent.style;
    }
    if (valueSource) {
        var textDecorations = valueSource.textDecoration;
        var underline_1 = textDecorations.indexOf('underline') !== -1;
        if (underline_1) {
            ssb.setSpan(new android.text.style.UnderlineSpan(), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }
        var strikethrough = textDecorations.indexOf('line-through') !== -1;
        if (strikethrough) {
            ssb.setSpan(new android.text.style.StrikethroughSpan(), start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }
    }
    // TODO: Implement letterSpacing for Span here.
    // const letterSpacing = formattedString.parent.style.letterSpacing;
    // if (letterSpacing > 0) {
    //     ssb.setSpan(new android.text.style.ScaleXSpan((letterSpacing + 1) / 10), start, end, android.text.Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
    // }
}
