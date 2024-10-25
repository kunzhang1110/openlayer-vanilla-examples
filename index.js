/*
* WMS Layer
*/
const wmsLayer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/wms", // URL of your GeoServer WMS service
    params: {
      LAYERS: "MRC-Test:Map", // Specify the workspace and layer name
      TILED: true,
    },
    serverType: "geoserver",
    tileLoadFunction: function (imageTile, src) {
      const tile = new Image();
      tile.addEventListener("load", function () {
        imageTile.getImage().src = tile.src;
      });
      tile.src = src;
    },
  }),
  opacity: 0.7,
});

/*
* WMS Layer
*/
const wmsLayer2 = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/wms", // URL of your GeoServer WMS service
    params: {
      LAYERS: "MRC-Test:Mathoura", // Specify the workspace and layer name
      TILED: true,
    },
    serverType: "geoserver",
    tileLoadFunction: function (imageTile, src) {
      const tile = new Image();
      tile.addEventListener("load", function () {
        imageTile.getImage().src = tile.src;
      });
      tile.src = src;
    },
  }),
  opacity: 0.7,
});


/*
* WFS Layer
*/
const wfsLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: "http://localhost:8080/geoserver/MRC-Test/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=MRC-Test%3AMathoura&maxFeatures=50&outputFormat=application/json",
    format: new ol.format.GeoJSON(),
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "blue",
      width: 2,
    }),
    fill: new ol.style.Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
});

const map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
    wmsLayer,
    wfsLayer,
    // wmsLayer2
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([143.5504, -35.3393]),
    zoom: 10,
  }),
});

map.on("click", function (event) {
  const coordinate = event.coordinate;

  const features = wfsLayer.getSource().getFeatures();

  let found = false;
  for (const feature of features) {
    if (feature.getGeometry().intersectsCoordinate(coordinate)) {
      found = feature;
      break;
    }
  }

  if (found) {
    alert("Feature found at this location! with zStyle: " + found.getProperties().zData);
  } else {
    alert("No features found at this location.");
  }
});
