var http = require('http');
var url  = require('url');
var fs = require('fs');


var PORT = 7744;

var FILE = 'log.json';


var lines = [];
var isDirty = false;


var RK = 6373; // mean radius of the earth (km) at 39 degrees from the equator
var DEG2RAD = Math.PI / 180;

  
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
        return [o.lo, o.la];
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
  
  var resp, v, f, cond;
  
  if (p === '/get') {
    resp = lines;

    // filters
    if ('accuracy' in q) { // accMin
      v = parseFloat(q.accuracy);
      f = new Function('o', [us, 'return o.ac <= ', v, ';'].join(''));
      resp = resp.filter(f);
    }
    if ('time' in q) { // tsMin, tsMax
      v = q.time.split(',');
      v = v.map(parseFloat);
      cond = [];
      if (isFinite(v[0])) { cond.push('o.ts >= ' + v[0]); }
      if (isFinite(v[1])) { cond.push('o.ts <= ' + v[1]); }
      f = new Function('o', [us, 'return ', cond.join(' && '), ';'].join(''));
      resp = resp.filter(f);
    }
    if ('bounds' in q) { // latm, latM, lonm, lonM
      v = q.bounds.split(',');
      v = v.map(parseFloat);
      cond = [];
      if (isFinite(v[0])) { cond.push('o.la >= ' + v[0]); }
      if (isFinite(v[1])) { cond.push('o.la <= ' + v[1]); }
      if (isFinite(v[2])) { cond.push('o.lo >= ' + v[2]); }
      if (isFinite(v[3])) { cond.push('o.lo <= ' + v[3]); }
      f = new Function('o', [us, 'return ', cond.join(' && '), ';'].join(''));
      resp = resp.filter(f);
    }
    if ('dist' in q) { // lat, lon, rad (in spheric space, radius in km, accurate)
      v = q.dist.split(',');
      v = v.map(parseFloat);
      f = new Function('o', [us, 'var la2 = o.la; var lo2 = o.lo; var la1 = ', v[0] , ' * 0.017453292519943295; var lo1 = ', v[1], ' * 0.017453292519943295; la2 *= 0.017453292519943295; lo2 *= 0.017453292519943295; var dla = la2 - la1; var dlo = lo2 - lo1; var a = Math.pow( Math.sin(dla/2), 2) + Math.pow( Math.sin(dlo/2) * Math.cos(la1) * Math.cos(la2), 2); var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); return c * 6373 <= ', v[2], ';'].join(''));
      resp = resp.filter(f);
    }

    // transformations
    if ('count' in q) {
      resp = resp.length;
    }
    else if ('geojson' in q) {
      resp = features(
          segmentByTime(resp, 10 * 60 * 1000)
          .map(function (arr) {
            var a = arr[0];
            var b = arr[arr.length - 1];
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
