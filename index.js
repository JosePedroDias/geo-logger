var http = require('http');
var url  = require('url');
var fs = require('fs');


/*
http://127.0.0.1:3333/get
http://127.0.0.1:3333/put?payload=%7B%22hello%20world%22:2%7D
http://127.0.0.1:3333/puts [array of payloads in the post body]
*/


var PORT = 7744;

var FILE = 'log.json';


var lines = [];
	
  

try {
  var tmp = fs.readFileSync(FILE).toString();
  lines = JSON.parse(tmp);
  console.log('file %s restored', FILE);
} catch (ex) {
  console.log('file %s restore failed or not found', FILE);
}

setInterval(
  function() {
    fs.writeFile(FILE, JSON.stringify(lines), function(err) {
      console.log( err ? 'error saving file' : 'file saved' );
    });
  },
  1 * 60 * 1000
);

  
  
var srv = http.createServer(function(req, res) {
	var u = req.url;
	
	if (u === '/favicon.ico') {
		res.writeHead(404);
		return res.end();
	}
	
	var o = url.parse(u, true);
	var p = o.pathname;
	var q = o.query;
  
  var resp;
  
  if (p === '/get') {
    resp = lines;
  }
  else if (p === '/put') {
    try {
      var d = JSON.parse(q.payload);
      lines.push(d);
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
