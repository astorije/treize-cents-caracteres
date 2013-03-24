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
  none:           { brewer: '',       range: function(d) { return null; }}, 
  jeunesse:       { brewer: 'RdYlGn', range: function(d){return get_brewer_class(d.jeunesse, [1.1, 2, 4]);} },
  gares :         { brewer: 'Blues',  range: function(d){return get_brewer_class(d.gares,    [10, 40, 80]);} },
  salaire_median :{ brewer: 'Blues',  range: function(d){return get_brewer_class(d.median,   [15000, 25000, 35000]);} },
  tx_hlm :        { brewer: 'RdGy',   range: function(d){return get_brewer_class(d.tx_hlm,   [5 ,15, 30]);} },
  tx_appart :     { brewer: 'RdYlGn', range: function(d){return get_brewer_class(d.tx_appart,[30, 60, 80]);} },
  augment1  :     { brewer: 'RdYlGn', range: function(d){return get_brewer_class(d.augment1,[-1000, 0, 1000]);} },
  augment2  :     { brewer: 'RdYlGn', range: function(d){return get_brewer_class(d.augment2,[-1000, 0, 1000]);} },
  augment3  :     { brewer: 'RdYlGn', range: function(d){return get_brewer_class(d.augment3,[-1000, 0, 1000]);} },
  augment4  :     { brewer: 'RdYlGn', range: function(d){return get_brewer_class(d.augment4,[-1000, 0, 1000]);} },
  augment5  :     { brewer: 'RdYlGn', range: function(d){return get_brewer_class(d.augment5,[-1000, 0, 1000]);} }
};

var sizes = {
  none: {scale: function(x){return 6;}, f: function(d){return 7;} },
  area: {scale: d3.scale.sqrt().domain([1, 5000]).range([1,10]), f: function(d){return d.surf;} }, 
  popref: {scale: d3.scale.pow().domain([1, 250000]).range([1,10]).exponent(.3), f: function(d){return d.p09_pop;} },
  pop99: {scale: d3.scale.pow().domain([1, 100000]).range([1,20]).exponent(3), f: function(d){return Math.min(d.p99_pop, 100000);} },
  pop09: {scale: d3.scale.pow().domain([1, 100000]).range([1,20]).exponent(3), f: function(d){return Math.min(d.p09_pop, 100000);} },
  pop90: {scale: d3.scale.pow().domain([1, 100000]).range([1,20]).exponent(3), f: function(d){return Math.min(d.d90_pop, 100000);} },
  pop82: {scale: d3.scale.pow().domain([1, 100000]).range([1,20]).exponent(3), f: function(d){return Math.min(d.d82_pop, 100000);} },
  pop75: {scale: d3.scale.pow().domain([1, 100000]).range([1,20]).exponent(3), f: function(d){return Math.min(d.d75_pop, 100000);} },
  pop68: {scale: d3.scale.pow().domain([1, 100000]).range([1,20]).exponent(3), f: function(d){return Math.min(d.d68_pop, 100000);} },
};


var svg = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height);

function render(color, size){
  var col = colors[color];
  var siz = sizes[size];

  svg.selectAll("circle")
  .data(global_data)
  .transition()
  .duration("2500")
  .delay(function(d, i) { return i*2; })
  .attr("r", function(d){ return siz.scale(parseFloat(siz.f(d)));})
  .style("fill", function(d){
    var tmp = col.range(d);
    if(tmp != null)
      return colorbrewer[col.brewer]['4'][tmp];
    else
      return "#6f5f5f";
  });

}

function get_brewer_class(val, range){
  if(val < range[0]) return 0;
  else if(val < range[1])  return 1;
  else if(val < range[2])  return 2;
  else return 3;
}

  svg.append("image")
  .attr("xlink:href", "img/idf-830.png")
  .attr("width", width)
  .attr("height", height)
  .style("opacity", 0.5);


d3.csv("data/communes.csv", function(error, data) {
  global_data = data;

  data.forEach(function(d) {
    var val = parseFloat(d.surf);
    coord = proj([d.lon, d.lat]);
    
    var g = svg.append("g")
      .attr("transform", "translate(" + coord[0] + ", " + (height - coord[1]) + ")");

  g.append("circle");

  g.append("text")
    .text(d.nomcom)
    .style("fill", "black")
    .style("display", "none")
    .style("visibility", "hidden");
  });

  render("none", "none");

  d3.selectAll("circle")
    .on('mouseover', function(e) {

      d3.select(this.parentNode)
      .select("text")
        .transition()
            .style("display", "block")
            .style("visibility", "visible")
        .transition()
          .duration("300")
            .style("opacity", 1)
        .transition()
          .delay("1300")
          .duration("200")
          .style("opacity", 0)
       .transition()
          .delay("1500")
          .style("display", "none")
          .style("visibility", "hidden");

        d3.select(this.parentNode).append("circle")
          .attr("r", 0)
          .attr("fill", "none")
          .attr("stroke-width", "1.5px")
          .style("stroke", "#6f5f5f")
          .style("stroke-opacity", 1)
        .transition()
          .duration(1500)
          .ease(Math.sqrt)
          .attr("r", 50)
          .style("stroke-opacity", 0)
          .remove();
    });
});

$(document).ready(function() {

  var criteriasNormalWidth = $("#criterias").width()
  , criteriasCompactWidth = 60;
  $("#criterias").width(criteriasCompactWidth);
  $("#criterias").hover(function() {
    $(this).animate({"width": criteriasNormalWidth});
  }, function() {
    $(this).animate({"width": criteriasCompactWidth});
  });

  $("#criterias img:first-of-type").hide();
  $("#criterias a").click(function() {
    $("#criterias img:first-of-type").hide();
    $("#criterias img:last-of-type").show();
    $(this).find("img:first-of-type").show();
    $(this).find("img:last-of-type").hide();
    $("#criterias a").removeClass("active");
    $(this).addClass("active");
  });

  $("#criterias a.first").click(function() {
    render("gares", "area");
    $("#legend svg").attr("class", colors["gares"].brewer);
  });

  $("#criterias a.second").click(function() {
    render("salaire_median", "popref");
    $("#legend svg").attr("class", colors["salaire_median"].brewer);
  });

  $("#criterias a.third").click(function() {
    render("jeunesse", "popref");
    $("#legend svg").attr("class", colors["jeunesse"].brewer);
  });

  $("#criterias a.fourth").click(function() {
    render("tx_hlm", "popref");
    $("#legend svg").attr("class", colors["tx_hlm"].brewer);
  });

  $("#criterias a.fifth").click(function() {
    setTimeout("render('augment1', 'area');", 0);
    setTimeout("render('augment2', 'area');", 5000);
    setTimeout("render('augment3', 'area');", 10000);
    setTimeout("render('augment4', 'area');", 15000);
    setTimeout("render('augment5', 'area');", 20000);
    $("#legend svg").attr("class", colors["augment4"].brewer);
  });

  /*$("#criterias a.fifth").click(function() {
    render("tx_appart", "popref");
    $("#legend svg").attr("class", colors["tx_appart"].brewer);
  });*/

  // 1 Transport
  // 2 Revenus
  // 3 Jeunesse
  // 4 Animation Population
  // 5 Superficie (area)

});
