# TFL - Node

This is a node package for interacting with the [Transport for London](http://tfl.co.uk) (TFL) api.

It comes with a tool for accessing this data directly via the command line, or can be used within your own projects.

## Installation

Install with:

```
$ npm install -g tfl
```

_move binary to /usr/local/bin ?_

## Command-line Tool

### Tube

**Line Status**
```
$ tfl tube --line District
```

**Station Status**
```
$ tfl tube --station Aldgate East
```

### Overground
```
$ tfl overground --station London Bridge
```

### Buses
```
$ tfl bus --route 66
```

### Cycle Hire
```
$ tfl cycle ...
```

### Roads

**Road Status**
```
$ tfl road --name Park Lane
```

**Route Status**
This will perform a search for the typical route taken between two roads and retrieve the statuses for each road on the route.
```
$ tfl road --from "Whitechapel Road" --to "Park Lane"
```

**Road Traffic Cam**
```
$ tfl road --camera Park Lane
```

## Using the package in your own projects

Require the tfl package as usual:

```js
var tfl = require('tfl');
```

Since each command sends a request to the TFL api, the response is returned in a promise. For example, to get the current list of incidents on tube lines you can call:

```js
tfl.tube.status({
    'incidents': true,
}).then(function(lines) {
    console.log(lines);
});
```

The function passed into `then()` will be called asynchronously once the request to the api has returned and been processed.

### Services

#### Tube / Overground

**Status**
```js
tfl.tube.status();
tfl.overground.status();
```

**Incidents**
```js
tfl.tube.status({ 'incidents': true });
tfl.overground.status({ 'incidents': true });
```

**Line**
```js
tfl.tube.line('District');
// Overground services do not provide line information
```

**Station**
```js
tfl.tube.station('Aldgate East');
tfl.overground.station('London Bridge');
```

**Journey**
```js
tfl.tube.journey(['Monument', 'Aldgate East']);
tfl.overground.journey(['East Croydon', 'Victoria', 'Shoreditch High Street']);
```

#### Bus
...

#### Cycle
...

#### Road
...