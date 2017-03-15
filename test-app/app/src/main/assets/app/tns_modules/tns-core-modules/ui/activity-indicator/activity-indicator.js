"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var activity_indicator_common_1 = require("./activity-indicator-common");
__export(require("./activity-indicator-common"));
var ActivityIndicator = (function (_super) {
    __extends(ActivityIndicator, _super);
    function ActivityIndicator() {
        _super.apply(this, arguments);
    }
    ActivityIndicator.prototype._createNativeView = function () {
        var progressBar = this._progressBar = new android.widget.ProgressBar(this._context);
        this._progressBar.setVisibility(android.view.View.INVISIBLE);
        this._progressBar.setIndeterminate(true);
        return progressBar;
    };
    Object.defineProperty(ActivityIndicator.prototype, "android", {
        get: function () {
            return this._progressBar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityIndicator.prototype, activity_indicator_common_1.busyProperty.native, {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityIndicator.prototype, activity_indicator_common_1.busyProperty.native, {
        set: function (value) {
            if (this.visibility === activity_indicator_common_1.Visibility.VISIBLE) {
                this._progressBar.setVisibility(value ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityIndicator.prototype, activity_indicator_common_1.visibilityProperty.native, {
        get: function () {
            return activity_indicator_common_1.Visibility.HIDDEN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityIndicator.prototype, activity_indicator_common_1.visibilityProperty.native, {
        set: function (value) {
            switch (value) {
                case activity_indicator_common_1.Visibility.VISIBLE:
                    this._progressBar.setVisibility(this.busy ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
                    break;
                case activity_indicator_common_1.Visibility.HIDDEN:
                    this._progressBar.setVisibility(android.view.View.INVISIBLE);
                    break;
                case activity_indicator_common_1.Visibility.COLLAPSE:
                    this._progressBar.setVisibility(android.view.View.GONE);
                    break;
                default:
                    throw new Error("Invalid visibility value: " + value + ". Valid values are: \"" + activity_indicator_common_1.Visibility.VISIBLE + "\", \"" + activity_indicator_common_1.Visibility.HIDDEN + "\", \"" + activity_indicator_common_1.Visibility.COLLAPSE + "\".");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityIndicator.prototype, activity_indicator_common_1.colorProperty.native, {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityIndicator.prototype, activity_indicator_common_1.colorProperty.native, {
        set: function (value) {
            if (value instanceof activity_indicator_common_1.Color) {
                this._progressBar.getIndeterminateDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
            }
            else {
                this._progressBar.getIndeterminateDrawable().clearColorFilter();
            }
        },
        enumerable: true,
        configurable: true
    });
    return ActivityIndicator;
}(activity_indicator_common_1.ActivityIndicatorBase));
exports.ActivityIndicator = ActivityIndicator;
