

queue()
  .defer(d3.csv,'./data/test.csv')
  .await(draw);

var pc;

function draw(error, data){
    if (error) {
        console.log(error);
        throw error;
    }
 
  var newData = parseData(data);

  parrallelCords(newData);
}