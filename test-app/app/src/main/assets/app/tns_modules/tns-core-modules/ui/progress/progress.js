"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var progress_common_1 = require("./progress-common");
__export(require("./progress-common"));
var R_ATTR_PROGRESS_BAR_STYLE_HORIZONTAL = 0x01010078;
var Progress = (function (_super) {
    __extends(Progress, _super);
    function Progress() {
        _super.apply(this, arguments);
    }
    Progress.prototype._createNativeView = function () {
        var progressBar = this._android = new android.widget.ProgressBar(this._context, null, R_ATTR_PROGRESS_BAR_STYLE_HORIZONTAL);
        return progressBar;
    };
    Object.defineProperty(Progress.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Progress.prototype, "nativeView", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Progress.prototype, progress_common_1.valueProperty.native, {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Progress.prototype, progress_common_1.valueProperty.native, {
        set: function (value) {
            this._android.setProgress(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Progress.prototype, progress_common_1.maxValueProperty.native, {
        get: function () {
            return 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Progress.prototype, progress_common_1.maxValueProperty.native, {
        set: function (value) {
            this._android.setMax(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Progress.prototype, progress_common_1.colorProperty.native, {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Progress.prototype, progress_common_1.colorProperty.native, {
        set: function (value) {
            var progressDrawable = this._android.getProgressDrawable();
            if (!progressDrawable) {
                return;
            }
            if (value instanceof progress_common_1.Color) {
                progressDrawable.setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
            }
            else {
                progressDrawable.clearColorFilter();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Progress.prototype, progress_common_1.backgroundColorProperty.native, {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Progress.prototype, progress_common_1.backgroundColorProperty.native, {
        set: function (value) {
            var progressDrawable = this._android.getProgressDrawable();
            if (!progressDrawable) {
                return;
            }
            if (progressDrawable instanceof android.graphics.drawable.LayerDrawable && progressDrawable.getNumberOfLayers() > 0) {
                var backgroundDrawable = progressDrawable.getDrawable(0);
                if (backgroundDrawable) {
                    if (value instanceof progress_common_1.Color) {
                        backgroundDrawable.setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
                    }
                    else {
                        backgroundDrawable.clearColorFilter();
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Progress.prototype, progress_common_1.backgroundInternalProperty.native, {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Progress.prototype, progress_common_1.backgroundInternalProperty.native, {
        set: function (value) {
            //
        },
        enumerable: true,
        configurable: true
    });
    return Progress;
}(progress_common_1.ProgressBase));
exports.Progress = Progress;
