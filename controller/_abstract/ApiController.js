"use strict"
var HttpError = require('http-errors');

module.exports = BaseController.extend({
    before: function(next) {
        this.res.type('json');
        this.res.data = {};
        next();
    },
    after: function(next, error) {
        // Everything went just fine
        if(error === undefined) {
            var error = new HttpError(200);
        }
        
        this.res.status(error.status);
        this.res.json({
            status: error.status,
            message: error.message,
            response: this.res.data
        });
        next();
    },
    errorHandler: function(next, error) {
        this.after(next, error);
    }
});