# 261claim.eu
261claim.eu is a webbased app built on ExpressJS.

### Table of contents
1. [Dependencies](#dependencies)
2. [Installation](#installation)
3. [Routing](#routing)
4. [MVC setup](#mvc-setup)

## Dependencies
Make sure the following dependencies have been installed on the target machine and are accessible from the project folder. All the Node.js specific dependencies are defined by `package.json` and don't require separate installation.

* Node.js
* NPM (node package manager)
* MySQL server
* Nodemon (optional)

## Installation

1. Pull this project from GitHub.
2. Run `npm install` in the project directory.
3. Create a MySQL database and add the credentials in JSON format to `configs/db.json`.
4. Run `node mysql.install.js` (file is not yet included, so don't bother trying).
5. Run `nodemon bin/www` from the project directory.
6. By default the app runs locally on port 3000. Go to `http://localhost:3000` in your web browser. Replace `localhost` with the IP address of your server, if the app has been installed remotely.
7. Enjoy :).
 
## Routing
A custom routing schema has been implemented in `router.js` to support autodiscovery of valid routes. Typically, a route has the structure `/<directories>/<controller>/<action>/<params>`. It takes the request path and splits it. Next, the following logic is applied:

1. Shift the first element from `req.path` and test if a directory with this value exists in `app.locals.paths.controllers` (this is the base directory for the controllers).
  1. If `true`, add the value to `req.directory`, apply step 1 with the next element in `req.path`.
  2. If `false`, continue to step 2.
2. Shift the first element from `req.path` and add the value to `req.controller`. If `undefined`, default to `index`.
3. Shift the first element from `req.path` and add the value to `req.action`. If `undefined`, default to `index`.
4. Add the remaining elements from `path` to `req.params`.
5. Determine if the request method is an allowed verb for this action. Search for a value in `app.locals.verbs` in the following order:
  1. Take the value of the complete route as identified by the key `<req.directory>/<req.controller>/<req.action>`, if not defined,
  2. Take the value of the action as identified by the key `<req.action>`, if not defined,
  3. Take the default value as identified by the key `_default`.
6. Run the controller in `app.locals.paths.controllers + '/' + req.directory + '/' + req.controller.CamelCase() + 'Controller'` with action `req.action.camelCase() + 'Action'`. The controller is an object and must be an instance of `BaseController`. The controller object must contain the method with the name of the action (e.g. `indexAction: function() {}`). Throw a 404 error if the controller or action do not exist.

### Example
Based on the HTTP request `GET http://localhost:3000/api/eu261/eligible-route/kl/ams/svo`.

#### Values added to `req` after the routing procedure
These variables will be available in the Controller class.
```javascript
req.directory = 'api'; // The directory ./controllers/api exists and will be used
req.controller = 'Eu261'; // Controller value after CamelCase() has been applied
req.action = 'eligibleRoute'; // Action value after camelCase() has been applied
req.route = 'api/Eu261/eligibleRoute';
req.params = ['kl', 'ams', 'svo'];
```

#### Results of the routing procedure
The following controller file and action are parsed. As you can see, the router will add `Controller` to the value in `req.controller` and `Action` to the value in `req.action`.
- Controller file: `./controllers/api/Eu261Controller.js`
- Action: `eligibleRouteAction()`

## MVC setup
### Model

### View

### Controller
A base controller file has the following structure.
```javascript
/**
 * Route: http://localhost:3000/foo
 * Filename: ./controllers/FooController.js
 */

var merge = require('merge');

// Replace BaseController with any other abstract controller in the _abstract folder
var BaseController = require('./_abstract/BaseController');

module.exports = merge(Object.create(BaseController), {
    indexAction: function() {}
});
```

