(function(w) {
    'use strict';


    // TODO
    var gpsProvider = function() {

    };

    var recordedProvider = function() {

    };

    var liveProvider = function() {

    };



    var getTileLayer = function(name) {
        if (name === 'bing-aerial') {
            return new L.BingLayer(
                'LfO3DMI9S6GnXD7d0WGs~bq2DRVkmIAzSOFdodzZLvw~Arx8dclDxmZA0Y38tHIJlJfnMbGq5GXeYmrGOUIbS2VLFzRKCK0Yv_bAl6oe-DOc',
                {
                    type        : 'Aerial',
                    reuseTiles  : true
                }
            );
        }
        else if (name === 'mapbox-roads') {
            return L.tileLayer(
                'http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
                {
                    attribution : 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    subdomains  : 'abcd',
                    id          : 'josepedrodias.ljaghn6a',
                    accessToken : 'pk.eyJ1Ijoiam9zZXBlZHJvZGlhcyIsImEiOiJaWjFRZWNZIn0.xrONp5eka_l3Ky8staCR4g',
                    reuseTiles  : true
                }
            );
        }
        else if (name === 'mapquest-map') {
            return L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
                type        : 'map',
                ext         : 'jpg',
                attribution : 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains  : '1234',
                reuseTiles  : true
            });
        }
        else {
            return L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    maxZoom     : 19,
                    attribution : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    reuseTiles  : true
                }
            );
        }
    };



    var handleNumericInputChangeFactory = function(STATE, store, keyName) {
        return function(ev) {
            var el = ev.target;
            var v = el.value;
            if (isFinite(v)) {
                STATE[keyName] = v;
                store.put(keyName, v);
            }
            else {
                el.value = STATE[keyName];
            }
        };
    };

    var handlePromptClickFactory = function(STATE, store, keyName, label) {
        return function(/*ev*/) {
            var v = w.prompt(label, STATE[keyName]);
            if (v) {
                STATE[keyName] = v;
                store.put(keyName, v);
            }
        };
    };



    var ajax = function(uri, body, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open(body ? 'POST' : 'GET', uri, true);
        var cbInner = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                return cb(null, JSON.parse(xhr.response));
            }
            cb('error requesting ' + uri);
        };
        xhr.onload  = cbInner;
        xhr.onerror = cbInner;
        xhr.send(body ? body : null);
    };



    w.geoLogger = {
        ajax                            : ajax,
        getTileLayer                    : getTileLayer,
        handleNumericInputChangeFactory : handleNumericInputChangeFactory,
        handlePromptClickFactory        : handlePromptClickFactory
    };

})(this);
