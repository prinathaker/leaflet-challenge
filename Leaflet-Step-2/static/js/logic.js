// geojson urls
var eqURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var flURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

///////////////////////////
///// Define Functions ////
///////////////////////////

// marker size function
function markerSize(magValue) {
    return magValue * 3;
};

// color function using ternary conditional
function colorScale(colorValue) {
    return colorValue > 5 ? '#FF3200' :
           colorValue > 4 ? '#FF6C00' :
           colorValue > 3 ? '#FFAD00' :
           colorValue > 2 ? '#FFCC00' :
           colorValue > 1 ? '#FFF700' :
                            '#D9FF00';
};


///////////////////////////
////// Create Markers /////
///////////////////////////

// Set LayerGroups
var earthquakeLayer = L.layerGroup();
var faultlineLayer = L.layerGroup();


// Earthquake Markers
d3.json(eqURL, data => {
    // console.log(data.features[0].properties.mag)
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker((feature, latlng), {
                fillOpacity: 0.75,
                color: "black",
                weight: 1,
                fillColor: colorScale(feature.properties.mag),
                radius: markerSize(feature.properties.mag)
            });
            },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(`<p>
        Magnitude: ${feature.properties.mag} <br> 
        Type: ${feature.properties.type} <br>
        Time: ${new Date(feature.properties.time)} <br>
        Place: ${feature.properties.place} <br> 
        Latitude: ${feature.geometry.coordinates[1]} <br>
        Longitude: ${feature.geometry.coordinates[0]} <br>
        <a href="${feature.properties.url}" target="_blank">Click To View USGS Map Details</a> <br>
        <a href="${feature.properties.detail}" target="_blank">Click for More Details (JSON)</a>
        </p>`);
        }
  }).addTo(earthquakeLayer)
});

// Faultline Polygons
d3.json(flURL, data => {
  // console.log(data.features[0].geometry.coordinates)
  L.geoJSON(data, {
    style: {
      "color": "#ffa600",
      "weight": 3,
      "opacity": 1
    }
  }).addTo(faultlineLayer)
});


///////////////////////////
//////// Create Map ///////
///////////////////////////

// Tile Layers
var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

// Base Layers
var baseMaps = {
  "Light Map": lightMap,
  "Dark Map": darkMap,
  "Satellite Map": satelliteMap,
  "Street Map": streetMap
};

// Overlays Layers
var overlayMaps = {
  "Earthquakes": earthquakeLayer,
  "Faultlines": faultlineLayer
};

// Create a map object
var map = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4,
  layers: [satelliteMap, earthquakeLayer, faultlineLayer]
});

// Layer Control
L.control.layers(baseMaps, overlayMaps).addTo(map);


// Legend
var legend = L.control({ position: 'bottomright' })
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend')
  var limits = [0, 1, 2, 3, 4 , 5]
  var labels = []

  for (let i = 0; i < limits.length; i++) {
    div.innerHTML +=
    '<i style="background:' + colorScale(limits[i] + 1) + '"></i> ' +
    limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
    }

return div;
};
legend.addTo(map);