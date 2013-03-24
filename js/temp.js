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

function lon2x(lon){
  var x = (lon - min_lon) / lon_width * latcos;
  return x * width; }

function lat2y(lat) {
  var y = (lat - min_lat) / lat_width;
  return height - y * height; 
}

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

  svg.append("image")
  .attr("xlink:href", "idf.png")
  .attr("width", width)
  .attr("height", height)
  .style("opacity", 0.5);


  var global_data;

  var colors = {jeunesse: { brewer: 'RdYlGn', range: [1.1, 2, 4], f: function(d){return d.jeunesse;} },
                gares : { brewer: 'Blues', range: [10, 40, 80], f: function(d){return d.gares;} },
                salaire_median :{ brewer: 'Blues', range:[15000, 25000, 35000], f:function(d){return d.median;} },
                tx_hlm :{ brewer: 'RdYlGn', range:[5 ,15, 30], f:function(d){return d.tx_hlm;} },
                tx_appart :{ brewer: 'RdYlGn', range:[30, 60, 80], f:function(d){return d.tx_appart;} }
  };

  var sizes = {none: {scale: function(x){return 6;}, f: function(d){return 7;} },
               area: {scale: d3.scale.sqrt().domain([1, 5000]).range([1,20]), f: function(d){return d.surf;} }, 
               pop99: {scale: d3.scale.pow().domain([1, 250000]).range([1,20]).exponent(0.3), f: function(d){return d.p99_pop;} },
               pop09: {scale: d3.scale.pow().domain([1, 250000]).range([1,20]).exponent(0.3), f: function(d){return d.p09_pop;} },
               pop90: {scale: d3.scale.pow().domain([1, 250000]).range([1,20]).exponent(0.3), f: function(d){return d.d90_pop;} },
               pop82: {scale: d3.scale.pow().domain([1, 250000]).range([1,20]).exponent(0.3), f: function(d){return d.d82_pop;} },
               pop75: {scale: d3.scale.pow().domain([1, 250000]).range([1,20]).exponent(0.3), f: function(d){return d.d75_pop;} },
               pop68: {scale: d3.scale.pow().domain([1, 250000]).range([1,20]).exponent(0.3), f: function(d){return d.d68_pop;} },
      };

function get_brewer_class(val, range){
  if(val < range[0]) return "q0-4";
  else if(val < range[1])  return "q1-4";
  else if(val < range[2])  return "q2-4";
  else return "q3-4";
}

function render(color, size){
  var col = colors[color];
  var siz = sizes[size];
  svg.attr("class", col.brewer);

  svg.selectAll("circle")
  .data(global_data)
  .transition()
  .attr("r", function(d){ return siz.scale(parseFloat(siz.f(d)));})
  .attr("class", function(d){return get_brewer_class(col.f(d), col.range);});
}

function transform(d) {
   var scale = "scale(" + 2 * Math.random() + ' ' + 2 * Math.random() + ')',
       translate = "translate(" + lon2x(d.lon) + "," + lat2y(d.lat) + ')';
   return translante + ' ' + scale;  
}

$(document).ready(function() {

d3.csv("data/communes2.csv", function(error, data) {
    global_data = data;

    svg.selectAll("circle")
    .data(global_data)
    .enter()
    .append("circle")
    .attr("transform",transform ;})
//    .attr("cy", function(d){return lat2y(d.lat);})
    .style("opacity", 0.8)
  ;
  render('tx_hlm', 'area' );
  });

});
