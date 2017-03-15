"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var transition_1 = require("./transition");
var FadeTransition = (function (_super) {
    __extends(FadeTransition, _super);
    function FadeTransition() {
        _super.apply(this, arguments);
    }
    FadeTransition.prototype.createAndroidAnimator = function (transitionType) {
        var alphaValues = Array.create("float", 2);
        switch (transitionType) {
            case transition_1.AndroidTransitionType.enter:
            case transition_1.AndroidTransitionType.popEnter:
                alphaValues[0] = 0;
                alphaValues[1] = 1;
                break;
            case transition_1.AndroidTransitionType.exit:
            case transition_1.AndroidTransitionType.popExit:
                alphaValues[0] = 1;
                alphaValues[1] = 0;
                break;
        }
        var animator = android.animation.ObjectAnimator.ofFloat(null, "alpha", alphaValues);
        var duration = this.getDuration();
        if (duration !== undefined) {
            animator.setDuration(duration);
        }
        animator.setInterpolator(this.getCurve());
        return animator;
    };
    return FadeTransition;
}(transition_1.Transition));
exports.FadeTransition = FadeTransition;
