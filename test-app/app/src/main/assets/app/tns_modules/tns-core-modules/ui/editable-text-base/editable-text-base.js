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
var editable_text_base_common_1 = require("./editable-text-base-common");
var utils_1 = require("../../utils/utils");
__export(require("./editable-text-base-common"));
//https://github.com/NativeScript/NativeScript/issues/2942
var dismissKeyboardTimeoutId;
var EditTextListeners;
function initializeEditTextListeners() {
    if (EditTextListeners) {
        return;
    }
    var EditTextListenersImpl = (function (_super) {
        __extends(EditTextListenersImpl, _super);
        function EditTextListenersImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        EditTextListenersImpl.prototype.beforeTextChanged = function (text, start, count, after) {
            //
        };
        EditTextListenersImpl.prototype.onTextChanged = function (text, start, before, count) {
            // const owner = this.owner;
            // let selectionStart = owner.android.getSelectionStart();
            // owner.android.removeTextChangedListener(owner._editTextListeners);
            // owner.android.addTextChangedListener(owner._editTextListeners);
            // owner.android.setSelection(selectionStart);
        };
        EditTextListenersImpl.prototype.afterTextChanged = function (editable) {
            var owner = this.owner;
            switch (owner.updateTextTrigger) {
                case "focusLost":
                    owner._dirtyTextAccumulator = editable.toString();
                    break;
                case "textChanged":
                    editable_text_base_common_1.textProperty.nativeValueChange(owner, editable.toString());
                    break;
                default:
                    throw new Error("Invalid updateTextTrigger: " + owner.updateTextTrigger);
            }
        };
        EditTextListenersImpl.prototype.onFocusChange = function (view, hasFocus) {
            var owner = this.owner;
            if (hasFocus) {
                if (dismissKeyboardTimeoutId) {
                    // https://github.com/NativeScript/NativeScript/issues/2942
                    // Don't hide the keyboard since another (or the same) EditText has gained focus.
                    clearTimeout(dismissKeyboardTimeoutId);
                    dismissKeyboardTimeoutId = undefined;
                }
            }
            else {
                if (owner._dirtyTextAccumulator) {
                    editable_text_base_common_1.textProperty.nativeValueChange(owner, owner._dirtyTextAccumulator);
                    owner._dirtyTextAccumulator = undefined;
                }
                dismissKeyboardTimeoutId = setTimeout(function () {
                    // https://github.com/NativeScript/NativeScript/issues/2942
                    // Dismiss the keyboard if focus goes to something different from EditText.
                    owner.dismissSoftInput();
                    dismissKeyboardTimeoutId = null;
                }, 1);
            }
        };
        EditTextListenersImpl.prototype.onEditorAction = function (textView, actionId, event) {
            var owner = this.owner;
            if (actionId === android.view.inputmethod.EditorInfo.IME_ACTION_DONE ||
                actionId === android.view.inputmethod.EditorInfo.IME_ACTION_GO ||
                actionId === android.view.inputmethod.EditorInfo.IME_ACTION_SEARCH ||
                actionId === android.view.inputmethod.EditorInfo.IME_ACTION_SEND ||
                (event && event.getKeyCode() === android.view.KeyEvent.KEYCODE_ENTER)) {
                // If it is TextField, close the keyboard. If it is TextView, do not close it since the TextView is multiline
                // https://github.com/NativeScript/NativeScript/issues/3111
                if (textView.getMaxLines() === 1) {
                    owner.dismissSoftInput();
                }
                owner._onReturnPress();
            }
            // If action is ACTION_NEXT then do not close keyboard
            if (actionId === android.view.inputmethod.EditorInfo.IME_ACTION_NEXT) {
                owner._onReturnPress();
            }
            return false;
        };
        EditTextListenersImpl = __decorate([
            Interfaces([android.text.TextWatcher, android.view.View.OnFocusChangeListener, android.widget.TextView.OnEditorActionListener])
        ], EditTextListenersImpl);
        return EditTextListenersImpl;
    }(java.lang.Object));
    EditTextListeners = EditTextListenersImpl;
}
var EditableTextBase = (function (_super) {
    __extends(EditableTextBase, _super);
    function EditableTextBase() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(EditableTextBase.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    EditableTextBase.prototype._createNativeView = function () {
        initializeEditTextListeners();
        var editText = this._android = new android.widget.EditText(this._context);
        this._configureEditText();
        this._keyListenerCache = editText.getKeyListener();
        this._editTextListeners = this._editTextListeners || new EditTextListeners(this);
        editText.addTextChangedListener(this._editTextListeners);
        editText.setOnFocusChangeListener(this._editTextListeners);
        editText.setOnEditorActionListener(this._editTextListeners);
        return editText;
    };
    EditableTextBase.prototype._resetNativeView = function (force) {
        if (this._android) {
            this._android.setOnFocusChangeListener(null);
            this._android.setOnEditorActionListener(null);
            if (this._editTextListeners) {
                this._android.removeTextChangedListener(this._editTextListeners);
            }
        }
        _super.prototype._resetNativeView.call(this);
    };
    EditableTextBase.prototype._disposeNativeView = function (force) {
        this._android = undefined;
        _super.prototype._disposeNativeView.call(this);
    };
    EditableTextBase.prototype.dismissSoftInput = function () {
        utils_1.ad.dismissSoftInput(this._android);
    };
    EditableTextBase.prototype.focus = function () {
        var result = _super.prototype.focus.call(this);
        if (result) {
            utils_1.ad.showSoftInput(this._android);
        }
        return result;
    };
    EditableTextBase.prototype._setInputType = function (inputType) {
        var nativeView = this._android;
        nativeView.setInputType(inputType);
        // setInputType will change the keyListener so we should cache it again
        var listener = nativeView.getKeyListener();
        if (listener) {
            this._keyListenerCache = listener;
        }
        // clear the listener if editable is false
        if (!this.editable) {
            nativeView.setKeyListener(null);
        }
    };
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.textProperty.native, {
        get: function () {
            return this._android.getText();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.textProperty.native, {
        set: function (value) {
            var text = (value === null || value === undefined) ? '' : value.toString();
            this._android.setText(text, android.widget.TextView.BufferType.EDITABLE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.keyboardTypeProperty.native, {
        get: function () {
            var inputType = this._android.getInputType();
            switch (inputType) {
                case android.text.InputType.TYPE_CLASS_DATETIME | android.text.InputType.TYPE_DATETIME_VARIATION_NORMAL:
                    return "datetime";
                case android.text.InputType.TYPE_CLASS_PHONE:
                    return "phone";
                case android.text.InputType.TYPE_CLASS_NUMBER | android.text.InputType.TYPE_NUMBER_VARIATION_NORMAL | android.text.InputType.TYPE_NUMBER_FLAG_SIGNED | android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL:
                    return "number";
                case android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_URI:
                    return "url";
                case android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS:
                    return "email";
                default:
                    return inputType.toString();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.keyboardTypeProperty.native, {
        set: function (value) {
            var newInputType;
            switch (value) {
                case "datetime":
                    newInputType = android.text.InputType.TYPE_CLASS_DATETIME | android.text.InputType.TYPE_DATETIME_VARIATION_NORMAL;
                    break;
                case "phone":
                    newInputType = android.text.InputType.TYPE_CLASS_PHONE;
                    break;
                case "number":
                    newInputType = android.text.InputType.TYPE_CLASS_NUMBER | android.text.InputType.TYPE_NUMBER_VARIATION_NORMAL | android.text.InputType.TYPE_NUMBER_FLAG_SIGNED | android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL;
                    break;
                case "url":
                    newInputType = android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_URI;
                    break;
                case "email":
                    newInputType = android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS;
                    break;
                default:
                    var inputType = +value;
                    if (!isNaN(inputType)) {
                        newInputType = inputType;
                    }
                    else {
                        newInputType = android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_NORMAL;
                    }
                    break;
            }
            this._setInputType(newInputType);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.returnKeyTypeProperty.native, {
        get: function () {
            var ime = this._android.getImeOptions();
            switch (ime) {
                case android.view.inputmethod.EditorInfo.IME_ACTION_DONE:
                    return "done";
                case android.view.inputmethod.EditorInfo.IME_ACTION_GO:
                    return "go";
                case android.view.inputmethod.EditorInfo.IME_ACTION_NEXT:
                    return "next";
                case android.view.inputmethod.EditorInfo.IME_ACTION_SEARCH:
                    return "search";
                case android.view.inputmethod.EditorInfo.IME_ACTION_SEND:
                    return "send";
                default:
                    return ime.toString();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.returnKeyTypeProperty.native, {
        set: function (value) {
            var newImeOptions;
            switch (value) {
                case "done":
                    newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_DONE;
                    break;
                case "go":
                    newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_GO;
                    break;
                case "next":
                    newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_NEXT;
                    break;
                case "search":
                    newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_SEARCH;
                    break;
                case "send":
                    newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_SEND;
                    break;
                default:
                    var ime = +value;
                    if (!isNaN(ime)) {
                        newImeOptions = ime;
                    }
                    else {
                        newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_UNSPECIFIED;
                    }
                    break;
            }
            this._android.setImeOptions(newImeOptions);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.editableProperty.native, {
        get: function () {
            return !!this._android.getKeyListener();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.editableProperty.native, {
        set: function (value) {
            if (value) {
                this._android.setKeyListener(this._keyListenerCache);
            }
            else {
                this._android.setKeyListener(null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.autocapitalizationTypeProperty.native, {
        get: function () {
            var inputType = this._android.getInputType();
            if ((inputType & android.text.InputType.TYPE_TEXT_FLAG_CAP_WORDS) === android.text.InputType.TYPE_TEXT_FLAG_CAP_WORDS) {
                return "words";
            }
            else if ((inputType & android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES) === android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES) {
                return "sentences";
            }
            else if ((inputType & android.text.InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS) === android.text.InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS) {
                return "allCharacters";
            }
            else {
                return inputType.toString();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.autocapitalizationTypeProperty.native, {
        set: function (value) {
            var inputType = this._android.getInputType();
            inputType = inputType & ~28672; //28672 (0x00070000) 13,14,15bits (111 0000 0000 0000)
            switch (value) {
                case "none":
                    //Do nothing, we have lowered the three bits above.
                    break;
                case "words":
                    inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_CAP_WORDS; //8192 (0x00020000) 14th bit
                    break;
                case "sentences":
                    inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES; //16384(0x00040000) 15th bit
                    break;
                case "allCharacters":
                    inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS; //4096 (0x00010000) 13th bit
                    break;
                default:
                    var number = +value;
                    // We set the default value.
                    if (!isNaN(number)) {
                        inputType = number;
                    }
                    else {
                        inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES;
                    }
                    break;
            }
            this._setInputType(inputType);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.autocorrectProperty.native, {
        get: function () {
            var autocorrect = this._android.getInputType();
            if ((autocorrect & android.text.InputType.TYPE_TEXT_FLAG_AUTO_CORRECT) === android.text.InputType.TYPE_TEXT_FLAG_AUTO_CORRECT) {
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.autocorrectProperty.native, {
        set: function (value) {
            var inputType = this._android.getInputType();
            switch (value) {
                case true:
                    inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_AUTO_COMPLETE;
                    inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_AUTO_CORRECT;
                    inputType = inputType & ~android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS;
                    break;
                case false:
                    inputType = inputType & ~android.text.InputType.TYPE_TEXT_FLAG_AUTO_COMPLETE;
                    inputType = inputType & ~android.text.InputType.TYPE_TEXT_FLAG_AUTO_CORRECT;
                    inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS;
                    break;
                default:
                    // We can't do anything.
                    break;
            }
            this._setInputType(inputType);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.hintProperty.native, {
        get: function () {
            return this._android.getHint();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.hintProperty.native, {
        set: function (value) {
            this._android.setHint(value + '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.placeholderColorProperty.native, {
        get: function () {
            return this._android.getHintTextColors();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableTextBase.prototype, editable_text_base_common_1.placeholderColorProperty.native, {
        set: function (value) {
            if (value instanceof editable_text_base_common_1.Color) {
                this._android.setHintTextColor(value.android);
            }
            else {
                this._android.setHintTextColor(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    return EditableTextBase;
}(editable_text_base_common_1.EditableTextBase));
exports.EditableTextBase = EditableTextBase;
