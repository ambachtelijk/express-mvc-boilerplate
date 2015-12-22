var Express = require('express');
var Fs = require('fs');
var Path = require('path');
var HttpError = require('http-errors');
var Router = Express.Router();

/**
 * Implement convention over configuration (CoC) paradigm for basic routing and MVC support
 * Should be in any framework by default
 */
module.exports = Router.all('/*', function (req, res, next) {
    var basedir = app.config.path.controller.basedir || './controller';
    var suffix = app.config.path.controller.suffix || 'Controller.js';
    
    // Protection against URL injection by only allowing certain characters
    var route = path = req.path.replace(/[^\w-\/]/g,'').toLowerCase().trim2('/');
    
    while(path !== "") {
        // If there is no / in the remaining path, directory will be empty and controller will be path
        if(path.indexOf('/') === -1) {
            req.directory = '';
            req.controller = path;

        // Take the last / from path as divider between directory and controller 
        } else {
            req.directory = path.slice(0, path.lastIndexOf('/'));
            req.controller = path.slice(path.lastIndexOf('/') + 1);
        }

        try {
            if(Fs.statSync(Path.join(app.basedir, basedir, req.directory, req.controller.CamelCase() + suffix)).isFile()) {
                break;
            }
        } catch(e) {}
        path = req.directory;
    };
    
    // Set default values for directory and controller
    req.directory = req.directory || '';
    req.controller = req.controller || app.config.path.controller.name || 'index';
    
    // Get the remaining path: first element is the action
    req.action = path.length !== route.length 
        ? route.slice(path.length + 1).split('/').shift()
        : app.config.path.controller.action || 'index';

    // Set the route
    req.route = Path.join(req.directory, req.controller, req.action); 
    
    // Take the original unfiltered request and cut off the URI elements that belong to the route
    req.params = req.path.trim2('/').split('/').splice(req.route.split('/').length);
    
    // Find the allowed HTTP verbs for this request
    var verbs = [];
    if(app.config.verb && app.config.verb[req.route]) {
        verbs = app.config.verb[req.route];
    } else if(app.config.verb[req.action]) {
        verbs = app.config.verb[req.action];
    } else {
        verbs = app.config.verb['_default'];
    }

    // Throw Method Not Allowed if unsupported verb
    if(verbs.indexOf(req.method) === -1) {
        throw new HttpError(405);
    }
    
    // Try to include the Controller
    try {
        var Controller = require(Path.join(app.basedir, basedir, req.directory, req.controller.CamelCase() + suffix));
    } catch(error) {
        console.log(error); // Sometimes we're dealing with a syntax error, but that is none of the front end's business
        throw new HttpError(404, Path.join(req.directory, req.controller.CamelCase() + suffix) + ' Not Found');
    }
    
    if(typeof Controller !== 'function') {
        throw new HttpError(500, 'No valid controller found in ' + Path.join(req.directory, req.controller.CamelCase() + suffix));
    }
    
    var controller = new Controller({ req: req, res: res, next: next });

    if(!(controller instanceof require(Path.join(app.basedir, app.config.path.controller.basedir, '_abstract', 'Base' + suffix)))
    ) {
        throw new HttpError(500, req.controller.CamelCase() + suffix + ' does not inherit from Base' + suffix);
    }
    
    // Bind the arguments to this object; typically action, req, res and next
    if(typeof controller[req.action.camelCase() + 'Action'] !== 'function') {
        throw new HttpError(404, req.action.camelCase() + 'Action Not Found');
    }

    // Dispatch the route
    controller.run(req.action);
});
