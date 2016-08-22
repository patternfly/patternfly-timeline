import filterData from '../filterData';

export default (container, scales, config) => data => {
  const labels = container.selectAll('.label').data(data);

  const text = d => {
    const count = filterData(d.data, scales.x).length;
    return d.name + (count > 0 ? ` (${count})` : '');
  };

  labels.text(text);

  labels.enter()
    .append('text')
      .classed('label', true)
      // .attr('x', 180)
      .attr('transform', (d, idx) => `translate(${config.labelWidth - 20} ${scales.y(idx) + (config.lineHeight/2)})`)
      .attr('dominant-baseline', 'central')
      .attr('text-anchor', 'end')
      .text(text);

  labels.exit().remove();
};
