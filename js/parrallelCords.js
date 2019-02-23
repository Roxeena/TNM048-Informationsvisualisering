
function parrallelCords(data)
{
	//console.log(data);
	var div = d3.select(".parrallelDiv").append("div");
	
	var margin = {top: 40, right: 30, bottom: 10, left: 30};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	var xScale = d3.scaleBand().range([0, width]);

	var line = d3.line(), 
		foreground,
		background;

	//Select the div and append our svg tag.
	var svg = div.append("svg")
		.attr("width", width)
		.attr("height", height + margin.top + margin.bottom)
		.append("svg:g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dimensions = [
		{
			name: "name",
			scale: d3.scaleOrdinal().range([0, height]),
			type: "string"
		},
		{
			name: "sales",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "score",
			scale: d3.scaleLinear().range([0, height]),
			type: "number"
		},
		{
			name: "genre",
			scale: d3.scaleOrdinal().range([0, height]),
			type: "string"
		}
	];

	plot(data);

	function plot(results)
	{
		/*background = svg.append("g")
			.attr("class", "background")
			.selectAll("path")
			.data(data)
			.enter().append("path")
			.attr("d", path);

		foreground = svg.append("g")
			.attr("class", "foreground")
			.selectAll("path")
			.data(data)
			.enter().append("path")
			.attr("d", path);
			//.style("stroke", function (d, i) {  return colors[results.assignments[i]]; });
*/
		var g = svg.selectAll(".dimension")
			.data(dimensions)
			.enter().append("g")
			.attr("class", "dimension")
			.attr("transform", function (d) { return "translate(" + xScale(d) + ")"; });

		// Add an axis and title.
		g.append("g")
			.attr("class", "axis")
			.each(function (d) { d3.select(this).call(d3.axisLeft(d.scale)); })
			.append("text")
			.attr("text-anchor", "middle")
			.attr("y", -9)
			.style('fill', 'black')
			.text(String);
	}
}

