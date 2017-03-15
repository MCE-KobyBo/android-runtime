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
var frame_1 = require("./frame");
var NativeScriptActivity = (function (_super) {
    __extends(NativeScriptActivity, _super);
    function NativeScriptActivity() {
        _super.call(this);
        return global.__native(this);
    }
    NativeScriptActivity.prototype.onCreate = function (savedInstanceState) {
        // Set isNativeScriptActivity in onCreate.
        // The JS construcotr might not be called beacuse the activity is created from Andoird.
        this.isNativeScriptActivity = true;
        if (!this._callbacks) {
            frame_1.setActivityCallbacks(this);
        }
        this._callbacks.onCreate(this, savedInstanceState, _super.prototype.onCreate);
    };
    NativeScriptActivity.prototype.onSaveInstanceState = function (outState) {
        this._callbacks.onSaveInstanceState(this, outState, _super.prototype.onSaveInstanceState);
    };
    NativeScriptActivity.prototype.onStart = function () {
        this._callbacks.onStart(this, _super.prototype.onStart);
    };
    NativeScriptActivity.prototype.onStop = function () {
        this._callbacks.onStop(this, _super.prototype.onStop);
    };
    NativeScriptActivity.prototype.onDestroy = function () {
        this._callbacks.onDestroy(this, _super.prototype.onDestroy);
    };
    NativeScriptActivity.prototype.onBackPressed = function () {
        this._callbacks.onBackPressed(this, _super.prototype.onBackPressed);
    };
    NativeScriptActivity.prototype.onRequestPermissionsResult = function (requestCode, permissions, grantResults) {
        this._callbacks.onRequestPermissionsResult(this, requestCode, permissions, grantResults, undefined /*TODO: Enable if needed*/);
    };
    NativeScriptActivity.prototype.onActivityResult = function (requestCode, resultCode, data) {
        this._callbacks.onActivityResult(this, requestCode, resultCode, data, _super.prototype.onActivityResult);
    };
    NativeScriptActivity = __decorate([
        JavaProxy("com.tns.NativeScriptActivity")
    ], NativeScriptActivity);
    return NativeScriptActivity;
}(android.app.Activity));
