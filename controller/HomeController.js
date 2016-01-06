"use strict"
var Path = require('path');
module.exports = WebController.extend({
    indexAction: function(next) {
        
        let Country = app.db.import(Path.join(app.basedir, app.config.path.model, 'Country'));

        return Country.findAll(/*{ limit: 2 }*/).bind(this).then(function(countries) {
            this.view.params.countries = countries;
            next();
        });
        next();
    }
});