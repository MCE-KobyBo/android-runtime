"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var view_1 = require("../core/view");
var utils_1 = require("../../utils/utils");
var file_system_1 = require("../../file-system");
exports.File = file_system_1.File;
exports.knownFolders = file_system_1.knownFolders;
exports.path = file_system_1.path;
__export(require("../core/view"));
exports.srcProperty = new view_1.Property({ name: "src" });
var WebViewBase = (function (_super) {
    __extends(WebViewBase, _super);
    function WebViewBase() {
        _super.apply(this, arguments);
    }
    WebViewBase.prototype._onLoadFinished = function (url, error) {
        this._suspendLoading = true;
        this._suspendLoading = false;
        var args = {
            eventName: WebViewBase.loadFinishedEvent,
            object: this,
            url: url,
            navigationType: undefined,
            error: error
        };
        this.notify(args);
    };
    WebViewBase.prototype._onLoadStarted = function (url, navigationType) {
        var args = {
            eventName: WebViewBase.loadStartedEvent,
            object: this,
            url: url,
            navigationType: navigationType,
            error: undefined
        };
        this.notify(args);
    };
    Object.defineProperty(WebViewBase.prototype, "canGoBack", {
        get: function () {
            throw new Error("This member is abstract.");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebViewBase.prototype, "canGoForward", {
        get: function () {
            throw new Error("This member is abstract.");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebViewBase.prototype, exports.srcProperty.native, {
        get: function () {
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebViewBase.prototype, exports.srcProperty.native, {
        set: function (src) {
            if (this._suspendLoading) {
                return;
            }
            this.stopLoading();
            if (utils_1.isFileOrResourcePath(src)) {
                if (src.indexOf("~/") === 0) {
                    src = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, src.replace("~/", ""));
                }
                if (file_system_1.File.exists(src)) {
                    var file = file_system_1.File.fromPath(src);
                    var content = file.readTextSync();
                    this._loadFileOrResource(src, content);
                }
            }
            else if (src.toLowerCase().indexOf("http://") === 0 || src.toLowerCase().indexOf("https://") === 0) {
                this._loadHttp(src);
            }
            else {
                this._loadData(src);
            }
        },
        enumerable: true,
        configurable: true
    });
    WebViewBase.loadStartedEvent = "loadStarted";
    WebViewBase.loadFinishedEvent = "loadFinished";
    WebViewBase.navigationTypes = [
        "linkClicked",
        "formSubmitted",
        "backForward",
        "reload",
        "formResubmitted",
        "other"
    ];
    return WebViewBase;
}(view_1.View));
exports.WebViewBase = WebViewBase;
exports.srcProperty.register(WebViewBase);
