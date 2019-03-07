
function circleDiagram(rawData)
{
    var data = parseData(rawData);

    var div = d3.select("#pie");
	var parentWidth = $("#pie").parent().width();
	var margin = {top: 20, right: 20, bottom: 20, left: 20};
	var width = parentWidth - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;
	var radius = Math.min(width, height) / 2.0;

    var formatDecimals = d3.format(".3f");

	var svg = div.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width /2.0 + "," + height /2.0 + ")");

	const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
         "#e78ac3","#a6d854","#ffd92f"]);

    var totalSales = 0;

    for(var i = 0; i < data.length; ++i)
    {
        totalSales += data[i][1];
    }

    var arc = d3.arc()
        .outerRadius(radius - margin.top)
        .innerRadius(radius - margin.top * 3.0);

    var labelArc = d3.arc()
        .outerRadius(radius - margin.top * 2.0)
        .innerRadius(radius - margin.top * 2.0);

    var pie = d3.pie()
    	.value( function(d) {
            return d[1];
        })
    	.sort(null)
    	.padAngle(0.03);

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", arc);

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return color(i); })
        .transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attrTween("d", pieTween);

    g.append("text")
        .attr("transform", function(d) { 
            return "translate(" + labelArc.centroid(d) + ")";
         })
        .attr("dy", ".35em")
        .text(function(d) { 
            return formatDecimals(d.value) + "%"; ; 
        });

    function pieTween(b) {
        b.innerRadius = 0;
        var inter = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return arc(inter(t)); };
    }

}

