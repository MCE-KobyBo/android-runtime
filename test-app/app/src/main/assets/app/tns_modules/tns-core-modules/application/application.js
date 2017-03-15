"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var application_common_1 = require("./application-common");
// First reexport so that app module is initialized.
__export(require("./application-common"));
var ActivityCreated = "activityCreated";
var ActivityDestroyed = "activityDestroyed";
var ActivityStarted = "activityStarted";
var ActivityPaused = "activityPaused";
var ActivityResumed = "activityResumed";
var ActivityStopped = "activityStopped";
var SaveActivityState = "saveActivityState";
var ActivityResult = "activityResult";
var ActivityBackPressed = "activityBackPressed";
var ActivityRequestPermissions = "activityRequestPermissions";
var AndroidApplication = (function (_super) {
    __extends(AndroidApplication, _super);
    function AndroidApplication() {
        _super.apply(this, arguments);
        this._registeredReceivers = {};
        this._pendingReceiverRegistrations = new Array();
    }
    Object.defineProperty(AndroidApplication.prototype, "currentContext", {
        get: function () {
            return this.foregroundActivity;
        },
        enumerable: true,
        configurable: true
    });
    AndroidApplication.prototype.init = function (nativeApp) {
        if (this.nativeApp) {
            throw new Error("application.android already initialized.");
        }
        this.nativeApp = nativeApp;
        this.packageName = nativeApp.getPackageName();
        this.context = nativeApp.getApplicationContext();
        var lifecycleCallbacks = initLifecycleCallbacks();
        var componentCallbacks = initComponentCallbacks();
        this.nativeApp.registerActivityLifecycleCallbacks(lifecycleCallbacks);
        this.nativeApp.registerComponentCallbacks(componentCallbacks);
        this._registerPendingReceivers();
    };
    AndroidApplication.prototype._registerPendingReceivers = function () {
        var _this = this;
        this._pendingReceiverRegistrations.forEach(function (func) { return func(_this.context); });
        this._pendingReceiverRegistrations.length = 0;
    };
    AndroidApplication.prototype.registerBroadcastReceiver = function (intentFilter, onReceiveCallback) {
        ensureBroadCastReceiverClass();
        var that = this;
        var registerFunc = function (context) {
            var receiver = new BroadcastReceiverClass(onReceiveCallback);
            context.registerReceiver(receiver, new android.content.IntentFilter(intentFilter));
            that._registeredReceivers[intentFilter] = receiver;
        };
        if (this.context) {
            registerFunc(this.context);
        }
        else {
            this._pendingReceiverRegistrations.push(registerFunc);
        }
    };
    AndroidApplication.prototype.unregisterBroadcastReceiver = function (intentFilter) {
        var receiver = this._registeredReceivers[intentFilter];
        if (receiver) {
            this.context.unregisterReceiver(receiver);
            this._registeredReceivers[intentFilter] = undefined;
            delete this._registeredReceivers[intentFilter];
        }
    };
    AndroidApplication.activityCreatedEvent = ActivityCreated;
    AndroidApplication.activityDestroyedEvent = ActivityDestroyed;
    AndroidApplication.activityStartedEvent = ActivityStarted;
    AndroidApplication.activityPausedEvent = ActivityPaused;
    AndroidApplication.activityResumedEvent = ActivityResumed;
    AndroidApplication.activityStoppedEvent = ActivityStopped;
    AndroidApplication.saveActivityStateEvent = SaveActivityState;
    AndroidApplication.activityResultEvent = ActivityResult;
    AndroidApplication.activityBackPressedEvent = ActivityBackPressed;
    AndroidApplication.activityRequestPermissionsEvent = ActivityRequestPermissions;
    return AndroidApplication;
}(application_common_1.Observable));
exports.AndroidApplication = AndroidApplication;
var androidApp = new AndroidApplication();
// use the exports object instead of 'export var' due to global namespace collision
exports.android = androidApp;
application_common_1.setApplication(androidApp);
var started = false;
function start(entry) {
    if (started) {
        throw new Error("Application is already started.");
    }
    if (!androidApp.nativeApp) {
        var nativeApp = getNativeApplication();
        androidApp.init(nativeApp);
    }
    started = true;
    if (entry) {
        exports.mainEntry = entry;
    }
}
exports.start = start;
function getNativeApplication() {
    // Try getting it from module - check whether application.android.init has been explicitly called
    var nativeApp = androidApp.nativeApp;
    if (!nativeApp) {
        // check whether the com.tns.NativeScriptApplication type exists
        if (!nativeApp && com.tns.NativeScriptApplication) {
            nativeApp = com.tns.NativeScriptApplication.getInstance();
        }
        // the getInstance might return null if com.tns.NativeScriptApplication exists but is  not the starting app type
        if (!nativeApp) {
            // TODO: Should we handle the case when a custom application type is provided and the user has not explicitly initialized the application module? 
            var clazz = java.lang.Class.forName("android.app.ActivityThread");
            if (clazz) {
                var method = clazz.getMethod("currentApplication", null);
                if (method) {
                    nativeApp = method.invoke(null, null);
                }
            }
        }
        // we cannot work without having the app instance
        if (!nativeApp) {
            throw new Error("Failed to retrieve native Android Application object. If you have a custom android.app.Application type implemented make sure that you've called the '<application-module>.android.init' method.");
        }
    }
    return nativeApp;
}
exports.getNativeApplication = getNativeApplication;
global.__onLiveSync = function () {
    if (androidApp && androidApp.paused) {
        return;
    }
    application_common_1.livesync();
};
function initLifecycleCallbacks() {
    // TODO: Verify whether the logic for triggerring application-wide events based on Activity callbacks is working properly
    var lifecycleCallbacks = new android.app.Application.ActivityLifecycleCallbacks({
        onActivityCreated: function (activity, savedInstanceState) {
            // Set app theme after launch screen was used during startup
            var activityInfo = activity.getPackageManager().getActivityInfo(activity.getComponentName(), android.content.pm.PackageManager.GET_META_DATA);
            if (activityInfo.metaData) {
                var setThemeOnLaunch = activityInfo.metaData.getInt("SET_THEME_ON_LAUNCH", -1);
                if (setThemeOnLaunch !== -1) {
                    activity.setTheme(setThemeOnLaunch);
                }
            }
            if (!androidApp.startActivity) {
                androidApp.startActivity = activity;
            }
            androidApp.notify({ eventName: ActivityCreated, object: androidApp, activity: activity, bundle: savedInstanceState });
        },
        onActivityDestroyed: function (activity) {
            if (activity === androidApp.foregroundActivity) {
                androidApp.foregroundActivity = undefined;
            }
            if (activity === androidApp.startActivity) {
                androidApp.startActivity = undefined;
            }
            androidApp.notify({ eventName: ActivityDestroyed, object: androidApp, activity: activity });
            // TODO: This is a temporary workaround to force the V8's Garbage Collector, which will force the related Java Object to be collected.
            gc();
        },
        onActivityPaused: function (activity) {
            if (activity.isNativeScriptActivity) {
                androidApp.paused = true;
                application_common_1.notify({ eventName: application_common_1.suspendEvent, object: androidApp, android: activity });
            }
            androidApp.notify({ eventName: ActivityPaused, object: androidApp, activity: activity });
        },
        onActivityResumed: function (activity) {
            androidApp.foregroundActivity = activity;
            if (activity.isNativeScriptActivity) {
                application_common_1.notify({ eventName: application_common_1.resumeEvent, object: androidApp, android: activity });
                androidApp.paused = false;
            }
            androidApp.notify({ eventName: ActivityResumed, object: androidApp, activity: activity });
        },
        onActivitySaveInstanceState: function (activity, outState) {
            androidApp.notify({ eventName: SaveActivityState, object: androidApp, activity: activity, bundle: outState });
        },
        onActivityStarted: function (activity) {
            androidApp.notify({ eventName: ActivityStarted, object: androidApp, activity: activity });
        },
        onActivityStopped: function (activity) {
            androidApp.notify({ eventName: ActivityStopped, object: androidApp, activity: activity });
        }
    });
    return lifecycleCallbacks;
}
var currentOrientation;
function initComponentCallbacks() {
    var componentCallbacks = new android.content.ComponentCallbacks2({
        onLowMemory: function () {
            gc();
            java.lang.System.gc();
            application_common_1.notify({ eventName: application_common_1.lowMemoryEvent, object: this, android: this });
        },
        onTrimMemory: function (level) {
            // TODO: This is skipped for now, test carefully for OutOfMemory exceptions
        },
        onConfigurationChanged: function (newConfig) {
            var newOrientation = newConfig.orientation;
            if (newOrientation === currentOrientation) {
                return;
            }
            currentOrientation = newOrientation;
            var newValue;
            switch (newOrientation) {
                case android.content.res.Configuration.ORIENTATION_LANDSCAPE:
                    newValue = "landscape";
                    break;
                case android.content.res.Configuration.ORIENTATION_PORTRAIT:
                    newValue = "portrait";
                    break;
                default:
                    newValue = "unknown";
                    break;
            }
            application_common_1.notify({
                eventName: application_common_1.orientationChangedEvent,
                android: androidApp.nativeApp,
                newValue: newValue,
                object: androidApp
            });
        }
    });
    return componentCallbacks;
}
var BroadcastReceiverClass;
function ensureBroadCastReceiverClass() {
    if (BroadcastReceiverClass) {
        return;
    }
    var BroadcastReceiver = (function (_super) {
        __extends(BroadcastReceiver, _super);
        function BroadcastReceiver(onReceiveCallback) {
            _super.call(this);
            this._onReceiveCallback = onReceiveCallback;
            return global.__native(this);
        }
        BroadcastReceiver.prototype.onReceive = function (context, intent) {
            if (this._onReceiveCallback) {
                this._onReceiveCallback(context, intent);
            }
        };
        return BroadcastReceiver;
    }(android.content.BroadcastReceiver));
    BroadcastReceiverClass = BroadcastReceiver;
}
