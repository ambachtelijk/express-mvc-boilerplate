"use strict"
/**
 * Include some goodies from PHP
 */
String.prototype.ucfirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.ucwords = function() {
    return this.replace(/\b([a-z])/g, function(char) {
        return char.toUpperCase();
    });
};

String.prototype.CamelCase = function() {
    return this.toLowerCase().replace(/((^|[^\w])[\w])/g, function(char) {
        return char.substr(char.length - 1).toUpperCase();
    });
};

String.prototype.camelCase = function() {
    return this.toLowerCase().replace(/(([^\w])[\w])/g, function(char) {
        return char.substr(char.length - 1).toUpperCase();
    });
};

// Source: http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
String.prototype.escape = function() {
    return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

String.prototype.trim2 = function(chars) {
    return this.replace(new RegExp("^["+chars.escape()+"]+|["+chars.escape()+"]+$", "g"), '');
};

// Source: http://stackoverflow.com/questions/12744995/finding-the-nth-occurrence-of-a-character-in-a-string-in-javascript
String.prototype.indexOfNth = function(needle, nth) {
    if(this === undefined) return false;
    for (let i = 0; i < this.length; i++) {
        if (this.charAt(i) === needle) {
            if (--nth === 0) {
               return i;    
            }
        }
    }
    return -1;
}

// Source: http://phpjs.org/functions/array_combine/
(function(){
    GLOBAL.array_combine = function(keys, values) {
        var new_array = {},
            keycount = keys && keys.length,
            i = 0;

        // input sanitation
        if (typeof keys !== 'object' || typeof values !== 'object' || // Only accept arrays or array-like objects
            typeof keycount !== 'number' || typeof values.length !== 'number' || !keycount) { // Require arrays to have a count
            return false;
        }

        // number of elements does not match
        if (keycount !== values.length) {
            return false;
        }

        for (i = 0; i < keycount; i++) {
            new_array[keys[i]] = values[i];
        }

        return new_array;
    }
}());

/**
 * Original by John Resig http://ejohn.org/
 * Modified by Rick van Ravensberg to provide better support for class properties http://plankje.eu
 */
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\bparent\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  GLOBAL.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function extend(prop) {
    var parent = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this;
    initializing = false;

    var properties = {};
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      if(typeof prop[name] === "function" &&
        typeof parent[name] === "function" && fnTest.test(prop[name])) {
      prototype[name] = 
        (function(name, fn){
          return function() {
            var tmp = this.parent;
           
            // Add a new .parent() method that is the same method
            // but on the super-class
            this.parent = parent[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this.parent = tmp;
           
            return ret;
          };
        })(name, prop[name]);
      } else if(typeof prop[name] === "function") {

        prototype[name] = prop[name];
      } else {
        prototype[name] = prop[name];
      }
    }
    
    
    /*
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] === "function" &&
        typeof parent[name] === "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this.parent;
           
            // Add a new .parent() method that is the same method
            // but on the super-class
            this.parent = parent[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this.parent = tmp;
           
            return ret;
          };
        })(name, prop[name]) : prop[name];
    }
    */
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = extend;
   
    return Class;
  };
}());