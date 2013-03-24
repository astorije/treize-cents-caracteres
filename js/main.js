
var svg = d3.select("body").append("svg")
  .attr("width", 700)
  .attr("height", 600)
  .style("fill", "#ddd");

for(var i=0; i<10; ++i) {
  var g = svg.append("g")
    .attr("transform", "translate(" + Math.random() * 700 + ", " + i * 70 + ")");

  g.append("circle")
    .attr("r", 25)
    .style("fill", "blue");

  g.append("text")
    .text("Truc")
    .style("fill", "black")
    .attr("opacity", 0);
}

d3.selectAll("g")
  .on('mouseover', function(e) {
    d3.select(this)
    .select("text")
      .transition()
      .duration("500")
      .attr("opacity", 1);

      truc(this);
      
  })
  .on('mouseout', function(e) {
    d3.select(this)
    .select("text")
      .transition()
      .duration("500")
      .attr("opacity", 0);
  });

  function truc(g) {
    d3.select(g).append("circle")
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
  }

/*svg.selectAll("circle").on('mouseover', function(e) {
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
          }*/


$(document).ready(function() {

  $("a").click(function() {
    svg.selectAll("circle")
      .transition()
      .duration("500")
      .delay(function(d, i) { return i * 10; })
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