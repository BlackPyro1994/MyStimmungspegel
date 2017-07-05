
// Cookie-Verwaltung

var getCookie = function(name) {
  var results = document.cookie.match ('(^|;) ?' + name + '=([^;]*)(;|$)');
  return results ? decodeURIComponent(results[2]) : null;
}

var setCookie = function(c_name, value) {
  document.cookie = c_name + "=" + encodeURIComponent(value);
}

var deleteCookie = function(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
}

// setzt automatisch defaults, wenn keine Cookies vorhanden
if (getCookie("type") === null) {
  setCookie("type", "11110010");
}
if (getCookie("radius") === null) {
  setCookie("radius", 10);
}

// Wrapper um "getCookie"
var getRadius = function() {
  var c = getCookie("radius");
  if (c) {
    return parseInt(c);
  }
  return 10;
}

var getSearchOptions = function() {
  var typecookie = getCookie("type");
  var opts = {
    order: 'rating',
    orderStr: "Beste Stimmung",
    excludePubs: '',
    excludeBars: '',
    excludeClubs: ''
  };
  if (typecookie === null) {
    return opts;
  }
  if (typecookie.charAt(0) == '0') {
    opts.excludePubs = '1';
  }
  if (typecookie.charAt(1) == '0') {
    opts.excludeBars = '1';
  }
  if (typecookie.charAt(2) == '0') {
    opts.excludeClubs = '1';
  }
  if (typecookie.charAt(3) == '1') {
    opts.order = 'r',
    opts.orderStr = "Beste Stimmung"
  } else if (typecookie.charAt(4) == '1') {
    opts.order = 'b';
    opts.orderStr = "Günstigstes Bier";
  } else if (typecookie.charAt(5) == '1') {
    opts.order = 'a';
    opts.orderStr = "Günstigster Eintritt";
  }
  return opts;
}

var getPosition = function(callback, errorCallback) {
  var lat = getCookie("lat");
  var lon = getCookie("lon");
  var options = getCookie("type");
  if (lat === null || lon === null) {
    if (options !== null && options.charAt(6) == '1') {
    // Position über Geolocation ermitteln
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          setCookie("lat", lat);
          setCookie("lon", lon);
          callback({lat: lat, lon: lon});
        }, errorCallback);
      }
    } else {
      // Position über angegebene Adresse
      var citycookie = getCookie("city");
      var addresscookie = getCookie("address");
      var zipcookie = getCookie("zipcode");
      var addr_string = "";
      if (addresscookie) {
        addr_string += addresscookie + ", ";
      }
      if (zipcookie) {
        addr_string += zipcookie + " ";
      }
      if (citycookie) {
        addr_string += citycookie;
      } else {
        addr_string = "Köln";
      }
      var osmGeocoder = GeocoderJS.createGeocoder('openstreetmap');
      osmGeocoder.geocode(addr_string, function(result) {
        lat = result[0].latitude;
        lon = result[0].longitude;
        setCookie("lat", lat);
        setCookie("lon", lon);
        callback({lat: lat, lon: lon});
      }, errorCallback);
    }
  } else {
    lat = lat ? parseFloat(lat) : 51.163375;
    lon = lon ? parseFloat(lon) : 10.447683;
    callback({lat: lat, lon: lon});
  }
}

// Map

var StimmungspegelMap = function() {
  var map;
  var markerClickCallbacks;

  var callbackMarkersOnClick = function(pixel) {
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
      (markerClickCallbacks[feature.getId()])({id: feature.getId()});
    });
  };

  return {

    createMap: function (lon, lat, zoom) {
      var markerLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [],
          projection: "EPSG:4326"
        })
      });
      var baseLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
      });
      map = new ol.Map({
        target: "map",
        renderer: "canvas",
        layers: [baseLayer, markerLayer],
        view: new ol.View({
          center: ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857"),
          zoom: zoom
        })
      });
      map.on("singleclick", function(event) {
        callbackMarkersOnClick(event.pixel);
      });
      markerClickCallbacks = Object();
    },

    addMarker: function(id, lon, lat, data) {
      var geom = new ol.geom.Point(ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857"));
      var feature = new ol.Feature(geom);
      var iconUrl = "/static/icons/pos.png";
      var anchor = [0.5, 1.0];
      if (data != null) {
        if (data.type == 0) {
          iconUrl = "/static/icons/pub.png";
          anchor = [0.5, 0.5];
        } else if (data.type == 1) {
          iconUrl = "/static/icons/bar.png";
          anchor = [0.5, 0.5];
        } else if (data.type == 2) {
          iconUrl = "/static/icons/club.png";
          anchor = [0.5, 0.5];
        }
      }
      feature.setStyle([
        new ol.style.Style({
            image: new ol.style.Icon(({
            anchor: anchor,
            anchorXUnits: "fraction",
            anchorYUnits: "fraction",
            opacity: 1,
            src: iconUrl
          }))
        })
      ]);
      if (id != null) {
        feature.setId(id);
      }
      map.getLayers().item(1).getSource().addFeature(feature);
    },

    deleteMarkerById: function(id) {
      var feature = map.getLayers().item(1).getSource().featureById(id);
      map.getLayers().item(1).getSource().removeFeature(feature);
    },

    removeAllMarkers: function() {
      map.getLayers().item(1).getSource().clear();
    },

    markerCount: function() {
      return map.getLayers().item(1).getSource().getFeatures().length;
    },

    onMarkerSingleClick: function(id, callback) {
      markerClickCallbacks[id] = callback;
    }
  }
}
