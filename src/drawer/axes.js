import xAxis from '../xAxis';

export default (axesContainer, scales, configuration, dimensions) => data => {
  const axis = (scope, scale) => {
    const selection = axesContainer.selectAll(`.x-axis.${scope}`).data([{}]);

    selection.enter()
      .append('g')
      .classed('x-axis', true)
      .classed(scope, true)
      .call(xAxis(scale, configuration))
      .attr('transform', `translate(0,${scope === 'focus' ? dimensions.height: dimensions.height + dimensions.ctxHeight + 25})`);

    selection.call(xAxis(scale, configuration));

    selection.exit().remove();
  };

  // if (boolOrReturnValue(configuration.hasTopAxis, data)) {
    axis('focus', scales.x);
  // }

  // if (boolOrReturnValue(configuration.hasBottomAxis, data)) {
  if (configuration.context) {
    axis('context', scales.ctx);
  }
  // }
};
