var colorScale = d3.scale.linear().domain(d3.range(0,70,10)).range(["#ffffb2","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"].reverse()).clamp(true);

var buses = L.layerGroup();
var map = L.map("map", {
  center: [34.047, -118.24],
  zoom: 14,
  layers: [buses]
});

L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
}).addTo(map);


// Add an SVG element to Leaflet’s overlay pane
map._initPathRoot()
var svg = d3.select("#map").select("svg"),
      g = svg.append("g").attr("class", "leaflet-zoom-hide");

// Render a legend for the point data
d3.select("#legend").selectAll("div")
    .data(d3.range(0,70, 10))
  .enter().append("div")
    .style("width", "50px")
    .style("height", "10px")
    .style("background-color", function(d) { return colorScale(d); })
    .attr("class", "text-center")
    .html(function(d) { return d === 60 ? d.toString() + "+" : d; });

var socket = io();
socket.on('data', function(data) {
  // console.dir(data);

  var buses = g.selectAll("circle")
      .data(data.data, function(d) { return d.id; });

  buses.transition().duration(20000).delay(function(d, i){ return i*100; })
      .attr("cx", function(d) { return projectPoint(d.lat, d.lon).x; })
      .attr("cy", function(d) { return projectPoint(d.lat, d.lon).y; })
      .style("fill", function(d) { return colorScale(d.kph); });

  buses.enter().append("circle")
      .attr("cx", function(d) { return projectPoint(d.lat, d.lon).x; })
      .attr("cy", function(d) { return projectPoint(d.lat, d.lon).y; })
      .attr("r", "5")
      .style("fill", function(d) { return colorScale(d.kph); });

  buses.exit().remove();

});

map.on("viewreset", update);
update();

function update() {
  g.selectAll("circle").transition().duration(0).delay(0)
      .attr("cx", function(d) { return projectPoint(d.lat, d.lon).x; })
      .attr("cy", function(d) { return projectPoint(d.lat, d.lon).y; });
}

// Use Leaflet to implement a D3 geometric transformation.
function projectPoint(x, y) {
  return map.latLngToLayerPoint(new L.LatLng(x, y));
}
