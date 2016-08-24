import d3 from 'd3';

export default function(xScale, configuration) {
  const tickFormatData = configuration.tickFormat.map(t => t.slice(0));
  const tickFormat = configuration.locale ? configuration.locale.timeFormat.multi(tickFormatData) : d3.time.format.multi(tickFormatData);

  const axis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickFormat(tickFormat);

  if (typeof configuration.axisFormat === 'function') {
    configuration.axisFormat(axis);
  }

  return axis;
}
