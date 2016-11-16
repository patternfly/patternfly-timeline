export default (container, scales, config) => data => {
  const labels = container.selectAll('.timeline-pf-label').data(data);

  const countEvents = data => {
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("events")) {
        count += data[i].events.length;
      } else {
        count++;
      }
    }
    return count
  }
  const text = d => {
    const count = countEvents(d.data);
    if (d.name === undefined || d.name ===''){
      return `${count} Events`;
    }
    return d.name + (count >= 0 ? ` (${count})` : '');
  };

  labels.text(text);

  labels.enter()
    .append('text')
      .classed('timeline-pf-label', true)
      .attr('transform', (d, idx) => `translate(${config.labelWidth - 20} ${scales.y(idx) + (config.lineHeight/2)})`)
      .attr('dominant-baseline', 'central')
      .attr('text-anchor', 'end')
      .text(text);

  labels.exit().remove();
};
