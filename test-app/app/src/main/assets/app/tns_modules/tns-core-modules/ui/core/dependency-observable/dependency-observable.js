"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var observable_1 = require("../../../data/observable");
var types_1 = require("../../../utils/types");
var properties_1 = require("../properties");
// use private variables in the scope of the module rather than static members of the class since a member is still accessible through JavaScript and may be changed.
var propertyFromKey = {};
// var propertyIdCounter = 0;
function generatePropertyKey(name, ownerType, validate) {
    if (validate) {
        validateRegisterParameters(name, ownerType);
    }
    return ownerType + "." + name;
}
function validateRegisterParameters(name, ownerType) {
    if (name == null || name.trim().length === 0) {
        throw new Error("Name should not be null or empty string.");
    }
    if (ownerType == null || ownerType.trim().length === 0) {
        throw new Error("OwnerType should not be null or empty string.");
    }
}
function getPropertyByNameAndType(name, owner) {
    var result;
    var key;
    var classInfo = types_1.getClassInfo(owner);
    while (classInfo) {
        key = generatePropertyKey(name, classInfo.name);
        result = propertyFromKey[key];
        if (result) {
            break;
        }
        classInfo = classInfo.baseClassInfo;
    }
    return result;
}
var PropertyMetadataSettings;
(function (PropertyMetadataSettings) {
    PropertyMetadataSettings.None = 0;
    PropertyMetadataSettings.AffectsLayout = 1;
    PropertyMetadataSettings.AffectsStyle = 1 << 1;
    PropertyMetadataSettings.Inheritable = 1 << 2;
})(PropertyMetadataSettings = exports.PropertyMetadataSettings || (exports.PropertyMetadataSettings = {}));
var ValueSource;
(function (ValueSource) {
    ValueSource.Default = 0;
    ValueSource.Inherited = 1;
    ValueSource.Css = 2;
    ValueSource.Local = 3;
    ValueSource.VisualState = 4;
})(ValueSource = exports.ValueSource || (exports.ValueSource = {}));
var PropertyMetadata = (function () {
    function PropertyMetadata(defaultValue, options, onChanged, onValidateValue, equalityComparer) {
        if (options === void 0) { options = PropertyMetadataSettings.None; }
        this.defaultValue = defaultValue;
        this.options = options;
        throw new Error("* @deprecated use 'ui/core/properties' module instead.");
    }
    return PropertyMetadata;
}());
exports.PropertyMetadata = PropertyMetadata;
var Property = (function () {
    function Property(name, ownerType, metadata, valueConverter) {
        this.name = name;
        this.ownerType = ownerType;
        this.metadata = metadata;
        throw new Error("* @deprecated use 'ui/core/properties' module instead.");
    }
    return Property;
}());
exports.Property = Property;
var PropertyEntry = (function () {
    function PropertyEntry(property) {
        this.property = property;
        this.valueSource = ValueSource.Default;
        throw new Error("* @deprecated use 'ui/core/properties' module instead.");
    }
    PropertyEntry.prototype.resetValue = function () {
        this.valueSource = ValueSource.Default;
        this.inheritedValue = this.cssValue = this.localValue = this.visualStateValue = this.effectiveValue = undefined;
    };
    return PropertyEntry;
}());
exports.PropertyEntry = PropertyEntry;
var DependencyObservable = (function (_super) {
    __extends(DependencyObservable, _super);
    function DependencyObservable() {
        _super.call(this);
        this._propertyEntries = {};
        throw new Error("* @deprecated use 'ui/core/view-base or ui/core/view' as base class.");
    }
    DependencyObservable.prototype.set = function (name, value) {
        var property = getPropertyByNameAndType(name, this);
        if (property) {
            this._setValueInternal(property, value, ValueSource.Local);
        }
        else {
            _super.prototype.set.call(this, name, value);
        }
    };
    DependencyObservable.prototype.get = function (name) {
        var property = getPropertyByNameAndType(name, this);
        if (property) {
            return this._getValue(property);
        }
        else {
            return _super.prototype.get.call(this, name);
        }
    };
    DependencyObservable.prototype._setValue = function (property, value, source) {
        this._setValueInternal(property, value, source || ValueSource.Local);
    };
    DependencyObservable.prototype._getValueSource = function (property) {
        var entry = this._propertyEntries[property.id];
        if (entry) {
            return entry.valueSource;
        }
        return ValueSource.Default;
    };
    DependencyObservable.prototype._getValue = function (property) {
        var entry = this._propertyEntries[property.id];
        if (entry) {
            return entry.effectiveValue;
        }
        else {
            return this._getDefaultValue(property);
        }
    };
    DependencyObservable.prototype._getDefaultValue = function (property) {
        if (property.defaultValueGetter) {
            // we check for cached properties only for these which have 'defaultValueGetter' defined;
            // When DependencyProperties are removed from Style - fix this check.
            var defaultValueResult = property.defaultValueGetter(this);
            var defaultValue = defaultValueResult.result;
            if (defaultValueResult.cacheable) {
                var entry = new PropertyEntry(property);
                entry.effectiveValue = entry.defaultValue = defaultValue;
                this._propertyEntries[property.id] = entry;
            }
            return defaultValue;
        }
        return property.defaultValue;
    };
    DependencyObservable.prototype._resetValues = function (valueSource) {
        for (var i = 0, keys = Object.keys(this._propertyEntries); i < keys.length; i++) {
            var key = keys[i];
            var entry = this._propertyEntries[key];
            this._resetValueInternal(entry.property, entry, valueSource);
        }
    };
    DependencyObservable.prototype._resetValue = function (property, valueSource) {
        if (valueSource === void 0) { valueSource = ValueSource.Local; }
        var entry = this._propertyEntries[property.id];
        if (!entry) {
            return;
        }
        this._resetValueInternal(property, entry, valueSource);
    };
    DependencyObservable.prototype._resetValueInternal = function (property, entry, valueSource) {
        switch (valueSource) {
            case ValueSource.Inherited:
                entry.inheritedValue = undefined;
                break;
            case ValueSource.Css:
                entry.cssValue = undefined;
                break;
            case ValueSource.Local:
                entry.localValue = undefined;
                break;
            case ValueSource.VisualState:
                entry.visualStateValue = undefined;
                break;
        }
        var currentValueSource = entry.valueSource;
        if (currentValueSource !== valueSource) {
            // If current valueSource is larget than the one we reset - do nothing. 
            // We are reseting property will lower priority and it won't change effectValue;
            // Reseting larger source means we somehow was able to set value without updating currentValueSource which is clearly a bug.
            return;
        }
        var currentValue = entry.effectiveValue;
        var newValue = this.getEffectiveValueAndUpdateEntry(currentValueSource, entry, property);
        if (!property.equalityComparer(currentValue, newValue)) {
            // If we fallback to defalutValue - remove propertyEntry.
            // Don't delete properties with ValueGetters because they will get their default value again
            // and it will be the current native value (if it was set before that, e.g. it will be wrong).
            if (entry.valueSource === ValueSource.Default && !property.defaultValueGetter) {
                delete this._propertyEntries[property.id];
            }
            else {
                entry.effectiveValue = newValue;
            }
            this._onPropertyChanged(property, currentValue, newValue);
        }
    };
    DependencyObservable.prototype._onPropertyChanged = function (property, oldValue, newValue) {
        // let realNewValue = WrappedValue.unwrap(newValue);
        var valueChanged = property.onValueChanged;
        if (valueChanged) {
            valueChanged({
                object: this,
                property: property,
                eventName: observable_1.Observable.propertyChangeEvent,
                newValue: newValue,
                oldValue: oldValue
            });
        }
        var propName = property.name;
        if (this.hasListeners(observable_1.Observable.propertyChangeEvent)) {
            this.notifyPropertyChange(propName, newValue);
        }
        var eventName = property.nameEvent;
        if (this.hasListeners(eventName)) {
            var ngChangedData = {
                eventName: eventName,
                propertyName: propName,
                object: this,
                value: newValue
            };
            this.notify(ngChangedData);
        }
    };
    DependencyObservable.prototype._eachSetProperty = function (callback) {
        for (var i = 0, keys = Object.keys(this._propertyEntries); i < keys.length; i++) {
            var key = keys[i];
            var entry = this._propertyEntries[key];
            if (!callback(entry.property)) {
                break;
            }
        }
    };
    DependencyObservable.prototype._eachSetPropertyValue = function (callback) {
        for (var i = 0, keys = Object.keys(this._propertyEntries); i < keys.length; i++) {
            var key = keys[i];
            var entry = this._propertyEntries[key];
            if (entry.valueSource === ValueSource.Default) {
                continue;
            }
            if (!callback(entry.property, entry.effectiveValue)) {
                break;
            }
        }
    };
    DependencyObservable.prototype._setValueInternal = function (property, value, source) {
        if (value === properties_1.unsetValue) {
            this._resetValue(property, source);
            return;
        }
        var wrapped = value && value.wrapped;
        var realValue = wrapped ? observable_1.WrappedValue.unwrap(value) : value;
        var validate = property.onValidateValue;
        if (validate && !validate(realValue)) {
            throw new Error("Invalid value " + realValue + " for property " + property.name);
        }
        // Convert the value to the real property type in case it is coming as a string from CSS or XML.
        var converter = property.valueConverter;
        if (converter && types_1.isString(realValue)) {
            realValue = converter(realValue);
        }
        var entry = this._propertyEntries[property.id];
        var currentValue;
        if (!entry) {
            entry = new PropertyEntry(property);
            entry.effectiveValue = this._getDefaultValue(property);
            this._propertyEntries[property.id] = entry;
        }
        currentValue = entry.effectiveValue;
        switch (source) {
            case ValueSource.Inherited:
                entry.inheritedValue = realValue;
                break;
            case ValueSource.Css:
                entry.cssValue = realValue;
                break;
            case ValueSource.Local:
                entry.localValue = realValue;
                break;
            case ValueSource.VisualState:
                entry.visualStateValue = realValue;
                break;
        }
        var currentValueSource = entry.valueSource;
        if (currentValueSource > source) {
            return;
        }
        else if (currentValueSource < source) {
            entry.valueSource = source;
        }
        if (wrapped || !property.equalityComparer(currentValue, realValue)) {
            entry.effectiveValue = realValue;
            this._onPropertyChanged(property, currentValue, realValue);
        }
    };
    DependencyObservable.prototype.getEffectiveValueAndUpdateEntry = function (currentValueSource, entry, property) {
        var newValue;
        switch (currentValueSource) {
            case ValueSource.Inherited:
                newValue = property.defaultValue;
                entry.valueSource = ValueSource.Default;
                break;
            case ValueSource.Css:
                if (entry.inheritedValue !== undefined) {
                    newValue = entry.inheritedValue;
                    entry.valueSource = ValueSource.Inherited;
                }
                else {
                    newValue = entry.defaultValue !== undefined ? entry.defaultValue : property.defaultValue;
                    entry.valueSource = ValueSource.Default;
                }
                break;
            case ValueSource.Local:
                if (entry.cssValue !== undefined) {
                    newValue = entry.cssValue;
                    entry.valueSource = ValueSource.Css;
                }
                else if (entry.inheritedValue !== undefined) {
                    newValue = entry.inheritedValue;
                    entry.valueSource = ValueSource.Inherited;
                }
                else {
                    newValue = entry.defaultValue !== undefined ? entry.defaultValue : property.defaultValue;
                    entry.valueSource = ValueSource.Default;
                }
                break;
            case ValueSource.VisualState:
                if (entry.localValue !== undefined) {
                    newValue = entry.localValue;
                    entry.valueSource = ValueSource.Local;
                }
                else if (entry.cssValue !== undefined) {
                    newValue = entry.cssValue;
                    entry.valueSource = ValueSource.Css;
                }
                else if (entry.inheritedValue !== undefined) {
                    newValue = entry.inheritedValue;
                    entry.valueSource = ValueSource.Inherited;
                }
                else {
                    newValue = entry.defaultValue !== undefined ? entry.defaultValue : property.defaultValue;
                    entry.valueSource = ValueSource.Default;
                }
                break;
        }
        return newValue;
    };
    return DependencyObservable;
}(observable_1.Observable));
exports.DependencyObservable = DependencyObservable;
