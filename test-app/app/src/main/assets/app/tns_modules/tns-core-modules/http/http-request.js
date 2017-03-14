var types = require("utils/types");
var http = require("http");
var requestIdCounter = 0;
var pendingRequests = {};
var utils;

function getTimeStamp() {
    var d = new Date();
    return Math.round(d.getTime() / 1000);
}

function ensureUtils() {
    if (!utils) {
        utils = require("utils/utils");
    }
}
var imageSource;
function ensureImageSource() {
    if (!imageSource) {
        imageSource = require("image-source");
    }
}
var platform;
function ensurePlatform() {
    if (!platform) {
        platform = require("platform");
    }
}
var completeCallback;
function ensureCompleteCallback() {
    if (completeCallback) {
        return;
    }
    completeCallback = new org.nativescript.widgets.Async.CompleteCallback({
        onComplete: function (result, context) {
            onRequestComplete(context, result);
        }
    });
}
function onRequestComplete(requestId, result) {
    var callbacks = pendingRequests[requestId];
    delete pendingRequests[requestId];
    if (result.error) {
        callbacks.rejectCallback(new Error(result.error.toString()));
        return;
    }
    var headers = {};
    if (result.headers) {
        var jHeaders = result.headers;
        var length = jHeaders.size();
        var i;
        var pair;
        for (i = 0; i < length; i++) {
            pair = jHeaders.get(i);
            http.addHeader(headers, pair.key, pair.value);
        }
    }

    if (__inspector && __inspector.isConnected) {
        var responseHeaders = {};
        var len = result.headers ? result.headers.size() : 0;
        for (var i = 0; i < len; i++) {
            var kvp = result.headers.get(i);
            responseHeaders[kvp.key] = kvp.value;
        }
        var type = "Document"
        // TODO: FIX ME!
        let hasTextContent = true;
        if (leUrl.indexOf("image") != -1) {
            hasTextContent = false;
            type = "Image"
        }
        var responseObj = {
            url: leUrl,
            status: result.statusCode,
            // TODO: Hard coded type
            statusText: "OK",
            headers: responseHeaders,
            mimeType: "Document",
            fromDiskCache: false
        }
        var responseReceivedObj = {
            requestId: requestId,
            // TODO: Hard coded type
            type: type,
            response: responseObj,
            timeStamp: getTimeStamp()
        }

        __inspector.responseReceived(responseReceivedObj);
        __inspector.loadingFinished({ requestId: requestId, timeStamp: getTimeStamp() });

        var responseData;
        if (!hasTextContent) {
            var bitmap = result.responseAsImage;
            if (bitmap) {
                var outputStream = new java.io.ByteArrayOutputStream();
                bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, outputStream);

                var base64Image = android.util.Base64.encodeToString(outputStream.toByteArray(), android.util.Base64.DEFAULT);
                responseData = base64Image
            }
        } else {
            responseData = result.responseAsString;
        }

        __inspector.dataForRequestId({ requestId: requestId, data: responseData, hasTextContent: hasTextContent });
    }

    callbacks.resolveCallback({
        content: {
            raw: result.raw,
            toString: function (encoding) {
                var str;
                if (encoding) {
                    str = decodeResponse(result.raw, encoding);
                }
                else {
                    str = result.responseAsString;
                }
                if (types.isString(str)) {
                    return str;
                }
                else {
                    throw new Error("Response content may not be converted to string");
                }
            },
            toJSON: function (encoding) {
                ensureUtils();
                var str;
                if (encoding) {
                    str = decodeResponse(result.raw, encoding);
                }
                else {
                    str = result.responseAsString;
                }
                return utils.parseJSON(str);
            },
            toImage: function () {
                ensureImageSource();
                return new Promise(function (resolveImage, rejectImage) {
                    if (result.responseAsImage != null) {
                        resolveImage(imageSource.fromNativeSource(result.responseAsImage));
                    }
                    else {
                        rejectImage(new Error("Response content may not be converted to an Image"));
                    }
                });
            },
            toFile: function (destinationFilePath) {
                var fs = require("file-system");
                var fileName = callbacks.url;
                if (!destinationFilePath) {
                    destinationFilePath = fs.path.join(fs.knownFolders.documents().path, fileName.substring(fileName.lastIndexOf('/') + 1));
                }
                var stream;
                try {
                    var javaFile = new java.io.File(destinationFilePath);
                    stream = new java.io.FileOutputStream(javaFile);
                    stream.write(result.raw.toByteArray());
                    return fs.File.fromPath(destinationFilePath);
                }
                catch (exception) {
                    throw new Error("Cannot save file with path: " + destinationFilePath + ".");
                }
                finally {
                    if (stream) {
                        stream.close();
                    }
                }
            }
        },
        statusCode: result.statusCode,
        headers: headers
    });
}
function buildJavaOptions(options) {
    if (!types.isString(options.url)) {
        throw new Error("Http request must provide a valid url.");
    }
    var javaOptions = new org.nativescript.widgets.Async.Http.RequestOptions();
    javaOptions.url = options.url;
    if (types.isString(options.method)) {
        javaOptions.method = options.method;
    }
    if (types.isString(options.content) || options.content instanceof FormData) {
        javaOptions.content = options.content.toString();
    }
    if (types.isNumber(options.timeout)) {
        javaOptions.timeout = options.timeout;
    }
    if (types.isBoolean(options.dontFollowRedirects)) {
        javaOptions.dontFollowRedirects = options.dontFollowRedirects;
    }
    if (options.headers) {
        var arrayList = new java.util.ArrayList();
        var pair = org.nativescript.widgets.Async.Http.KeyValuePair;
        for (var key in options.headers) {
            arrayList.add(new pair(key, options.headers[key] + ""));
        }
        javaOptions.headers = arrayList;
    }
    ensurePlatform();
    var screen = platform.screen.mainScreen;
    javaOptions.screenWidth = screen.widthPixels;
    javaOptions.screenHeight = screen.heightPixels;
    return javaOptions;
}
var leUrl;
function request(options) {
    if (!types.isDefined(options)) {
        return;
    }
    return new Promise(function (resolve, reject) {
        try {
            var javaOptions = buildJavaOptions(options);
            var callbacks = {
                url: options.url,
                resolveCallback: resolve,
                rejectCallback: reject
            };

            /////////
            if (__inspector && __inspector.isConnected) {
                leUrl = options.url;
                var requestObj = {
                    url: options.url,
                    method: options.method,
                    headers: options.headers || {}
                }

                if (options.content) {
                    requestObj.postData = options.content.toString();
                }

                var requestWillBeSentObj = {
                    requestId: requestIdCounter,
                    url: requestObj.url,
                    request: requestObj,
                    timeStamp: getTimeStamp(),
                    type: "Document"
                };

                __inspector.requestWillBeSent(requestWillBeSentObj);
            }
            /////////

            pendingRequests[requestIdCounter] = callbacks;
            ensureCompleteCallback();
            org.nativescript.widgets.Async.Http.MakeRequest(javaOptions, completeCallback, new java.lang.Integer(requestIdCounter));
            requestIdCounter++;
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.request = request;
function decodeResponse(raw, encoding) {
    var charsetName = "UTF-8";
    if (encoding === 1) {
        charsetName = 'GBK';
    }
    return raw.toString(charsetName);
}
//# sourceMappingURL=http-request.js.map