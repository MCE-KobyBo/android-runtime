"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var observable = require("../observable");
var types = require("../../utils/types");
var ChangeType = (function () {
    function ChangeType() {
    }
    ChangeType.Add = "add";
    ChangeType.Delete = "delete";
    ChangeType.Update = "update";
    ChangeType.Splice = "splice";
    return ChangeType;
}());
exports.ChangeType = ChangeType;
var CHANGE = "change";
var ObservableArray = (function (_super) {
    __extends(ObservableArray, _super);
    function ObservableArray() {
        _super.call(this);
        if (arguments.length === 1 && Array.isArray(arguments[0])) {
            this._array = arguments[0].slice();
        }
        else {
            this._array = Array.apply(null, arguments);
        }
        this._addArgs = {
            eventName: CHANGE, object: this,
            action: ChangeType.Add,
            index: null,
            removed: new Array(),
            addedCount: 1
        };
        this._deleteArgs = {
            eventName: CHANGE, object: this,
            action: ChangeType.Delete,
            index: null,
            removed: null,
            addedCount: 0
        };
    }
    ObservableArray.prototype.getItem = function (index) {
        return this._array[index];
    };
    ObservableArray.prototype.setItem = function (index, value) {
        var oldValue = this._array[index];
        this._array[index] = value;
        this.notify({
            eventName: CHANGE, object: this,
            action: ChangeType.Update,
            index: index,
            removed: [oldValue],
            addedCount: 1
        });
    };
    Object.defineProperty(ObservableArray.prototype, "length", {
        /**
         * Gets or sets the length of the array. This is a number one higher than the highest element defined in an array.
         */
        get: function () {
            return this._array.length;
        },
        set: function (value) {
            if (types.isNumber(value) && this._array && this._array.length !== value) {
                this.splice(value, this._array.length - value);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a string representation of an array.
     */
    ObservableArray.prototype.toString = function () {
        return this._array.toString();
    };
    ObservableArray.prototype.toLocaleString = function () {
        return this._array.toLocaleString();
    };
    /**
     * Combines two or more arrays.
     * @param items Additional items to add to the end of array1.
     */
    ObservableArray.prototype.concat = function () {
        this._addArgs.index = this._array.length;
        var result = this._array.concat.apply(this._array, arguments);
        return result;
    };
    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
     */
    ObservableArray.prototype.join = function (separator) {
        return this._array.join(separator);
    };
    /**
     * Removes the last element from an array and returns it.
     */
    ObservableArray.prototype.pop = function () {
        this._deleteArgs.index = this._array.length - 1;
        var result = this._array.pop();
        this._deleteArgs.removed = [result];
        this.notify(this._deleteArgs);
        this._notifyLengthChange();
        return result;
    };
    /**
     * Appends new elements to an array, and returns the new length of the array.
     * @param item New element of the Array.
     */
    ObservableArray.prototype.push = function () {
        this._addArgs.index = this._array.length;
        if (arguments.length === 1 && Array.isArray(arguments[0])) {
            var source = arguments[0];
            for (var i = 0, l = source.length; i < l; i++) {
                this._array.push(source[i]);
            }
        }
        else {
            this._array.push.apply(this._array, arguments);
        }
        this._addArgs.addedCount = this._array.length - this._addArgs.index;
        this.notify(this._addArgs);
        this._notifyLengthChange();
        return this._array.length;
    };
    ObservableArray.prototype._notifyLengthChange = function () {
        var lengthChangedData = this._createPropertyChangeData("length", this._array.length);
        this.notify(lengthChangedData);
    };
    /**
     * Reverses the elements in an Array.
     */
    ObservableArray.prototype.reverse = function () {
        return this._array.reverse();
    };
    /**
     * Removes the first element from an array and returns it.
     */
    ObservableArray.prototype.shift = function () {
        var result = this._array.shift();
        this._deleteArgs.index = 0;
        this._deleteArgs.removed = [result];
        this.notify(this._deleteArgs);
        this._notifyLengthChange();
        return result;
    };
    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array.
     */
    ObservableArray.prototype.slice = function (start, end) {
        return this._array.slice(start, end);
    };
    /**
     * Sorts an array.
     * @param compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
     */
    ObservableArray.prototype.sort = function (compareFn) {
        return this._array.sort(compareFn);
    };
    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @param items Elements to insert into the array in place of the deleted elements.
     */
    ObservableArray.prototype.splice = function (start, deleteCount) {
        var length = this._array.length;
        var result = this._array.splice.apply(this._array, arguments);
        this.notify({
            eventName: CHANGE, object: this,
            action: ChangeType.Splice,
            index: start,
            removed: result,
            addedCount: this._array.length > length ? this._array.length - length : 0
        });
        if (this._array.length !== length) {
            this._notifyLengthChange();
        }
        return result;
    };
    /**
     * Inserts new elements at the start of an array.
     * @param items  Elements to insert at the start of the Array.
     */
    ObservableArray.prototype.unshift = function () {
        var length = this._array.length;
        var result = this._array.unshift.apply(this._array, arguments);
        this._addArgs.index = 0;
        this._addArgs.addedCount = result - length;
        this.notify(this._addArgs);
        this._notifyLengthChange();
        return result;
    };
    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
     */
    ObservableArray.prototype.indexOf = function (searchElement, fromIndex) {
        var index = fromIndex ? fromIndex : 0;
        for (var i = index, l = this._array.length; i < l; i++) {
            if (this._array[i] === searchElement) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Returns the index of the last occurrence of a specified value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
     */
    ObservableArray.prototype.lastIndexOf = function (searchElement, fromIndex) {
        var index = fromIndex ? fromIndex : this._array.length - 1;
        for (var i = index; i >= 0; i--) {
            if (this._array[i] === searchElement) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param callbackfn A function that accepts up to three arguments. The every method calls the callbackfn function for each element in array1 until the callbackfn returns false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    ObservableArray.prototype.every = function (callbackfn, thisArg) {
        return this._array.every(callbackfn, thisArg);
    };
    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param callbackfn A function that accepts up to three arguments. The some method calls the callbackfn function for each element in array1 until the callbackfn returns true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    ObservableArray.prototype.some = function (callbackfn, thisArg) {
        return this._array.some(callbackfn, thisArg);
    };
    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    ObservableArray.prototype.forEach = function (callbackfn, thisArg) {
        this._array.forEach(callbackfn, thisArg);
    };
    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    ObservableArray.prototype.map = function (callbackfn, thisArg) {
        return this._array.map(callbackfn, thisArg);
    };
    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    ObservableArray.prototype.filter = function (callbackfn, thisArg) {
        return this._array.filter(callbackfn, thisArg);
    };
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    ObservableArray.prototype.reduce = function (callbackfn, initialValue) {
        return this._array.reduce(callbackfn, initialValue);
    };
    /**
     * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    ObservableArray.prototype.reduceRight = function (callbackfn, initialValue) {
        return this._array.reduceRight(callbackfn, initialValue);
    };
    ObservableArray.changeEvent = CHANGE;
    return ObservableArray;
}(observable.Observable));
exports.ObservableArray = ObservableArray;
