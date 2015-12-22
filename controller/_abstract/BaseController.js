var HttpError = require('http-errors');
var Promise = require("bluebird");
var merge = require('merge');

module.exports = Class.extend({
    config: {},
    before: function(next) { next(); },
    after: function(next) { next(); this.res.send('Ok!'); },
    init: function(globals) {
        merge.recursive(this.config, app.config.web);
        merge(this, globals);
    },
    run: function(action) {
        var self = this;
        Promise.try(function(){
            return new Promise(function(next) {
                self.before(next);
            });
        }).then(function(){
            return new Promise(function(next) {
                self[action.camelCase() + 'Action'].apply(self, [].concat(next, self.req.params));
            });
        }).then(function(){
            return new Promise(function(next) {
                self.after(next);
            });
        });
    }
})