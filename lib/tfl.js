var request = require('request')
  , q = require('q')
  , libxml = require('libxmljs')
;

var TFL = function() {
    this.baseUrl = 'http://cloud.tfl.gov.uk';
};

// Send a request to an api endpoint with an optional root node to iterate on.
// Creates and returns a promise for the request.
TFL.prototype.get = function(uri, root) {
    var deferred = q.defer()
      , xml
      , nodes
    ;

    this.promise = deferred.promise;

    console.log('GET:', {
        'url': this.baseUrl + uri
    });

    request({
        url: this.baseUrl + uri
    }, function(error, response, body) {
        if (error) {
            console.log('ERROR', error);
            deferred.resolve(false);
            return this.promise;
        }

        xml = libxml.parseXml(body);

        if (root) {
            nodes = xml.get('//' + root).childNodes();
        } else {
            nodes = xml.root().childNodes();
        }

        deferred.resolve(nodes);
    }.bind(this));

    return this.promise;
};

TFL.prototype.getNodes = function(endpoint, nodeNameFilter, pushCallback, elementsFilterCallback) {
    var endpoint
      , statuses
      , promise
    ;

    promise = this.get(endpoint);

    return promise.then(function(nodes) {
        var elements = []
          , n
          , node
        ;

        if (!nodes || nodes.length == 0) {
            console.log('No nodes found');
            return [];
        }

        for (n in nodes) {
            node = nodes[n];
            if (node.name() == nodeNameFilter) {
                elements.push(pushCallback(node));
            }
        }

        elementsFilterCallback(elements);

        return elements;
    });
};

module.exports = new TFL();