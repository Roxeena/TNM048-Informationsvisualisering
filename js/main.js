

queue()
  .defer(d3.csv,'./data/videogamesales.csv')
  .await(draw);

var pc;

function draw(error, data){
    if (error) {
        console.log(error);
        throw error;
    }

  parrallelCords(data);
  circleDiagram(data);
}