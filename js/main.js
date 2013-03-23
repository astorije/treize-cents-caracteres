// Limites de l’Île-de-France considérés
// Requête pour l’obtenir : select min(ymin(transform(setsrid(the_geom,2154), 4326))) from communes_simplifiees;
var width = 1000,
  height = 669,
  min_lon = 1.44635812195709,
  max_lon = 3.55901796978031,
  min_lat = 48.1202959913403,
  max_lat = 49.2413960984924;

latcos = Math.cos(48.5); 
lon_width = (max_lon - min_lon) * latcos;
lat_width = max_lat - min_lat;


function proj(coord){
  var x = (coord[0] - min_lon) / lon_width * latcos;
  var y = (coord[1] - min_lat) / lat_width;

  return [x * width, y * height]; 
}


var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "#ddd");

var coord = [];
var i= 0;
d3.tsv("data/communes.csv", function(error, data) {
  data.forEach(function(d) {
    coord = proj([d.lon, d.lat]);
    svg.append("circle")
    .attr("r", 5)
    .attr("cx", coord[0] )
    .attr("cy", height - coord[1] )
    .style("fill", "#ddd");
  });
});
