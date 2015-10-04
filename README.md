# geo-logger


## what?

HTTP server for storing GPS coords and querying them.  
Saves to JSON file every n mins.


## HTTP Interface

all readings  
GET `/get`

as geoJSON lines  
GET `/get?geojson=1`

only with timestamp between `0` and `2nd Oct 2015 9:22`  
GET `/get?time=0,1443774162534`

only at 5Km or nearer from lat=`-9.1822393` and lon=`38.7433273`  
GET `/get?dist=-9.1822393,38.7433273,5`

only within bounds lat=`[-9.2513,-9.2147]` and lon=`[38.6907,38.7115]`  
GET `/get?bounds=-9.2513,-9.2147,38.6907,38.7115`

save one reading `{"ts":1443773887052,"la":-9.2199055,"lo":38.7136595}` (encodeURIComponent)  
GET /put?payload=%7B%22ts%22%3A1443773887052%2C%22la%22%3A-9.2199055%2C%22lo%22%3A38.7136595%7D

POST `/puts`  
`[{"ts":1443773995791,"la":-9.2134068,"lo":38.7112762},{"ts":1443774116998,"la":-9.2152781,"lo":38.7091957}]`


## importKlm

Converts KLM format logs from `https://www.google.com/maps/timeline`
into our simple JSON format (la, lo, ts).


## TODO

* dest dist and bounds
