"use strict";
function getTimeStamp() {
    var d = new Date();
    return Math.round(d.getTime() / 1000);
}
function mimeTypeToType(mimeType) {
    var type = "Document";
    if (mimeType.indexOf("image") === 0) {
        type = "Image";
    }
    else if (mimeType.indexOf("javascript") !== -1 || mimeType.indexOf("json") !== -1) {
        type = "Script";
    }
    return type;
}
function parseJSON(source) {
    var src = source.trim();
    if (src.lastIndexOf(")") === src.length - 1) {
        return JSON.parse(src.substring(src.indexOf("(") + 1, src.lastIndexOf(")")));
    }
    return JSON.parse(src);
}
var requestIdCounter = 0;
var pendingRequests = {};
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
            // as a context we will receive the id of the request
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
    // read the headers
    var headers = {};
    if (result.headers) {
        var jHeaders = result.headers;
        var length = jHeaders.size();
        var i;
        var pair;
        for (i = 0; i < length; i++) {
            pair = jHeaders.get(i);
            addHeader(headers, pair.key, pair.value);
        }
    }
    if (global.__inspector && global.__inspector.isConnected) {
        var requestIdStr = requestId.toString();
        // Content-Type and content-type are both common in headers spelling
        var mimeType = headers["Content-Type"] || headers["content-type"];
        var response = {
            url: result.url || "",
            status: result.statusCode,
            statusText: result.statusText || "",
            headers: headers,
            mimeType: mimeType,
            fromDiskCache: false
        };
        var responseData = {
            requestId: requestIdStr,
            type: mimeTypeToType(response.mimeType),
            response: response,
            timeStamp: getTimeStamp()
        };
        global.__inspector.responseReceived(responseData);
        global.__inspector.loadingFinished({ requestId: requestIdStr, timeStamp: getTimeStamp() });
        var hasTextContent = responseData.type === "Document" || responseData.type === "Script";
        var data = void 0;
        if (!hasTextContent) {
            if (responseData.type === "Image") {
                var bitmap = result.responseAsImage;
                if (bitmap) {
                    var outputStream = new java.io.ByteArrayOutputStream();
                    bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, outputStream);
                    var base64Image = android.util.Base64.encodeToString(outputStream.toByteArray(), android.util.Base64.DEFAULT);
                    data = base64Image;
                }
            }
        }
        else {
            data = result.responseAsString;
        }
        var successfulRequestData = {
            requestId: requestIdStr,
            data: data,
            hasTextContent: hasTextContent
        };
        global.__inspector.dataForRequestId(successfulRequestData);
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
                if (typeof str === "string") {
                    return str;
                }
                else {
                    throw new Error("Response content may not be converted to string");
                }
            },
            toJSON: function (encoding) {
                var str;
                if (encoding) {
                    str = decodeResponse(result.raw, encoding);
                }
                else {
                    str = result.responseAsString;
                }
                return parseJSON(str);
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
    if (typeof options.url !== "string") {
        throw new Error("Http request must provide a valid url.");
    }
    var javaOptions = new org.nativescript.widgets.Async.Http.RequestOptions();
    javaOptions.url = options.url;
    if (typeof options.method === "string") {
        javaOptions.method = options.method;
    }
    if (typeof options.content === "string" || options.content instanceof FormData) {
        javaOptions.content = options.content.toString();
    }
    if (typeof options.timeout === "number") {
        javaOptions.timeout = options.timeout;
    }
    if (typeof options.dontFollowRedirects === "boolean") {
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
    // pass the maximum available image size to the request options in case we need a bitmap conversion
    var screen = platform.screen.mainScreen;
    javaOptions.screenWidth = screen.widthPixels;
    javaOptions.screenHeight = screen.heightPixels;
    return javaOptions;
}
function request(options) {
    if (options === undefined || options === null) {
        // TODO: Shouldn't we throw an error here - defensive programming
        return;
    }
    return new Promise(function (resolve, reject) {
        try {
            // initialize the options
            var javaOptions = buildJavaOptions(options);
            if (global.__inspector && global.__inspector.isConnected) {
                var request_1 = {
                    url: options.url,
                    method: options.method,
                    headers: options.headers || {},
                    postData: options.content ? options.content.toString() : ""
                };
                var requestData = {
                    requestId: requestIdCounter.toString(),
                    url: request_1.url,
                    request: request_1,
                    timeStamp: getTimeStamp(),
                    type: "Document"
                };
                global.__inspector.requestWillBeSent(requestData);
            }
            // remember the callbacks so that we can use them when the CompleteCallback is called
            var callbacks = {
                url: options.url,
                resolveCallback: resolve,
                rejectCallback: reject
            };
            pendingRequests[requestIdCounter] = callbacks;
            ensureCompleteCallback();
            //make the actual async call
            org.nativescript.widgets.Async.Http.MakeRequest(javaOptions, completeCallback, new java.lang.Integer(requestIdCounter));
            // increment the id counter
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
    if (encoding === 1 /* GBK */) {
        charsetName = 'GBK';
    }
    return raw.toString(charsetName);
}
function addHeader(headers, key, value) {
    if (!headers[key]) {
        headers[key] = value;
    }
    else if (Array.isArray(headers[key])) {
        headers[key].push(value);
    }
    else {
        var values = [headers[key]];
        values.push(value);
        headers[key] = values;
    }
}
exports.addHeader = addHeader;
