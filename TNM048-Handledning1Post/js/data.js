
//Parse the data for every row in the table
function parseData(rawData)
{
	//To hold the data
	var data = [];	

	for(var i = 0; i < rawData.length; ++i)
	{
		//array for the items in the columns and a counter to know if string of number
		var dims = [];

		//For all items in the row (columns)
		for(var j in rawData[i])
		{
			//Skip the columns with Names, developers and publishers, too clutterd
			if(j == "Name")
			{
				//console.log("skip!");
				continue;
			}

			//Columns with numerical values, convert to float if possible
			if( parseFloat(rawData[i][j]) > 0.0001 )
			{
				dims.push(parseFloat(rawData[i][j]));
			}
			//Check for NaN or empty slots, then push 0
			else if( !(rawData[i][j] === rawData[i][j]) || rawData[i][j] == "" || rawData[i][j] == "N/A")
			{
				dims.push(0);
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