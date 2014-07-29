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

    promise = tfl.getNodes(endpoint, '???', function(node) {

    }, function(roads) {
        return roads;
    });

    return promise;
};

Road.prototype.cameras = function() {
    var endpoint
      , statuses
      , promise
    ;

    options = _.defaults(options || {}, {
        roads: [],
    });

    endpoint = '/foo';

    promise = tfl.getNodes(endpoint, '???', function(node) {

    }, function(cameras) {
        return cameras;
    });

    return promise;
};