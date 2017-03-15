"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
// Types.
var frame_common_1 = require("./frame-common");
var constants_1 = require("../page/constants");
var transitionModule = require("../transition");
__export(require("./frame-common"));
var HIDDEN = "_hidden";
var INTENT_EXTRA = "com.tns.activity";
var FRAMEID = "_frameId";
var CALLBACKS = "_callbacks";
var navDepth = -1;
var fragmentId = -1;
var activityInitialized = false;
function onFragmentShown(fragment) {
    if (frame_common_1.traceEnabled()) {
        frame_common_1.traceWrite("SHOWN " + fragment, frame_common_1.traceCategories.NativeLifecycle);
    }
    var callbacks = fragment[CALLBACKS];
    if (callbacks.clearHistory) {
        // This is the fragment which was at the bottom of the stack (fragment0) when we cleared history and called
        // manager.popBackStack(firstEntryName, android.app.FragmentManager.POP_BACK_STACK_INCLUSIVE);
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + " has been shown, but it is being cleared from history. Returning.", frame_common_1.traceCategories.NativeLifecycle);
        }
        return null;
    }
    // TODO: consider putting entry and page in queue so we can safely extract them here. Pass the index of current navigation and extract it from here.
    // After extracting navigation info - remove this index from navigation stack.
    var frame = callbacks.frame;
    var entry = callbacks.entry;
    var page = entry.resolvedPage;
    page._fragmentTag = entry.fragmentTag;
    var currentNavigationContext;
    var navigationQueue = frame._navigationQueue;
    for (var i = 0; i < navigationQueue.length; i++) {
        if (navigationQueue[i].entry === entry) {
            currentNavigationContext = navigationQueue[i];
            break;
        }
    }
    var isBack = currentNavigationContext ? currentNavigationContext.isBackNavigation : false;
    frame._addView(page);
    // onFragmentShown is called before NativeActivity.start where we call frame.onLoaded
    // We need to call frame.onLoaded() here so that the call to frame._addView(page) will emit the page.loaded event
    // before the page.navigatedTo event making the two platforms identical.
    if (!frame.isLoaded) {
        frame._currentEntry = entry;
        frame.onLoaded();
    }
    // Handle page transitions.
    transitionModule._onFragmentShown(fragment, isBack);
}
function onFragmentHidden(fragment, destroyed) {
    if (frame_common_1.traceEnabled()) {
        frame_common_1.traceWrite("HIDDEN " + fragment + "; destroyed: " + destroyed, frame_common_1.traceCategories.NativeLifecycle);
    }
    var callbacks = fragment[CALLBACKS];
    var isBack = callbacks.entry.isBack;
    callbacks.entry.isBack = undefined;
    callbacks.entry.resolvedPage._fragmentTag = undefined;
    // Handle page transitions.
    transitionModule._onFragmentHidden(fragment, isBack, destroyed);
}
var Frame = (function (_super) {
    __extends(Frame, _super);
    function Frame() {
        _super.call(this);
        this._containerViewId = -1;
        this._android = new AndroidFrame(this);
        this._listener = new android.view.View.OnAttachStateChangeListener({
            onViewAttachedToWindow: this.onNativeViewAttachedToWindow.bind(this),
            onViewDetachedFromWindow: this.onNativeViewDetachedToWindow.bind(this)
        });
    }
    Object.defineProperty(Frame, "defaultAnimatedNavigation", {
        get: function () {
            return frame_common_1.FrameBase.defaultAnimatedNavigation;
        },
        set: function (value) {
            frame_common_1.FrameBase.defaultAnimatedNavigation = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame, "defaultTransition", {
        get: function () {
            return frame_common_1.FrameBase.defaultTransition;
        },
        set: function (value) {
            frame_common_1.FrameBase.defaultTransition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "containerViewId", {
        get: function () {
            return this._containerViewId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "_nativeView", {
        get: function () {
            return this._android.rootViewGroup;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype._navigateCore = function (backstackEntry) {
        _super.prototype._navigateCore.call(this, backstackEntry);
        var activity = this._android.activity;
        if (!activity) {
            // We do not have an Activity yet associated. In this case we have two execution paths:
            // 1. This is the main frame for the application
            // 2. This is an inner frame which requires a new Activity
            var currentActivity = this._android.currentActivity;
            if (currentActivity) {
                startActivity(currentActivity, this._android.frameId);
            }
            this._delayedNavigationEntry = backstackEntry;
            return;
        }
        var manager = activity.getFragmentManager();
        // Current Fragment
        var currentFragment;
        if (this._currentEntry) {
            this._currentEntry.isNavigation = true;
            currentFragment = manager.findFragmentByTag(this._currentEntry.fragmentTag);
        }
        var clearHistory = backstackEntry.entry.clearHistory;
        // New Fragment
        if (clearHistory) {
            navDepth = -1;
        }
        navDepth++;
        fragmentId++;
        var newFragmentTag = "fragment" + fragmentId + "[" + navDepth + "]";
        ensureFragmentClass();
        var newFragment = new fragmentClass();
        var args = new android.os.Bundle();
        args.putInt(FRAMEID, this._android.frameId);
        newFragment.setArguments(args);
        setFragmentCallbacks(newFragment);
        var callbacks = newFragment[CALLBACKS];
        callbacks.frame = this;
        callbacks.entry = backstackEntry;
        // backstackEntry
        backstackEntry.isNavigation = true;
        backstackEntry.fragmentTag = newFragmentTag;
        backstackEntry.navDepth = navDepth;
        var fragmentTransaction = manager.beginTransaction();
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("BEGIN TRANSACTION " + fragmentTransaction, frame_common_1.traceCategories.Navigation);
        }
        // Transitions
        var animated = this._getIsAnimatedNavigation(backstackEntry.entry);
        var navigationTransition = this._getNavigationTransition(backstackEntry.entry);
        if (currentFragment) {
            // There might be transitions left over from previous forward navigations from the current page.
            transitionModule._clearForwardTransitions(currentFragment);
            if (animated && navigationTransition) {
                transitionModule._setAndroidFragmentTransitions(this.android.cachePagesOnNavigate, navigationTransition, currentFragment, newFragment, fragmentTransaction);
            }
        }
        // Clear History
        var length = manager.getBackStackEntryCount();
        var emptyNativeBackStack = clearHistory && length > 0;
        if (emptyNativeBackStack) {
            for (var i = 0; i < length; i++) {
                var fragmentToRemove = manager.findFragmentByTag(manager.getBackStackEntryAt(i).getName());
                Frame._clearHistory(fragmentToRemove);
            }
            if (currentFragment) {
                // We need to reverse the transitions because Android will ask the current fragment
                // to create its POP EXIT animator due to popping the back stack, but in reality
                // we need to create the EXIT animator because we are actually going forward and not back.
                transitionModule._prepareCurrentFragmentForClearHistory(currentFragment);
            }
            var firstEntryName = manager.getBackStackEntryAt(0).getName();
            if (frame_common_1.traceEnabled()) {
                frame_common_1.traceWrite("POP BACK STACK " + firstEntryName, frame_common_1.traceCategories.Navigation);
            }
            manager.popBackStackImmediate(firstEntryName, android.app.FragmentManager.POP_BACK_STACK_INCLUSIVE);
        }
        // Hide/remove current fragment if it exists and was not popped
        if (currentFragment && !emptyNativeBackStack) {
            if (this.android.cachePagesOnNavigate && !clearHistory) {
                if (frame_common_1.traceEnabled()) {
                    frame_common_1.traceWrite("\tHIDE " + currentFragment, frame_common_1.traceCategories.Navigation);
                }
                fragmentTransaction.hide(currentFragment);
            }
            else {
                if (frame_common_1.traceEnabled()) {
                    frame_common_1.traceWrite("\tREMOVE " + currentFragment, frame_common_1.traceCategories.Navigation);
                }
                fragmentTransaction.remove(currentFragment);
            }
        }
        // Add newFragment
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("\tADD " + newFragmentTag + "<" + callbacks.entry.resolvedPage + ">", frame_common_1.traceCategories.Navigation);
        }
        fragmentTransaction.add(this.containerViewId, newFragment, newFragmentTag);
        // addToBackStack
        if (this.backStack.length > 0 && currentFragment && !clearHistory) {
            // We add each entry in the backstack to avoid the "Stack corrupted" mismatch
            if (frame_common_1.traceEnabled()) {
                frame_common_1.traceWrite("\tADD TO BACK STACK " + currentFragment, frame_common_1.traceCategories.Navigation);
            }
            fragmentTransaction.addToBackStack(this._currentEntry.fragmentTag);
        }
        if (currentFragment) {
            // This bug is fixed on API19+
            ensureAnimationFixed();
            var trans = void 0;
            if (this.android.cachePagesOnNavigate && animationFixed < 0 && !navigationTransition) {
                // Apparently, there is an Android bug with when hiding fragments with animation.
                // https://code.google.com/p/android/issues/detail?id=32405
                // When bug is fixed use animated variable.
                trans = android.app.FragmentTransaction.TRANSIT_NONE;
            }
            else {
                trans = animated ? android.app.FragmentTransaction.TRANSIT_FRAGMENT_OPEN : android.app.FragmentTransaction.TRANSIT_NONE;
            }
            if (frame_common_1.traceEnabled()) {
                frame_common_1.traceWrite("\tSET TRANSITION " + (trans === 0 ? "NONE" : "OPEN"), frame_common_1.traceCategories.Navigation);
            }
            fragmentTransaction.setTransition(trans);
        }
        fragmentTransaction.commit();
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("END TRANSACTION " + fragmentTransaction, frame_common_1.traceCategories.Navigation);
        }
    };
    Frame._clearHistory = function (fragment) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("CLEAR HISTORY FOR " + fragment, frame_common_1.traceCategories.Navigation);
        }
        var callbacks = fragment[CALLBACKS];
        callbacks.clearHistory = true; // This is hacky
        transitionModule._clearBackwardTransitions(fragment);
        transitionModule._clearForwardTransitions(fragment);
        transitionModule._removePageNativeViewFromAndroidParent(callbacks.entry.resolvedPage);
    };
    Frame.prototype._goBackCore = function (backstackEntry) {
        _super.prototype._goBackCore.call(this, backstackEntry);
        navDepth = backstackEntry.navDepth;
        backstackEntry.isNavigation = true;
        if (this._currentEntry) {
            // We need this information inside onFragmentHidden
            this._currentEntry.isBack = true;
            this._currentEntry.isNavigation = true;
        }
        var manager = this._android.activity.getFragmentManager();
        if (manager.getBackStackEntryCount() > 0) {
            // pop all other fragments up until the named one
            // this handles cases where user may navigate to an inner page without adding it on the backstack
            manager.popBackStack(backstackEntry.fragmentTag, android.app.FragmentManager.POP_BACK_STACK_INCLUSIVE);
        }
    };
    Frame.prototype._createNativeView = function () {
        var root = new org.nativescript.widgets.ContentLayout(this._context);
        if (this._containerViewId < 0) {
            this._containerViewId = android.view.View.generateViewId();
        }
        this._android.rootViewGroup = root;
        this._android.rootViewGroup.setId(this._containerViewId);
        this._android.rootViewGroup.addOnAttachStateChangeListener(this._listener);
        return root;
    };
    Frame.prototype.onNativeViewAttachedToWindow = function (view) {
        if (this._delayedNavigationEntry) {
            this._navigateCore(this._delayedNavigationEntry);
            this._delayedNavigationEntry = undefined;
        }
    };
    Frame.prototype.onNativeViewDetachedToWindow = function (view) {
        // unused for the moment.
    };
    Frame.prototype._popFromFrameStack = function () {
        if (!this._isInFrameStack) {
            return;
        }
        _super.prototype._popFromFrameStack.call(this);
        if (this._android.hasOwnActivity) {
            this._android.activity.finish();
        }
    };
    Frame.prototype._resetNativeView = function () {
        this._android.rootViewGroup.removeOnAttachStateChangeListener(this._listener);
    };
    Frame.prototype._disposeNativeView = function () {
        // we should keep the reference to underlying native object, since frame can contain many pages.
        this._android.rootViewGroup = null;
    };
    Frame.prototype._printNativeBackStack = function () {
        if (!this._android.activity) {
            return;
        }
        var manager = this._android.activity.getFragmentManager();
        var length = manager.getBackStackEntryCount();
        var i = length - 1;
        console.log("Fragment Manager Back Stack: ");
        while (i >= 0) {
            var fragment = manager.findFragmentByTag(manager.getBackStackEntryAt(i--).getName());
            console.log("\t" + fragment);
        }
    };
    Frame.prototype._getNavBarVisible = function (page) {
        if (page.actionBarHidden !== undefined) {
            return !page.actionBarHidden;
        }
        if (this._android && this._android.showActionBar !== undefined) {
            return this._android.showActionBar;
        }
        return true;
    };
    Frame.prototype._processNavigationContext = function (navigationContext) {
        var _this = this;
        var activity = this._android.activity;
        if (activity) {
            var isForegroundActivity = activity === frame_common_1.application.android.foregroundActivity;
            var isPaused = frame_common_1.application.android.paused;
            if (activity && !isForegroundActivity || (isForegroundActivity && isPaused)) {
                var weakActivity_1 = new WeakRef(activity);
                var resume_1 = function (args) {
                    var weakActivityInstance = weakActivity_1.get();
                    var isCurrent = args.activity === weakActivityInstance;
                    if (!weakActivityInstance) {
                        if (frame_common_1.traceEnabled()) {
                            frame_common_1.traceWrite("Frame _processNavigationContext: Drop For Activity GC-ed", frame_common_1.traceCategories.Navigation);
                        }
                        unsubscribe_1();
                        return;
                    }
                    if (isCurrent) {
                        if (frame_common_1.traceEnabled()) {
                            frame_common_1.traceWrite("Frame _processNavigationContext: Activity.Resumed, Continue", frame_common_1.traceCategories.Navigation);
                        }
                        _super.prototype._processNavigationContext.call(_this, navigationContext);
                        unsubscribe_1();
                    }
                };
                var unsubscribe_1 = function () {
                    if (frame_common_1.traceEnabled()) {
                        frame_common_1.traceWrite("Frame _processNavigationContext: Unsubscribe from Activity.Resumed", frame_common_1.traceCategories.Navigation);
                    }
                    frame_common_1.application.android.off(frame_common_1.application.AndroidApplication.activityResumedEvent, resume_1);
                    frame_common_1.application.android.off(frame_common_1.application.AndroidApplication.activityStoppedEvent, unsubscribe_1);
                    frame_common_1.application.android.off(frame_common_1.application.AndroidApplication.activityDestroyedEvent, unsubscribe_1);
                };
                if (frame_common_1.traceEnabled()) {
                    frame_common_1.traceWrite("Frame._processNavigationContext: Subscribe for Activity.Resumed", frame_common_1.traceCategories.Navigation);
                }
                frame_common_1.application.android.on(frame_common_1.application.AndroidApplication.activityResumedEvent, resume_1);
                frame_common_1.application.android.on(frame_common_1.application.AndroidApplication.activityStoppedEvent, unsubscribe_1);
                frame_common_1.application.android.on(frame_common_1.application.AndroidApplication.activityDestroyedEvent, unsubscribe_1);
                return;
            }
        }
        _super.prototype._processNavigationContext.call(this, navigationContext);
    };
    return Frame;
}(frame_common_1.FrameBase));
exports.Frame = Frame;
var framesCounter = 0;
var framesCache = new Array();
var AndroidFrame = (function (_super) {
    __extends(AndroidFrame, _super);
    function AndroidFrame(owner) {
        _super.call(this);
        this.hasOwnActivity = false;
        this._showActionBar = true;
        this._owner = owner;
        this.frameId = framesCounter++;
        framesCache.push(new WeakRef(this));
    }
    Object.defineProperty(AndroidFrame.prototype, "showActionBar", {
        get: function () {
            return this._showActionBar;
        },
        set: function (value) {
            if (this._showActionBar !== value) {
                this._showActionBar = value;
                if (this.owner.currentPage) {
                    this.owner.currentPage.actionBar.update();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidFrame.prototype, "activity", {
        get: function () {
            var activity = this.owner._context;
            if (activity) {
                return activity;
            }
            // traverse the parent chain for an ancestor Frame
            var currView = this._owner.parent;
            while (currView) {
                if (currView instanceof Frame) {
                    return currView.android.activity;
                }
                currView = currView.parent;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidFrame.prototype, "actionBar", {
        get: function () {
            var activity = this.currentActivity;
            if (!activity) {
                return undefined;
            }
            var bar = activity.getActionBar();
            if (!bar) {
                return undefined;
            }
            return bar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidFrame.prototype, "currentActivity", {
        get: function () {
            var activity = this.activity;
            if (activity) {
                return activity;
            }
            var frames = frame_common_1.stack();
            for (var length_1 = frames.length, i = length_1 - 1; i >= 0; i--) {
                activity = frames[i].android.activity;
                if (activity) {
                    return activity;
                }
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidFrame.prototype, "owner", {
        get: function () {
            return this._owner;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidFrame.prototype, "cachePagesOnNavigate", {
        get: function () {
            return this._cachePagesOnNavigate;
        },
        set: function (value) {
            if (this._cachePagesOnNavigate !== value) {
                if (this._owner.backStack.length > 0) {
                    this._owner._printFrameBackStack();
                    this._owner._printNativeBackStack();
                    console.log("currentPage: " + this._owner.currentPage);
                    throw new Error("Cannot set cachePagesOnNavigate if there are items in the back stack.");
                }
                this._cachePagesOnNavigate = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    AndroidFrame.prototype.canGoBack = function () {
        if (!this.activity) {
            return false;
        }
        // can go back only if it is not the main one.
        return this.activity.getIntent().getAction() !== android.content.Intent.ACTION_MAIN;
    };
    AndroidFrame.prototype.fragmentForPage = function (page) {
        if (!page) {
            return undefined;
        }
        var tag = page._fragmentTag;
        if (tag) {
            var manager = this.activity.getFragmentManager();
            return manager.findFragmentByTag(tag);
        }
        return undefined;
    };
    return AndroidFrame;
}(frame_common_1.Observable));
function findPageForFragment(fragment, frame) {
    var fragmentTag = fragment.getTag();
    var page;
    var entry;
    if (frame_common_1.traceEnabled()) {
        frame_common_1.traceWrite("Finding page for " + fragmentTag + ".", frame_common_1.traceCategories.NativeLifecycle);
    }
    if (fragmentTag === constants_1.DIALOG_FRAGMENT_TAG) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("No need to find page for dialog fragment.", frame_common_1.traceCategories.NativeLifecycle);
        }
        return;
    }
    if (frame._currentEntry && frame._currentEntry.fragmentTag === fragmentTag) {
        page = frame.currentPage;
        entry = frame._currentEntry;
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("Current page matches fragment " + fragmentTag + ".", frame_common_1.traceCategories.NativeLifecycle);
        }
    }
    else {
        var backStack = frame.backStack;
        for (var i = 0; i < backStack.length; i++) {
            if (backStack[i].fragmentTag === fragmentTag) {
                entry = backStack[i];
                break;
            }
        }
        if (entry) {
            page = entry.resolvedPage;
            if (frame_common_1.traceEnabled()) {
                frame_common_1.traceWrite("Found " + page + " for " + fragmentTag, frame_common_1.traceCategories.NativeLifecycle);
            }
        }
    }
    if (page) {
        var callbacks = fragment[CALLBACKS];
        callbacks.frame = frame;
        callbacks.entry = entry;
    }
    else {
        throw new Error("Could not find a page for " + fragmentTag + ".");
    }
}
function startActivity(activity, frameId) {
    // TODO: Implicitly, we will open the same activity type as the current one
    var intent = new android.content.Intent(activity, activity.getClass());
    intent.setAction(android.content.Intent.ACTION_DEFAULT);
    intent.putExtra(INTENT_EXTRA, frameId);
    // TODO: Put the navigation context (if any) in the intent
    activity.startActivity(intent);
}
function getFrameById(frameId) {
    // Find the frame for this activity.
    for (var i = 0; i < framesCache.length; i++) {
        var aliveFrame = framesCache[i].get();
        if (aliveFrame && aliveFrame.frameId === frameId) {
            return aliveFrame.owner;
        }
    }
    return null;
}
var animationFixed;
function ensureAnimationFixed() {
    if (!animationFixed) {
        // android.os.Build.VERSION.KITKAT but we don't have definition for it
        animationFixed = android.os.Build.VERSION.SDK_INT >= 19 ? 1 : -1;
    }
}
function ensureFragmentClass() {
    if (fragmentClass) {
        return;
    }
    // this require will apply the FragmentClass implementation 
    require("ui/frame/fragment");
    if (!fragmentClass) {
        throw new Error("Failed to initialize the extended android.app.Fragment class");
    }
}
var fragmentClass;
function setFragmentClass(clazz) {
    if (fragmentClass) {
        throw new Error("Fragment class already initialized");
    }
    fragmentClass = clazz;
}
exports.setFragmentClass = setFragmentClass;
var FragmentCallbacksImplementation = (function () {
    function FragmentCallbacksImplementation() {
    }
    FragmentCallbacksImplementation.prototype.onHiddenChanged = function (fragment, hidden, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onHiddenChanged(" + hidden + ")", frame_common_1.traceCategories.NativeLifecycle);
        }
        superFunc.call(fragment, hidden);
        if (hidden) {
            onFragmentHidden(fragment, false);
        }
        else {
            onFragmentShown(fragment);
        }
    };
    FragmentCallbacksImplementation.prototype.onCreateAnimator = function (fragment, transit, enter, nextAnim, superFunc) {
        var nextAnimString;
        switch (nextAnim) {
            case -10:
                nextAnimString = "enter";
                break;
            case -20:
                nextAnimString = "exit";
                break;
            case -30:
                nextAnimString = "popEnter";
                break;
            case -40:
                nextAnimString = "popExit";
                break;
        }
        var animator = transitionModule._onFragmentCreateAnimator(fragment, nextAnim);
        if (!animator) {
            animator = superFunc.call(fragment, transit, enter, nextAnim);
        }
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onCreateAnimator(" + transit + ", " + (enter ? "enter" : "exit") + ", " + nextAnimString + "): " + animator, frame_common_1.traceCategories.NativeLifecycle);
        }
        return animator;
    };
    FragmentCallbacksImplementation.prototype.onCreate = function (fragment, savedInstanceState, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onCreate(" + savedInstanceState + ")", frame_common_1.traceCategories.NativeLifecycle);
        }
        superFunc.call(fragment, savedInstanceState);
        // There is no entry set to the fragment, so this must be destroyed fragment that was recreated by Android.
        // We should find its corresponding page in our backstack and set it manually.
        if (!this.entry) {
            var frameId = fragment.getArguments().getInt(FRAMEID);
            var frame = getFrameById(frameId);
            if (frame) {
                this.frame = frame;
            }
            else {
                throw new Error("Cannot find Frame for " + fragment);
            }
            findPageForFragment(fragment, this.frame);
        }
    };
    FragmentCallbacksImplementation.prototype.onCreateView = function (fragment, inflater, container, savedInstanceState, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onCreateView(inflater, container, " + savedInstanceState + ")", frame_common_1.traceCategories.NativeLifecycle);
        }
        var entry = this.entry;
        var page = entry.resolvedPage;
        try {
            if (savedInstanceState && savedInstanceState.getBoolean(HIDDEN, false)) {
                fragment.getFragmentManager().beginTransaction().hide(fragment).commit();
                this.frame._addView(page);
            }
            else {
                onFragmentShown(fragment);
            }
        }
        catch (ex) {
            var label = new android.widget.TextView(container.getContext());
            label.setText(ex.message + ", " + ex.stackTrace);
            return label;
        }
        return page._nativeView;
    };
    FragmentCallbacksImplementation.prototype.onSaveInstanceState = function (fragment, outState, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onSaveInstanceState(" + outState + ")", frame_common_1.traceCategories.NativeLifecycle);
        }
        superFunc.call(fragment, outState);
        if (fragment.isHidden()) {
            outState.putBoolean(HIDDEN, true);
        }
    };
    FragmentCallbacksImplementation.prototype.onDestroyView = function (fragment, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onDestroyView()", frame_common_1.traceCategories.NativeLifecycle);
        }
        superFunc.call(fragment);
        // Detaching the page has been move in onFragmentHidden due to transitions.
        onFragmentHidden(fragment, true);
    };
    FragmentCallbacksImplementation.prototype.onDestroy = function (fragment, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite(fragment + ".onDestroy()", frame_common_1.traceCategories.NativeLifecycle);
        }
        superFunc.call(fragment);
    };
    FragmentCallbacksImplementation.prototype.toStringOverride = function (fragment, superFunc) {
        return fragment.getTag() + "<" + (this.entry ? this.entry.resolvedPage : "") + ">";
    };
    return FragmentCallbacksImplementation;
}());
var ActivityCallbacksImplementation = (function () {
    function ActivityCallbacksImplementation() {
    }
    ActivityCallbacksImplementation.prototype.onCreate = function (activity, savedInstanceState, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("Activity.onCreate(" + savedInstanceState + ")", frame_common_1.traceCategories.NativeLifecycle);
        }
        var app = frame_common_1.application.android;
        var intent = activity.getIntent();
        var launchArgs = { eventName: frame_common_1.application.launchEvent, object: app, android: intent };
        frame_common_1.application.notify(launchArgs);
        var frameId = -1;
        var rootView = launchArgs.root;
        var extras = intent.getExtras();
        // We have extras when we call - new Frame().navigate();
        // savedInstanceState is used when activity is recreated.
        // NOTE: On API 23+ we get extras on first run.
        // Check changed - first try to get frameId from Extras if not from saveInstanceState.
        if (extras) {
            frameId = extras.getInt(INTENT_EXTRA, -1);
        }
        if (savedInstanceState && frameId < 0) {
            frameId = savedInstanceState.getInt(INTENT_EXTRA, -1);
        }
        // If we have frameId from extras - we are starting a new activity from navigation (e.g. new Frame().navigate()))
        // Then we check if we have frameId from savedInstanceState - this happens when Activity is destroyed but app was not (e.g. suspend)
        // Only then we fallback to the view returned from the event. This is done in order to have backwards compatibility (remove it for 2.0.0).
        var frame;
        var navParam;
        if (frameId >= 0) {
            rootView = getFrameById(frameId);
        }
        if (!rootView) {
            navParam = frame_common_1.application.mainEntry;
            if (!navParam) {
                navParam = frame_common_1.application.mainModule;
            }
            if (navParam) {
                frame = new Frame();
            }
            else {
                // TODO: Throw an exception?
                throw new Error("A Frame must be used to navigate to a Page.");
            }
            rootView = frame;
        }
        // If there is savedInstanceState this call will recreate all fragments that were previously in the navigation.
        // We take care of associating them with a Page from our backstack in the onAttachFragment callback.
        // If there is savedInstanceState and activityInitialized is false we are restarted but process was killed.
        // For now we treat it like first run (e.g. we are not passing savedInstanceState so no fragments are being restored).
        // When we add support for application save/load state - revise this logic.
        var isRestart = !!savedInstanceState && activityInitialized;
        superFunc.call(activity, isRestart ? savedInstanceState : null);
        this._rootView = rootView;
        // Initialize native visual tree;
        rootView._setupUI(activity);
        activity.setContentView(rootView._nativeView, new org.nativescript.widgets.CommonLayoutParams());
        // frameId is negative w
        if (frame) {
            frame.navigate(navParam);
        }
        activityInitialized = true;
    };
    ActivityCallbacksImplementation.prototype.onSaveInstanceState = function (activity, outState, superFunc) {
        superFunc.call(activity, outState);
        var view = this._rootView;
        if (view instanceof Frame) {
            outState.putInt(INTENT_EXTRA, view.android.frameId);
        }
    };
    ActivityCallbacksImplementation.prototype.onStart = function (activity, superFunc) {
        superFunc.call(activity);
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("NativeScriptActivity.onStart();", frame_common_1.traceCategories.NativeLifecycle);
        }
        var rootView = this._rootView;
        if (rootView && !rootView.isLoaded) {
            rootView.onLoaded();
        }
    };
    ActivityCallbacksImplementation.prototype.onStop = function (activity, superFunc) {
        superFunc.call(activity);
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("NativeScriptActivity.onStop();", frame_common_1.traceCategories.NativeLifecycle);
        }
        var rootView = this._rootView;
        if (rootView && rootView.isLoaded) {
            rootView.onUnloaded();
        }
    };
    ActivityCallbacksImplementation.prototype.onDestroy = function (activity, superFunc) {
        var rootView = this._rootView;
        if (rootView && rootView._context) {
            rootView._tearDownUI(true);
        }
        superFunc.call(activity);
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("NativeScriptActivity.onDestroy();", frame_common_1.traceCategories.NativeLifecycle);
        }
        var exitArgs = { eventName: frame_common_1.application.exitEvent, object: frame_common_1.application.android, android: activity };
        frame_common_1.application.notify(exitArgs);
    };
    ActivityCallbacksImplementation.prototype.onBackPressed = function (activity, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("NativeScriptActivity.onBackPressed;", frame_common_1.traceCategories.NativeLifecycle);
        }
        var args = {
            eventName: "activityBackPressed",
            object: frame_common_1.application.android,
            activity: activity,
            cancel: false
        };
        frame_common_1.application.android.notify(args);
        if (args.cancel) {
            return;
        }
        if (!frame_common_1.goBack()) {
            superFunc.call(activity);
        }
    };
    ActivityCallbacksImplementation.prototype.onRequestPermissionsResult = function (activity, requestCode, permissions, grantResults, superFunc) {
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("NativeScriptActivity.onRequestPermissionsResult;", frame_common_1.traceCategories.NativeLifecycle);
        }
        frame_common_1.application.android.notify({
            eventName: "activityRequestPermissions",
            object: frame_common_1.application.android,
            activity: activity,
            requestCode: requestCode,
            permissions: permissions,
            grantResults: grantResults
        });
    };
    ActivityCallbacksImplementation.prototype.onActivityResult = function (activity, requestCode, resultCode, data, superFunc) {
        superFunc.call(activity, requestCode, resultCode, data);
        if (frame_common_1.traceEnabled()) {
            frame_common_1.traceWrite("NativeScriptActivity.onActivityResult(" + requestCode + ", " + resultCode + ", " + data + ")", frame_common_1.traceCategories.NativeLifecycle);
        }
        frame_common_1.application.android.notify({
            eventName: "activityResult",
            object: frame_common_1.application.android,
            activity: activity,
            requestCode: requestCode,
            resultCode: resultCode,
            intent: data
        });
    };
    return ActivityCallbacksImplementation;
}());
function setActivityCallbacks(activity) {
    activity[CALLBACKS] = new ActivityCallbacksImplementation();
}
exports.setActivityCallbacks = setActivityCallbacks;
function setFragmentCallbacks(fragment) {
    fragment[CALLBACKS] = new FragmentCallbacksImplementation();
}
exports.setFragmentCallbacks = setFragmentCallbacks;
