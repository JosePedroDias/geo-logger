# geo-logger


## what?

HTTP server for storing GPS coords and querying them.  
All data processed in memory, stored to JSON file every n minutes.  
You can perform some interesting operations on the raw data (filters and transforms, see below).



## HTTP Interface

### get/search

all readings  
GET `/get`


#### filters (several can be used at once)

only readings with accuracy <= 12m  
GET `/get?accuracy=12`

only with timestamp between `0` and `2nd Oct 2015 9:22`  
GET `/get?time=0,1443774162534`

applies [simplification algorithm](http://mourner.github.io/simplify-js/) to the data  
GET `/get?simplify=0.0001`

only at 5Km or nearer from lat=`-9.1822393` and lon=`38.7433273`  
GET `/get?dist=-9.1822393,38.7433273,5`

only within bounds lat=`[-9.2513,-9.2147]` and lon=`[38.6907,38.7115]`  
GET `/get?bounds=-9.2513,-9.2147,38.6907,38.7115`


#### transforms (only one at most)

returns count instead of the items themselves  
GET `/get?count=1`

as geoJSON lines for usage in [leaflet](http://leafletjs.com/), [geojson.io](http://geojson.io/), etc.  
the argument is the segmentation criteria for different lines. syntax: `<float><s|min|h|day>`  
GET `/get?geojson=10min`

returns summary instead of the items themselves (summary is an array of clusters of events, each having start ts, end ts and count of events)
the argument is the segmentation criteria for different cluster items. syntax: `<float><s|min|h|day>`  
GET `/get?summary=10min`


### put/post

save one reading `{"ts":1443773887052,"la":-9.2199055,"lo":38.7136595}` (encodeURIComponent)  
GET `/put?payload=%7B%22ts%22%3A1443773887052%2C%22la%22%3A-9.2199055%2C%22lo%22%3A38.7136595%7D`

save several readings at once, via JSON array on POST body  
POST `/puts`  
`[{"ts":1443773995791,"la":-9.2134068,"lo":38.7112762},{"ts":1443774116998,"la":-9.2152781,"lo":38.7091957}]`


## import KLM

Converts KLM format logs from [google timeline](https://www.google.com/maps/timeline)
into our simple JSON format `{la, lo, ts}`.


## pages

### recorder

example client using leaflet to display the map
and `navigator.geolocation` to fetch GPS readings.  
[demo](http://rawgit.com/JosePedroDias/geo-logger/master/recorder.html)


### viewer

displays data recorded earlier as geojson (uses the HTTP interface)  
[demo](http://rawgit.com/JosePedroDias/geo-logger/master/viewer.html)


### queryWizard

aids in creating get requests with filters and transforms.  
[demo](http://rawgit.com/JosePedroDias/geo-logger/master/queryWizard.html)


### importer

imports data from files. Formats currently supported: KML  
[demo](http://rawgit.com/JosePedroDias/geo-logger/master/importer.html)


## TODO

* recorder:
    * encapsulate map view ops in single file (ajax, map rotation and 2 layouts, line of recent positions)
    * 2 buttons
        * toggle gps
        * toggle recording
    * state
        * time since last gps report -> is gps down?
        * time since last precise report -> indoors?
        * speed estimate?
        * hide lat, lon?
    * config dialog
        * min distance from last reading (number)
        * min precision (number)
        * server (string)
        * map tiles (bing, osm, mapbox, etc)
    * how disable sleep?!
    * providers
        * gps
        * remote live (websockets endpoint)
        * remote recorded (current /puts) - options: speed, max gap (to reduce inactive times)
    * client importer supporting GPX too
        
* viewer:
    * reuse structure from recorder
    * config dialog
        * server (string)
        * query (window.prompt)
        * map tiles
    
* server:
    * puts could receive an option to check duplicates (would use summary and ignore readings in found time intervals)
    * optimize dist with prior internal bound
    * live endpoint in websockets
