var http = require('http');
var url  = require('url');
var fs = require('fs');


var PORT = 7744;

var FILE = 'log.json';


var lines = [];
var isDirty = false;


var RK = 6373; // mean radius of the earth (km) at 39 degrees from the equator
var DEG2RAD = Math.PI / 180;


var findDistance = function(lat1, lon1, lat2, lon2) {
  // convert coordinates to radians
  lat1 *= DEG2RAD;
  lon1 *= DEG2RAD;
  lat2 *= DEG2RAD;
  lon2 *= DEG2RAD;

  // find the differences between the coordinates
  var dlat = lat2 - lat1;
  var dlon = lon2 - lon1;

  // here's the heavy lifting
  var a = Math.pow(
    Math.sin(dlat/2),
    2
  ) +
  Math.pow(
    Math.sin(dlon/2) *
    Math.cos(lat1) *
    Math.cos(lat2),
    2
  );

  var c = 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1-a
  )); // great circle distance in radians

  return c * RK; // great circle distance in km
};

//var findDistance2 = function(lat1, lon1, lat2, lon2) { lat1 *= 0.017453292519943295; lon1 *= 0.017453292519943295; lat2 *= 0.017453292519943295; lon2 *= 0.017453292519943295; var dlat = lat2 - lat1; var dlon = lon2 - lon1; var a = Math.pow( Math.sin(dlat/2), 2) + Math.pow( Math.sin(dlon/2) * Math.cos(lat1) * Math.cos(lat2), 2); var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); return c * 6373; };
	
  
var segmentByTime = function(arr, dt) {
  arr.sort(function(a, b) {
    return (a.ts < b.ts ? -1 : (a.ts > b.ts ? 1 : 0) );
  });
  
  var bags = [];
  var lastBag;
  var _ts = 0;
  
  arr.forEach(function(o) {
    if (o.ts - _ts > dt) {
      lastBag = [];
      bags.push(lastBag);
    }
    lastBag.push(o);
    _ts = o.ts;
  });
  
  return bags;
};
  
var line = function(arr, name) {
  return {
    type: 'Feature',
    properties: {
      name: name
    },
    geometry: {
      type: 'LineString',
      coordinates: arr.map(function(o) {
        return [o.la, o.lo];
      })
    }
  };
};

var features = function(feats) {
  return {
    type: 'FeatureCollection',
    features: feats
  };
};
  

  
try {
  var tmp = fs.readFileSync(FILE).toString();
  lines = JSON.parse(tmp);
  console.log('file %s restored', FILE);
} catch (ex) {
  console.log('file %s restore failed or not found', FILE);
}

setInterval(
  function() {
    if (!isDirty) { return; }
    isDirty = false;
    fs.writeFile(FILE, JSON.stringify(lines), function(err) {
      console.log( err ? 'error saving file' : 'file saved' );
    });
  },
  5 * 60 * 1000
);

var us = '"use strict";';
  
var srv = http.createServer(function(req, res) {
	var u = req.url;
	
	if (u === '/favicon.ico') {
		res.writeHead(404);
		return res.end();
	}
	
	var o = url.parse(u, true);
	var p = o.pathname;
	var q = o.query;
  
  var resp, v, f;
  
  if (p === '/get') {
    resp = lines;
    if ('time' in q) { // tsMin, tsMax
      v = q.time.split(',');
      v = v.map(parseFloat);
      f = new Function('o', [us, 'return o.ts > ', v[0], ' && o.ts < ', v[1], ';'].join(''));
      resp = resp.filter(f);
    }
    if ('bounds' in q) { // latm, latM, lonm, lonM
      v = q.bounds.split(',');
      v = v.map(parseFloat);
      f = new Function('o', [us, 'return o.la > ', v[0], ' && o.la < ', v[1], ' && o.lo > ', v[2], ' && o.lo < ', v[3], ';'].join(''));
      resp = resp.filter(f);
    }
    if ('dist' in q) { // lat, lon, rad (in spheric space, radius in km, accurate)
      v = q.dist.split(',');
      v = v.map(parseFloat);
      f = new Function('lat2', 'lon2', [us, 'var lat1 = ', v[0] , ' * 0.017453292519943295; var lon1 = ', v[1], ' * 0.017453292519943295; lat2 *= 0.017453292519943295; lon2 *= 0.017453292519943295; var dlat = lat2 - lat1; var dlon = lon2 - lon1; var a = Math.pow( Math.sin(dlat/2), 2) + Math.pow( Math.sin(dlon/2) * Math.cos(lat1) * Math.cos(lat2), 2); var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); return c * 6373 < ', v[2], ';'].join(''));
      resp = resp.filter(f);
    }
    if ('dist2' in q) { // lat, lon, rad (in projected space, radius in "degrees" faster)
      v = q.dist2.split(',');
      v = v.map(parseFloat);
      v[2] *= v[2];
      f = new Function('o', [us, 'var dx = o.la - ', v[0], ', dy = o.lo - ', v[1], '; return (dx*dx + dy*dy) < ', v[2], ';'].join(''));
      resp = resp.filter(f);
    }
    if ('geojson' in q) {
      resp = features(
        segmentByTime(resp, 10 * 60 * 1000)
        .map(function(arr) {
          var a = arr[0];
          var b = arr[arr.length-1];
          var title = [
            new Date(a.ts).toISOString(),
            new Date(b.ts).toISOString()
          ].join(' - ');
          return line(arr, title);
        })
      );
    }
  }
  else if (p === '/zero') {
    lines = [];
    isDirty = true;
    resp = 'ok';
  }
  else if (p === '/put') {
    try {
      var d = JSON.parse(q.payload);
      lines.push(d);
      isDirty = true;
    } catch (ex) {
      console.error(ex);
    }
    resp = 'ok';
  }
  else if (p === '/puts') {
    var body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      try {
        var d = JSON.parse(body);
        lines = lines.concat(d);
        isDirty = true;
      } catch (ex) {
        console.error(ex);
      }
    });
    resp = 'ok';
  }
  else {
    resp = 'noop';
  }
	
	res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  //res.setHeader('Content-Length', resp ? resp.length : 0);
  if (resp) {
    resp = JSON.stringify(resp);
    res.setHeader('Content-Length', resp.length);
  }
  res.writeHead(200);
  
	if (resp) {
		res.end(resp);
	}
  else {
    res.end();
  }
});



console.log('LISTENING ON PORT ' + PORT + '...');
srv.listen(PORT);
