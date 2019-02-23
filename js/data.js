
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
