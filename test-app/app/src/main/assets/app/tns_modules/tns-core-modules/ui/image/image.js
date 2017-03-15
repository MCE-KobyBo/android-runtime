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
var image_common_1 = require("./image-common");
var file_system_1 = require("../../file-system");
__export(require("./image-common"));
var FILE_PREFIX = "file:///";
var ASYNC = "async";
var imageFetcher;
var imageCache;
(function (CacheMode) {
    CacheMode[CacheMode["none"] = 0] = "none";
    CacheMode[CacheMode["memory"] = 1] = "memory";
    CacheMode[CacheMode["diskAndMemory"] = 2] = "diskAndMemory";
})(exports.CacheMode || (exports.CacheMode = {}));
var CacheMode = exports.CacheMode;
function initImageCache(context, mode, memoryCacheSize, diskCacheSize) {
    if (mode === void 0) { mode = CacheMode.diskAndMemory; }
    if (memoryCacheSize === void 0) { memoryCacheSize = 0.25; }
    if (diskCacheSize === void 0) { diskCacheSize = 10 * 1024 * 1024; }
    if (exports.currentCacheMode === mode) {
        return;
    }
    exports.currentCacheMode = mode;
    if (!imageFetcher) {
        imageFetcher = org.nativescript.widgets.image.Fetcher.getInstance(context);
    }
    // Disable cache.
    if (mode === CacheMode.none) {
        if (imageCache != null && imageFetcher != null) {
            imageFetcher.clearCache();
        }
    }
    var params = new org.nativescript.widgets.image.Cache.CacheParams();
    params.memoryCacheEnabled = mode !== CacheMode.none;
    params.setMemCacheSizePercent(memoryCacheSize); // Set memory cache to % of app memory
    params.diskCacheEnabled = mode === CacheMode.diskAndMemory;
    params.diskCacheSize = diskCacheSize;
    imageCache = org.nativescript.widgets.image.Cache.getInstance(params);
    imageFetcher.addImageCache(imageCache);
    imageFetcher.initCache();
}
exports.initImageCache = initImageCache;
var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        _super.apply(this, arguments);
        this.decodeWidth = 0;
        this.decodeHeight = 0;
        this.useCache = true;
    }
    Object.defineProperty(Image.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Image.prototype._createNativeView = function () {
        initializeImageLoadedListener();
        if (!imageFetcher) {
            initImageCache(this._context);
        }
        var imageView = this._android = new org.nativescript.widgets.ImageView(this._context);
        return imageView;
    };
    Image.prototype._createImageSourceFromSrc = function () {
        var imageView = this._android;
        this.imageSource = image_common_1.unsetValue;
        if (!imageView || !this.src) {
            return;
        }
        var value = this.src;
        var async = this.loadMode === ASYNC;
        this._imageLoadedListener = this._imageLoadedListener || new ImageLoadedListener(this);
        if (typeof value === "string") {
            value = value.trim();
            this.isLoading = true;
            if (image_common_1.isDataURI(value)) {
                // TODO: Check with runtime what should we do in case of base64 string.
                _super.prototype._createImageSourceFromSrc.call(this);
            }
            else if (image_common_1.isFileOrResourcePath(value)) {
                if (value.indexOf(image_common_1.RESOURCE_PREFIX) === 0) {
                    imageView.setUri(value, this.decodeWidth, this.decodeHeight, this.useCache, async, this._imageLoadedListener);
                }
                else {
                    var fileName = value;
                    if (fileName.indexOf("~/") === 0) {
                        fileName = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, fileName.replace("~/", ""));
                    }
                    imageView.setUri(FILE_PREFIX + fileName, this.decodeWidth, this.decodeHeight, this.useCache, async, this._imageLoadedListener);
                }
            }
            else {
                // For backwards compatibility http always use async loading.
                imageView.setUri(value, this.decodeWidth, this.decodeHeight, this.useCache, true, this._imageLoadedListener);
            }
        }
        else {
            _super.prototype._createImageSourceFromSrc.call(this);
        }
    };
    Object.defineProperty(Image.prototype, image_common_1.stretchProperty.native, {
        get: function () {
            return "aspectFit";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, image_common_1.stretchProperty.native, {
        set: function (value) {
            switch (value) {
                case "aspectFit":
                    this.android.setScaleType(android.widget.ImageView.ScaleType.FIT_CENTER);
                    break;
                case "aspectFill":
                    this.android.setScaleType(android.widget.ImageView.ScaleType.CENTER_CROP);
                    break;
                case "fill":
                    this.android.setScaleType(android.widget.ImageView.ScaleType.FIT_XY);
                    break;
                case "none":
                default:
                    this.android.setScaleType(android.widget.ImageView.ScaleType.MATRIX);
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, image_common_1.tintColorProperty.native, {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, image_common_1.tintColorProperty.native, {
        set: function (value) {
            if (value === undefined) {
                this._android.clearColorFilter();
            }
            else {
                this._android.setColorFilter(value.android);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, image_common_1.imageSourceProperty.native, {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, image_common_1.imageSourceProperty.native, {
        set: function (value) {
            if (value && value.android) {
                var rotation = value.rotationAngle ? value.rotationAngle : 0;
                this.android.setRotationAngle(rotation);
                this.android.setImageBitmap(value.android);
            }
            else {
                this.android.setRotationAngle(0);
                this.android.setImageBitmap(null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, image_common_1.srcProperty.native, {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Image.prototype, image_common_1.srcProperty.native, {
        set: function (value) {
            this._createImageSourceFromSrc();
        },
        enumerable: true,
        configurable: true
    });
    return Image;
}(image_common_1.ImageBase));
exports.Image = Image;
var ImageLoadedListener;
function initializeImageLoadedListener() {
    if (ImageLoadedListener) {
        return;
    }
    var ImageLoadedListenerImpl = (function (_super) {
        __extends(ImageLoadedListenerImpl, _super);
        function ImageLoadedListenerImpl(owner) {
            _super.call(this);
            this.owner = owner;
            return global.__native(this);
        }
        ImageLoadedListenerImpl.prototype.onImageLoaded = function (success) {
            this.owner.isLoading = false;
        };
        ImageLoadedListenerImpl = __decorate([
            Interfaces([org.nativescript.widgets.image.Worker.OnImageLoadedListener])
        ], ImageLoadedListenerImpl);
        return ImageLoadedListenerImpl;
    }(java.lang.Object));
    ImageLoadedListener = ImageLoadedListenerImpl;
}
