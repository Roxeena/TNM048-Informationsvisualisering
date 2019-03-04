
function circleDiagram(rawData)
{
    var originalData = parseData(rawData)
    var data = extractSalesData(originalData);
    //console.log(data);

    var div = d3.select("#pie");
	var parentWidth = $("#pie").parent().width();
	var margin = {top: 20, right: 20, bottom: 20, left: 20};
	var width = parentWidth - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;
	var radius = Math.min(width, height) / 2.0;

    var formatDecimals = d3.format(".1f");

    var totalSales = 0;
    for(var i = 0; i < originalData.length; ++i)
    {
        for(var j in originalData[i])
        {
            if(j == 9)
                totalSales += originalData[i][9];
        }
    }

	var svg = div.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width /2.0 + "," + height /2.0 + ")");

	const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
         "#e78ac3","#a6d854","#ffd92f"]);

    var arc = d3.arc()
        .outerRadius(radius - margin.top)
        .innerRadius(radius - margin.top * 4.0);

    var labelArc = d3.arc()
        .outerRadius(radius - margin.top * 2.5)
        .innerRadius(radius - margin.top * 2.5);

    var pie = d3.pie()
    	.value( function(d) {
            return d.value;
        })
    	.sort(null)
    	.padAngle(0.03);

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", arc)
        .attr("class", "shadow");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return color(i); })
        .transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attrTween("d", pieTween);

    g.append("text")
        .transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attr("transform", function(d) { 
            return "translate(" + arc.centroid(d) + ")";
         })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { 
            return formatDecimals(d.data.value) + "%"; ; 
        })
        .style("fill", "white")
        .style("font-size", "10px");

    function pieTween(b) {
        b.innerRadius = 0;
        var inter = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return arc(inter(t)); };
    }

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

    legend.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .attr("rx", 20)
        .attr("ry", 20)
        .attr("class", "shadow")
        .style("fill", function(d, i) { return color(i); })
        .style("stroke", function(d, i) { return color(i); });
 
    legend.append('text')
        .attr("x", 40)
        .attr("y", 20)
        .text(function(d){
            return d.name;
        })
        .style("fill", "black")
        .style("font-size", "14px");

}

