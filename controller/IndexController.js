var BaseController = require('./_abstract/BaseController');

module.exports = BaseController.extend({
    indexAction: function() {
        this.res.send('Ok!');
    }
});