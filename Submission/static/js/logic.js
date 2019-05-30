// Define earthquake url to fetch usgs json data
var earthquakeurl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Grab the data with d3 and pass on to a createFeatures function
d3.json(earthquakeurl, function(response) {

  createFeatures(response.features);
});

// Define a function createFeatures to provide on each feature for adding a GEOJSON layer and marker properties
function createFeatures(data) {       

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  
  var earthquakes = L.geoJson(data, {
    // use onEachFeature function to pop up place, magnitude and time of earthquake
    onEachFeature: function (feature, layer){
      layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },
    // define the radius, color and other properties of marker
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          fillOpacity: .7,
          stroke: true,
          color: "black",
          weight: .5
      })
    }
  });

  // adding layer to createMap function
  createMap(earthquakes)
}

// Defining function createMap that defines different layers

function createMap(earthquakes) {

  // Define streetmap layer
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWN2ZW5rIiwiYSI6ImNqdmpyaXd6bzBqdWw0M29qZjR3bnFrMmMifQ.OZ318jMWBjwNz6UrgKTRFQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  // var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  //   maxZoom: 18,
  //   id: "mapbox.street",
  //   accessToken: API_KEY

    
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
  "Street Map": streetmap
  };

// Create overlay object to hold our overlay layer
  var overlayMaps = {
  Earthquakes: earthquakes
  };

// Create maps, giving it base map of streetmap and earthquakes layer to display
var myMap = L.map("map", {
  center: [37.09, 95.71],
  zoom: 3.5,
  layers: [streetmap, earthquakes]
  });

  
// Create Layer control and add to map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// Define a legend and determine the position
var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 1, 2, 3, 4, 5],
              labels = [];
    
    div.innerHTML+='Magnitude<br><hr>'

  // loop through grades and generate a labels with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}

//setting various colors for different magnitudes
function getColor(d) {
  return d > 5 ? '#F30' :
  d > 4  ? '#F60' :
  d > 3  ? '#F90' :
  d > 2  ? '#FC0' :
  d > 1  ? '#FF0' :
            '#9F3';
};
// Define function to get radius and display bigger size
function getRadius(val){
  return val*50000
};