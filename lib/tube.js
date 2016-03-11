var tfl = require('./tfl')
  , _ = require('underscore')
  , linesFile = __dirname + '/../fixtures/lines.json'
  , stationsFile = __dirname + '/../fixtures/stations.json'
;

var Tube = function() { };

Tube.prototype.line = { };
Tube.prototype.lines = {
    'endpoints' : {
        'status': '/TrackerNet/LineStatus',
        'incidents': '/TrackerNet/LineStatus/IncidentsOnly',
        'prediction': '/PredictionSummary/{line}',
    },
    'values': require(linesFile),
};
Tube.prototype.stations = {
    'endpoints' : {
        'status': '/TrackerNet/StationStatus',
        'incidents': '/TrackerNet/StationStatus/IncidentsOnly',
        'prediction': '/PredictionSummary/{line}/{station}',
    },
    'values': require(stationsFile)
};

// Retrieve the status of lines on the tube network
Tube.prototype.lines.status = function(options) {
    var endpoint
      , statuses
      , promise
      , self = this
    ;

    options = _.defaults(options || {}, {
        lines: [],
        incidents: false,
    });

    endpoint = (options.incidents)
        ? this.endpoints.incidents
        : this.endpoints.status;

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
                return options.lines.indexOf(line.name) > -1
                    || options.lines.indexOf(self.values[line.name].code) > -1;
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

    endpoint = (station)
        ? this.stations.endpoints.prediction.replace('{line}', line).replace('{station}', station)
        : this.lines.endpoints.prediction.replace('{line}', line);

    promise = tfl.getNodes(endpoint, 'S', function(node) {
        var platforms = []
          , platformNodes
          , trainNodes
        ;

        platformNodes = node.childNodes();

        Object.keys(platformNodes).forEach(function(p) {
            platform = {
                'name': platformNodes[p].attr('N').value(),
                'trains': []
            };

            trainNodes = platformNodes[o].childNodes();
            Object.keys(trainNodes).forEach(function(t) {
                platform.trains.push({
                    'time_to_station': child.attr('C').value(),
                    'location': child.attr('L').value(),
                    'destination': child.attr('DE').value(),
                });
            });

            platforms.push(platform);
        });

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
    //this = Tube.stations
    endpoint = (options.incidents)
        ? this.endpoints.incidents
        : this.endpoints.status;

    promise = tfl.getNodes(endpoint, 'StationStatus', function(node) {
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

Tube.prototype.status = function(options){return Tube.prototype.lines.status(options)};

module.exports = new Tube();
