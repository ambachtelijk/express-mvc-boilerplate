"use strict"
var HttpError = require('http-errors');
var Path = require('path');

module.exports = ApiController.extend({
    searchAction: function(next, key, value) {
        if(key !== 'all' && value === undefined) {
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
            case 'all':
                break;
            default:
                throw new HttpError(400, 'Invalid key (' + key + '), please use name, id, alpha2 or alpha3');
        }

        return Country.findAll({where: where}).bind(this).then(function(countries) {
            this.res.data = JSON.parse(JSON.stringify(countries));
            next();
        });
    },
    createAction: function(next) {
        let Country = app.db.import(Path.join(app.basedir, app.config.path.model, 'Country'));
        return Country.create(this.req.body).bind(this).then(function(country) {
            this.res.data = JSON.parse(JSON.stringify(country));
            next();
        });
    },
    readAction: function(next, id) {
        if(id === undefined) {
            throw new HttpError(400, 'Request did not match expected formatting, e.g. country/read/id');
        }
        
        let Country = app.db.import(Path.join(app.basedir, app.config.path.model, 'Country'));
        
        return Country.findById(id).bind(this).then(function(country) {
            this.res.data = JSON.parse(JSON.stringify(country));
        }).then(next);
    },
    updateAction: function(next, id) {
        if(id === undefined) {
            throw new HttpError(400, 'Request did not match expected formatting, e.g. country/update/id');
        }
        
        let Country = app.db.import(Path.join(app.basedir, app.config.path.model, 'Country'));
        
        return Country.findById(id).bind(this).then(function(country) {
            return country.updateAttributes(this.req.body);
        }).then(function(country) {
            this.res.data = JSON.parse(JSON.stringify(country));
        }).then(next);
    },
    deleteAction: function(next, id) {
        if(id === undefined) {
            throw new HttpError(400, 'Request did not match expected formatting, e.g. country/delete/id');
        }
        
        let Country = app.db.import(Path.join(app.basedir, app.config.path.model, 'Country'));
        return Country.findById(id).bind(this).then(function(country) {
            return country.destroy();
        }).then(next);
    }
});