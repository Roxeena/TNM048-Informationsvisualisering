//Authors: Malin Ejdbo and Elias Elmquist
//Creates the pie chart visualization

//Usefull variables (global since they are needed in several functions)
var svg;
var arc;
var pie;
var formatDecimals;

//Create the pie chart
function circleDiagram(rawData)
{
    //Usefull variables
	var originalData = parseData(rawData)
    var data = extractSalesData(originalData, true);
    var totalSales = extractTotalSales(originalData, true);

    var div = d3.select("#pie");
	var parentWidth = $("#pie").parent().width();
	var margin = {top: 20, right: 20, bottom: 20, left: 20};
	var width = parentWidth - margin.left - margin.right;
	var height = 450 - margin.top - margin.bottom;
	var radius = Math.min(width, height) / 2.0;

	formatDecimals = d3.format(".1f");

	svg = div.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width /2.0 + "," + height /2.0 + ")");

	const color = colorbrewer.Set2[4];

    //Arc generator
	arc = d3.arc()
        .outerRadius(radius - margin.top)
        .innerRadius(radius - margin.top * 4.0);

    //Pie chart generator
	pie = d3.pie()
    	.value( function(d) {
            return d.value;
        })
    	.sort(null)
    	.padAngle(0.03);

    //Add a group element for each dimension
	var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", arc)
        .attr("class", "shadow");

    //Create the pie slices
	g.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return color[i]; })
        .transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attrTween("d", pieTween);

	var legendRectSize = 30;
    var legendSpacing = 15;
    var legendHeight = legendRectSize+legendSpacing;
 
    var legend = svg.selectAll('.legend')
        .data(data)
        .enter()
        .append('g')
        .attr("class", "legend")
        .attr("transform", function(d,i){
            //Just a calculation for x & y position
            return "translate(-65," + ((i*legendHeight)-80) + ")";
        });

    //Small circles to indicate colors
	legend.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .attr("rx", 20)
        .attr("ry", 20)
        .attr("class", "shadow")
        .style("fill", function(d, i) { return color[i]; })
        .style("stroke", function(d, i) { return color[i]; });
 
    //Text for each region
	legend.append('text')
    	.attr("class", "label")
        .attr("x", 40)
        .attr("y", 20)
        .text(function(d){
            return d.name + ": " + formatDecimals((d.value/totalSales)*100) + "%";
        })
        .style("fill", "black")
        .style("font-size", "14px");

}

//Animation when the pie chart is created
function pieTween(b) {
    b.innerRadius = 0;
    var inter = d3.interpolate({startAngle: 0, endAngle: 0}, b);
    return function(t) { return arc(inter(t)); };
}

//Animation when slises is updated
function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(1);
    return (t) => arc(i(t));
}

//Update the arcs
function update(selected_data)
{
	var newData = extractSalesData(selected_data, false);
    var totalSales = extractTotalSales(selected_data, false);

	var path = svg.selectAll("path")
        .data(pie(newData));

    //Update existing arcs
    path.transition()
    	.duration(1000)
    	.attrTween("d", arcTween);

    //Enter new arcs
    path.enter().append("path")
        .style("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .each(function(d) { this._current = d; });

    var label = svg.selectAll(".label")
    	.data(pie(newData));

    //Enter new labels
    label.attr("class", "label")
        .attr("x", 40)
        .attr("y", 20)
        .text(function(d){
            return d.data.name + ": " + formatDecimals((d.data.value/totalSales)*100) + "%";
        })
        .style("fill", "black")
        .style("font-size", "14px");
}




