
// Cookie-Verwaltung

var getCookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

var setCookie = function(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
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

      var iconUrl = "https://openlayers.org/en/v3.19.1/examples/data/icon.png";
      if (data != null) {
        if (data.kind == 0) {
          iconUrl = "/static/icons/BIER_SMALL.png";
        } else if (data.kind == 1) {
          iconUrl = "/static/icons/COCKTAIL_SMALL.png";
        } else if (data.kind == 2) {
          iconUrl = "/static/icons/DISCO_SMALL.png";
        }
      }

      feature.setStyle([
        new ol.style.Style({
            image: new ol.style.Icon(({
            anchor: [0.5, 0.5],
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
