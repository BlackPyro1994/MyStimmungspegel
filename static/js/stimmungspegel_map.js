
var map = new ol.Map({
  target: 'map-canvas',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center : ol.proj.fromLonLat([10.416667, 51.133333]),
    zoom: 6
  })
});
