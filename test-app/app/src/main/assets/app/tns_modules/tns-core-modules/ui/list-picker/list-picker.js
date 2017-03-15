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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var list_picker_common_1 = require("./list-picker-common");
__export(require("./list-picker-common"));
var Formatter;
var ValueChangeListener;
function initializeNativeClasses() {
    if (Formatter) {
        return;
    }
    var FormatterImpl = (function (_super) {
        __extends(FormatterImpl, _super);
        function FormatterImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        FormatterImpl.prototype.format = function (index) {
            return this.owner._getItemAsString(index);
        };
        FormatterImpl = __decorate([
            Interfaces([android.widget.NumberPicker.Formatter])
        ], FormatterImpl);
        return FormatterImpl;
    }(java.lang.Object));
    var ValueChangeListenerImpl = (function (_super) {
        __extends(ValueChangeListenerImpl, _super);
        function ValueChangeListenerImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        ValueChangeListenerImpl.prototype.onValueChange = function (picker, oldValue, newValue) {
            list_picker_common_1.selectedIndexProperty.nativeValueChange(this.owner, newValue);
        };
        ValueChangeListenerImpl = __decorate([
            Interfaces([android.widget.NumberPicker.OnValueChangeListener])
        ], ValueChangeListenerImpl);
        return ValueChangeListenerImpl;
    }(java.lang.Object));
    Formatter = FormatterImpl;
    ValueChangeListener = ValueChangeListenerImpl;
}
function getEditText(picker) {
    for (var i = 0, count = picker.getChildCount(); i < count; i++) {
        var child = picker.getChildAt(i);
        if (child instanceof android.widget.EditText) {
            return child;
        }
    }
    return null;
}
var selectorWheelPaintField;
function getSelectorWheelPaint(picker) {
    if (!selectorWheelPaintField) {
        selectorWheelPaintField = picker.getClass().getDeclaredField("mSelectorWheelPaint");
        selectorWheelPaintField.setAccessible(true);
    }
    return selectorWheelPaintField.get(picker);
}
var ListPicker = (function (_super) {
    __extends(ListPicker, _super);
    function ListPicker() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ListPicker.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    ListPicker.prototype._createNativeView = function () {
        initializeNativeClasses();
        var picker = this._android = new android.widget.NumberPicker(this._context);
        var editText = getEditText(this._android);
        this._editText = editText;
        this._selectorWheelPaint = getSelectorWheelPaint(picker);
        picker.setDescendantFocusability(android.widget.NumberPicker.FOCUS_BLOCK_DESCENDANTS);
        picker.setMinValue(0);
        picker.setMaxValue(0);
        picker.setValue(0);
        this._formatter = this._formatter || new Formatter(this);
        picker.setFormatter(this._formatter);
        this._valueChangedListener = this._valueChangedListener || new ValueChangeListener(this);
        picker.setOnValueChangedListener(this._valueChangedListener);
        if (editText) {
            //Fix the disappearing selected item.
            //HACK: http://stackoverflow.com/questions/17708325/android-numberpicker-with-formatter-does-not-format-on-first-rendering/26797732
            editText.setFilters([]);
            //Since the Android NumberPicker has to always have at least one item, i.e. minValue=maxValue=value=0, we don't want this zero showing up when this.items is empty.
            editText.setText(" ", android.widget.TextView.BufferType.NORMAL);
        }
        picker.setWrapSelectorWheel(false);
        return picker;
    };
    ListPicker.prototype._fixNumberPickerRendering = function () {
        //HACK: Force the stubborn NumberPicker to render correctly when we have 0 or 1 items.
        this._android.setFormatter(null);
        this._android.setFormatter(this._formatter); //Force the NumberPicker to call our Formatter 
        if (this._editText) {
            this._editText.setFilters([]);
            this._editText.invalidate(); //Force the EditText to redraw
        }
        this._android.invalidate();
    };
    Object.defineProperty(ListPicker.prototype, list_picker_common_1.selectedIndexProperty.native, {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListPicker.prototype, list_picker_common_1.selectedIndexProperty.native, {
        set: function (value) {
            if (value >= 0) {
                this.android.setValue(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListPicker.prototype, list_picker_common_1.itemsProperty.native, {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListPicker.prototype, list_picker_common_1.itemsProperty.native, {
        set: function (value) {
            var maxValue = value && value.length > 0 ? value.length - 1 : 0;
            this.android.setMaxValue(maxValue);
            this._fixNumberPickerRendering();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListPicker.prototype, list_picker_common_1.colorProperty.native, {
        get: function () {
            return {
                wheelColor: this._selectorWheelPaint.getColor(),
                textColor: this._editText ? this._editText.getTextColors().getDefaultColor() : -1
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListPicker.prototype, list_picker_common_1.colorProperty.native, {
        set: function (value) {
            var color;
            var wheelColor;
            if (value instanceof list_picker_common_1.Color) {
                color = wheelColor = value.android;
            }
            else {
                color = value.textColor;
                wheelColor = value.wheelColor;
            }
            this._selectorWheelPaint.setColor(wheelColor);
            if (this._editText) {
                this._editText.setTextColor(color);
            }
        },
        enumerable: true,
        configurable: true
    });
    return ListPicker;
}(list_picker_common_1.ListPickerBase));
exports.ListPicker = ListPicker;
