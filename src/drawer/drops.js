export default (svg, scales, configuration) => function dropsSelector(data) {
  const dropLines = svg.selectAll('.timeline-pf-drop-line').data(data);

  dropLines.enter()
    .append('g')
    .classed('timeline-pf-drop-line', true)
    .attr('transform', (d, idx) => `translate(0, ${scales.y(idx) + (configuration.lineHeight/2)})`)
    .attr('fill', configuration.eventLineColor);

  dropLines.each(function dropLineDraw(drop) {

    const drops = d3.select(this).selectAll('.timeline-pf-drop').data(drop.data);

    drops.attr('transform', (d) => `translate(${scales.x(d.date)})`);

    const shape = drops.enter()
        .append('text')
          .classed('timeline-pf-drop', true)
          .classed('timeline-pf-event-group', (d) => {return d.hasOwnProperty("events") ? true : false})
          .attr('transform', (d) => `translate(${scales.x(d.date)})`)
          .attr('fill', configuration.eventColor)
          .attr('text-anchor', 'middle')
          .attr('data-toggle', 'popover')
          .attr('data-html', 'true')
          .attr('data-content', configuration.eventPopover)
          .attr('dominant-baseline', 'central')
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
