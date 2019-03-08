
function parrallelCords(rawData)
{
	var data = parseData(rawData);
    var transposed = transpose(data);
    var rawDimensions = d3.keys(rawData[0]);

    //console.log(transposed);
	var div = d3.select("#parallel");
	var parentWidth = $("#parallel").parent().width();
	var margin = {top: 40, right: 30, bottom: 10, left: 30};
	var width = parentWidth - margin.left - margin.right;
	var height = 450 - margin.top - margin.bottom;

	var line = d3.line(); 
	var foreground;
	var background;
    var dragging = {};

    var GenreColors = colorbrewer.Paired[12];
    var genres = ["0", "Strategy", "Sports", "Simulation", "Shooter", "Role-Playing", "Racing", 
        "Puzzle", "Platform", "Misc", "Fighting", "Adventure", "Action"];

	//Select the div and append our svg tag.
	var svg = div.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dimensions = [
        {
            name: "Platform",
            scale: d3.scalePoint().domain(transposed[1].sort(d3.ascending)).range([height, 0]),
            type: "string"
        },
        {
            name: "Year_of_Release",
            scale: d3.scaleLinear().domain(d3.extent(transposed[2])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "Genre",
            scale: d3.scalePoint().domain(transposed[3].sort(d3.ascending)).range([height, 0]),
            type: "string"
        },
		{
			name: "NA_Sales",
			scale: d3.scaleSqrt().domain(d3.extent(transposed[5])).range([height, 0]).nice(),
			type: "number"
        },
        {
            name: "EU_Sales",
            scale: d3.scaleSqrt().domain(d3.extent(transposed[6])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "JP_Sales",
            scale: d3.scaleSqrt().domain(d3.extent(transposed[7])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "Other_Sales",
            scale: d3.scaleSqrt().domain(d3.extent(transposed[8])).range([height, 0]).nice(),
            type: "number"
        },
		{
			name: "Global_Sales",
			scale: d3.scaleSqrt().domain(d3.extent(transposed[9])).range([height, 0]).nice(),
			type: "number"
        },
        {
            name: "Critic_Score",
            scale: d3.scaleLinear().domain(d3.extent(transposed[10])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "Critic_Count",
            scale: d3.scaleLinear().domain(d3.extent(transposed[11])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "User_Score",
            scale: d3.scaleLinear().domain(d3.extent(transposed[12])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "User_Count",
            scale: d3.scaleLinear().domain(d3.extent(transposed[13])).range([height, 0]).nice(),
            type: "number"
        },
        {
            name: "Rating",
            scale: d3.scalePoint().domain(transposed[15].sort(d3.ascending)).range([height, 0]),
            type: "string"
        }
		
    ];

    var xScale = d3.scalePoint()
        .domain( updateDimensionDomain())
        .rangeRound([0, width]).padding(0.2);


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
            .style("stroke", function(d) {
                if(d[3] == 0)
                    return "black"
                return GenreColors[findGenreIndex(d[3]) - 1];
            });
			//.style("stroke", function (d, i) {  return colors[results.assignments[i]]; });

		// Add a group element for each dimension.
		var g = svg.selectAll(".dimension")
			.data(dimensions)
			.enter().append("g")
			.attr("class", "dimension")
			.attr("transform", function (d) { return "translate(" + xScale(d.name) + ")"; })
            .call(d3.drag()
                .subject(function(d) { return {x: xScale(d.name)}; })
                .on("start", function(d) {
                    dragging[d.name] = xScale(d.name);
                    background.attr("visibility", "hidden");
                })
                .on("drag", function(d) {
                    dragging[d.name] = Math.min(width, Math.max(0, d3.event.x));
                    foreground.attr("d", path);
                    dimensions.sort(function(a, b) { return position(a.name) - position(b.name); });
                    xScale.domain(updateDimensionDomain());
                    g.attr("transform", function(d) { 
                        return "translate(" + position(d.name) + ")"; 
                    })
                })
                .on("end", function(d) {
                    delete dragging[d.name];
                    transition(d3.select(this)).attr(
                        "transform", "translate(" + xScale(d.name) + ")" );
                    transition(foreground).attr("d", path);
                    background.attr("d", path)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
                }));

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

        //Mouse functions
        svg.selectAll(".foreground path")
            .on("click", mouseClick)
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut);
	}

	// Returns the path for a given data point.
    function path(item) {
        return line(dimensions.map(function (dim) {  
            return [position(dim.name), dim.scale(item[findDimIndex(dim)])]; 
		}));
	}

    function position(d) {
      var v = dragging[d];
      return v == null ? xScale(d) : v;
    }

    function transition(g) {
      return g.transition().duration(500);
    }

    //Mouse over function
    function mouseOver(selected_line){    
        tooltip(selected_line);
        update(selected_line);
        foreground.style("display", selected_line);
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
        
        if(d[0] == 0)
        {
            tooltip
            .select("#name")
            .text("Name: " + "Unknown");
        }
        else
        {
            tooltip
            .select("#name")
            .text("Name: " + d[0]);
        }

        if(d[1] == 0)
        {
            tooltip
            .select("#platform")
            .text("Platform: " + "Unknown");
        }
        else
        {
            tooltip
            .select("#platform")
            .text("Platform: " + d[1]);
        }

        if(d[2] == 1970)
        {
            tooltip
            .select("#year")
            .text("Year of relese: " + "No data");
        }
        else
        {
            tooltip
            .select("#year")
            .text("Year of relese: " + d[2]);
        }

        if(d[3] == 0)
        {
            tooltip
            .select("#genre")
            .text("Genre: " + "Unknown");
        }
        else
        {
            tooltip
            .select("#genre")
            .text("Genre: " + d[3]);
        }

        tooltip
            .select("#publisher")
            .text("Publisher: " + d[4]);

        if(d[5] == 0)
        {
            tooltip
            .select("#NA_sales")
            .text("NA sales: " + "No data");
        }
        else
        {
            tooltip
            .select("#NA_sales")
            .text("NA sales: " + d[5]);
        }
        
        if(d[6] == 0)
        {
            tooltip
            .select("#EU_sales")
            .text("EU sales: " + "No data");
        }
        else
        {
            tooltip
            .select("#EU_sales")
            .text("EU sales: " + d[6]);
        }

        if(d[7] == 0)
        {
            tooltip
            .select("#JP_sales")
            .text("JP sales: " + "No data");
        }
        else
        {
            tooltip
            .select("#JP_sales")
            .text("JP sales: " + d[7]);
        }

        if(d[8] == 0)
        {
            tooltip
            .select("#other_sales")
            .text("Other sales: " + "No data");
        }
        else
        {
            tooltip
            .select("#other_sales")
            .text("Other sales: " + d[8]);
        }

        if(d[9] == 0)
        {
            tooltip
            .select("#global_sales")
            .text("Global sales: " + "No data");
        }
        else
        {
            tooltip
            .select("#global_sales")
            .text("Global sales: " + d[9]);
        }

        if(d[10] == 0)
        {
            tooltip
            .select("#critic_score")
            .text("Critic score: " + "No data");
        }
        else
        {
            tooltip
            .select("#critic_score")
            .text("Critic score: " + d[10]);
        }

        if(d[11] == 0)
        {
            tooltip
            .select("#critic_count")
            .text("Critic count: " + "No data");
        }
        else
        {
            tooltip
            .select("#critic_count")
            .text("Critic count: " + d[11]);
        }

        if(d[12] == 0)
        {
            tooltip
            .select("#user_score")
            .text("User score: " + "No data");
        }
        else
        {
            tooltip
            .select("#user_score")
            .text("User score: " + d[12]);
        }
        
        if(d[13] == 0)
        {
            tooltip
            .select("#user_count")
            .text("User count: " + "No data");
        }
        else
        {
            tooltip
            .select("#user_count")
            .text("User count: " + d[13]);
        }

        if(d[14] == 0)
        {
            tooltip
            .select("#developer")
            .text("Developer: " + "Unknown");
        }
        else
        {
            tooltip
            .select("#developer")
            .text("Developer: " + d[14]);
        }

        if(d[15] == 0)
        {
            tooltip
            .select("#rating")
            .text("Rating: " + "No data");
        }
        else
        {
            tooltip
            .select("#rating")
            .text("Rating: " + d[15]);
        }
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

    

    function findGenreIndex(genre)
    {
        for(var i = 0; i < genres.length; ++i)
        {
            if(genres[i] == genre)
            {
                return i;
            }
        }
        console.log("Could not find Genre!");
    }
}

