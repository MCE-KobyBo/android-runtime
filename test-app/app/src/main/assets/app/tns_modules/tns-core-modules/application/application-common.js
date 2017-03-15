"use strict";
// Require globals first so that snapshot takes __extends function.
require("globals");
var observable_1 = require("../data/observable");
exports.Observable = observable_1.Observable;
var events = new observable_1.Observable();
var launched = false;
function setLaunched() {
    launched = true;
    events.off("launch", setLaunched);
}
events.on("launch", setLaunched);
function hasLaunched() {
    return launched;
}
exports.hasLaunched = hasLaunched;
exports.launchEvent = "launch";
exports.suspendEvent = "suspend";
exports.resumeEvent = "resume";
exports.exitEvent = "exit";
exports.lowMemoryEvent = "lowMemory";
exports.uncaughtErrorEvent = "uncaughtError";
exports.orientationChangedEvent = "orientationChanged";
var cssFile = "app.css";
exports.resources = {};
function setResources(res) {
    exports.resources = res;
}
exports.setResources = setResources;
exports.android = undefined;
exports.ios = undefined;
exports.on = events.on.bind(events);
exports.off = events.off.bind(events);
exports.notify = events.notify.bind(events);
var app;
function setApplication(instance) {
    app = instance;
}
exports.setApplication = setApplication;
function livesync() {
    events.notify({ eventName: "livesync", object: app });
}
exports.livesync = livesync;
function setCssFileName(cssFileName) {
    cssFile = cssFileName;
    events.notify({ eventName: "cssChanged", object: app, cssFile: cssFileName });
}
exports.setCssFileName = setCssFileName;
function getCssFileName() {
    return cssFile;
}
exports.getCssFileName = getCssFileName;
function addCss(cssText) {
    events.notify({ eventName: "cssChanged", object: app, cssText: cssText });
}
exports.addCss = addCss;
global.__onUncaughtError = function (error) {
    events.notify({ eventName: exports.uncaughtErrorEvent, object: app, android: error, ios: error, error: error });
};
