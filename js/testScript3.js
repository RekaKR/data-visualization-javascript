function pageLoaded() {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 90, left: 40 },
    width = 20000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#root")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Parse the Data
  d3.csv("/CSV/snakes_count_1000.csv", function (data) {
    console.log(data);
    let maxi = [];
    for (let i = 0; i < data.length; i++) {
      maxi.push(data[i].GameLength);
    }
    console.log(Math.max(...maxi));
    // X axis
    var x = d3
      .scaleBand()
      .range([0, width])
      .domain(
        data.map(function (d) {
          return d.GameNumber;
        })
      )
      .padding(0.2);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([0, Math.max(...maxi)])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.GameNumber);
      })
      .attr("width", x.bandwidth())
      .attr("fill", "orange")
      // no bar at the beginning thus:
      .attr("height", function (d) {
        return height - y(0);
      }) // always equal to 0
      .attr("y", function (d) {
        return y(0);
      });

    // Animation
    svg
      .selectAll("rect")
      .transition()
      .duration(500)
      .attr("y", function (d) {
        return y(d.GameLength);
      })
      .attr("height", function (d) {
        return height - y(d.GameLength);
      })
      .delay(function (d, i) {
        console.log(i);
        return i * 100;
      });
  });
}

window.addEventListener("load", pageLoaded);
