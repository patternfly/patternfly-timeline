import xAxis from '../xAxis';

export default (axesContainer, scales, configuration, dimensions) => data => {
  const axis = (scope, scale) => {
    const selection = axesContainer.selectAll(`.x-axis.${scope}`).data([{}]);

    selection.enter()
      .append('g')
      .classed('x-axis', true)
      .classed(scope, true)
      .call(xAxis(scale, configuration))
      .attr('transform', `translate(0,${scope === 'focus' ? dimensions.height: dimensions.height + dimensions.ctxHeight + 30})`);

    selection.call(xAxis(scale, configuration));

    selection.exit().remove();
  };

  axis('focus', scales.x);

  if (configuration.context) {
    axis('context', scales.ctx);
  }
};
