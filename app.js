var Php = require('./php'); 
var Fs = require('fs');
var Path = require('path');
var Favicon = require('serve-favicon');
var Less = require('less-middleware');
var Logger = require('morgan');
var Sequelize = require('sequelize');
var CookieParser = require('cookie-parser');
var BodyParser = require('body-parser');


// Load Express.js and create an instance of the app
var Express = require('express');

// Set app as global variable
(function(){
    this.app = Express();
}());

app.basedir = __dirname;
app.config = {};

// Load all config files
Fs.readdirSync('./config').forEach(function(filename) {
    if(~filename.indexOf('.json')) {
        app.config[filename.slice(0, filename.indexOf('.json'))] = require('./config/' + filename);
    }
});

// Connect to database
if(app.config.db) {
    var db = new Sequelize(app.config.db.database, app.config.db.username, app.config.db.password, app.config.db.options);
    app.use(function(req, res, next) {
        req.db = db;
        next();
    });
}

// Set up view renderer
app.locals.delimiters = '[[ ]]'; // Change Hogan delimiters to avoid conflicts with Angular

app.set('views', app.config.path.view || 'view');
app.set('view engine', 'hjs');

// Front end interaction
//app.use(Favicon(Path.join(__dirname, 'public', 'favicon.ico')));app.use(logger('dev'));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));
app.use(CookieParser());
app.use(Less(Path.join(app.basedir, app.config.path.public || 'public')));
app.use(Express.static(Path.join(app.basedir, app.config.path.public || 'public')));

// This is where the magic happens: route the request
app.use(require(Path.join(app.basedir, 'router')));

// Catch errors
app.use(function(error, req, res, next) {
    res
        .status(error.status || 500)
        .render('error', {
            message: error.message,
            error: app.get('env') === 'development' ? error : {}
        });
});
module.exports = app;
