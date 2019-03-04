
function parrallelCords(rawData)
{
	var data = parseData(rawData);
    var transposed = transpose(data);
    var rawDimensions = d3.keys(rawData[0]);
    //console.log(rawDimensions);

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
			scale: d3.scaleLinear().domain(d3.extent(transposed[1])).range([height, 0]).nice(),
			type: "number"
		},
		{
			name: "Score",
			scale: d3.scaleLinear().domain(d3.extent(transposed[2])).range([height, 0]).nice(),
			type: "number"
		},
		{
            name: "Genre",
            scale: d3.scalePoint().domain(transposed[3].sort(d3.ascending)).range([height, 0]),
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
			.attr("transform", function (d) { return "translate(" + xScale(d.name) + ")"; });
		
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

        //Mouse functions
        var projection = svg.selectAll(".foreground path")
        	.on("click", mouseClick)
        	.on("mouseover", mouseOver)
        	.on("mouseout", mouseOut);
	    //mouseOver(selected_line);
	    //mouseOut(selected_line);

	    var selected_lines = g.selectAll(".foreground path");
	}

	//Mouse over function
    function mouseOver(selected_line){    
        tooltip(selected_line);
    }

    //Mouse out function
    function mouseOut(selected_line){    
        
	}

	//Mouse click function
	function mouseClick(selected_line){  
		console.log(selected_line);  
		//Hightlight this line and make it stay hightlighted until user clicks somewhere eles
    }

	function tooltip(d)
    {
    	//Helper function for including information tool_tip
        // Defining tooltip for hovering points
        var tooltip = d3.select("#tooltip");
        tooltip
            .select("#name")
            .text("Name: " + d[0]);

        tooltip
            .select("#sales")
            .text("Sales: " + d[1]);

        if (d[2] == 0) {
            tooltip
                .select("#score")
                .text("Score: No entry");
        } else {
            tooltip
                .select("#score")
                .text("Score: " + d[2]);
        }
        tooltip
            .select("#genre")
            .text("Genre: " + d[3])
            ;
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
            return  actives.every(function (active) {
                var dim = active.dimension;
                var ext = active.extent;
                return within(d[findDimIndex(dim)], ext, dim);
            }) ? null : "none";
        });
        
    }

    function within(d, extent, dim) {
        return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1];
    };

    function findDimIndex(dim)
    {
    	//for all the dimensions in axes
    	for(var i = 0; i < dimensions.length; ++i)
    	{
    		//for all the dimensions in the data
    		for(var j = 0; j < rawDimensions.length; ++j)
    		{
	    		//Compare 
	    		if(rawDimensions[j] == dim.name)
	    		{
	    			return j;
	    		}
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

