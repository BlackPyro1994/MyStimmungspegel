
// Cookie-Verwaltung

var getCookie = function(name) {
  var results = document.cookie.match ('(^|;) ?' + name + '=([^;]*)(;|$)');
  return results ? decodeURIComponent(results[2]) : null;
}

var setCookie = function(c_name, value) {
  document.cookie = c_name + "=" + encodeURIComponent(value);
}


// Sortierfunktionen

var byRating = function(a, b) {
  if(a.rating < b.rating) return 1;
  else if (a.rating > b.rating) return -1;
  return 0;
}

var byBeerPrice = function(a, b) {
  if(a.beer_price > b.beer_price) return 1;
  else if (a.beer_price < b.beer_price) return -1;
  return 0;
}

var byAdmission = function(a, b) {
  if(a.admission > b.admission) return 1;
  else if (a.admission < b.admission) return -1;
  return 0;
}

// Wrapper um "getCookie"

var getSortFuncFromCookie = function() {
  var typecookie = getCookie("type");
  if (typecookie != null && typecookie.charAt(3) == '1') {
    return {
      sortFunc: byRating,
      sortStr: "Beste Stimmung"
    };
  } else if (typecookie != null && typecookie.charAt(4) == '1') {
    return {
      sortFunc: byBeerPrice,
      sortStr: "Günstigstes Bier"
    };
  } else if (typecookie != null && typecookie.charAt(5) == '1') {
    return {
      sortFunc: byAdmission,
      sortStr: "Günstigster Eintritt"
    };
  }
  return {
    sortFunc: byRating,
    sortStr: "Beste Stimmung"
  };
}

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
    sortFunc: byRating,
    sortStr: "Beste Stimmung",
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
    opts.sortFunc = byRating,
    opts.sortStr = "Beste Stimmung"
  } else if (typecookie.charAt(4) == '1') {
    opts.sortFunc = byBeerPrice;
    opts.sortStr = "Günstigstes Bier";
  } else if (typecookie.charAt(5) == '1') {
    opts.sortFunc = byAdmission;
    opts.sortStr = "Günstigster Eintritt";
  }
  return opts;
}

var getPosition = function(refresh, callback, errorCallback) {
  var lat = getCookie("lat");
  var lon = getCookie("lon");
  var options = getCookie("type");
  if ((refresh || lat === null || lon === null)) {
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
