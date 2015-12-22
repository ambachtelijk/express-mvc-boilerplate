var Path = require('path');
var HttpError = require('http-errors');
var Promise = require("bluebird");

var merge = require('merge');
var php = require(Path.join(app.basedir,'php'));

module.exports = Class.extend({
    config: {},
    before: function(honor) { honor(); },
    after: function(honor) { honor(); },
    init: function(globals) {
        merge.recursive(this.config, app.config.web);
        merge(this, globals);
    },
    run: function(action) {
        var self = this;
        Promise.try(function(){
            return new Promise(function(honor) {
                self.before(honor);
            });
        }).then(function(){
            return new Promise(function(honor) {
                self[action.camelCase() + 'Action'].apply(self, [].concat(honor, self.req.params));
            });
        }).then(function(){
            return new Promise(function(honor) {
                self.after(honor);
            });
        });
    }
})