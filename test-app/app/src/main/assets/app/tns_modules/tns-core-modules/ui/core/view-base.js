function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var observable_1 = require("data/observable");
exports.Observable = observable_1.Observable;
var properties_1 = require("./properties");
var bindable_1 = require("ui/core/bindable");
exports.Binding = bindable_1.Binding;
var platform_1 = require("platform");
exports.isIOS = platform_1.isIOS;
exports.isAndroid = platform_1.isAndroid;
var gestures_1 = require("ui/gestures");
exports.gestureFromString = gestures_1.fromString;
var trace_1 = require("trace");
exports.traceEnabled = trace_1.isEnabled;
exports.traceWrite = trace_1.write;
exports.traceCategories = trace_1.categories;
exports.traceNotifyEvent = trace_1.notifyEvent;
exports.isCategorySet = trace_1.isCategorySet;
var types = require("utils/types");
var styleScopeModule;
function ensureStyleScopeModule() {
    if (!styleScopeModule) {
        styleScopeModule = require("ui/styling/style-scope");
    }
}
__export(require("./properties"));
var defaultBindingSource = {};
function getAncestor(view, criterion) {
    var matcher = null;
    if (typeof criterion === "string") {
        matcher = function (view) { return view.typeName === criterion; };
    }
    else {
        matcher = function (view) { return view instanceof criterion; };
    }
    for (var parent_1 = view.parent; parent_1 != null; parent_1 = parent_1.parent) {
        if (matcher(parent_1)) {
            return parent_1;
        }
    }
    return null;
}
exports.getAncestor = getAncestor;
function getEventOrGestureName(name) {
    return name.indexOf("on") === 0 ? name.substr(2, name.length - 2) : name;
}
exports.getEventOrGestureName = getEventOrGestureName;
function isEventOrGesture(name, view) {
    if (typeof name === "string") {
        var eventOrGestureName = getEventOrGestureName(name);
        var evt = eventOrGestureName + "Event";
        return view.constructor && evt in view.constructor ||
            gestures_1.fromString(eventOrGestureName.toLowerCase()) !== undefined;
    }
    return false;
}
exports.isEventOrGesture = isEventOrGesture;
function getViewById(view, id) {
    if (!view) {
        return undefined;
    }
    if (view.id === id) {
        return view;
    }
    var retVal;
    var descendantsCallback = function (child) {
        if (child.id === id) {
            retVal = child;
            return false;
        }
        return true;
    };
    eachDescendant(view, descendantsCallback);
    return retVal;
}
exports.getViewById = getViewById;
function eachDescendant(view, callback) {
    if (!callback || !view) {
        return;
    }
    var continueIteration;
    var localCallback = function (child) {
        continueIteration = callback(child);
        if (continueIteration) {
            child.eachChild(localCallback);
        }
        return continueIteration;
    };
    view.eachChild(localCallback);
}
exports.eachDescendant = eachDescendant;
var viewIdCounter = 0;
var ViewBase = (function (_super) {
    __extends(ViewBase, _super);
    function ViewBase() {
        var _this = _super.call(this) || this;
        _this.pseudoClassAliases = {
            'highlighted': [
                'active',
                'pressed'
            ]
        };
        _this.cssClasses = new Set();
        _this.cssPseudoClasses = new Set();
        _this._domId = viewIdCounter++;
        _this._style = new properties_1.Style(_this);
        return _this;
    }
    Object.defineProperty(ViewBase.prototype, "typeName", {
        get: function () {
            return types.getClass(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "style", {
        get: function () {
            return this._style;
        },
        set: function (value) {
            throw new Error("View.style property is read-only.");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "android", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "ios", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "isLoaded", {
        get: function () {
            return this._isLoaded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "class", {
        get: function () {
            return this.className;
        },
        set: function (v) {
            this.className = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewBase.prototype, "inlineStyleSelector", {
        get: function () {
            return this._inlineStyleSelector;
        },
        set: function (value) {
            this._inlineStyleSelector = value;
        },
        enumerable: true,
        configurable: true
    });
    ViewBase.prototype.getViewById = function (id) {
        return getViewById(this, id);
    };
    Object.defineProperty(ViewBase.prototype, "page", {
        get: function () {
            if (this.parent) {
                return this.parent.page;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    ViewBase.prototype.onLoaded = function () {
        this._isLoaded = true;
        this._loadEachChild();
        this._emit("loaded");
    };
    ViewBase.prototype._loadEachChild = function () {
        this.eachChild(function (child) {
            child.onLoaded();
            return true;
        });
    };
    ViewBase.prototype.onUnloaded = function () {
        this._styleScope = null;
        this._setCssState(null);
        this._unloadEachChild();
        this._isLoaded = false;
        this._emit("unloaded");
    };
    ViewBase.prototype._unloadEachChild = function () {
        this.eachChild(function (child) {
            if (child.isLoaded) {
                child.onUnloaded();
            }
            return true;
        });
    };
    ViewBase.prototype._applyStyleFromScope = function () {
        var scope = this._styleScope;
        if (scope) {
            scope.applySelectors(this);
        }
    };
    ViewBase.prototype._setCssState = function (next) {
        var _this = this;
        var previous = this._cssState;
        this._cssState = next;
        if (!this._invalidateCssHandler) {
            this._invalidateCssHandler = function () {
                if (_this._invalidateCssHandlerSuspended) {
                    return;
                }
                _this.applyCssState();
            };
        }
        try {
            this._invalidateCssHandlerSuspended = true;
            if (next) {
                next.changeMap.forEach(function (changes, view) {
                    if (changes.attributes) {
                        changes.attributes.forEach(function (attribute) {
                            view.addEventListener(attribute + "Change", _this._invalidateCssHandler);
                        });
                    }
                    if (changes.pseudoClasses) {
                        changes.pseudoClasses.forEach(function (pseudoClass) {
                            var eventName = ":" + pseudoClass;
                            view.addEventListener(":" + pseudoClass, _this._invalidateCssHandler);
                            if (view[eventName]) {
                                view[eventName](+1);
                            }
                        });
                    }
                });
            }
            if (previous) {
                previous.changeMap.forEach(function (changes, view) {
                    if (changes.attributes) {
                        changes.attributes.forEach(function (attribute) {
                            view.removeEventListener("onPropertyChanged:" + attribute, _this._invalidateCssHandler);
                        });
                    }
                    if (changes.pseudoClasses) {
                        changes.pseudoClasses.forEach(function (pseudoClass) {
                            var eventName = ":" + pseudoClass;
                            view.removeEventListener(eventName, _this._invalidateCssHandler);
                            if (view[eventName]) {
                                view[eventName](-1);
                            }
                        });
                    }
                });
            }
        }
        finally {
            this._invalidateCssHandlerSuspended = false;
        }
        this.applyCssState();
    };
    ViewBase.prototype.notifyPseudoClassChanged = function (pseudoClass) {
        this.notify({ eventName: ":" + pseudoClass, object: this });
    };
    ViewBase.prototype.applyCssState = function () {
        if (!this._cssState) {
            return;
        }
        this._cssState.apply();
    };
    ViewBase.prototype.getAllAliasedStates = function (name) {
        var allStates = [];
        allStates.push(name);
        if (name in this.pseudoClassAliases) {
            for (var i = 0; i < this.pseudoClassAliases[name].length; i++) {
                allStates.push(this.pseudoClassAliases[name][i]);
            }
        }
        return allStates;
    };
    ViewBase.prototype.addPseudoClass = function (name) {
        var allStates = this.getAllAliasedStates(name);
        for (var i = 0; i < allStates.length; i++) {
            if (!this.cssPseudoClasses.has(allStates[i])) {
                this.cssPseudoClasses.add(allStates[i]);
                this.notifyPseudoClassChanged(allStates[i]);
            }
        }
    };
    ViewBase.prototype.deletePseudoClass = function (name) {
        var allStates = this.getAllAliasedStates(name);
        for (var i = 0; i < allStates.length; i++) {
            if (this.cssPseudoClasses.has(allStates[i])) {
                this.cssPseudoClasses.delete(allStates[i]);
                this.notifyPseudoClassChanged(allStates[i]);
            }
        }
    };
    ViewBase.prototype._applyInlineStyle = function (inlineStyle) {
        if (typeof inlineStyle === "string") {
            try {
                ensureStyleScopeModule();
                styleScopeModule.applyInlineStyle(this, inlineStyle);
            }
            finally {
            }
        }
    };
    ViewBase.prototype.bindingContextChanged = function (data) {
        this.bindings.get("bindingContext").bind(data.value);
    };
    ViewBase.prototype.bind = function (options, source) {
        if (source === void 0) { source = defaultBindingSource; }
        var targetProperty = options.targetProperty;
        this.unbind(targetProperty);
        if (!this.bindings) {
            this.bindings = new Map();
        }
        var binding = new bindable_1.Binding(this, options);
        this.bindings.set(targetProperty, binding);
        var bindingSource = source;
        if (bindingSource === defaultBindingSource) {
            bindingSource = this.bindingContext;
            binding.sourceIsBindingContext = true;
            if (targetProperty === "bindingContext") {
                this.bindingContextBoundToParentBindingContextChanged = true;
                var parent_2 = this.parent;
                if (parent_2) {
                    parent_2.on("bindingContextChange", this.bindingContextChanged, this);
                }
                else {
                    this.shouldAddHandlerToParentBindingContextChanged = true;
                }
            }
        }
        binding.bind(bindingSource);
    };
    ViewBase.prototype.unbind = function (property) {
        var bindings = this.bindings;
        if (!bindings) {
            return;
        }
        var binding = bindings.get(property);
        if (binding) {
            binding.unbind();
            bindings.delete(property);
            if (binding.sourceIsBindingContext) {
                if (property === "bindingContext") {
                    this.shouldAddHandlerToParentBindingContextChanged = false;
                    this.bindingContextBoundToParentBindingContextChanged = false;
                    var parent_3 = this.parent;
                    if (parent_3) {
                        parent_3.off("bindingContextChange", this.bindingContextChanged, this);
                    }
                }
            }
        }
    };
    ViewBase.prototype.requestLayout = function () {
        var parent = this.parent;
        if (parent) {
            parent.requestLayout();
        }
    };
    ViewBase.prototype.eachChild = function (callback) {
    };
    ViewBase.prototype._addView = function (view, atIndex) {
        if (trace_1.isEnabled()) {
            trace_1.write(this + "._addView(" + view + ", " + atIndex + ")", trace_1.categories.ViewHierarchy);
        }
        if (!view) {
            throw new Error("Expecting a valid View instance.");
        }
        if (!(view instanceof ViewBase)) {
            throw new Error(view + " is not a valid View instance.");
        }
        if (view.parent) {
            throw new Error("View already has a parent. View: " + view + " Parent: " + view.parent);
        }
        view.parent = this;
        this._addViewCore(view, atIndex);
        view._parentChanged(null);
    };
    ViewBase.prototype._setStyleScope = function (scope) {
        this._styleScope = scope;
        this._applyStyleFromScope();
        this.eachChild(function (v) {
            v._setStyleScope(scope);
            return true;
        });
    };
    ViewBase.prototype._addViewCore = function (view, atIndex) {
        properties_1.propagateInheritableProperties(this);
        var styleScope = this._styleScope;
        if (styleScope) {
            view._setStyleScope(styleScope);
        }
        properties_1.propagateInheritableCssProperties(this.style);
        if (this._context) {
            view._setupUI(this._context, atIndex);
        }
        if (this._isLoaded) {
            view.onLoaded();
        }
    };
    ViewBase.prototype._removeView = function (view) {
        if (trace_1.isEnabled()) {
            trace_1.write(this + "._removeView(" + view + ")", trace_1.categories.ViewHierarchy);
        }
        if (view.parent !== this) {
            throw new Error("View not added to this instance. View: " + view + " CurrentParent: " + view.parent + " ExpectedParent: " + this);
        }
        this._removeViewCore(view);
        view.parent = undefined;
        view._parentChanged(this);
    };
    ViewBase.prototype._removeViewCore = function (view) {
        if (view.isLoaded) {
            view.onUnloaded();
        }
        if (view._context) {
            view._tearDownUI();
        }
    };
    ViewBase.prototype._createNativeView = function () {
    };
    ViewBase.prototype._disposeNativeView = function () {
    };
    ViewBase.prototype._initNativeView = function () {
    };
    ViewBase.prototype._resetNativeView = function () {
        if (this.nativeView && this.recycleNativeView) {
            properties_1.resetNativeView(this);
        }
    };
    ViewBase.prototype._setupUI = function (context, atIndex, parentIsLoaded) {
        trace_1.notifyEvent(this, "_setupUI");
        if (trace_1.isEnabled()) {
            trace_1.write(this + "._setupUI(" + context + ")", trace_1.categories.VisualTreeEvents);
        }
        if (this._context === context) {
            return;
        }
        this._context = context;
        trace_1.notifyEvent(this, "_onContextChanged");
        this._createNativeView();
        this.nativeView = this._nativeView;
        this._initNativeView();
        if (this.parent) {
            var nativeIndex = this.parent._childIndexToNativeChildIndex(atIndex);
            this._isAddedToNativeVisualTree = this.parent._addViewToNativeVisualTree(this, nativeIndex);
        }
        if (this.nativeView) {
            properties_1.initNativeView(this);
        }
        this.eachChild(function (child) {
            child._setupUI(context);
            return true;
        });
    };
    ViewBase.prototype._tearDownUI = function (force) {
        if (trace_1.isEnabled()) {
            trace_1.write(this + "._tearDownUI(" + force + ")", trace_1.categories.VisualTreeEvents);
        }
        this.eachChild(function (child) {
            child._tearDownUI(force);
            return true;
        });
        if (this.parent) {
            this.parent._removeViewFromNativeVisualTree(this);
        }
        this._resetNativeView();
        this._disposeNativeView();
        this._context = null;
        trace_1.notifyEvent(this, "_onContextChanged");
        trace_1.notifyEvent(this, "_tearDownUI");
    };
    ViewBase.prototype._childIndexToNativeChildIndex = function (index) {
        return index;
    };
    ViewBase.prototype._addViewToNativeVisualTree = function (view, atIndex) {
        if (view._isAddedToNativeVisualTree) {
            throw new Error("Child already added to the native visual tree.");
        }
        return true;
    };
    ViewBase.prototype._removeViewFromNativeVisualTree = function (view) {
        trace_1.notifyEvent(view, "_removeViewFromNativeVisualTree");
        view._isAddedToNativeVisualTree = false;
    };
    ViewBase.prototype._goToVisualState = function (state) {
        if (trace_1.isEnabled()) {
            trace_1.write(this + " going to state: " + state, trace_1.categories.Style);
        }
        if (state === this._visualState) {
            return;
        }
        this.deletePseudoClass(this._visualState);
        this._visualState = state;
        this.addPseudoClass(state);
    };
    ViewBase.prototype._applyXmlAttribute = function (attribute, value) {
        if (attribute === "style") {
            this._applyInlineStyle(value);
            return true;
        }
        return false;
    };
    ViewBase.prototype.setInlineStyle = function (style) {
        if (typeof style !== "string") {
            throw new Error("Parameter should be valid CSS string!");
        }
        this._applyInlineStyle(style);
    };
    ViewBase.prototype._parentChanged = function (oldParent) {
        if (oldParent) {
            properties_1.clearInheritedProperties(this);
            if (this.bindingContextBoundToParentBindingContextChanged) {
                oldParent.parent.off("bindingContextChange", this.bindingContextChanged, this);
            }
        }
        else if (this.shouldAddHandlerToParentBindingContextChanged) {
            var parent_4 = this.parent;
            parent_4.on("bindingContextChange", this.bindingContextChanged, this);
            this.bindings.get("bindingContext").bind(parent_4.bindingContext);
        }
    };
    ViewBase.prototype._registerAnimation = function (animation) {
        if (this._registeredAnimations === undefined) {
            this._registeredAnimations = new Array();
        }
        this._registeredAnimations.push(animation);
    };
    ViewBase.prototype._unregisterAnimation = function (animation) {
        if (this._registeredAnimations) {
            var index_1 = this._registeredAnimations.indexOf(animation);
            if (index_1 >= 0) {
                this._registeredAnimations.splice(index_1, 1);
            }
        }
    };
    ViewBase.prototype._cancelAllAnimations = function () {
        if (this._registeredAnimations) {
            for (var _i = 0, _a = this._registeredAnimations; _i < _a.length; _i++) {
                var animation = _a[_i];
                animation.cancel();
            }
        }
    };
    return ViewBase;
}(observable_1.Observable));
exports.ViewBase = ViewBase;
ViewBase.prototype.isCollapsed = false;
exports.bindingContextProperty = new properties_1.InheritedProperty({ name: "bindingContext" });
exports.bindingContextProperty.register(ViewBase);
exports.classNameProperty = new properties_1.Property({
    name: "className",
    valueChanged: function (view, oldValue, newValue) {
        var classes = view.cssClasses;
        classes.clear();
        if (typeof newValue === "string") {
            newValue.split(" ").forEach(function (c) { return classes.add(c); });
        }
        resetStyles(view);
    }
});
exports.classNameProperty.register(ViewBase);
function resetStyles(view) {
    view._cancelAllAnimations();
    properties_1.resetCSSProperties(view.style);
    view._applyStyleFromScope();
    view.eachChild(function (child) {
        resetStyles(child);
        return true;
    });
}
exports.idProperty = new properties_1.Property({ name: "id", valueChanged: function (view, oldValue, newValue) { return resetStyles(view); } });
exports.idProperty.register(ViewBase);
//# sourceMappingURL=view-base.js.map