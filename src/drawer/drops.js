export default (svg, scales, configuration) => function dropsSelector(data) {
  const dropLines = svg.selectAll('.drop-line').data(data);

  dropLines.enter()
    .append('g')
    .classed('drop-line', true)
    .attr('transform', (d, idx) => `translate(0, ${scales.y(idx) + (configuration.lineHeight/2)})`)
    .attr('fill', configuration.eventLineColor);

  dropLines.each(function dropLineDraw(drop) {
    const drops = d3.select(this).selectAll('.drop').data(drop.data);

    drops.attr('transform', (d) => `translate(${scales.x(d.date)})`);

    const shape = drops.enter()
      .append('text')
      .classed('drop', true)
      .attr('transform', (d) => `translate(${scales.x(d.date)})`)
      .attr('fill', configuration.eventColor)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('data-toggle', 'tooltip')
      .attr('title', configuration.eventTooltip)
      .text(configuration.eventShape);

    if (configuration.eventClick) {
      shape.on('click', configuration.eventClick);
    }

    if (configuration.eventHover) {
      shape.on('mouseover', configuration.eventHover);
    }

    // unregister previous event handlers to prevent from memory leaks
    drops.exit()
      .on('click', null)
      .on('mouseover', null);

    drops.exit().remove();
  });

  dropLines.exit().remove();
};
