function pageLoaded() {
  const title = "Games";
  console.log("d");
  d3.select("body").append("h3").text(title);

  d3.csv("/CSV/snakes_count_1000.csv", function (data) {
    //console.log(data);
    d3.select("body")
      .selectAll("div")
      .data(data)
      .enter()
      .append("div")
      .style("width", function (d) {
        console.log(d);
        return d[" GameLength"] * 4 + "px";
      })
      .style("height", "20px")
      .text(function (e) {
        return e[" GameLength"];
      });
  });
}

window.addEventListener("load", pageLoaded);
