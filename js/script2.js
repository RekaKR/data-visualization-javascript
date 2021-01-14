function pageLoaded() {
  const w = 10000;
  const h = 700;

  const margins = { top: 50, left: 100, bottom: 100, right: 100 };
  const innerWidth = w - margins.left - margins.right;
  const innerHeight = h - margins.top - margins.bottom;

  d3.csv("/CSV/snakes_count_1000_v2.csv").then((data, error) => {
    if (error) throw error;
    // console.log(data);

    data.forEach((d) => {
      d.letter = d.letter;
      d.frequency = +d.frequency;
    });

    // Create a select dropdown
    const mySelection = document.getElementById("selectMe");

    d3.select(mySelection)
      .append("span")
      .append("p")
      .attr("class", "label")
      .text("How should these bars sorted?")
      .style("font-weight", "bold")
      .style("color", "red")
      .style("font-size", "25px");

    const selectItems = ["Alphabetically", "Ascendingly", "Descendingly"];

    // Create a drop down
    d3.select(mySelection)
      .append("span")
      .append("select")
      .attr("id", "selection")
      .attr("name", "tasks")
      // .style("font-size", "19px")
      .selectAll("option")
      .data(selectItems)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d);

    // When the page loads, the chart which sorted alphabetically loads by default
    document.addEventListener("DOMContentLoaded", myChart());

    // Chart changes based on drop down selection
    d3.select("#selection").on("change", function () {
      const selectedOption = d3.select(this).node().value;
      // console.log(selectedOption);
      if (selectedOption == "Ascendingly") {
        data.sort((a, b) => {
          return d3.ascending(a.frequency, b.frequency);
        });
      } else if (selectedOption == "Descendingly") {
        data.sort((a, b) => {
          return d3.descending(a.frequency, b.frequency);
        });
      } else if (selectedOption == "Alphabetically") {
        data.sort((a, b) => {
          return d3.ascending(a.letter, b.letter);
        });
      }
      myChart();
    });

    function myChart() {
      // Append SVG to this DIV
      const chartDIV = document.createElement("div");

      // Create scales
      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.letter))
        .rangeRound([0, innerWidth])
        // .round(true)
        .paddingInner(0.2);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.frequency)])
        .nice()
        .range([innerHeight, 0]);

      const xAxis = d3.axisBottom().scale(xScale);

      const yAxis = d3.axisLeft().scale(yScale);

      const svg = d3
        .select(chartDIV)
        .append("svg")
        .attr("viewBox", [0, 0, w, h])
        .attr("overflow", "auto");

      const mainG = svg
        .append("g")
        .attr("transform", `translate(${margins.left}, ${margins.top})`);

      const g = mainG
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", `translate(15,0)`);

      g.append("rect")
        .attr("class", "bars")
        .attr("x", (d) => xScale(d.letter) - innerWidth / data.length / 2)
        // .attr("x", (d,i) => i*(innerWidth/data.length))
        .attr("y", (d) => yScale(d.frequency))
        .attr("width", innerWidth / data.length - 1.5)
        .attr("height", (d) => innerHeight - yScale(d.frequency))
        .attr("fill", (d) =>
          d.frequency == d3.max(data, (d) => d.frequency) ? "#f4c430" : "green"
        );

      // Add labels to bars
      mainG
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text((d) => d.frequency.toFixed(3))
        .attr("text-anchor", "middle")
        .attr("x", (d, i) => xScale(d.letter) + innerWidth / data.length / 2)
        .attr("y", (d) => yScale(d.frequency) - 5)
        .attr("font-family", "sans-serif")
        .attr("font-size", "9px")
        .attr("font-weight", "bold")
        .attr("fill", "red");

      mainG
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`);

      mainG.append("g").call(yAxis);

      // This code will redraw charts based on dropdown selection. At any point in time, chartContainer DIV only contains one chart. The charts are recycled.
      const showChart = document.getElementById("chartContainer");
      while (showChart.firstChild) {
        showChart.firstChild.remove();
      }
      showChart.appendChild(chartDIV);
    }
  });
}

window.addEventListener("load", pageLoaded);
