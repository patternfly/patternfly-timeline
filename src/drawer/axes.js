import xAxis from '../xAxis';

export default (axesContainer, scales, configuration, dimensions) => data => {
  const axis = (scope, scale) => {
    const selection = axesContainer.selectAll(`.timeline-pf-x-axis.${scope}`).data([{}]);

    selection.enter()
      .append('g')
      .classed('timeline-pf-x-axis', true)
      .classed(scope, true)
      .call(xAxis(scale, configuration))
      .attr('transform', `translate(0,${scope === 'focus' ? dimensions.height : dimensions.height + dimensions.ctxHeight + 40})`);

    selection.call(xAxis(scale, configuration, dimensions.width));

    selection.exit().remove();
  };

  axis('focus', scales.x);

  if (configuration.context) {
    axis('context', scales.ctx);
  }
};
