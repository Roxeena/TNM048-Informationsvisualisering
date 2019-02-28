
function parrallelCords(rawData)
{
	var data = parseData(rawData);
    var transposed = transpose(data);

	//console.log(data);
	var div = d3.select("#parallel");
	//console.log(div.node().parentNode);
	var parentWidth = $("#parallel").parent().width();
	var margin = {top: 40, right: 30, bottom: 10, left: 200};
	var width = parentWidth - margin.left - margin.right;
	var height = 400 - margin.top - margin.bottom;

	var line = d3.line(); 
	var foreground;
	var background;
	var dragging = {};

	//Select the div and append our svg tag.
	var svg = div.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dimensions = [
		{
			name: "Sales",
			scale: d3.scaleLinear().domain(d3.extent(transposed[0])).range([height, 0]).nice(),
			type: "number"
		},
		{
			name: "Score",
			scale: d3.scaleLinear().domain(d3.extent(transposed[1])).range([height, 0]).nice(),
			type: "number"
		},
		{
            name: "Genre",
            scale: d3.scalePoint().domain(transposed[2].sort(d3.ascending)).range([height, 0]),
			type: "string"
		}
	];

	var xScale = d3.scaleBand()
		.domain( updateDimensionDomain())
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
            .attr("d", path)
            .style("stroke", "red");
			//.style("stroke", function (d, i) {  return colors[results.assignments[i]]; });

		// Add a group element for each dimension.
		var g = svg.selectAll(".dimension")
			.data(dimensions)
			.enter().append("g")
			.attr("class", "dimension")
			.attr("transform", function (d) { return "translate(" + xScale(d.name) + ")"; })
			.call(d3.drag()
				.on("start", function(d) {
					dragging[d] = xScale(d.name);
					background.attr("visibility", "hidden");
				})
				.on("drag", function(d) {
					dragging[d] = Math.min(width, Math.max(0, d3.event.x));
					foreground.attr("d", path);
					dimensions.sort(function(a, b) { return dragging[a] - xScale(b.name); });
					xScale.domain(updateDimensionDomain());
					d3.select(this).attr("transform", function(d) { return "translate(" + position(d) + ")"; })
				})
				.on("end", function(d) {
					delete dragging[d];
					transition(d3.select(this))
					.attr("transform", function(p) { console.log(p); return "translate(" + xScale(d.name) + ")"; } );
					transition(foreground)
					.attr("d", path);
					background
					.attr("d", path)
					.transition()
					.delay(500)
					.duration(1000)
					.attr("visibility", null);
				}));
		
		// Add an axis and title.
		g.append("g")
			.attr("class", "axis")
			.each(function (d) { d3.select(this).call(d3.axisLeft(d.scale)); })
			.append("text")
			.attr("text-anchor", "start")
			.attr("y", -9)
			.style('fill', 'black')
			.text(function (d) { return d.name; });

		// Add and store a brush for each axis.
        g.append("g")
            .attr("class", "brush")
            .each(function (d) {
                d3.select(this).call(d.brush = d3.brushY()
                    .extent([[-10, 0], [10, height]])
                    .on("start", brushstart)
                    .on("brush", brush)
                    .on("end", brush)
                    );
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 10);
	}


	function position(d) {
		var v = dragging[d];
		return v == null ? xScale(d.name) : v;
	}

	function transition(g) {
		return g.transition().duration(500);
	}

	// Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function (p) { 
            return [xScale(p.name), p.scale(d[findDimIndex(p)])];
		}));
	}

	function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {

        var actives = [];
        svg.selectAll(".dimension .brush")
            .filter(function (d) {
                return d3.brushSelection(this);
            })
            .each(function (d) {
                actives.push({
                    dimension: d,
                    extent: d3.brushSelection(this)
                });
            });

        foreground.style("display", function (d) {
            return actives.every(function (active) {
                var dim = active.dimension;
                var ext = active.extent;
                return within(d[findDimIndex(dim)], ext, dim);
            }) ? null : "none";
        });

        function within(d, extent, dim) {
            return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1];
        };

    }

    function findDimIndex(dim)
    {
    	
    	for(var i = 0; i < dimensions.length; ++i)
    	{
    		if(dimensions[i].name == dim.name)
    		{
    			return i;
    		}
    	}
    	console.log("Could not find dimension!");
    }

    function updateDimensionDomain()
    {
    	var domains = [];
    	for(var i = 0; i < dimensions.length; ++i)
    	{
    		domains.push(dimensions[i].name);
    	}
    	return domains;
    }
}

