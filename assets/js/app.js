var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 25,
  right: 50,
  bottom: 70,
  left: 80,
};

var svg = d3.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

var totalwidth = svgWidth - margin.left - margin.right;
var totalheight = svgHeight - margin.top - margin.bottom;

var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv", function(err, demographicdata) {
  if (err) throw err;

 demographicdata.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare= +d.healthcare;  
  });


// Identify the x and y axis
var xAxis = d3.scaleLinear()
  .domain([d3.min(demographicdata, d => d.poverty)-1, d3.max(demographicdata, d => d.poverty)+1, 20])
  .range([0, totalwidth]);

var InPoverty = d3.axisBottom(xAxis);
chart.append("g")
  .attr("transform", `translate(0, ${totalheight})`)
  .call(InPoverty);

var yAxis = d3.scaleLinear()
  .domain([d3.min(demographicdata, d => d.healthcare)-1, d3.max(demographicdata, d => d.healthcare)+2])
  .range([totalheight, 0]);
  
var LacksHealthcare = d3.axisLeft(yAxis);
chart.append("g")
  .call(LacksHealthcare);

var bubblechart = chart.selectAll("circle").data(demographicdata).enter();
var chartGraphic=bubblechart
  .append("circle")  
  .classed("stateCircle", true)
  .attr("cx", d => xAxis(d.poverty))
  .attr("cy", d => yAxis(d.healthcare))
  .attr("r", "15")
  .attr("opacity", ".5");
  
bubblechart.append("text")
  .classed("stateText", true)
  .attr("x", d => xAxis(d.poverty))
  .attr("y", d => yAxis(d.healthcare))
  .attr("stroke", "white")
  .attr("font-size", "10px")
  .text(d => d.abbr)

//  Create a tooltip
var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
  });

chartGraphic.call(toolTip);

chartGraphic.on("mouseover", function(d) {
  d3.select(this).style("background", "black")
  toolTip.show(d, this);
})
  .on("mouseout", function(d, index) {
    d3.select(this).style("background", "black")
    toolTip.show(d);
  });

chart.append("text")
.text("Lacks Healthcare (%)")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 25)
.attr("x", 0 - (totalheight / 2));

chart.append("text")
.text("In Poverty (%)")
.attr("transform", `translate(${totalwidth / 2}, ${totalheight + margin.top + 30})`);
    
});

