
//Parse the data for every row in the table
function parseData(rawData)
{
	//To hold the data
    var data = [];
    var dimensions = d3.keys(rawData[0]);
    //console.log(dimensions);

	for(var i = 0; i < rawData.length; ++i)
	{
		//array for the items in the columns and a counter to know if string of number
		var dims = [];

		//For all items in the row (columns)
		for(var j in rawData[i])
        {
            //Columns with numerical values, convert to float if possible
			if( parseFloat(rawData[i][j]) > 0.0001 )
			{
				dims.push(parseFloat(rawData[i][j]));
			}
			//Check for NaN or empty slots, then push 0
            else if (!(rawData[i][j] === rawData[i][j]) || rawData[i][j] == "" || rawData[i][j] == "0")
			{
				dims.push(0);
			}
            //If no year specified use 1970
            else if(rawData[i][j] == "N/A")
            {
                dims.push(1970);
            }
			//Columns with string value, push as they are
			else
			{
				dims.push(rawData[i][j]);
			}
			
		}
		//Add this row to the data
		data.push(dims);
	}

	return data;
}


function transpose(data) {

    //To hold the result, copy data to get same structure
    var rows = data.length;
    var columns = data[0].length;

    //Declare the result
    var transposed = new Array(columns);
    for (var i = 0; i < columns; ++i)
    {
        transposed[i] = new Array(rows);
    }

    //For each row
    for (var r = 0; r < data.length; ++r)
    {
        //For each column
        for (var c in data[r])
        {
            //Transpose the data
            transposed[c][r] = data[r][c];
        }
    }
    //console.log(transposed);
    return transposed;
}

function extractSalesData(data, allData)
{
    var sales = [
        { 
            name: "NA sales",
            value: 0
        }, 
        { 
            name: "EU sales",
            value: 0
        }, 
        { 
            name: "JP sales",
            value: 0
        }, 
        { 
            name: "Other sales",
            value: 0
        }
    ];

    
    //Is the sent in data more than one line?
    if(allData)
    {
        for(var i = 0; i < data.length; ++i)
        {
            //For every value
            for(var j in data[i])
            {
                //Only count sales
                if(j < 9 && j > 4)
                    sales[j - 5].value += data[i][j];
            }
        }
    }
    else
    {
       //For every sales
        for(var i = 5; i < 9; ++i)
        {
            sales[i - 5].value += data[i];
        } 
    }
    
    return sales;
}

function extractTotalSales(data, allData)
{
    var total = 0;
    //Is the sent in data more than one line?
    if(allData)
    {
        for(var i = 0; i < data.length; ++i)
        {
            //For every value
            for(var j in data[i])
            {
                //Only count global sales
                if(j == 9)
                    total += data[i][j];
            }
        }
    }
    else
    {
       total = data[9];
    }
    
    return total;
}