import d3 from 'd3';

export default (contextContainer, scales, dimensions, configuration) => data => {

  var counts = [];
  var roundTo = 86400000;
  var brush = d3.svg.brush()
  .x(scales.ctx)
  .on("brush", brushed);

  var xAxis = d3.svg.axis() // move into xaxis file
      .scale(scales.ctx)
      .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(scales.cty)
    .orient("left");

  var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return d.date; })
    .y0(dimensions.ctxHeight)
    .y1(function(d) { return d.count; });


  countEvents(data, roundTo, counts);

  // scales.cty.domain();

  contextContainer.append("path")
    .datum(counts)
    .attr("class", "area")
    .attr("d", area);


  contextContainer.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + (dimensions.ctxHeight - 20) + ")")
    .call(xAxis);

  // contextContainer.append("g")
  //   .attr("class", "x brush")
  //   .call(brush)
  // .selectAll("rect")
  //   .attr("y", -6)
  //   .attr("height", dimensions.ctxHeight + 7);


  function brushed() {
    scales.x.domain(brush.empty() ? scales.ctx.domain() : brush.extent());
    focus.select(".area").attr("d", area);

    // focus.select(".x.axis").call(xAxis);
    // Reset zoom scale's domain
  //   zoom.x(x);
  }
  function countEvents(data, toRoundTo, counts) {
    var temp = {};
    for(var i in data) {
      for (var j in data[i].data) {
        var rounded = Math.floor(data[i].data[j].date / toRoundTo) * toRoundTo;
        temp[rounded] = temp[rounded] + 1 || 1;
      }
    }
    for(var k in temp) {
      var tempDate = new Date();
      tempDate.setTime(+k);
      counts.push({'date': tempDate, 'count': temp[k]});
    }
  }
};
