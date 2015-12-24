"use strict"
var HttpError = require('http-errors');
var Path = require('path');

module.exports = ApiController.extend({
    searchAction: function(next, key, value) {
        if(key === undefined || value === undefined) {
            throw new HttpError(400, 'Request did not match expected formatting, e.g. country/search/name/Netherlands');
        }
        
        let Country = app.db.import(Path.join(app.basedir, app.config.path.model, 'Country'));
        
        // Compose query
        let where = {};
        switch(key) {
            case 'name':
                where['$or'] = [{name: {$like: '%'+value+'%'}},{alt_name: {$like: '%'+value+'%'}}];
                break;
            case 'id':
            case 'alpha2':
            case 'alpha3':
                where[key] = value;
                break;
            default:
                throw new HttpError(400, 'Invalid key (' + key + '), please use name, id, alpha2 or alpha3');
        }

        return Country.findAll({where: where}).bind(this).then(function(countries) {
            this.res.data = JSON.parse(JSON.stringify(countries));
            next();
        });
    }
});