"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var animation_common_1 = require("./animation-common");
var style_properties_1 = require("../styling/style-properties");
var utils_1 = require("../../utils/utils");
var lazy_1 = require("../../utils/lazy");
__export(require("./animation-common"));
var argbEvaluator;
function ensureArgbEvaluator() {
    if (!argbEvaluator) {
        argbEvaluator = new android.animation.ArgbEvaluator();
    }
}
var easeIn = lazy_1["default"](function () { return new android.view.animation.AccelerateInterpolator(1); });
var easeOut = lazy_1["default"](function () { return new android.view.animation.DecelerateInterpolator(1); });
var easeInOut = lazy_1["default"](function () { return new android.view.animation.AccelerateDecelerateInterpolator(); });
var linear = lazy_1["default"](function () { return new android.view.animation.LinearInterpolator(); });
var bounce = lazy_1["default"](function () { return new android.view.animation.BounceInterpolator(); });
var keyPrefix = "ui.animation.";
var propertyKeys = {};
propertyKeys[animation_common_1.Properties.backgroundColor] = Symbol(keyPrefix + animation_common_1.Properties.backgroundColor);
propertyKeys[animation_common_1.Properties.opacity] = Symbol(keyPrefix + animation_common_1.Properties.opacity);
propertyKeys[animation_common_1.Properties.rotate] = Symbol(keyPrefix + animation_common_1.Properties.rotate);
propertyKeys[animation_common_1.Properties.scale] = Symbol(keyPrefix + animation_common_1.Properties.scale);
propertyKeys[animation_common_1.Properties.translate] = Symbol(keyPrefix + animation_common_1.Properties.translate);
function _resolveAnimationCurve(curve) {
    switch (curve) {
        case "easeIn":
            if (animation_common_1.traceEnabled()) {
                animation_common_1.traceWrite("Animation curve resolved to android.view.animation.AccelerateInterpolator(1).", animation_common_1.traceCategories.Animation);
            }
            return easeIn();
        case "easeOut":
            if (animation_common_1.traceEnabled()) {
                animation_common_1.traceWrite("Animation curve resolved to android.view.animation.DecelerateInterpolator(1).", animation_common_1.traceCategories.Animation);
            }
            return easeOut();
        case "easeInOut":
            if (animation_common_1.traceEnabled()) {
                animation_common_1.traceWrite("Animation curve resolved to android.view.animation.AccelerateDecelerateInterpolator().", animation_common_1.traceCategories.Animation);
            }
            return easeInOut();
        case "linear":
            if (animation_common_1.traceEnabled()) {
                animation_common_1.traceWrite("Animation curve resolved to android.view.animation.LinearInterpolator().", animation_common_1.traceCategories.Animation);
            }
            return linear();
        case "spring":
            if (animation_common_1.traceEnabled()) {
                animation_common_1.traceWrite("Animation curve resolved to android.view.animation.BounceInterpolator().", animation_common_1.traceCategories.Animation);
            }
            return bounce();
        case "ease":
            return android.support.v4.view.animation.PathInterpolatorCompat.create(0.25, 0.1, 0.25, 1.0);
        default:
            if (animation_common_1.traceEnabled()) {
                animation_common_1.traceWrite("Animation curve resolved to original: " + curve, animation_common_1.traceCategories.Animation);
            }
            if (curve instanceof animation_common_1.CubicBezierAnimationCurve) {
                return android.support.v4.view.animation.PathInterpolatorCompat.create(curve.x1, curve.y1, curve.x2, curve.y2);
            }
            else if (curve instanceof android.view.animation.Interpolator) {
                return curve;
            }
            else {
                throw new Error("Invalid animation curve: " + curve);
            }
    }
}
exports._resolveAnimationCurve = _resolveAnimationCurve;
var Animation = (function (_super) {
    __extends(Animation, _super);
    function Animation(animationDefinitions, playSequentially) {
        _super.call(this, animationDefinitions, playSequentially);
        if (animationDefinitions.length > 0 && animationDefinitions[0].valueSource !== undefined) {
            this._valueSource = animationDefinitions[0].valueSource;
        }
        var that = new WeakRef(this);
        this._animatorListener = new android.animation.Animator.AnimatorListener({
            onAnimationStart: function (animator) {
                if (animation_common_1.traceEnabled()) {
                    animation_common_1.traceWrite("MainAnimatorListener.onAndroidAnimationStart(" + animator + ")", animation_common_1.traceCategories.Animation);
                }
            },
            onAnimationRepeat: function (animator) {
                if (animation_common_1.traceEnabled()) {
                    animation_common_1.traceWrite("MainAnimatorListener.onAnimationRepeat(" + animator + ")", animation_common_1.traceCategories.Animation);
                }
            },
            onAnimationEnd: function (animator) {
                if (animation_common_1.traceEnabled()) {
                    animation_common_1.traceWrite("MainAnimatorListener.onAnimationEnd(" + animator + ")", animation_common_1.traceCategories.Animation);
                }
                that.get()._onAndroidAnimationEnd();
            },
            onAnimationCancel: function (animator) {
                if (animation_common_1.traceEnabled()) {
                    animation_common_1.traceWrite("MainAnimatorListener.onAnimationCancel(" + animator + ")", animation_common_1.traceCategories.Animation);
                }
                that.get()._onAndroidAnimationCancel();
            }
        });
    }
    Animation.prototype.play = function () {
        var animationFinishedPromise = _super.prototype.play.call(this);
        this._animators = new Array();
        this._propertyUpdateCallbacks = new Array();
        this._propertyResetCallbacks = new Array();
        for (var i = 0, length_1 = this._propertyAnimations.length; i < length_1; i++) {
            this._createAnimators(this._propertyAnimations[i]);
        }
        this._nativeAnimatorsArray = Array.create(android.animation.Animator, this._animators.length);
        for (var i = 0, length_2 = this._animators.length; i < length_2; i++) {
            this._nativeAnimatorsArray[i] = this._animators[i];
        }
        this._animatorSet = new android.animation.AnimatorSet();
        this._animatorSet.addListener(this._animatorListener);
        if (this._animators.length > 0) {
            if (this._playSequentially) {
                this._animatorSet.playSequentially(this._nativeAnimatorsArray);
            }
            else {
                this._animatorSet.playTogether(this._nativeAnimatorsArray);
            }
        }
        this._enableHardwareAcceleration();
        if (animation_common_1.traceEnabled()) {
            animation_common_1.traceWrite("Starting " + this._nativeAnimatorsArray.length + " animations " + (this._playSequentially ? "sequentially." : "together."), animation_common_1.traceCategories.Animation);
        }
        this._animatorSet.setupStartValues();
        this._animatorSet.start();
        return animationFinishedPromise;
    };
    Animation.prototype.cancel = function () {
        _super.prototype.cancel.call(this);
        if (animation_common_1.traceEnabled()) {
            animation_common_1.traceWrite("Cancelling AnimatorSet.", animation_common_1.traceCategories.Animation);
        }
        this._animatorSet.cancel();
    };
    Animation.prototype._resolveAnimationCurve = function (curve) {
        return _resolveAnimationCurve(curve);
    };
    Animation.prototype._onAndroidAnimationEnd = function () {
        if (!this.isPlaying) {
            // It has been cancelled
            return;
        }
        var i = 0;
        var length = this._propertyUpdateCallbacks.length;
        for (; i < length; i++) {
            this._propertyUpdateCallbacks[i]();
        }
        this._disableHardwareAcceleration();
        this._resolveAnimationFinishedPromise();
    };
    Animation.prototype._onAndroidAnimationCancel = function () {
        var i = 0;
        var length = this._propertyResetCallbacks.length;
        for (; i < length; i++) {
            this._propertyResetCallbacks[i]();
        }
        this._disableHardwareAcceleration();
        this._rejectAnimationFinishedPromise();
    };
    Animation.prototype._createAnimators = function (propertyAnimation) {
        if (!propertyAnimation.target._nativeView) {
            return;
        }
        if (animation_common_1.traceEnabled()) {
            animation_common_1.traceWrite("Creating ObjectAnimator(s) for animation: " + Animation._getAnimationInfo(propertyAnimation) + "...", animation_common_1.traceCategories.Animation);
        }
        if (propertyAnimation.target === null || propertyAnimation.target === undefined) {
            throw new Error("Animation target cannot be null or undefined; property: " + propertyAnimation.property + "; value: " + propertyAnimation.value + ";");
        }
        if (propertyAnimation.property === null || propertyAnimation.property === undefined) {
            throw new Error("Animation property cannot be null or undefined; target: " + propertyAnimation.target + "; value: " + propertyAnimation.value + ";");
        }
        if (propertyAnimation.value === null || propertyAnimation.value === undefined) {
            throw new Error("Animation value cannot be null or undefined; target: " + propertyAnimation.target + "; property: " + propertyAnimation.property + ";");
        }
        var nativeArray;
        var nativeView = propertyAnimation.target._nativeView;
        var animators = new Array();
        var propertyUpdateCallbacks = new Array();
        var propertyResetCallbacks = new Array();
        var originalValue1;
        var originalValue2;
        var density = utils_1.layout.getDisplayDensity();
        var xyObjectAnimators;
        var animatorSet;
        var key = propertyKeys[propertyAnimation.property];
        if (key) {
            propertyAnimation.target[key] = propertyAnimation;
        }
        function checkAnimation(cb) {
            return function () {
                if (propertyAnimation.target[key] === propertyAnimation) {
                    delete propertyAnimation.target[key];
                    cb();
                }
            };
        }
        var setLocal = this._valueSource === "animation";
        switch (propertyAnimation.property) {
            case animation_common_1.Properties.opacity:
                originalValue1 = nativeView.getAlpha();
                nativeArray = Array.create("float", 1);
                nativeArray[0] = propertyAnimation.value;
                propertyUpdateCallbacks.push(checkAnimation(function () {
                    propertyAnimation.target.style[setLocal ? style_properties_1.opacityProperty.name : style_properties_1.opacityProperty.keyframe] = propertyAnimation.value;
                }));
                propertyResetCallbacks.push(checkAnimation(function () {
                    if (setLocal) {
                        propertyAnimation.target.style[style_properties_1.opacityProperty.name] = originalValue1;
                    }
                    else {
                        propertyAnimation.target.style[style_properties_1.opacityProperty.keyframe] = originalValue1;
                    }
                    if (propertyAnimation.target.nativeView) {
                        propertyAnimation.target[style_properties_1.opacityProperty.native] = propertyAnimation.target.style.opacity;
                    }
                }));
                animators.push(android.animation.ObjectAnimator.ofFloat(nativeView, "alpha", nativeArray));
                break;
            case animation_common_1.Properties.backgroundColor:
                ensureArgbEvaluator();
                originalValue1 = propertyAnimation.target.backgroundColor;
                nativeArray = Array.create(java.lang.Object, 2);
                nativeArray[0] = propertyAnimation.target.backgroundColor ? java.lang.Integer.valueOf(propertyAnimation.target.backgroundColor.argb) : java.lang.Integer.valueOf(-1);
                nativeArray[1] = java.lang.Integer.valueOf(propertyAnimation.value.argb);
                var animator = android.animation.ValueAnimator.ofObject(argbEvaluator, nativeArray);
                animator.addUpdateListener(new android.animation.ValueAnimator.AnimatorUpdateListener({
                    onAnimationUpdate: function (animator) {
                        var argb = animator.getAnimatedValue().intValue();
                        propertyAnimation.target.style[style_properties_1.backgroundColorProperty.cssName] = new animation_common_1.Color(argb);
                    }
                }));
                propertyUpdateCallbacks.push(checkAnimation(function () {
                    propertyAnimation.target.style[setLocal ? style_properties_1.backgroundColorProperty.name : style_properties_1.backgroundColorProperty.keyframe] = propertyAnimation.value;
                }));
                propertyResetCallbacks.push(checkAnimation(function () {
                    if (setLocal) {
                        propertyAnimation.target.style[style_properties_1.backgroundColorProperty.name] = originalValue1;
                    }
                    else {
                        propertyAnimation.target.style[style_properties_1.backgroundColorProperty.keyframe] = originalValue1;
                        if (propertyAnimation.target.nativeView) {
                            propertyAnimation.target[style_properties_1.backgroundColorProperty.native] = propertyAnimation.target.style.backgroundColor;
                        }
                    }
                }));
                animators.push(animator);
                break;
            case animation_common_1.Properties.translate:
                xyObjectAnimators = Array.create(android.animation.Animator, 2);
                nativeArray = Array.create("float", 1);
                nativeArray[0] = propertyAnimation.value.x * density;
                xyObjectAnimators[0] = android.animation.ObjectAnimator.ofFloat(nativeView, "translationX", nativeArray);
                xyObjectAnimators[0].setRepeatCount(Animation._getAndroidRepeatCount(propertyAnimation.iterations));
                nativeArray = Array.create("float", 1);
                nativeArray[0] = propertyAnimation.value.y * density;
                xyObjectAnimators[1] = android.animation.ObjectAnimator.ofFloat(nativeView, "translationY", nativeArray);
                xyObjectAnimators[1].setRepeatCount(Animation._getAndroidRepeatCount(propertyAnimation.iterations));
                originalValue1 = nativeView.getTranslationX() / density;
                originalValue2 = nativeView.getTranslationY() / density;
                propertyUpdateCallbacks.push(checkAnimation(function () {
                    propertyAnimation.target.style[setLocal ? style_properties_1.translateXProperty.name : style_properties_1.translateXProperty.keyframe] = propertyAnimation.value.x;
                    propertyAnimation.target.style[setLocal ? style_properties_1.translateYProperty.name : style_properties_1.translateYProperty.keyframe] = propertyAnimation.value.y;
                }));
                propertyResetCallbacks.push(checkAnimation(function () {
                    if (setLocal) {
                        propertyAnimation.target.style[style_properties_1.translateXProperty.name] = originalValue1;
                        propertyAnimation.target.style[style_properties_1.translateYProperty.name] = originalValue2;
                    }
                    else {
                        propertyAnimation.target.style[style_properties_1.translateXProperty.keyframe] = originalValue1;
                        propertyAnimation.target.style[style_properties_1.translateYProperty.keyframe] = originalValue2;
                        if (propertyAnimation.target.nativeView) {
                            propertyAnimation.target[style_properties_1.translateXProperty.native] = propertyAnimation.target.style.translateX;
                            propertyAnimation.target[style_properties_1.translateYProperty.native] = propertyAnimation.target.style.translateY;
                        }
                    }
                }));
                animatorSet = new android.animation.AnimatorSet();
                animatorSet.playTogether(xyObjectAnimators);
                animatorSet.setupStartValues();
                animators.push(animatorSet);
                break;
            case animation_common_1.Properties.scale:
                xyObjectAnimators = Array.create(android.animation.Animator, 2);
                nativeArray = Array.create("float", 1);
                nativeArray[0] = propertyAnimation.value.x;
                xyObjectAnimators[0] = android.animation.ObjectAnimator.ofFloat(nativeView, "scaleX", nativeArray);
                xyObjectAnimators[0].setRepeatCount(Animation._getAndroidRepeatCount(propertyAnimation.iterations));
                nativeArray = Array.create("float", 1);
                nativeArray[0] = propertyAnimation.value.y;
                xyObjectAnimators[1] = android.animation.ObjectAnimator.ofFloat(nativeView, "scaleY", nativeArray);
                xyObjectAnimators[1].setRepeatCount(Animation._getAndroidRepeatCount(propertyAnimation.iterations));
                originalValue1 = nativeView.getScaleX();
                originalValue2 = nativeView.getScaleY();
                propertyUpdateCallbacks.push(checkAnimation(function () {
                    propertyAnimation.target.style[setLocal ? style_properties_1.scaleXProperty.name : style_properties_1.scaleXProperty.keyframe] = propertyAnimation.value.x;
                    propertyAnimation.target.style[setLocal ? style_properties_1.scaleYProperty.name : style_properties_1.scaleYProperty.keyframe] = propertyAnimation.value.y;
                }));
                propertyResetCallbacks.push(checkAnimation(function () {
                    if (setLocal) {
                        propertyAnimation.target.style[style_properties_1.scaleXProperty.name] = originalValue1;
                        propertyAnimation.target.style[style_properties_1.scaleYProperty.name] = originalValue2;
                    }
                    else {
                        propertyAnimation.target.style[style_properties_1.scaleXProperty.keyframe] = originalValue1;
                        propertyAnimation.target.style[style_properties_1.scaleYProperty.keyframe] = originalValue2;
                        if (propertyAnimation.target.nativeView) {
                            propertyAnimation.target[style_properties_1.scaleXProperty.native] = propertyAnimation.target.style.scaleX;
                            propertyAnimation.target[style_properties_1.scaleYProperty.native] = propertyAnimation.target.style.scaleY;
                        }
                    }
                }));
                animatorSet = new android.animation.AnimatorSet();
                animatorSet.playTogether(xyObjectAnimators);
                animatorSet.setupStartValues();
                animators.push(animatorSet);
                break;
            case animation_common_1.Properties.rotate:
                originalValue1 = nativeView.getRotation();
                nativeArray = Array.create("float", 1);
                nativeArray[0] = propertyAnimation.value;
                propertyUpdateCallbacks.push(checkAnimation(function () {
                    propertyAnimation.target.style[setLocal ? style_properties_1.rotateProperty.name : style_properties_1.rotateProperty.keyframe] = propertyAnimation.value;
                }));
                propertyResetCallbacks.push(checkAnimation(function () {
                    if (setLocal) {
                        propertyAnimation.target.style[style_properties_1.rotateProperty.name] = originalValue1;
                    }
                    else {
                        propertyAnimation.target.style[style_properties_1.rotateProperty.keyframe] = originalValue1;
                        if (propertyAnimation.target.nativeView) {
                            propertyAnimation.target[style_properties_1.rotateProperty.native] = propertyAnimation.target.style.rotate;
                        }
                    }
                }));
                animators.push(android.animation.ObjectAnimator.ofFloat(nativeView, "rotation", nativeArray));
                break;
            default:
                throw new Error("Cannot animate " + propertyAnimation.property);
        }
        for (var i = 0, length_3 = animators.length; i < length_3; i++) {
            // Duration
            if (propertyAnimation.duration !== undefined) {
                animators[i].setDuration(propertyAnimation.duration);
            }
            // Delay
            if (propertyAnimation.delay !== undefined) {
                animators[i].setStartDelay(propertyAnimation.delay);
            }
            // Repeat Count
            if (propertyAnimation.iterations !== undefined && animators[i] instanceof android.animation.ValueAnimator) {
                animators[i].setRepeatCount(Animation._getAndroidRepeatCount(propertyAnimation.iterations));
            }
            // Interpolator
            if (propertyAnimation.curve !== undefined) {
                animators[i].setInterpolator(propertyAnimation.curve);
            }
            if (animation_common_1.traceEnabled()) {
                animation_common_1.traceWrite("Animator created: " + animators[i], animation_common_1.traceCategories.Animation);
            }
        }
        this._animators = this._animators.concat(animators);
        this._propertyUpdateCallbacks = this._propertyUpdateCallbacks.concat(propertyUpdateCallbacks);
        this._propertyResetCallbacks = this._propertyResetCallbacks.concat(propertyResetCallbacks);
    };
    Animation._getAndroidRepeatCount = function (iterations) {
        return (iterations === Number.POSITIVE_INFINITY) ? android.view.animation.Animation.INFINITE : iterations - 1;
    };
    Animation.prototype._enableHardwareAcceleration = function () {
        for (var i = 0, length_4 = this._propertyAnimations.length; i < length_4; i++) {
            var cache = this._propertyAnimations[i].target._nativeView;
            if (cache) {
                var layerType = cache.getLayerType();
                if (layerType !== android.view.View.LAYER_TYPE_HARDWARE) {
                    cache.layerType = layerType;
                    cache.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);
                }
            }
        }
    };
    Animation.prototype._disableHardwareAcceleration = function () {
        for (var i = 0, length_5 = this._propertyAnimations.length; i < length_5; i++) {
            var cache = this._propertyAnimations[i].target._nativeView;
            if (cache && cache.layerType !== undefined) {
                cache.setLayerType(cache.layerType, null);
                cache.layerType = undefined;
            }
        }
    };
    return Animation;
}(animation_common_1.AnimationBase));
exports.Animation = Animation;
