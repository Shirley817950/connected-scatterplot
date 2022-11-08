d3.csv('driving.csv', d3.autoType).then(d => {
    console.log(d);
    //d = d.filter(d => d.year < 1975);
    const margin = ({top: 30, right: 50, bottom: 75, left: 50});
    const width = 700 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
    const svg = d3.select(".container")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const xScale = d3.scaleLinear()
                     .domain(d3.extent(d, d => d.miles)).nice()
                     .range([0, width])
                     //.range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear()
                     .domain(d3.extent(d, d => d.gas)).nice()
                     .range([height, 0]);
                     //.range([height - margin.bottom, margin.top])
    var xAxis = d3.axisBottom(xScale)
                  .ticks(7);
    var yAxis = d3.axisLeft(yScale)
                  .ticks(null, "$.2f");
    var drawY = svg.append('g')
                   .attr('class', 'axis y-axis');
    var drawX = svg.append('g')
                   .attr('class', 'axis x-axis')
                   .attr("transform", `translate(0, ${height})`);
    drawX.call(xAxis)
         .select(".domain").remove()
         .call(xAxis)
         .call(g => g.select(".domain").remove());
    drawX.selectAll(".tick line")
         .clone()
         .attr("y2", -height)
         .attr("stroke-opacity", 0.1); // make it transparent 
    drawY.call(yAxis)
         .select(".domain").remove()
         .call(yAxis)
         .call(g => g.select(".domain").remove());
    drawY.selectAll(".tick line")
         .clone()
         .attr("x2", width)
         .attr("stroke-opacity", 0.1); // make it transparent 
    svg.call(g => g.append("text")
                   .attr("x", width - 3 * margin.right)
                   .attr("y", height + margin.bottom / 2)
                   .text("Miles per person per year")
                   .style("font-weight", "400")
                   .call(halo));
    svg.call(g => g.append("text")
                     .attr("x", -margin.left)
                     .attr("y", -margin.top + 15)
                     .text("Cost per gallon")
                     .style("font-weight", "400")
                     .call(halo));
    const line = d3.line()
                   .x(d => xScale(d.miles))
                   .y(d => yScale(d.gas));
    svg.append("path")
        .datum(d)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("d", line)
        .style("stroke-width", "3px");
    var circles = svg.selectAll('circle')
                     .data(d)
                     .enter();
    circles.append("circle")
           .attr('cx', d => xScale(d.miles))
           .attr('cy', d => yScale(d.gas))
           .attr("fill", "white")
           .attr("stroke", "black")
           .attr("r", "4px");
    function position(d) {
    const t = d3.select(this);
    switch (d.side) {
        case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
        case "right":
        t.attr("dx", "0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "start");
        break;
        case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
        case "left":
        t.attr("dx", "-0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "end");
        break;
    }}
    function halo(text) {
        text.select(function() {return this.parentNode.insertBefore(this.cloneNode(true), this);})
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 4)
            .attr("stroke-linejoin", "round");
    }
    circles.append("text")
           .attr('x', d => xScale(d.miles))
           .attr('y', d => yScale(d.gas))
           .attr("font-size", 10)
           .text(d => d.year)
           .each(position)
           .call(halo);
});