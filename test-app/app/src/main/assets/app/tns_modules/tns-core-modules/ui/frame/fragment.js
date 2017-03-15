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
var FragmentClass = (function (_super) {
    __extends(FragmentClass, _super);
    function FragmentClass() {
        _super.call(this);
        return global.__native(this);
    }
    FragmentClass.prototype.onHiddenChanged = function (hidden) {
        this._callbacks.onHiddenChanged(this, hidden, _super.prototype.onHiddenChanged);
    };
    FragmentClass.prototype.onCreateAnimator = function (transit, enter, nextAnim) {
        var result = this._callbacks.onCreateAnimator(this, transit, enter, nextAnim, _super.prototype.onCreateAnimator);
        return result;
    };
    FragmentClass.prototype.onCreate = function (savedInstanceState) {
        if (!this._callbacks) {
            frame_1.setFragmentCallbacks(this);
        }
        this.setHasOptionsMenu(true);
        this._callbacks.onCreate(this, savedInstanceState, _super.prototype.onCreate);
    };
    FragmentClass.prototype.onCreateView = function (inflater, container, savedInstanceState) {
        var result = this._callbacks.onCreateView(this, inflater, container, savedInstanceState, _super.prototype.onCreateView);
        return result;
    };
    FragmentClass.prototype.onSaveInstanceState = function (outState) {
        this._callbacks.onSaveInstanceState(this, outState, _super.prototype.onSaveInstanceState);
    };
    FragmentClass.prototype.onDestroyView = function () {
        this._callbacks.onDestroyView(this, _super.prototype.onDestroyView);
    };
    FragmentClass.prototype.onDestroy = function () {
        this._callbacks.onDestroy(this, _super.prototype.onDestroy);
    };
    FragmentClass.prototype.toString = function () {
        return this._callbacks.toStringOverride(this, _super.prototype.toString);
    };
    FragmentClass = __decorate([
        JavaProxy("com.tns.FragmentClass")
    ], FragmentClass);
    return FragmentClass;
}(android.app.Fragment));
frame_1.setFragmentClass(FragmentClass);
