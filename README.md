# geo-logger


## what?

HTTP server for storing GPS coords and querying them.  
Saves to JSON file every n mins.


## HTTP Interface

### get/search

all readings  
GET `/get`


#### filters (several can be used at once)

only with timestamp between `0` and `2nd Oct 2015 9:22`  
GET `/get?time=0,1443774162534`

only at 5Km or nearer from lat=`-9.1822393` and lon=`38.7433273`  
GET `/get?dist=-9.1822393,38.7433273,5`

only within bounds lat=`[-9.2513,-9.2147]` and lon=`[38.6907,38.7115]`  
GET `/get?bounds=-9.2513,-9.2147,38.6907,38.7115`


#### transforms (only one at most)

as geoJSON lines for usage in [leaflet](http://leafletjs.com/), [geojson.io](http://geojson.io/), etc.  
GET `/get?geojson=1`

returns count instead of the items themselves  
GET `/get?count=1`


### put/post

save one reading `{"ts":1443773887052,"la":-9.2199055,"lo":38.7136595}` (encodeURIComponent)  
GET `/put?payload=%7B%22ts%22%3A1443773887052%2C%22la%22%3A-9.2199055%2C%22lo%22%3A38.7136595%7D`

save several readings at once, via JSON array on POST body  
POST `/puts`  
`[{"ts":1443773995791,"la":-9.2134068,"lo":38.7112762},{"ts":1443774116998,"la":-9.2152781,"lo":38.7091957}]`


## import KLM

Converts KLM format logs from [google timeline](https://www.google.com/maps/timeline)
into our simple JSON format `{la, lo, ts}`.


## TODO

* server
    * optimize dist with prior internal bound
* viewer
    * correctly draw geojson
    * allow drawing restrictions such a bounds, radius and a timeline UI.
    * playback positions instead of drawing them
* client
    * if rec is off, geo should be off too?
    * request screen not to go to sleep? how?


