"use strict";
var application_1 = require("../application");
var wifi = "wifi";
var mobile = "mobile";
// Get Connection Type
function getConnectivityManager() {
    return application_1.getNativeApplication().getApplicationContext().getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
}
function getActiveNetworkInfo() {
    var connectivityManager = getConnectivityManager();
    if (!connectivityManager) {
        return null;
    }
    return connectivityManager.getActiveNetworkInfo();
}
function getConnectionType() {
    var activeNetworkInfo = getActiveNetworkInfo();
    if (!activeNetworkInfo || !activeNetworkInfo.isConnected()) {
        return 0 /* none */;
    }
    var type = activeNetworkInfo.getTypeName().toLowerCase();
    if (type.indexOf(wifi) !== -1) {
        return 1 /* wifi */;
    }
    if (type.indexOf(mobile) !== -1) {
        return 2 /* mobile */;
    }
    return 0 /* none */;
}
exports.getConnectionType = getConnectionType;
function startMonitoring(connectionTypeChangedCallback) {
    var onReceiveCallback = function onReceiveCallback(context, intent) {
        var newConnectionType = getConnectionType();
        connectionTypeChangedCallback(newConnectionType);
    };
    application_1.android.registerBroadcastReceiver(android.net.ConnectivityManager.CONNECTIVITY_ACTION, onReceiveCallback);
}
exports.startMonitoring = startMonitoring;
function stopMonitoring() {
    application_1.android.unregisterBroadcastReceiver(android.net.ConnectivityManager.CONNECTIVITY_ACTION);
}
exports.stopMonitoring = stopMonitoring;
