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
var font_1 = require("../styling/font");
var search_bar_common_1 = require("./search-bar-common");
var utils_1 = require("../../utils/utils");
__export(require("./search-bar-common"));
var SEARCHTEXT = Symbol("searchText");
var QUERY = Symbol("query");
var QueryTextListener;
var CloseListener;
function initializeNativeClasses() {
    if (QueryTextListener) {
        return;
    }
    var QueryTextListenerImpl = (function (_super) {
        __extends(QueryTextListenerImpl, _super);
        function QueryTextListenerImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        QueryTextListenerImpl.prototype.onQueryTextChange = function (newText) {
            var owner = this.owner;
            search_bar_common_1.textProperty.nativeValueChange(owner, newText);
            // This code is needed since sometimes OnCloseListener is not called!
            if (newText === "" && this[SEARCHTEXT] !== newText) {
                owner._emit(search_bar_common_1.SearchBarBase.clearEvent);
            }
            this[SEARCHTEXT] = newText;
            return true;
        };
        QueryTextListenerImpl.prototype.onQueryTextSubmit = function (query) {
            var owner = this.owner;
            // This code is needed since onQueryTextSubmit is called twice with same query!
            if (query !== "" && this[QUERY] !== query) {
                owner._emit(search_bar_common_1.SearchBarBase.submitEvent);
            }
            this[QUERY] = query;
            return true;
        };
        QueryTextListenerImpl = __decorate([
            Interfaces([android.widget.SearchView.OnQueryTextListener])
        ], QueryTextListenerImpl);
        return QueryTextListenerImpl;
    }(java.lang.Object));
    var CloseListenerImpl = (function (_super) {
        __extends(CloseListenerImpl, _super);
        function CloseListenerImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        CloseListenerImpl.prototype.onClose = function () {
            this.owner._emit(search_bar_common_1.SearchBarBase.clearEvent);
            return true;
        };
        CloseListenerImpl = __decorate([
            Interfaces([android.widget.SearchView.OnCloseListener])
        ], CloseListenerImpl);
        return CloseListenerImpl;
    }(java.lang.Object));
    QueryTextListener = QueryTextListenerImpl;
    CloseListener = CloseListenerImpl;
}
var SearchBar = (function (_super) {
    __extends(SearchBar, _super);
    function SearchBar() {
        _super.apply(this, arguments);
    }
    SearchBar.prototype.dismissSoftInput = function () {
        utils_1.ad.dismissSoftInput(this._nativeView);
    };
    SearchBar.prototype.focus = function () {
        var result = _super.prototype.focus.call(this);
        if (result) {
            utils_1.ad.showSoftInput(this._nativeView);
        }
        return result;
    };
    SearchBar.prototype._createNativeView = function () {
        initializeNativeClasses();
        this._android = new android.widget.SearchView(this._context);
        this._android.setIconified(false);
        this._queryTextListener = this._queryTextListener || new QueryTextListener(this);
        this._android.setOnQueryTextListener(this._queryTextListener);
        this._closeListener = this._closeListener || new CloseListener(this);
        this._android.setOnCloseListener(this._closeListener);
        return this._android;
    };
    Object.defineProperty(SearchBar.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.backgroundColorProperty.native, {
        get: function () {
            // TODO: Why do we get DrawingCacheBackgroundColor but set backgroundColor?????
            var result = this._android.getDrawingCacheBackgroundColor();
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.backgroundColorProperty.native, {
        set: function (value) {
            var color;
            if (typeof value === "number") {
                color = value;
            }
            else {
                color = value.android;
            }
            this._android.setBackgroundColor(color);
            var searchPlate = this._getSearchPlate();
            searchPlate.setBackgroundColor(color);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.colorProperty.native, {
        get: function () {
            var textView = this._getTextView();
            return textView.getCurrentTextColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.colorProperty.native, {
        set: function (value) {
            var color;
            if (typeof value === "number") {
                color = value;
            }
            else {
                color = value.android;
            }
            var textView = this._getTextView();
            textView.setTextColor(color);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.fontSizeProperty.native, {
        get: function () {
            return { nativeSize: this._getTextView().getTextSize() };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.fontSizeProperty.native, {
        set: function (value) {
            if (typeof value === "number") {
                this._getTextView().setTextSize(value);
            }
            else {
                this._getTextView().setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.fontInternalProperty.native, {
        get: function () {
            return this._getTextView().getTypeface();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.fontInternalProperty.native, {
        set: function (value) {
            this._getTextView().setTypeface(value instanceof font_1.Font ? value.getAndroidTypeface() : value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.backgroundInternalProperty.native, {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.backgroundInternalProperty.native, {
        set: function (value) {
            //
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.textProperty.native, {
        get: function () {
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.textProperty.native, {
        set: function (value) {
            var text = (value === null || value === undefined) ? '' : value.toString();
            this._android.setQuery(text, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.hintProperty.native, {
        get: function () {
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.hintProperty.native, {
        set: function (value) {
            var text = (value === null || value === undefined) ? '' : value.toString();
            this._android.setQueryHint(text);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.textFieldBackgroundColorProperty.native, {
        get: function () {
            var textView = this._getTextView();
            return textView.getCurrentTextColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.textFieldBackgroundColorProperty.native, {
        set: function (value) {
            var textView = this._getTextView();
            var color = value instanceof search_bar_common_1.Color ? value.android : value;
            textView.setBackgroundColor(color);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.textFieldHintColorProperty.native, {
        get: function () {
            var textView = this._getTextView();
            return textView.getCurrentTextColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, search_bar_common_1.textFieldHintColorProperty.native, {
        set: function (value) {
            var textView = this._getTextView();
            var color = value instanceof search_bar_common_1.Color ? value.android : value;
            textView.setHintTextColor(color);
        },
        enumerable: true,
        configurable: true
    });
    SearchBar.prototype._getTextView = function () {
        var id = this._android.getContext().getResources().getIdentifier("android:id/search_src_text", null, null);
        return this._android.findViewById(id);
    };
    SearchBar.prototype._getSearchPlate = function () {
        var id = this._android.getContext().getResources().getIdentifier("android:id/search_plate", null, null);
        return this._android.findViewById(id);
    };
    return SearchBar;
}(search_bar_common_1.SearchBarBase));
exports.SearchBar = SearchBar;
