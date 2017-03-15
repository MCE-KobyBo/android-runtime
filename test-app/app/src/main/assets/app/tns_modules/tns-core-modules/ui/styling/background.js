"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var types_1 = require("../../utils/types");
var utils_1 = require("../../utils/utils");
var css_value_1 = require("../../css-value");
__export(require("./background-common"));
// TODO: Change this implementation to use 
// We are using "ad" here to avoid namespace collision with the global android object
var ad;
(function (ad) {
    var SDK;
    function getSDK() {
        if (!SDK) {
            SDK = android.os.Build.VERSION.SDK_INT;
        }
        return SDK;
    }
    var _defaultBackgrounds = new Map();
    function isSetColorFilterOnlyWidget(nativeView) {
        return (nativeView instanceof android.widget.Button ||
            (nativeView instanceof android.support.v7.widget.Toolbar
                && getSDK() >= 21 // There is an issue with the DrawableContainer which was fixed for API version 21 and above: https://code.google.com/p/android/issues/detail?id=60183
            ));
    }
    function onBackgroundOrBorderPropertyChanged(view) {
        var nativeView = view._nativeView;
        if (!nativeView) {
            return;
        }
        var background = view.style.backgroundInternal;
        var backgroundDrawable = nativeView.getBackground();
        var cache = view._nativeView;
        var viewClass = types_1.getClass(view);
        // always cache the default background constant state.
        if (!_defaultBackgrounds.has(viewClass) && !types_1.isNullOrUndefined(backgroundDrawable)) {
            _defaultBackgrounds.set(viewClass, backgroundDrawable.getConstantState());
        }
        if (isSetColorFilterOnlyWidget(nativeView)
            && !types_1.isNullOrUndefined(backgroundDrawable)
            && types_1.isFunction(backgroundDrawable.setColorFilter)
            && !background.hasBorderWidth()
            && !background.hasBorderRadius()
            && !background.clipPath
            && types_1.isNullOrUndefined(background.image)
            && !types_1.isNullOrUndefined(background.color)) {
            var backgroundColor = backgroundDrawable.backgroundColor = background.color.android;
            backgroundDrawable.mutate();
            backgroundDrawable.setColorFilter(backgroundColor, android.graphics.PorterDuff.Mode.SRC_IN);
            backgroundDrawable.invalidateSelf(); // Make sure the drawable is invalidated. Android forgets to invalidate it in some cases: toolbar
            backgroundDrawable.backgroundColor = backgroundColor;
        }
        else if (!background.isEmpty()) {
            if (!(backgroundDrawable instanceof org.nativescript.widgets.BorderDrawable)) {
                backgroundDrawable = new org.nativescript.widgets.BorderDrawable(utils_1.layout.getDisplayDensity(), view.toString());
                refreshBorderDrawable(view, backgroundDrawable);
                org.nativescript.widgets.ViewHelper.setBackground(nativeView, backgroundDrawable);
            }
            else {
                refreshBorderDrawable(view, backgroundDrawable);
            }
            // This should be done only when backgroundImage is set!!!
            if ((background.hasBorderWidth() || background.hasBorderRadius() || background.clipPath) && getSDK() < 18) {
                // Switch to software because of unsupported canvas methods if hardware acceleration is on:
                // http://developer.android.com/guide/topics/graphics/hardware-accel.html
                if (cache.layerType === undefined) {
                    cache.layerType = cache.getLayerType();
                    cache.setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null);
                }
            }
        }
        else {
            if (_defaultBackgrounds.has(viewClass)) {
                org.nativescript.widgets.ViewHelper.setBackground(nativeView, _defaultBackgrounds.get(viewClass).newDrawable());
            }
            if (cache.layerType !== undefined) {
                cache.setLayerType(cache.layerType, null);
                cache.layerType = undefined;
            }
        }
        // TODO: Can we move BorderWidths as separate native setter?
        // This way we could skip setPadding if borderWidth is not changed.
        var leftPadding = Math.round(view.effectiveBorderLeftWidth + view.effectivePaddingLeft);
        var topPadding = Math.round(view.effectiveBorderTopWidth + view.effectivePaddingTop);
        var rightPadding = Math.round(view.effectiveBorderRightWidth + view.effectivePaddingRight);
        var bottomPadding = Math.round(view.effectiveBorderBottomWidth + view.effectivePaddingBottom);
        nativeView.setPadding(leftPadding, topPadding, rightPadding, bottomPadding);
    }
    ad.onBackgroundOrBorderPropertyChanged = onBackgroundOrBorderPropertyChanged;
})(ad = exports.ad || (exports.ad = {}));
function refreshBorderDrawable(view, borderDrawable) {
    var background = view.style.backgroundInternal;
    if (background) {
        var backgroundPositionParsedCSSValues = null;
        var backgroundSizeParsedCSSValues = null;
        if (background.position) {
            backgroundPositionParsedCSSValues = createNativeCSSValueArray(background.position);
        }
        if (background.size) {
            backgroundSizeParsedCSSValues = createNativeCSSValueArray(background.size);
        }
        var blackColor = android.graphics.Color.BLACK;
        borderDrawable.refresh((background.borderTopColor && background.borderTopColor.android !== undefined) ? background.borderTopColor.android : blackColor, (background.borderRightColor && background.borderRightColor.android !== undefined) ? background.borderRightColor.android : blackColor, (background.borderBottomColor && background.borderBottomColor.android !== undefined) ? background.borderBottomColor.android : blackColor, (background.borderLeftColor && background.borderLeftColor.android !== undefined) ? background.borderLeftColor.android : blackColor, background.borderTopWidth, background.borderRightWidth, background.borderBottomWidth, background.borderLeftWidth, background.borderTopLeftRadius, background.borderTopRightRadius, background.borderBottomRightRadius, background.borderBottomLeftRadius, background.clipPath, (background.color && background.color.android) ? background.color.android : 0, (background.image && background.image.android) ? background.image.android : null, background.repeat, background.position, backgroundPositionParsedCSSValues, background.size, backgroundSizeParsedCSSValues);
    }
}
function createNativeCSSValueArray(css) {
    if (!css) {
        return null;
    }
    var cssValues = css_value_1.parse(css);
    var nativeArray = Array.create(org.nativescript.widgets.CSSValue, cssValues.length);
    for (var i = 0, length_1 = cssValues.length; i < length_1; i++) {
        nativeArray[i] = new org.nativescript.widgets.CSSValue(cssValues[i].type, cssValues[i].string, cssValues[i].unit, cssValues[i].value);
    }
    return nativeArray;
}
