"use strict"
var HttpError = require('http-errors');
var Promise = require("bluebird");

module.exports = Class.extend({
    config: {},
    before: function(next) { next(); },
    after: function(next) { next(); },
    init: function(req, res) {
        this.req = req;
        this.res = res;
    },
    run: function(action, next) {
        Promise.try(function() {
            return new Promise(function(next) {
                this.before(next);
            }.bind(this));
        }.bind(this)).then(function() {
            return new Promise(function(next, error) {
                return this[action.camelCase() + 'Action'].apply(this, [next].concat(this.req.params));
            }.bind(this));
        }.bind(this)).then(function() {
            return new Promise(function(next) {
                return this.after(next);
            }.bind(this));
        }.bind(this)).then(function() {
            next();
        }).catch(function(error) {
            console.log(error);
            // Delegate if an error handler has been defined
            this.errorHandler ? this.errorHandler(next, error) : next(error);
        }.bind(this));
    }
});