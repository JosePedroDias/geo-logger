(function (w) {
    'use strict';


    var listToArr = function(lst) {
        var l = lst.length;
        var arr = new Array(l); // optimizable *list-to-array
        for (var i = 0; i < l; ++i) {
            arr[i] = lst[i];
        }
        return arr;
    };



    var parseXMLFile = function(blob, cb) {
        var reader = new FileReader();

        reader.addEventListener('loadend', function() {
            try {
                var parser = new DOMParser();
                var doc = parser.parseFromString(reader.result, 'text/xml');
                cb(null, doc);
            } catch (ex) {
                cb(ex);
            }
        });

        reader.readAsText(blob);
    };



    // KML
    // <gx:Track>*
    //   <when xmlns="http://www.opengis.net/kml/2.2">2015-10-07T01:15:26.751-07:00</when>
    //   <gx:coord xmlns:gx="http://www.google.com/kml/ext/2.2">-9.2144415 38.7119388 0</gx:coord>
    var parseKML = function(doc, cb) {
        try {
            var tracks = listToArr(doc.querySelectorAll('Track'))
                .map(function (trackEl) {
                    var readings = listToArr(trackEl.querySelectorAll('when'))
                        .map(function (whenEl) {
                            return {
                                ts: new Date(whenEl.innerHTML).valueOf(),
                                la: 0.1,
                                lo: 0.1
                            }
                        });

                    listToArr(trackEl.querySelectorAll('coord'))
                        .forEach(function (coordEl, i) {
                            var s = coordEl.innerHTML.split(' ');
                            var reading = readings[i];
                            reading.lo = parseFloat(s[0]);
                            reading.la = parseFloat(s[1]);
                        });

                    return readings;
                });

            cb(null, tracks);
        } catch (ex) {
            cb(ex);
        }
    };

    var isKML = function(fn) {
        return (/\.kml$/i).test(fn);
    };



    w.getDataFromFile = function(inputEl, cb) {
        inputEl.addEventListener('change', function () {
            inputEl.disabled = true;
            var file0 = inputEl.files[0];

            if (isKML(file0.name)) {
                parseXMLFile(file0, function(err, doc) {
                    if (err) { return cb(null); }

                    parseKML(doc, cb);
                });
            }

        }, false);
    };



})(this);