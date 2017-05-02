
var map = new ol.Map({
  target: 'map-canvas',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center : ol.proj.fromLonLat([6.9875, 50.934]),
    zoom: 16
  })
});
