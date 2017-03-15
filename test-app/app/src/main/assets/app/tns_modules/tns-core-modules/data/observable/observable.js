"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _wrappedIndex = 0;
var WrappedValue = (function () {
    function WrappedValue(wrapped) {
        this.wrapped = wrapped;
    }
    WrappedValue.unwrap = function (value) {
        return (value && value.wrapped) ? value.wrapped : value;
    };
    WrappedValue.wrap = function (value) {
        var w = _wrappedValues[_wrappedIndex++ % 5];
        w.wrapped = value;
        return w;
    };
    return WrappedValue;
}());
exports.WrappedValue = WrappedValue;
var _wrappedValues = [
    new WrappedValue(null),
    new WrappedValue(null),
    new WrappedValue(null),
    new WrappedValue(null),
    new WrappedValue(null)
];
var Observable = (function () {
    function Observable() {
        this._observers = {};
    }
    Observable.prototype.get = function (name) {
        return this[name];
    };
    Observable.prototype.set = function (name, value) {
        // TODO: Parameter validation
        if (this[name] === value) {
            return;
        }
        var newValue = WrappedValue.unwrap(value);
        this[name] = newValue;
        this.notifyPropertyChange(name, newValue);
    };
    Observable.prototype.on = function (eventNames, callback, thisArg) {
        this.addEventListener(eventNames, callback, thisArg);
    };
    Observable.prototype.off = function (eventNames, callback, thisArg) {
        this.removeEventListener(eventNames, callback, thisArg);
    };
    Observable.prototype.addEventListener = function (eventNames, callback, thisArg) {
        if (typeof eventNames !== "string") {
            throw new TypeError("Events name(s) must be string.");
        }
        if (typeof callback !== "function") {
            throw new TypeError("callback must be function.");
        }
        var events = eventNames.split(",");
        for (var i = 0, l = events.length; i < l; i++) {
            var event_1 = events[i].trim();
            var list = this._getEventList(event_1, true);
            // TODO: Performance optimization - if we do not have the thisArg specified, do not wrap the callback in additional object (ObserveEntry)
            list.push({
                callback: callback,
                thisArg: thisArg
            });
        }
    };
    Observable.prototype.removeEventListener = function (eventNames, callback, thisArg) {
        if (typeof eventNames !== "string") {
            throw new TypeError("Events name(s) must be string.");
        }
        if (callback && typeof callback !== "function") {
            throw new TypeError("callback must be function.");
        }
        var events = eventNames.split(",");
        for (var i = 0, l = events.length; i < l; i++) {
            var event_2 = events[i].trim();
            if (callback) {
                var list = this._getEventList(event_2, false);
                if (list) {
                    var index_1 = this._indexOfListener(list, callback, thisArg);
                    if (index_1 >= 0) {
                        list.splice(index_1, 1);
                    }
                    if (list.length === 0) {
                        delete this._observers[event_2];
                    }
                }
            }
            else {
                this._observers[event_2] = undefined;
                delete this._observers[event_2];
            }
        }
    };
    Observable.prototype.notify = function (data) {
        var observers = this._observers[data.eventName];
        if (!observers) {
            return;
        }
        for (var i = observers.length - 1; i >= 0; i--) {
            var entry = observers[i];
            if (entry.thisArg) {
                entry.callback.apply(entry.thisArg, [data]);
            }
            else {
                entry.callback(data);
            }
        }
    };
    Observable.prototype.notifyPropertyChange = function (name, newValue) {
        this.notify(this._createPropertyChangeData(name, newValue));
    };
    Observable.prototype.hasListeners = function (eventName) {
        return eventName in this._observers;
    };
    Observable.prototype._createPropertyChangeData = function (name, value) {
        return {
            eventName: Observable.propertyChangeEvent,
            propertyName: name,
            object: this,
            value: value
        };
    };
    Observable.prototype._emit = function (eventNames) {
        var events = eventNames.split(",");
        for (var i = 0, l = events.length; i < l; i++) {
            var event_3 = events[i].trim();
            this.notify({ eventName: event_3, object: this });
        }
    };
    Observable.prototype._getEventList = function (eventName, createIfNeeded) {
        if (!eventName) {
            throw new TypeError("EventName must be valid string.");
        }
        var list = this._observers[eventName];
        if (!list && createIfNeeded) {
            list = [];
            this._observers[eventName] = list;
        }
        return list;
    };
    Observable.prototype._indexOfListener = function (list, callback, thisArg) {
        for (var i = 0; i < list.length; i++) {
            var entry = list[i];
            if (thisArg) {
                if (entry.callback === callback && entry.thisArg === thisArg) {
                    return i;
                }
            }
            else {
                if (entry.callback === callback) {
                    return i;
                }
            }
        }
        return -1;
    };
    Observable.propertyChangeEvent = "propertyChange";
    return Observable;
}());
exports.Observable = Observable;
var ObservableFromObject = (function (_super) {
    __extends(ObservableFromObject, _super);
    function ObservableFromObject() {
        _super.apply(this, arguments);
        this._map = {};
    }
    ObservableFromObject.prototype.set = function (name, value) {
        var currentValue = this._map[name];
        if (currentValue === value) {
            return;
        }
        var newValue = WrappedValue.unwrap(value);
        this._map[name] = newValue;
        this.notifyPropertyChange(name, newValue);
    };
    return ObservableFromObject;
}(Observable));
function defineNewProperty(target, propertyName) {
    Object.defineProperty(target, propertyName, {
        get: function () {
            return target._map[propertyName];
        },
        set: function (value) {
            target.set(propertyName, value);
        },
        enumerable: true,
        configurable: true
    });
}
function addPropertiesFromObject(observable, source, recursive) {
    if (recursive === void 0) { recursive = false; }
    var isRecursive = recursive;
    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            if (isRecursive) {
                if (!Array.isArray(source[prop]) && source[prop] && typeof source[prop] === 'object' && !(source[prop] instanceof Observable)) {
                    source[prop] = fromObjectRecursive(source[prop]);
                }
            }
            defineNewProperty(observable, prop);
            observable.set(prop, source[prop]);
        }
    }
}
function fromObject(source) {
    var observable = new ObservableFromObject();
    addPropertiesFromObject(observable, source, false);
    return observable;
}
exports.fromObject = fromObject;
function fromObjectRecursive(source) {
    var observable = new ObservableFromObject();
    addPropertiesFromObject(observable, source, true);
    return observable;
}
exports.fromObjectRecursive = fromObjectRecursive;
