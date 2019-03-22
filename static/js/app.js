/****************************************************

Homework Assignment:
16-Data Journalism and D3 - Project Health Risks

@Author Jeffery Brown (daddyjab)
@Date 3/22/19
@File app.js

 ****************************************************/

// Set the dimension of the SVG div for the chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
              .append("svg")
              .attr("width", svgWidth)
              .attr("height", svgHeight);
            
// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {

  // create scales, with the x-values determined using the
  // 'chosenXAxis' property within the data object
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// Initial Params
var chosenYAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function yScale(data, chosenYAxis) {

  // create scales, with the x-values determined using the
  // 'chosenXAxis' property within the data object
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
      d3.max(data, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
}

// // function used for updating xAxis var upon click on axis label
// function renderAxes(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return xAxis;
// }

// // function used for updating circles group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, chosenXaxis) {

//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXAxis]));

//   return circlesGroup;
// }

// Object to specify the tooltip text based upon chosen axis
const toolTipTextList = {
  poverty: '% Population in Poverty',
  age: 'Median Age',
  income:  'Median Income',
  healthcare:  '% Population with Healthcare Coverage',
  obesity:  '% Population Classified as Obese',
  smokes: '% Population Who  Smoke'
};


// function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, data) {

//   // var toolTipItem = d3.select("body")
//   var toolTipItem = chartGroup.append("div")
//     .classed("tooltipinfo", true);
  
//   // Set mouse events for the circles
//   circlesGroup
//     // On mouseover, show tooltip
//     .on("mouseover", function(d) {

//       // Display the tooltip item
//       toolTipItem.style("display", "block")
//         .html( function(x) {
//           tipInfo = `State: ${d['state']} (${d['abbr']})<hr>`
//           tipInfo += `${toolTipTextList[chosenXAxis]}: ${d[chosenXAxis]}<br>`
//           tipInfo += `${toolTipTextList[chosenYAxis]}: ${d[chosenYAxis]}`
//           return tipInfo;
//         })
//         .style("left", d3.event.pageX + "px")
//         .style("top", d3.event.pageY + "px");
//     })

//     .on("mouseout", function() {
//       // toolTipItem.style("display", "none");
//       toolTipItem.style("display", "block");
//     });

//   // Return the circles group now that the events have been setup
//   return circlesGroup;
// }

// Retrieve data from the CSV file and execute everything below
d3.csv("static/js/data.csv", function(err, healthData) {

  if (err) {
    console.log("Error occurred while reading datafile: data.csv", err);
    throw err;
  };

  // Data Example from "data.csv"
  // id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh
  // 1,Alabama,AL,19.3,0.5,38.6,0.2,42830,598,13.9,12.7,15.1,33.5,32.1,35,21.1,19.8,22.5


  // List all data fields that should be numeric
  numericFields = [ "id","poverty","povertyMoe","age","ageMoe",
                    "income","incomeMoe","healthcare","healthcareLow","healthcareHigh",
                    "obesity","obesityLow","obesityHigh","smokes","smokesLow","smokesHigh" ]

  // For each row of Health Data...
  healthData.forEach( function(d) {

    // console.log(`healthData[${d['id']}] abbr = `, d['abbr']);

    // ... convert all the fields that should be numeric to numeric
    numericFields.forEach( function( element ) {
      d[ element ] = +d[ element ];
    });

  });

  console.log("Health Data after fields converted to numeric:", healthData);

  // Use the xScale function to define the x-axis scale function
  // based upon a chosen property of the input data
  var xLinearScale = xScale(healthData, chosenXAxis);

  // Use the yScale function to define the y-axis scale function
  // based upon a chosen property of the input data
  var yLinearScale = yScale(healthData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append x axis
  // Set the class of this axis to be the active x-axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Append y axis
  // Set the class of this axis to be the active y-axis
  var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

  // Append initial circles
  var stateCirclesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .classed("stateCircle", true);

  // Append initial circles
  var stateTextGroup = chartGroup.selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    // .attr("fill", "black")
    // .attr("opacity", ".5")
    .attr("dy", ".35em")
    .text(d => d["abbr"])
    .classed("stateText", true);

    // Create group for two x-axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var xAxisLabel_Age = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age");

  var xAxisLabel_Smokes = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  // Create group for two y-axis labels
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${0}, ${height / 2 })`);

  // append y axis
  var yAxisLabel_Poverty = yLabelsGroup.append("text")
    .attr("y", -40)
    .attr("x", 0)
    .attr("transform", "rotate(-90)")
    // .attr("dy", "1em")
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty");

  // updateToolTip function above csv import
  // var stateCirclesGroup = updateToolTip(chosenXAxis, chosenYAxis, stateCirclesGroup, healthData);

  var toolTipItem = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .classed("tooltipinfo", true);

    // Set mouse events for the circles
  stateCirclesGroup
    // On mouseover, show tooltip
    .on("mouseover", function(d) {

      // Build the tooltip content
      tipInfo = `State: ${d['state']} (${d['abbr']})<hr>`
      tipInfo += `${toolTipTextList[chosenXAxis]}: ${d[chosenXAxis]}<br>`
      tipInfo += `${toolTipTextList[chosenYAxis]}: ${d[chosenYAxis]}`
      tipInfo = "<h5>" + tipInfo + "</h5>"

      // Display the tooltip item
      toolTipItem.style("visibility", "visible")
        .html( tipInfo )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");

      // console.log("Mouse event - PageXY, LayerXY:", d3.event.pageX, d3.event.pageY, d3.event.layerX, d3.event.layerY);
      // console.log("Mouse event - Object:", d3.event);

    })

    .on("mouseout", function() {
      toolTipItem.style("visibility", "hidden");
    })

    .on("click", function() {
      toolTipItem.style("visibility", "visible")
      
      // Build the tooltip content
      tipInfo = `State: ${d['state']} (${d['abbr']})<hr>`
      tipInfo += `${toolTipTextList[chosenXAxis]}: ${d[chosenXAxis]}<br>`
      tipInfo += `${toolTipTextList[chosenYAxis]}: ${d[chosenYAxis]}`
      tipInfo = "<h5>" + tipInfo + "</h5>"

      .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    });


    //   // x axis labels event listener
//   labelsGroup.selectAll("text")
//     .on("click", function() {
//       // get value of selection
//       var value = d3.select(this).attr("value");
//       if (value !== chosenXAxis) {

//         // replaces chosenXaxis with value
//         chosenXAxis = value;

//         // console.log(chosenXAxis)

//         // functions here found above csv import
//         // updates x scale for new data
//         xLinearScale = xScale(healthData, chosenXAxis);

//         // updates x axis with transition
//         xAxis = renderAxes(xLinearScale, xAxis);

//         // updates circles with new x values
//         circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

//         // updates tooltips with new info
//         circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//         // changes classes to change bold text
//         if (chosenXAxis === "num_albums") {
//           albumsLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           hairLengthLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else {
//           albumsLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           hairLengthLabel
//             .classed("active", true)
//             .classed("inactive", false);
//         }
//       }
//     });
});
