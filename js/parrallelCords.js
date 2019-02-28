
function parrallelCords(rawData)
{
	var data = parseData(rawData);
    var transposed = transpose(data);

    //console.log(transposed);
	var div = d3.select("#parallel");
	var parentWidth = $("#parallel").parent().width();
	var margin = {top: 40, right: 30, bottom: 10, left: 60};
	var width = parentWidth - margin.left - margin.right;
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
            name: "Platform",
            scale: d3.scalePoint().domain(transposed[0].sort(d3.ascending)).range([height, 0]),
            type: "string"
        },
        {
            name: "Year_of_Release",
            scale: d3.scaleLinear().domain(d3.extent(transposed[1])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "Genre",
            scale: d3.scalePoint().domain(transposed[2].sort(d3.ascending)).range([height, 0]),
            type: "string"
        },
		{
			name: "NA_Sales",
			scale: d3.scaleLinear().domain(d3.extent(transposed[3])).range([height, 0]).nice(),
			type: "number"
        },
        {
            name: "EU_Sales",
            scale: d3.scaleLinear().domain(d3.extent(transposed[4])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "JP_Sales",
            scale: d3.scaleLinear().domain(d3.extent(transposed[5])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "Other_Sales",
            scale: d3.scaleLinear().domain(d3.extent(transposed[6])).range([height, 0]).nice(),
            type: "number"
        },
		{
			name: "Global_Sales",
			scale: d3.scaleLinear().domain(d3.extent(transposed[7])).range([height, 0]).nice(),
			type: "number"
        },
        {
            name: "Critic_Score",
            scale: d3.scaleLinear().domain(d3.extent(transposed[8])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "Critic_Count",
            scale: d3.scaleLinear().domain(d3.extent(transposed[9])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "User_Score",
            scale: d3.scaleLinear().domain(d3.extent(transposed[10])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "User_Count",
            scale: d3.scaleLinear().domain(d3.extent(transposed[11])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "Rating",
            scale: d3.scalePoint().domain(transposed[12].sort(d3.ascending)).range([height, 0]),
            type: "string"
        }
		
    ];

    var dimensionDomain = ["Platform", "Year_of_Release", "Genre", "NA_Sales", "EU_Sales",
        "JP_Sales", "Other_Sales", "Global_Sales", "Critic_Score", "Critic_Count", "User_Score",
        "User_Count", "Rating"];

    var xScale = d3.scaleBand()
        .domain(dimensionDomain)
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
			.attr("transform", function (d) { return "translate(" + xScale(d.name) + ")"; });

		// Add an axis and title.
		g.append("g")
			.attr("class", "axis")
			.each(function (d) { d3.select(this).call(d3.axisLeft(d.scale)); })
			.append("text")
			.attr("text-anchor", "middle")
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

	// Returns the path for a given data point.
    function path(item) {
        return line(dimensions.map(function (dim) {  
            return [xScale(dim.name), dim.scale(item[findDimIndex(dim)])]; 
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

    //Function that finds the index for a specified dimension
    function findDimIndex(dim)
    {
        //For every dimension
        for(var i = 0; i < dimensions.length; ++i)
        {
            //If the name is same, return the index
            if(dimensions[i].name == dim.name)
            {
                return i;
            }
        }
        //If not possible to find the index then log it
        console.log("Could not find dimension!");
    }
}

