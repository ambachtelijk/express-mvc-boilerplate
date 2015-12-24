"use strict"
module.exports = WebController.extend({
    indexAction: function(next) {
        next();
    }
});