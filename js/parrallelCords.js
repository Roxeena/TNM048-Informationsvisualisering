
function parrallelCords(rawData)
{
	var data = parseData(rawData);

	//console.log(data);
	var div = d3.select(".parrallelDiv").append("div");
	
	var margin = {top: 40, right: 30, bottom: 10, left: 30};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	var line = d3.line(); 
	var foreground;
	var background;

	//Select the div and append our svg tag.
	var svg = div.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dimensions = [
		{
			name: "Name",
			scale: d3.scaleOrdinal().range([height, 0]),
			type: "string"
		},
		{
			name: "Sales",
			scale: d3.scaleLinear().range([height, 0]),
			type: "number"
		},
		{
			name: "Score",
			scale: d3.scaleLinear().range([height, 0]),
			type: "number"
		},
		{
			name: "Genre",
			scale: d3.scaleOrdinal().range([height, 0]),
			type: "string"
		}
	];

	var xScale = d3.scaleBand()
		.domain( d3.keys(rawData[0]))
		.range([0, width]);

	plot(data);

	function plot(results)
	{
		background = svg.append("g")
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

		// Add a group element for each dimension.
		var g = svg.selectAll(".dimension")
			.data(dimensions)
			.enter().append("g")
			.attr("class", "dimension")
			.attr("transform", function (d) { console.log(xScale(d.name)); return "translate(" + xScale(d.name) + ")"; });

		// Add an axis and title.
		g.append("g")
			.attr("class", "axis")
			.each(function (d) { d3.select(this).call(d3.axisLeft(d.scale)); })
			.append("text")
			.attr("class", "title")
			.attr("text-anchor", "middle")
			.attr("y", -9)
			.style('fill', 'black')
			.text(function (d) { return d.name; });
	}

	// Returns the path for a given data point.
	function path(d) {
		return line(dimensions.map( function (p) { 
			return [xScale(p.name), p.scale(d[p.name])]; 
		}));
	}
}

