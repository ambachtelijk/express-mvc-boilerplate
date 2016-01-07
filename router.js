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
    try {
        var basedir = app.config.path.controller.basedir;
        var suffix = app.config.path.controller.suffix;

        // Protection against URL injection by only allowing certain characters
        var route = path = req.path.replace(/[^\w-\/]/g,'').toLowerCase().trim2('/');

        /**
         * @todo add caching for loading controllers
         */
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
        req.controller = req.controller || app.config.path.controller.name;

        // Get the remaining path: first element is the action
        req.action = path.length !== route.length 
            ? route.slice(path.length + 1).split('/').shift()
            : app.config.path.controller.action || 'index';

        // Set the route
        req.route = Path.join(req.directory, req.controller, req.action); 

        // Take the original unfiltered request and cut off the URI elements that belong to the route
        req.params = req.path.trim2('/').split('/').splice(req.route.split('/').length);

        var filename = Path.join(app.basedir, basedir, req.directory, req.controller.CamelCase() + suffix);

        // Try to locate the file, otherwise it may be a request intended to the public folder
        try {
            Fs.statSync(filename);
        } catch(error) {
            throw new HttpError(404);
        }

        // Load the file as code
        try {
            var Controller = require(filename);
        } catch(error) {
            console.log(error); // These are errors that we are interested in developer mode
            throw new HttpError(500, 'JavaScript error in ' + Path.join(req.directory, req.controller.CamelCase() + suffix));
        }
        
        // Bind the arguments to this object
        // Only give methods as arguments, properties will cause severe scope issues
        // http://www.2ality.com/2012/08/property-definition-assignment.html
        var controller = new Controller(req, res);

        if(typeof Controller !== 'function') {
            throw new HttpError(500, 'No valid controller found in ' + Path.join(req.directory, req.controller.CamelCase() + suffix));
        }
        
        if(!(controller instanceof BaseController)) {
            throw new HttpError(500, req.controller.CamelCase() + suffix + ' does not inherit from Base' + suffix);
        }
    } catch(error) {
        throw error; // @todo, implement standard error handler; for now just rethrow
    }
    
    // From here we have errors that can be dealt with
    try {
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


        if(typeof controller[req.action.camelCase() + 'Action'] !== 'function') {
            throw new HttpError(404, req.action.camelCase() + 'Action Not Found');
        }

        // Dispatch the route
        controller.run(req.action, next);
    } catch(error) {
        controller.errorHandler(next, error);
    }
});
