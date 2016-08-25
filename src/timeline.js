import d3 from 'd3';

import configurable from 'configurable.js';
import defaultConfig from './config';
import drawer from './drawer';
import context from './drawer/context';
import Zoom from './zoom';


function timeline(config = {}) {
  const finalConfiguration = {...defaultConfig, ...config};
  let zoomInstance = new Zoom();

  const yScale = (data) => {
    return d3.scale.ordinal()
      .domain(data.map((d) => d.name))
      .range(data.map((d, i) => i * finalConfiguration.lineHeight));
  };

  const xScale = (width, timeBounds) => {
    return d3.time.scale()
      .range([0, width])
      .domain(timeBounds);
  };

  function timelineGraph(selection) {
    selection.each(function selector(data) {
      d3.select(this).select('.pf-timeline-chart').remove();
      d3.select(this).selectAll('.pf-timeline-zoom').remove();

      const SCALEHEIGHT = 30;
      let outer_width = finalConfiguration.width || selection.node().clientWidth;
      const height = data.length * finalConfiguration.lineHeight;

      const dimensions = {
        width: outer_width - finalConfiguration.padding.right - finalConfiguration.padding.left - finalConfiguration.labelWidth - ((finalConfiguration.slider) ? finalConfiguration.sliderWidth : 0),
        height,
        ctxHeight: finalConfiguration.contextHeight,
        outer_height: height + finalConfiguration.padding.top + finalConfiguration.padding.bottom + ((finalConfiguration.context) ? finalConfiguration.contextHeight + SCALEHEIGHT: 0)
      };
      const scales = {
        x: xScale(dimensions.width, [finalConfiguration.start, finalConfiguration.end]),
        y: yScale(data),
        ctx: xScale(dimensions.width, [d3.min(getDates(data)), finalConfiguration.end]),
        cty: d3.scale.linear().range([dimensions.ctxHeight, 0])
      };

      const svg = d3.select(this).append('svg')
        .classed('pf-timeline-chart', true)
        .attr({
          width: outer_width,
          height: dimensions.outer_height,
        });
      const draw = drawer(svg, dimensions, scales, finalConfiguration).bind(selection);

      draw(data);

      zoomInstance.updateZoom(d3.select(this), dimensions, scales, finalConfiguration, data, draw);

      if (finalConfiguration.context) {
        context(svg, scales, dimensions, finalConfiguration, data);
      }
    });
  }

  configurable(timelineGraph, finalConfiguration);
  timelineGraph.Zoom = zoomInstance;
  return timelineGraph;
}

d3.chart = d3.chart || {};
d3.chart.timeline = timeline;

module.exports = timeline;

function getDates(data) {
  let toReturn = [];
  for (let i = 0; i < data.length; i++){
    for (let j = 0; j < data[i].data.length; j++){
      toReturn.push(data[i].data[j].date);
    }
  }
  return toReturn;
}
