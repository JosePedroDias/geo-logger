# geolocation in the browser

<https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation>


# extracts and routing

<http://wiki.openstreetmap.org/wiki/Routing>
<https://github.com/geopipes/openstreetmap-stream>
<http://gis.stackexchange.com/questions/73465/best-way-to-assign-points-to-nearest-roads-in-postgis>
<https://help.openstreetmap.org/questions/22945/get-way-from-location>
<http://wiki.openstreetmap.org/wiki/OSM_tags_for_routing>
<http://overpass-turbo.eu/>
<http://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL>


## examples

<http://overpass.osm.rambler.ru/cgi/interpreter?data=[out:json];way[%22highway%22~%22.%22](around:5,50.7528080,2.0377858);%20out%20geom;>

<http://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%3Bway%28around%3A10%2C48%2E21%2C16%2E371%29%5B%22highway%22%5D%3B%28%2E_%3B%3E%3B%29%3Bout%3B>
    
<http://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%28way%5B%22highway%22%5D%2838%2E70773304314285%2C-9%2E218806028366089%2C38%2E71261387172247%2C-9%2E211724996566772%29%3B%29%3Bout%20body%3B%3E%3Bout%20skel%20qt%3B%0A>

<http://overpass-api.de/api/convert?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A(%0A%20%20way(38.70870920885878%2C-9.217389822006226%2C38.71163770600654%2C-9.213141202926636)%3B%0A)%3B%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B&target=compact>

    curl 'http://openrouteservice.org/cgi-bin/proxy.cgi?url=http://openls.geog.uni-heidelberg.de/routing' -H 'Pragma: no-cache' -H 'Origin: http://openrouteservice.org' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8,pt-PT;q=0.6,pt;q=0.4,es;q=0.2,fr;q=0.2,nb;q=0.2' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: application/xml, text/xml, */*; q=0.01' -H 'Cache-Control: no-cache' -H 'X-Requested-With: XMLHttpRequest' -H 'Cookie: lang=en; routeLang=en; distUnit=m; version=standardVersion; pos=-9.1893903199125%2C38.76918726357557; zoom=14; layer=B000FTTTFFTTTTTTTT' -H 'Connection: keep-alive' -H 'Referer: http://openrouteservice.org/' --data $'<?xml version="1.0" encoding="UTF-8" ?>\n<xls:XLS xmlns:xls="http://www.opengis.net/xls" xsi:schemaLocation="http://www.opengis.net/xls http://schemas.opengis.net/ols/1.1.0/RouteService.xsd" xmlns:sch="http://www.ascc.net/xml/schematron" xmlns:gml="http://www.opengis.net/gml" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1" xls:lang="en">\n\x09<xls:RequestHeader>\n\x09</xls:RequestHeader>\n\x09<xls:Request methodName="RouteRequest" version="1.1" requestID="00" maximumResponses="15">\n\x09\x09<xls:DetermineRouteRequest>\n\x09\x09\x09<xls:RoutePlan>\n\x09\x09\x09\x09<xls:RoutePreference>Car</xls:RoutePreference>\n\x09\x09\x09\x09<xls:ExtendedRoutePreference>\n\x09\x09\x09\x09\x09<xls:WeightingMethod>Fastest</xls:WeightingMethod>\n\x09\x09\x09\x09</xls:ExtendedRoutePreference>\n\x09\x09\x09\x09<xls:WayPointList>\n\x09\x09\x09\x09\x09<xls:StartPoint>\n\x09\x09\x09\x09\x09\x09<xls:Position>\n\x09\x09\x09\x09\x09\x09\x09<gml:Point xmlns:gml="http://www.opengis.net/gml">\n\x09\x09\x09\x09\x09\x09\x09\x09<gml:pos srsName="EPSG:4326">-9.16845119999995 38.83087409999974</gml:pos>\n\x09\x09\x09\x09\x09\x09\x09</gml:Point>\n\x09\x09\x09\x09\x09\x09</xls:Position>\n\x09\x09\x09\x09\x09</xls:StartPoint>\n\x09\x09\x09\x09\x09<xls:EndPoint>\n\x09\x09\x09\x09\x09\x09<xls:Position>\n\x09\x09\x09\x09\x09\x09\x09<gml:Point xmlns:gml="http://www.opengis.net/gml">\n\x09\x09\x09\x09\x09\x09\x09\x09<gml:pos srsName="EPSG:4326">-9.229761099999623 38.700589</gml:pos>\n\x09\x09\x09\x09\x09\x09\x09</gml:Point>\n\x09\x09\x09\x09\x09\x09</xls:Position>\n\x09\x09\x09\x09\x09</xls:EndPoint>\n\x09\x09\x09\x09</xls:WayPointList>\n\x09\x09\x09\x09<xls:AvoidList />\n\x09\x09\x09</xls:RoutePlan>\n\x09\x09\x09<xls:RouteInstructionsRequest provideGeometry="true" />\n\x09\x09\x09<xls:RouteGeometryRequest>\n\x09\x09\x09</xls:RouteGeometryRequest>\n\x09\x09</xls:DetermineRouteRequest>\n\x09</xls:Request>\n</xls:XLS>' --compressed


## routers

<http://openrouteservice.org/>
<http://www.yournavigation.org/>
<http://www.liedman.net/leaflet-routing-machine/tutorials/alternative-routers/>


# name things/geocoding (nominatim)

<https://wiki.openstreetmap.org/wiki/Nominatim>


## geocoding (name to coords)

<http://nominatim.openstreetmap.org/search/alg%C3%A9s?format=json>


## reverse (coords to name)

<http://nominatim.openstreetmap.org/reverse?format=json&lat=52.5487429714954&lon=-1.81602098644987&zoom=18&addressdetails=1>


## lookup (info about node, ways and relations)

<http://nominatim.openstreetmap.org/lookup?format=json&osm_ids=R146656,W104393803,N240109189>


## services

<http://geocoder.opencagedata.com/>


# read out loud (TTS)

<http://www.masswerk.at/mespeak/>
