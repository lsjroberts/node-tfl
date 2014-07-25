var tfl = require('./tfl')
  , _ = require('underscore')
;

var Road = function() { };

Road.prototype.incidents = function() {
    var endpoint
      , statuses
      , promise
    ;

    options = _.defaults(options || {}, {
        roads: [],
    });

    endpoint = '/foo';
};

Road.prototype.cameras = function() { };