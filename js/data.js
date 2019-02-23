
//Parse the data for every row in the table
function parseData(path)
{
	//To hold the data
	var data = [];	

	d3.csv(path,function(row)
	{
		//array for the items in the columns and a counter to know if string of number
		var dims = [];
		var count = 0;

		//For all items in the row
		for(var i in row)
		{
			//Columns with numerical values, how to make automatic?
			if(count == 1 || count == 2)
			{
				//Check for NaN, if NaN then push 0
				if(parseFloat(row[i]) > 0.001)
					dims.push(parseFloat(row[i]));
				else
					dims.push(0);
			}
			//Columns with string value
			else
				dims.push(row[i]);
			
			++count;
		}
		//Add this row to the data
		data.push(dims);
	});

	return data;
}
