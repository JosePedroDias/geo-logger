var fs = require('fs');

var s = fs.readFileSync('/Users/jdias/Downloads/history-2015-10-02.kml').toString();
var rgx = /<when>([^<]+)<\/when><gx:coord>([^<]+)<\/gx:coord>/g;

var m, out = [];
while (m = rgx.exec(s)) {
  //console.log(m[1], m[2]);
  var d = new Date(m[1]);
  var tri = m[2].split(' ');
  out.push({
    ts : d.valueOf(),
    la : parseFloat(tri[0]),
    lo : parseFloat(tri[1])
  });
}

//console.log(out);

fs.writeFileSync('log.json', JSON.stringify(out));
