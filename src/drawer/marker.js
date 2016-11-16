import d3 from 'd3';

export default (gridContainer, stampContainer, scales, dimensions, dateFormat) => {
  gridContainer.append('rect')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)
    .on("mouseover", function() {
      marker.style("display", null);
      timeStamp.style("display", null);
      timeBox.style("display", null);
    })
    .on("mouseout", function() {
      marker.style("display", "none");
      timeStamp.style("display", "none");
      timeBox.style("display", "none");
    })
    .on('mousemove', moveMarker);


  var marker = gridContainer.append('line')
    .classed('timeline-pf-marker', true)
    .attr('y1', 0)
    .attr('y2', dimensions.height);

  const domain = scales.x.domain();

  var timeBox = stampContainer.append('rect')
    .attr('height', '24')
    .attr('width', '150')
    .style('display', 'none');

  var timeStamp = stampContainer.append('text')
    .text(dateFormat(domain[1]))
    .attr('transform', `translate(${scales.x.range()[1]})`)
    .attr('text-anchor', 'middle');

  function moveMarker() {
    var pos = d3.mouse(gridContainer[0][0])[0]
    marker.attr('transform', `translate(${pos})`);
    timeBox.attr('transform', `translate(${pos - 75}, -25)`);
    timeStamp.attr('transform', `translate(${pos}, -9)`)
      .text(dateFormat(scales.x.invert(pos)));

  }

};
