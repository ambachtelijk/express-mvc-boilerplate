"use strict"
var merge = require('merge');
var HttpError = require('http-errors');
var Path = require('path');

module.exports = BaseController.extend({
    view: {
        file: '',
        params: {
            partials: {}
        }
    },
    before: function(next) {
        this.view.file = this.req.route;
        next();
    },
    after: function(next) {
        if(this.res.headersSent) {
            return true;
        }

        var partials = {};
        // Parse route for partials set not by config
        for(var i in this.view.params.partials) {
            partials[i] = Path.join(this.req.route, this.view.params.partials[i]);
        }

        // Merge partials with configuration partials
        partials = merge(true, { _content: this.view.file }, this.config.partials, partials);
        // Test if the partials do exist to prevent hard-to-solve issues
        for(var i in partials) {
            try {
                require.resolve(Path.join(app.basedir, app.config.path.view, partials[i] + '.hjs'));
            } catch(e) {
                throw new HttpError(404, 'Partial ' + partials[i] + ' Not Found');
            }
        }
        // Do the actial rendering
        this.res.render(this.config.layout, merge(true, this.view.params, { partials: partials }));
        next();
    },
    init: function(req, res) {
        // Load specific settings for the WebController
        this.view = merge(true, this.view, {});
        this.config = merge(true, this.config, app.config.web);
        
        this.parent(req, res);
    }
});