// Limites de l’Île-de-France considérés
// Requête pour l’obtenir : select min(ymin(transform(setsrid(the_geom,2154), 4326))) from communes_simplifiees;
var width = 830,
  height = 555,
  min_lon = 1.44635812195709,
  max_lon = 3.55901796978031,
  min_lat = 48.1202959913403,
  max_lat = 49.2413960984924,
  coord = [],
  i= 0;

latcos = Math.cos(48.5); 
lon_width = (max_lon - min_lon) * latcos;
lat_width = max_lat - min_lat;


function proj(coord){
  var x = (coord[0] - min_lon) / lon_width * latcos;
  var y = (coord[1] - min_lat) / lat_width;

  return [x * width, y * height]; 
}

var global_data;

var colors = {
  none:           { brewer: '',       range: function(d) { return "default"; }}, 
  jeunesse:       { brewer: 'RdYlGn', range: function(d){return get_brewer_class(d.jeunesse, [1.1, 2, 4]);} },
  gares :         { brewer: 'Blues',  range: function(d){return get_brewer_class(d.gares,    [10, 40, 80]);} },
  salaire_median :{ brewer: 'Blues',  range: function(d){return get_brewer_class(d.median,   [15000, 25000, 35000]);} },
  tx_hlm :        { brewer: 'RdGy',   range: function(d){return get_brewer_class(d.tx_hlm,   [5 ,15, 30]);} },
  tx_appart :     { brewer: 'RdYlGn', range: function(d){return get_brewer_class(d.tx_appart,[30, 60, 80]);} }
};

var sizes = {
  none: {scale: function(x){return 6;}, f: function(d){return 7;} },
  area: {scale: d3.scale.sqrt().domain([1, 5000]).range([1,10]), f: function(d){return d.surf;} }, 
  pop99: {scale: d3.scale.pow().domain([1, 250000]).range([1,10]).exponent(0.3), f: function(d){return d.p99_pop;} },
  pop09: {scale: d3.scale.pow().domain([1, 250000]).range([1,10]).exponent(0.3), f: function(d){return d.p09_pop;} },
  pop90: {scale: d3.scale.pow().domain([1, 250000]).range([1,10]).exponent(0.3), f: function(d){return d.d90_pop;} },
  pop82: {scale: d3.scale.pow().domain([1, 250000]).range([1,10]).exponent(0.3), f: function(d){return d.d82_pop;} },
  pop75: {scale: d3.scale.pow().domain([1, 250000]).range([1,10]).exponent(0.3), f: function(d){return d.d75_pop;} },
  pop68: {scale: d3.scale.pow().domain([1, 250000]).range([1,10]).exponent(0.3), f: function(d){return d.d68_pop;} },
};


var svg = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height);

function render(color, size){
  var col = colors[color];
  var siz = sizes[size];
  svg.attr("class", col.brewer);

  svg.selectAll("circle")
  .data(global_data)
  .transition()
  .duration("2500")
  .delay(function(d, i) { return i*2; })
  .attr("r", function(d){ return siz.scale(parseFloat(siz.f(d)));})
  .attr("class", col.range);
}

function get_brewer_class(val, range){
  if(val < range[0]) return "q0-4";
  else if(val < range[1])  return "q1-4";
  else if(val < range[2])  return "q2-4";
  else return "q3-4";
}

  svg.append("image")
  .attr("xlink:href", "img/idf-830.png")
  .attr("width", width)
  .attr("height", height)
  .style("opacity", 0.5);


d3.csv("data/communes2.csv", function(error, data) {
  global_data = data;

  data.forEach(function(d) {
    var val = parseFloat(d.Surface);
    coord = proj([d.lon, d.lat]);
    
    var g = svg.append("g")
      .attr("transform", "translate(" + coord[0] + ", " + (height - coord[1]) + ")");

  /*g.append("circle")
    .attr("r", Math.sqrt(val)/10)
    .style("fill", "#6f5f5f");*/

  g.append("circle");

  g.append("text")
    .text(d.NomCommune + " - " + val)
    .style("fill", "black")
    .style("display", "none")
    .style("visibility", "hidden");
  });

  render("none", "none");

  d3.selectAll("g")
    .on('mouseover', function(e) {

      d3.select(this)
      .select("text")
        .transition()
        .duration("500")
        .style("display", "block")
        .style("visibility", "visible");

        d3.select(this).append("circle")
          .attr("r", 0)
          .attr("fill", "none")
          .attr("stroke-width", "1.5px")
          .style("stroke", "#6f5f5f")
          .style("stroke-opacity", 1)
        .transition()
          .duration(1000)
          .ease(Math.sqrt)
          .attr("r", 50)
          .style("stroke-opacity", 0)
          .remove();
    })
    .on('mouseout', function(e) {
      d3.select(this)
      .select("text")
        .transition()
        .duration("500")
        .style("display", "none")
        .style("visibility", "hidden");
    });
});

$(document).ready(function() {

  $("a").click(function() {
    svg.selectAll("circle")
      .transition()
      .duration("2000")
      .delay(function(d, i) { return i; })
      .style("fill", "green")
      ;//.attr("r", 10);

    return false;
  });

  var criteriasNormalWidth = $("#criterias").width()
  , criteriasCompactWidth = 60;
  $("#criterias").width(criteriasCompactWidth);
  $("#criterias").hover(function() {
    $(this).animate({"width": criteriasNormalWidth});
  }, function() {
    $(this).animate({"width": criteriasCompactWidth});
  });

  $("#criterias img:last-of-type").hide();
  $("#criterias a").click(function() {
    $(this).find("img:last-of-type").toggle();
    $(this).find("img:first-of-type").toggle();
    $(this).toggleClass("active");

    render("tx_appart", "pop90");
  });

});
