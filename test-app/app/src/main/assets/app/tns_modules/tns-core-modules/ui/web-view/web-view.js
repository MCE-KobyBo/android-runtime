"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var web_view_common_1 = require("./web-view-common");
__export(require("./web-view-common"));
var WebViewClient;
function initializeWebViewClient() {
    if (WebViewClient) {
        return;
    }
    var WebViewClientImpl = (function (_super) {
        __extends(WebViewClientImpl, _super);
        function WebViewClientImpl(view) {
            _super.call(this);
            this._view = view;
            return global.__native(this);
        }
        WebViewClientImpl.prototype.shouldOverrideUrlLoading = function (view, url) {
            if (web_view_common_1.traceEnabled()) {
                web_view_common_1.traceWrite("WebViewClientClass.shouldOverrideUrlLoading(" + url + ")", web_view_common_1.traceCategories.Debug);
            }
            return false;
        };
        WebViewClientImpl.prototype.onPageStarted = function (view, url, favicon) {
            _super.prototype.onPageStarted.call(this, view, url, favicon);
            if (this._view) {
                if (web_view_common_1.traceEnabled()) {
                    web_view_common_1.traceWrite("WebViewClientClass.onPageStarted(" + url + ", " + favicon + ")", web_view_common_1.traceCategories.Debug);
                }
                this._view._onLoadStarted(url, web_view_common_1.WebViewBase.navigationTypes[web_view_common_1.WebViewBase.navigationTypes.indexOf("linkClicked")]);
            }
        };
        WebViewClientImpl.prototype.onPageFinished = function (view, url) {
            _super.prototype.onPageFinished.call(this, view, url);
            if (this._view) {
                if (web_view_common_1.traceEnabled()) {
                    web_view_common_1.traceWrite("WebViewClientClass.onPageFinished(" + url + ")", web_view_common_1.traceCategories.Debug);
                }
                this._view._onLoadFinished(url, undefined);
            }
        };
        WebViewClientImpl.prototype.onReceivedError = function () {
            var view = arguments[0];
            if (arguments.length === 4) {
                var errorCode = arguments[1];
                var description = arguments[2];
                var failingUrl = arguments[3];
                _super.prototype.onReceivedError.call(this, view, errorCode, description, failingUrl);
                if (this._view) {
                    if (web_view_common_1.traceEnabled()) {
                        web_view_common_1.traceWrite("WebViewClientClass.onReceivedError(" + errorCode + ", " + description + ", " + failingUrl + ")", web_view_common_1.traceCategories.Debug);
                    }
                    this._view._onLoadFinished(failingUrl, description + "(" + errorCode + ")");
                }
            }
            else {
                var request = arguments[1];
                var error = arguments[2];
                _super.prototype.onReceivedError.call(this, view, request, error);
                if (this._view) {
                    if (web_view_common_1.traceEnabled()) {
                        web_view_common_1.traceWrite("WebViewClientClass.onReceivedError(" + error.getErrorCode() + ", " + error.getDescription() + ", " + (error.getUrl && error.getUrl()) + ")", web_view_common_1.traceCategories.Debug);
                    }
                    this._view._onLoadFinished(error.getUrl && error.getUrl(), error.getDescription() + "(" + error.getErrorCode() + ")");
                }
            }
        };
        return WebViewClientImpl;
    }(android.webkit.WebViewClient));
    ;
    WebViewClient = WebViewClientImpl;
}
var WebView = (function (_super) {
    __extends(WebView, _super);
    function WebView() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(WebView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype._createNativeView = function () {
        initializeWebViewClient();
        this._webViewClient = new WebViewClient(this);
        this._android = new android.webkit.WebView(this._context);
        this._android.getSettings().setJavaScriptEnabled(true);
        this._android.getSettings().setBuiltInZoomControls(true);
        this._android.setWebViewClient(this._webViewClient);
        return this._android;
    };
    WebView.prototype._resetNativeView = function () {
        if (this.android) {
            this.android.destroy();
        }
        _super.prototype._resetNativeView.call(this);
    };
    WebView.prototype._loadUrl = function (url) {
        if (!this._android) {
            return;
        }
        if (web_view_common_1.traceEnabled()) {
            web_view_common_1.traceWrite("WebView._loadUrl(" + url + ")", web_view_common_1.traceCategories.Debug);
        }
        this._android.stopLoading();
        this._android.loadUrl(url);
    };
    WebView.prototype._loadFileOrResource = function (path, content) {
        if (!this._android) {
            return;
        }
        var baseUrl = "file:///" + path.substring(0, path.lastIndexOf('/') + 1);
        this._android.loadDataWithBaseURL(baseUrl, content, "text/html", "utf-8", null);
    };
    WebView.prototype._loadHttp = function (src) {
        if (!this._android) {
            return;
        }
        this._android.loadUrl(src);
    };
    WebView.prototype._loadData = function (src) {
        if (!this._android) {
            return;
        }
        var baseUrl = "file:///" + web_view_common_1.knownFolders.currentApp().path + "/";
        this._android.loadDataWithBaseURL(baseUrl, src, "text/html", "utf-8", null);
    };
    Object.defineProperty(WebView.prototype, "canGoBack", {
        get: function () {
            return this._android.canGoBack();
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype.stopLoading = function () {
        if (this._android) {
            this._android.stopLoading();
        }
    };
    Object.defineProperty(WebView.prototype, "canGoForward", {
        get: function () {
            return this._android.canGoForward();
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype.goBack = function () {
        this._android.goBack();
    };
    WebView.prototype.goForward = function () {
        this._android.goForward();
    };
    WebView.prototype.reload = function () {
        this._android.reload();
    };
    return WebView;
}(web_view_common_1.WebViewBase));
exports.WebView = WebView;
