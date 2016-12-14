import d3 from 'd3';
import axesFactory from './axes';
import dropsFactory from './drops';
import labelsFactory from './labels';
import markerFactory from './marker';

export default (svg, dimensions, scales, configuration) => {
  const defs = svg.append('defs');
  defs.append('clipPath')
    .attr('id', 'timeline-pf-drops-container-clipper')
    .append('rect')
      .attr('id', 'timeline-pf-drops-container-rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

  if(configuration.context) {
    defs.append('clipPath')
      .attr('id', 'timeline-pf-context-brush-clipper')
      .append('polygon')
        .attr('points', `0,0 ${dimensions.width},0 ${dimensions.width + configuration.sliderWidth},${dimensions.ctxHeight/2} ${dimensions.width},${dimensions.ctxHeight} 0,${dimensions.ctxHeight} ${-configuration.sliderWidth},${dimensions.ctxHeight/2}`);
  }

  const pattern = defs.append('pattern')
    .attr('class', 'timeline-pf-grid-stripes')
    .attr('id', 'timeline-pf-grid-stripes')
    .attr('width', dimensions.width)
    .attr('height', (configuration.lineHeight) * 2)
    .attr('patternUnits', 'userSpaceOnUse');
  pattern.append('rect')
    .attr('width', dimensions.width)
    .attr('height', configuration.lineHeight);
  pattern.append('line')
    .attr('x1', 0)
    .attr('x2', dimensions.width)
    .attr('y1', configuration.lineHeight)
    .attr('y2', configuration.lineHeight);
  pattern.append('line')
    .attr('x1', 0)
    .attr('x2', dimensions.width)
    .attr('y1', '1px')
    .attr('y2', '1px');

  const gridContainer = svg.append('g')
    .classed('timeline-pf-grid', true)
    .attr('fill', 'url(#timeline-pf-grid-stripes)')
    .attr('transform', `translate(${configuration.padding.left + configuration.labelWidth}, ${configuration.padding.top})`);

  const labelsContainer = svg.append('g')
    .classed('timeline-pf-labels', true)
    .attr('transform', `translate(${configuration.padding.left}, ${configuration.padding.top})`);

  const axesContainer = svg.append('g')
    .classed('timeline-pf-axes', true)
    .attr('transform', `translate(${configuration.padding.left + configuration.labelWidth},  ${configuration.padding.top})`);

  const dropsContainer = svg.append('g')
    .classed('timeline-pf-drops-container', true)
    .attr('clip-path', 'url(#timeline-pf-drops-container-clipper)')
    .attr('transform', `translate(${configuration.padding.left + configuration.labelWidth},  ${configuration.padding.top})`);

  if (configuration.marker) {
    const stampContainer = svg.append('g')
      .classed('timeline-pf-timestamp', true)
      .attr('height', 30)
      .attr('transform', `translate(${configuration.padding.left + configuration.labelWidth}, ${configuration.padding.top})`);

    markerFactory(gridContainer, stampContainer, scales, dimensions, configuration.dateFormat);
  }

  const axes = axesFactory(axesContainer, scales, configuration, dimensions);
  const labels = labelsFactory(labelsContainer, scales, configuration);
  const drops = dropsFactory(dropsContainer, scales, configuration);


  return data => {
    drops(data);
    labels(data);
    axes(data);
  };
};
