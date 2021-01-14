function pageLoaded() {
  let margin = {
    top: 50,
    right: 30,
    bottom: 20,
    left: 40,
  },
    width = 50000 - margin.left - margin.right,
    height = 950 - margin.top - margin.bottom;

  let formatPercent = d3.format(".0");

  let x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1, 1);

  let y = d3.scale.linear().range([height, 0]);

  let xAxis = d3.svg.axis().scale(x).orient("bottom");

  let yAxis = d3.svg.axis().scale(y).orient("right").tickFormat(formatPercent);

  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("/CSV/snakes_count_1000.csv", function (error, data) {
    data.forEach(function (d) {
      d.gameLength = +d.gameLength;
    });

    x.domain(
      data.map(function (d) {
        return d.gameNumber;
      })
    );

    y.domain([
      0,
      d3.max(data, function (d) {
        return d.gameLength;
      }),
    ]);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.gameNumber);
      })
      .attr("width", x.rangeBand())
      .attr("y", function (d) {
        return y(d.gameLength);
      })
      .attr("height", function (d) {
        return height - y(d.gameLength);
      });

    d3.select("input").on("change", change);

    let sortTimeout = setTimeout(function () {
      d3.select("input").property("checked", true).each(change);
    }, 0);

    function change() {
      clearTimeout(sortTimeout);

      // Copy-on-write since tweens are evaluated after a delay.
      let x0 = x
        .domain(
          data
            .sort(
              this.checked
                ? function (a, b) {
                  return parseInt(b.gameLength) - parseInt(a.gameLength);
                }
                : function (a, b) {
                  return d3.ascending(parseInt(a.gameNumber), parseInt(b.gameNumber));
                }
            )
            .map(function (d) {
              return d.gameNumber;
            })
        )
        .copy();

      svg.selectAll(".bar").sort(function (a, b) {
        return x0(a.gameNumber) - x0(b.gameNumber);
      });

      let transition = svg.transition().duration(2),
        delay = function (d, i) {
          return i;
        };

      transition
        .selectAll(".bar")
        .delay(delay)
        .attr("x", function (d) {
          return x0(d.gameNumber);
        });

      transition.select(".x.axis").call(xAxis).selectAll("g").delay(delay);
    }
  });
}

window.addEventListener("load", pageLoaded);