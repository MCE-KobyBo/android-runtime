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
var content_view_1 = require("../content-view");
var Border = (function (_super) {
    __extends(Border, _super);
    function Border() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Border.prototype, "cornerRadius", {
        get: function () {
            if (typeof this.borderRadius === "number") {
                return this.borderRadius;
            }
            return 0;
        },
        set: function (value) {
            this.borderRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Border.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = content_view_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = content_view_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = content_view_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = content_view_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var horizontalBorderLength = this.effectiveBorderLeftWidth + this.effectiveBorderRightWidth;
        var verticalBorderLength = this.effectiveBorderTopWidth + this.effectiveBorderBottomWidth;
        var result = content_view_1.View.measureChild(this, this.layoutView, content_view_1.layout.makeMeasureSpec(width - horizontalBorderLength, widthMode), content_view_1.layout.makeMeasureSpec(height - verticalBorderLength, heightMode));
        var widthAndState = content_view_1.View.resolveSizeAndState(result.measuredWidth + horizontalBorderLength, width, widthMode, 0);
        var heightAndState = content_view_1.View.resolveSizeAndState(result.measuredHeight + verticalBorderLength, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Border.prototype.onLayout = function (left, top, right, bottom) {
        var horizontalBorderLength = this.effectiveBorderLeftWidth + this.effectiveBorderRightWidth;
        var verticalBorderLength = this.effectiveBorderTopWidth + this.effectiveBorderBottomWidth;
        content_view_1.View.layoutChild(this, this.layoutView, this.effectiveBorderLeftWidth, this.effectiveBorderTopWidth, right - left - horizontalBorderLength, bottom - top - verticalBorderLength);
    };
    Border = __decorate([
        Deprecated
    ], Border);
    return Border;
}(content_view_1.ContentView));
exports.Border = Border;
