"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var view_1 = require("../core/view");
var Placeholder = (function (_super) {
    __extends(Placeholder, _super);
    function Placeholder() {
        _super.apply(this, arguments);
    }
    Placeholder.prototype._createNativeView = function () {
        var args = { eventName: Placeholder.creatingViewEvent, object: this, view: undefined, context: this._context };
        this.notify(args);
        var view = this._android = args.view;
        return view;
    };
    Object.defineProperty(Placeholder.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Placeholder.prototype, "_nativeView", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Placeholder.creatingViewEvent = "creatingView";
    return Placeholder;
}(view_1.View));
exports.Placeholder = Placeholder;
