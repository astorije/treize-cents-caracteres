
var svg = d3.select("body").append("svg")
  .attr("width", 700)
  .attr("height", 600)
  .style("fill", "#ddd");

for(var i=0; i<10; ++i)
  svg.append("circle")
    .attr("r", 30)
    .style("fill", "blue")
    .attr("cx", i * 70)
    .attr("cy", i * 70);