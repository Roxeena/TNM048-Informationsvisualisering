//Authors: Malin Ejdbo and Elias Elmquist
//File that creates the visualization. Gets the data and sends it to each visualization

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