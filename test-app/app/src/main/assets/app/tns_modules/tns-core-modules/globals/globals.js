"use strict";
// Required by TypeScript compiler
require("./decorators");
// Required by V8 snapshot generator
global.__extends = global.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) {
            d[p] = b[p];
        }
    }
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// This method iterates all the keys in the source exports object and copies them to the destination exports one.
// Note: the method will not check for naming collisions and will override any already existing entries in the destination exports.
global.moduleMerge = function (sourceExports, destExports) {
    for (var key in sourceExports) {
        destExports[key] = sourceExports[key];
    }
};
var modules = new Map();
global.registerModule = function (name, loader) {
    modules.set(name, loader);
};
global.moduleExists = function (name) {
    return modules.has(name);
};
global.loadModule = function (name) {
    var loader = modules.get(name);
    if (loader) {
        return loader();
    }
    else {
        var result_1 = global.require(name);
        modules.set(name, function () { return result_1; });
        return result_1;
    }
};
global.zonedCallback = function (callback) {
    if (global.zone) {
        // Zone v0.5.* style callback wrapping
        return global.zone.bind(callback);
    }
    if (global.Zone) {
        // Zone v0.6.* style callback wrapping
        return global.Zone.current.wrap(callback);
    }
    else {
        return callback;
    }
};
global.registerModule("timer", function () { return require("timer"); });
global.registerModule("ui/dialogs", function () { return require("ui/dialogs"); });
global.registerModule("xhr", function () { return require("xhr"); });
global.registerModule("fetch", function () { return require("fetch"); });
var __tnsGlobalMergedModules = new Map();
function registerOnGlobalContext(name, module) {
    Object.defineProperty(global, name, {
        get: function () {
            // We do not need to cache require() call since it is already cached in the runtime.
            var m = global.loadModule(module);
            if (!__tnsGlobalMergedModules.has(module)) {
                __tnsGlobalMergedModules.set(module, true);
                global.moduleMerge(m, global);
            }
            // Redefine the property to make sure the above code is executed only once.
            var resolvedValue = m[name];
            Object.defineProperty(this, name, { value: resolvedValue, configurable: true, writable: true });
            return resolvedValue;
        },
        configurable: true
    });
}
if (global.__snapshot) {
    // when we have a snapshot, it is better to pre-populate these on the global context to get them saved within the blob
    var timer = require("timer");
    global.setTimeout = timer.setTimeout;
    global.clearTimeout = timer.clearTimeout;
    global.setInterval = timer.setInterval;
    global.clearInterval = timer.clearInterval;
    var dialogs = require("ui/dialogs");
    global.alert = dialogs.alert;
    global.confirm = dialogs.confirm;
    global.prompt = dialogs.prompt;
    var xhr = require("xhr");
    global.XMLHttpRequest = xhr.XMLHttpRequest;
    global.FormData = xhr.FormData;
    var fetch = require("fetch");
    global.fetch = fetch.fetch;
    global.Headers = fetch.Headers;
    global.Request = fetch.Request;
    global.Response = fetch.Response;
}
else {
    registerOnGlobalContext("setTimeout", "timer");
    registerOnGlobalContext("clearTimeout", "timer");
    registerOnGlobalContext("setInterval", "timer");
    registerOnGlobalContext("clearInterval", "timer");
    registerOnGlobalContext("alert", "ui/dialogs");
    registerOnGlobalContext("confirm", "ui/dialogs");
    registerOnGlobalContext("prompt", "ui/dialogs");
    registerOnGlobalContext("XMLHttpRequest", "xhr");
    registerOnGlobalContext("FormData", "xhr");
    registerOnGlobalContext("fetch", "fetch");
}
if (!global.console) {
    var consoleModule = require("console");
    global.console = new consoleModule.Console();
}
function Deprecated(target, key, descriptor) {
    if (descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            console.log(key + " is deprecated");
            return originalMethod.apply(this, args);
        };
        return descriptor;
    }
    else {
        console.log((target && target.name || target) + " is deprecated");
        return target;
    }
}
exports.Deprecated = Deprecated;
global.Deprecated = Deprecated;
function Experimental(target, key, descriptor) {
    if (descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            console.log(key + " is experimental");
            return originalMethod.apply(this, args);
        };
        return descriptor;
    }
    else {
        console.log((target && target.name || target) + " is experimental");
        return target;
    }
}
exports.Experimental = Experimental;
global.Experimental = Experimental;
