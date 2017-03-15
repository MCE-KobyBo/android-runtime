"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var properties_1 = require("../core/properties");
var css_1 = require("../../css");
var css_selector_1 = require("./css-selector");
var trace_1 = require("../../trace");
var file_system_1 = require("../../file-system");
var application = require("../../application");
var keyframeAnimationModule;
function ensureKeyframeAnimationModule() {
    if (!keyframeAnimationModule) {
        keyframeAnimationModule = require("ui/animation/keyframe-animation");
    }
}
var cssAnimationParserModule;
function ensureCssAnimationParserModule() {
    if (!cssAnimationParserModule) {
        cssAnimationParserModule = require("./css-animation-parser");
    }
}
function mergeCssSelectors() {
    applicationCssSelectors = applicationSelectors.slice();
    applicationCssSelectors.push.apply(applicationCssSelectors, applicationAdditionalSelectors);
    applicationCssSelectorVersion++;
}
exports.mergeCssSelectors = mergeCssSelectors;
var applicationCssSelectors = [];
var applicationCssSelectorVersion = 0;
var applicationSelectors = [];
var applicationAdditionalSelectors = [];
var applicationKeyframes = {};
var animationsSymbol = Symbol("animations");
var pattern = /('|")(.*?)\1/;
function onCssChanged(args) {
    if (args.cssText) {
        var parsed = createSelectorsFromCss(args.cssText, args.cssFile, applicationKeyframes);
        if (parsed) {
            applicationAdditionalSelectors.push.apply(applicationAdditionalSelectors, parsed);
            mergeCssSelectors();
        }
    }
    else if (args.cssFile) {
        loadCss(args.cssFile);
    }
}
function onLiveSync(args) {
    loadCss(args.cssFile);
}
function loadCss(cssFile) {
    if (!cssFile) {
        return undefined;
    }
    var result;
    var cssFileName = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, cssFile);
    if (file_system_1.File.exists(cssFileName)) {
        var file = file_system_1.File.fromPath(cssFileName);
        var applicationCss = file.readTextSync();
        if (applicationCss) {
            result = createSelectorsFromCss(applicationCss, cssFileName, applicationKeyframes);
            applicationSelectors = result;
            mergeCssSelectors();
        }
    }
}
application.on("cssChanged", onCssChanged);
application.on("livesync", onLiveSync);
function loadCssOnLaunch() {
    loadCss(application.getCssFileName());
    application.off("launch", loadCssOnLaunch);
}
if (application.hasLaunched()) {
    loadCssOnLaunch();
}
else {
    application.on("launch", loadCssOnLaunch);
}
var CssState = (function () {
    function CssState(view, match) {
        this.view = view;
        this.match = match;
    }
    Object.defineProperty(CssState.prototype, "changeMap", {
        get: function () {
            return this.match.changeMap;
        },
        enumerable: true,
        configurable: true
    });
    CssState.prototype.apply = function () {
        var _this = this;
        this.view._cancelAllAnimations();
        properties_1.resetCSSProperties(this.view.style);
        var matchingSelectors = this.match.selectors.filter(function (sel) { return sel.dynamic ? sel.match(_this.view) : true; });
        if (this.view.inlineStyleSelector) {
            matchingSelectors.push(this.view.inlineStyleSelector);
        }
        matchingSelectors.forEach(function (s) { return _this.applyDescriptors(_this.view, s.ruleset); });
    };
    CssState.prototype.applyDescriptors = function (view, ruleset) {
        var style = view.style;
        ruleset.declarations.forEach(function (d) {
            try {
                // Use the "css:" prefixed name, so that CSS value source is set.
                var cssPropName = "css:" + d.property;
                if (cssPropName in style) {
                    style[cssPropName] = d.value;
                }
                else {
                    view[d.property] = d.value;
                }
            }
            catch (e) {
                trace_1.write("Failed to apply property [" + d.property + "] with value [" + d.value + "] to " + view + ". " + e, trace_1.categories.Error, trace_1.messageType.error);
            }
        });
        var ruleAnimations = ruleset[animationsSymbol];
        if (ruleAnimations && view.isLoaded && view.nativeView !== undefined) {
            ensureKeyframeAnimationModule();
            var _loop_1 = function(animationInfo) {
                var animation = keyframeAnimationModule.KeyframeAnimation.keyframeAnimationFromInfo(animationInfo);
                if (animation) {
                    view._registerAnimation(animation);
                    animation.play(view)
                        .then(function () { view._unregisterAnimation(animation); })
                        .catch(function (e) { view._unregisterAnimation(animation); });
                }
            };
            for (var _i = 0, ruleAnimations_1 = ruleAnimations; _i < ruleAnimations_1.length; _i++) {
                var animationInfo = ruleAnimations_1[_i];
                _loop_1(animationInfo);
            }
        }
    };
    return CssState;
}());
exports.CssState = CssState;
var StyleScope = (function () {
    function StyleScope() {
        // caches all the visual states by the key of the visual state selectors
        this._statesByKey = {};
        this._viewIdToKey = {};
        this._css = "";
        this._localCssSelectors = [];
        this._localCssSelectorVersion = 0;
        this._localCssSelectorsAppliedVersion = 0;
        this._applicationCssSelectorsAppliedVersion = 0;
        this._keyframes = {};
    }
    Object.defineProperty(StyleScope.prototype, "css", {
        get: function () {
            return this._css;
        },
        set: function (value) {
            this._cssFileName = undefined;
            this.setCss(value);
        },
        enumerable: true,
        configurable: true
    });
    StyleScope.prototype.addCss = function (cssString, cssFileName) {
        this.appendCss(cssString, cssFileName);
    };
    StyleScope.prototype.setCss = function (cssString, cssFileName) {
        this._css = cssString;
        this._reset();
        this._localCssSelectors = createSelectorsFromCss(this._css, cssFileName, this._keyframes);
        this._localCssSelectorVersion++;
        this.ensureSelectors();
    };
    StyleScope.prototype.appendCss = function (cssString, cssFileName) {
        if (!cssString) {
            return;
        }
        this._css = this._css + cssString;
        this._reset();
        var parsedCssSelectors = createSelectorsFromCss(cssString, cssFileName, this._keyframes);
        this._localCssSelectors.push.apply(this._localCssSelectors, parsedCssSelectors);
        this._localCssSelectorVersion++;
        this.ensureSelectors();
    };
    StyleScope.prototype.getKeyframeAnimationWithName = function (animationName) {
        var keyframes = this._keyframes[animationName];
        if (keyframes !== undefined) {
            ensureKeyframeAnimationModule();
            var animation = new keyframeAnimationModule.KeyframeAnimationInfo();
            ensureCssAnimationParserModule();
            animation.keyframes = cssAnimationParserModule.CssAnimationParser.keyframesArrayFromCSS(keyframes);
            return animation;
        }
        return undefined;
    };
    StyleScope.prototype.ensureSelectors = function () {
        var toMerge;
        if (this._applicationCssSelectorsAppliedVersion !== applicationCssSelectorVersion ||
            this._localCssSelectorVersion !== this._localCssSelectorsAppliedVersion ||
            !this._mergedCssSelectors) {
            toMerge = [];
            toMerge.push(applicationCssSelectors);
            this._applicationCssSelectorsAppliedVersion = applicationCssSelectorVersion;
            toMerge.push(this._localCssSelectors);
            this._localCssSelectorsAppliedVersion = this._localCssSelectorVersion;
            for (var keyframe in applicationKeyframes) {
                this._keyframes[keyframe] = applicationKeyframes[keyframe];
            }
        }
        if (toMerge && toMerge.length > 0) {
            this._mergedCssSelectors = toMerge.filter(function (m) { return !!m; }).reduce(function (merged, next) { return merged.concat(next); }, []);
            this._applyKeyframesOnSelectors();
        }
        else {
            return false;
        }
        this._selectors = new css_selector_1.SelectorsMap(this._mergedCssSelectors);
        return true;
    };
    StyleScope.prototype.applySelectors = function (view) {
        this.ensureSelectors();
        var state = this._selectors.query(view);
        var nextState = new CssState(view, state);
        view._setCssState(nextState);
    };
    StyleScope.prototype.query = function (node) {
        this.ensureSelectors();
        return this._selectors.query(node).selectors;
    };
    StyleScope.prototype._reset = function () {
        this._statesByKey = {};
        this._viewIdToKey = {};
    };
    StyleScope.prototype._applyKeyframesOnSelectors = function () {
        for (var i = this._mergedCssSelectors.length - 1; i >= 0; i--) {
            var ruleset = this._mergedCssSelectors[i];
            var animations = ruleset[animationsSymbol];
            if (animations !== undefined && animations.length) {
                ensureCssAnimationParserModule();
                for (var _i = 0, animations_1 = animations; _i < animations_1.length; _i++) {
                    var animation = animations_1[_i];
                    var keyframe = this._keyframes[animation.name];
                    if (keyframe !== undefined) {
                        animation.keyframes = cssAnimationParserModule.CssAnimationParser.keyframesArrayFromCSS(keyframe);
                    }
                }
            }
        }
    };
    StyleScope.prototype.getAnimations = function (ruleset) {
        return ruleset[animationsSymbol];
    };
    return StyleScope;
}());
exports.StyleScope = StyleScope;
function createSelectorsFromCss(css, cssFileName, keyframes) {
    try {
        var pageCssSyntaxTree = css ? css_1.parse(css, { source: cssFileName }) : null;
        var pageCssSelectors = [];
        if (pageCssSyntaxTree) {
            pageCssSelectors = pageCssSelectors.concat(createSelectorsFromImports(pageCssSyntaxTree, keyframes));
            pageCssSelectors = pageCssSelectors.concat(createSelectorsFromSyntaxTree(pageCssSyntaxTree, keyframes));
        }
        return pageCssSelectors;
    }
    catch (e) {
        trace_1.write("Css styling failed: " + e, trace_1.categories.Error, trace_1.messageType.error);
    }
}
function createSelectorsFromImports(tree, keyframes) {
    var selectors = [];
    if (tree !== null && tree !== undefined) {
        var imports = tree["stylesheet"]["rules"].filter(function (r) { return r.type === "import"; });
        for (var i = 0; i < imports.length; i++) {
            var importItem = imports[i]["import"];
            var match = importItem && importItem.match(pattern);
            var url = match && match[2];
            if (url !== null && url !== undefined) {
                var appDirectory = file_system_1.knownFolders.currentApp().path;
                var fileName = resolveFileNameFromUrl(url, appDirectory, file_system_1.File.exists);
                if (fileName !== null) {
                    var file = file_system_1.File.fromPath(fileName);
                    var text = file.readTextSync();
                    if (text) {
                        selectors = selectors.concat(createSelectorsFromCss(text, fileName, keyframes));
                    }
                }
            }
        }
    }
    return selectors;
}
function createSelectorsFromSyntaxTree(ast, keyframes) {
    var nodes = ast.stylesheet.rules;
    nodes.filter(isKeyframe).forEach(function (node) { return keyframes[node.name] = node; });
    var rulesets = css_selector_1.fromAstNodes(nodes);
    if (rulesets && rulesets.length) {
        ensureCssAnimationParserModule();
        rulesets.forEach(function (rule) { return rule[animationsSymbol] = cssAnimationParserModule.CssAnimationParser.keyframeAnimationsFromCSSDeclarations(rule.declarations); });
    }
    return rulesets;
}
function resolveFileNameFromUrl(url, appDirectory, fileExists) {
    var fileName = typeof url === "string" ? url.trim() : "";
    if (fileName.indexOf("~/") === 0) {
        fileName = fileName.replace("~/", "");
    }
    var local = file_system_1.path.join(appDirectory, fileName);
    if (fileExists(local)) {
        return local;
    }
    var external = file_system_1.path.join(appDirectory, "tns_modules", fileName);
    if (fileExists(external)) {
        return external;
    }
    return null;
}
exports.resolveFileNameFromUrl = resolveFileNameFromUrl;
function applyInlineStyle(view, styleStr) {
    var localStyle = "local { " + styleStr + " }";
    var inlineRuleSet = createSelectorsFromCss(localStyle, null, {});
    var style = view.style;
    inlineRuleSet[0].declarations.forEach(function (d) {
        // Use the actual property name so that a local value is set.
        var name = d.property;
        try {
            if (name in style) {
                style[name] = d.value;
            }
            else {
                view[name] = d.value;
            }
        }
        catch (e) {
            trace_1.write("Failed to apply property [" + d.property + "] with value [" + d.value + "] to " + view + ". " + e, trace_1.categories.Error, trace_1.messageType.error);
        }
    });
}
exports.applyInlineStyle = applyInlineStyle;
function isKeyframe(node) {
    return node.type === "keyframes";
}
var InlineSelector = (function (_super) {
    __extends(InlineSelector, _super);
    function InlineSelector(ruleSet) {
        _super.call(this);
        this.specificity = 0x01000000;
        this.rarity = 0;
        this.dynamic = false;
        this.ruleset = ruleSet;
    }
    InlineSelector.prototype.match = function (node) { return true; };
    return InlineSelector;
}(css_selector_1.SelectorCore));
