// Limites de l’Île-de-France considérés
// Requête pour l’obtenir : select min(ymin(transform(setsrid(the_geom,2154), 4326))) from communes_simplifiees;
var width = 1000,
  height = 669,
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


var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "#ddd");


d3.tsv("data/communes.csv", function(error, data) {
  data.forEach(function(d) {
    var val = parseFloat(d.Surface);
    coord = proj([d.lon, d.lat]);
    
    var g = svg.append("g")
      .attr("transform", "translate(" + coord[0] + ", " + (height - coord[1]) + ")");
    
  g.append("circle")
    .attr("r", Math.sqrt(val)/10)
    .style("fill", "#aaa");

  g.append("text")
    .text(d.NomCommune + " - " + val)
    .style("fill", "black")
    .style("display", "none")
    .style("visibility", "hidden");
  });

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
          .style("stroke", "blue")
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

svg.selectAll("circle").on('mouseover', function(e) {
          if (!packer.animating) {
            var g = d3.select(this),
              transform = g.attr('transform'),
              c = g.attr('class'),
              l = g.select('text'),
              t = l.text();
            
            var newEle = d3.select('#temp').append('g')
              .attr('class', c)
              .attr('transform', transform);
            
            newEle.append('text')
                .attr('y', 3)
                .text(t);
          }
  });


$(document).ready(function() {

  $("a").click(function() {
    svg.selectAll("circle")
      .transition()
      .duration("5000")
      //.delay(function(d, i) { return i * 10; })
      .style("fill", "green")
      .attr("r", 50);

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
  });

});
