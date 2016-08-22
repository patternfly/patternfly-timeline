import xAxis from '../xAxis';

const drawAxis = (svg, xScale, configuration, orientation, y) => {
  svg.append('g')
    .classed('x-axis', true)
    .classed(orientation, true)
    .attr('transform', `translate(${configuration.padding.left}, ${y})`)
    .call(xAxis(xScale, configuration, orientation));
};

// export const drawTopAxis = (svg, xScale, configuration, dimensions) => drawAxis(svg, xScale, configuration, 'top', configuration.padding.top);
export const drawBottomAxis = (svg, xScale, configuration, dimensions) => drawAxis(svg, xScale, configuration, 'bottom', configuration.padding.top + dimensions.height);
