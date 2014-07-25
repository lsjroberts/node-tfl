var tfl = require('./tfl')
  , _ = require('underscore')
;

var Tube = function() { };

Tube.prototype.lines = {};
Tube.prototype.stations = {};
Tube.prototype.lineValues = _readJsonFile('../fixutes/lines.json');

// Retrieve the status of lines on the tube network
Tube.prototype.lines.status = function(options) {
    var endpoint
      , statuses
      , promise
    ;

    options = _.defaults(options || {}, {
        lines: [],
        incidents: false,
    });

    endpoint = '/TrackerNet/LineStatus';

    // Optionally filter by incidents only
    if (options.incidents) {
        endpoint += '/IncidentsOnly';
    }

    promise = tfl.getNodes(endpoint, 'LineStatus', function(node) {
        return {
            'name': node.child(3).attr('Name').value(),
            'status': node.child(5).attr('Description').value(),
            'statusDescription': node.attr('StatusDetails').value(),
            'incident': node.child(5).attr('Description').value() !== 'Good Service',
        };
    }, function(lines) {
        if (options.lines.length > 0) {
            lines = lines.filter(function(line) {
                return options.lines.indexOf(line.name) > -1;
            });
        }
        return lines;
    });

    return promise;
};

Tube.prototype.lines.incidents = function(options) {
    options = options || {};
    options.incidents = true;

    return this.lines.status(options);
};

Tube.prototype.line.arrivals = function(name) {
    var endpoint
      , statuses
      , promise
    ;

    options = _.defaults(options || {}, {
        line: false,
        station: false,
    });

    if (! line) {
        return;
    }

    endpoint = '/PredictionSummary/' + this.lineValues[line].code;

    if (station) {
        endpoint += '/' + this.stationValues[station].code;
    }

    promise = tfl.getNodes(endpoint, 'S', function(node) {
        var platforms = []
          , platformNodes
          , trainNodes
        ;

        platformNodes = node.childNodes();

        Object.keys(platformNodes).forEach(p) {
            platform = {
                'name': platformNodes[p].attr('N').value(),
                'trains': []
            };

            trainNodes = platformNodes[o].childNodes();
            Object.keys(trainNodes).forEach(t) {
                platform.trains.push({
                    'time_to_station': child.attr('C').value(),
                    'location': child.attr('L').value(),
                    'destination': child.attr('DE').value(),
                });
            };

            platforms.push(platform);
        }

        return {
            'name': node.attr('N'),
            'platforms': platforms,
        };
    }, function(platforms) {
        return platforms;
    });

    return promise;
};

Tube.prototype.stations.status = function(options) {
    var endpoint
      , statuses
      , promise
    ;

    options = _.defaults(options || {}, {
        stations: [],
        incidents: false,
    });

    endpoint = '/TrackerNet/StationStatus';

    // Optionally filter by incidents only
    if (options.incidents) {
        endpoint += '/IncidentsOnly';
    }

    promise = tfl.getNodes(endpoint, 'LineStatus', function(node) {
        return {
            'name': node.child(1).attr('Name').value(),
            'status': node.child(3).attr('Description').value(),
            'statusDescription': node.attr('StatusDetails').value(),
            'incident': node.child(3).attr('Description').value() !== 'Open',
        };
    }, function(stations) {
        if (options.stations.length > 0) {
            stations = stations.filter(function(station) {
                return options.stations.indexOf(station.name) > -1;
            });
        }
        return stations;
    });

    return promise;
};

Tube.prototype.stations.incidents = function(options) {
    options = options || {};
    options.incidents = true;

    return this.stations.status(options);
}

Tube.prototype.station = function(name) { };

module.exports = new Tube();