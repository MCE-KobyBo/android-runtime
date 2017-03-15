"use strict";
var FPSCallback = (function () {
    function FPSCallback(onFrame) {
        var _this = this;
        this.running = false;
        this.onFrame = onFrame;
        this.impl = new android.view.Choreographer.FrameCallback({
            doFrame: function (nanos) {
                _this.handleFrame(nanos);
            }
        });
    }
    FPSCallback.prototype.start = function () {
        if (this.running) {
            return;
        }
        android.view.Choreographer.getInstance().postFrameCallback(this.impl);
        this.running = true;
    };
    FPSCallback.prototype.stop = function () {
        if (!this.running) {
            return;
        }
        android.view.Choreographer.getInstance().removeFrameCallback(this.impl);
        this.running = false;
    };
    FPSCallback.prototype.handleFrame = function (nanos) {
        if (!this.running) {
            return;
        }
        // divide by 1 000 000 since the parameter is in nanoseconds
        this.onFrame(nanos / 1000000);
        // add the FrameCallback instance again since it is automatically removed from the Choreographer
        android.view.Choreographer.getInstance().postFrameCallback(this.impl);
    };
    return FPSCallback;
}());
exports.FPSCallback = FPSCallback;
