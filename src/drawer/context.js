import d3 from 'd3';

export default (svg, scales, dimensions, configuration, data) => {

  const contextContainer = svg.append("g")
    .classed('context', true)
    .attr('width', dimensions.width)
    .attr('height', dimensions.ctxHeight)
    .attr("transform", `translate(${configuration.padding.left + configuration.labelWidth},${configuration.padding.top + dimensions.height + 40})`);

  let counts = [];
  let roundTo = 60000;//one hour


  countEvents(data, roundTo, counts);
  counts.sort((a,b) => {
    if(a.date < b.date) {
        return -1;
    }
    if(a.date > b.date) {
      return 1;
    }
    return 0;
  });
  scales.cty.domain([0, d3.max(counts, (d) => {return d.count;})]);

  let area = d3.svg.area()
  .interpolate("step")
  .x( d => { return scales.ctx(d.date); })
  .y0(dimensions.ctxHeight)
  .y1( d => { return scales.cty(d.count); });

  const context = contextContainer
    .append("path")
    .datum(counts)
    .attr("class", "area")
    .attr("d", area);

  contextContainer.append("g")
    .attr("class", "pf-timeline-brush");

  function countEvents(data, toRoundTo, counts) {
    let temp = {};
    for(let i in data) {
      for (let j in data[i].data) {
        let rounded = Math.floor(data[i].data[j].date / toRoundTo) * toRoundTo;
        temp[rounded] = temp[rounded] + 1 || 1;
      }
    }
    for(let k in temp) {
      let tempDate = new Date();
      tempDate.setTime(+k);
      counts.push({'date': tempDate, 'count': temp[k]});
    }
  }
};
