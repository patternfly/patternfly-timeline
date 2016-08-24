import d3 from 'd3';

import configurable from 'configurable.js';
import defaultConfig from './config';
import drawer from './drawer';
import Zoom from './zoom';

function timeline(config = {}) {
  const finalConfiguration = {...defaultConfig, ...config};
  var zoomInstance = new Zoom();

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

  const ctyScale = (height, maxEvents) => {
    return d3.scale.linear()
      .range([height, 0]);
  };

  function timelineGraph(selection) {
    selection.each(function selector(data) {
      d3.select(this).select('.pf-timeline-chart').remove();
      d3.select(this).selectAll('.pf-timeline-zoom').remove();

      let outer_width = finalConfiguration.width || selection.node().clientWidth;
      const height = data.length * finalConfiguration.lineHeight;

      const dimensions = {
        width: outer_width - finalConfiguration.padding.right - finalConfiguration.padding.left - finalConfiguration.labelWidth - ((finalConfiguration.slider) ? finalConfiguration.sliderWidth : 0),
        height,
        ctxHeight: finalConfiguration.contextHeight,
        outer_height: height + finalConfiguration.padding.top + finalConfiguration.padding.bottom + ((finalConfiguration.context) ? finalConfiguration.contextHeight : 0)
      };
      const scales = {
        x: xScale(dimensions.width, [finalConfiguration.start, /* new Date( */ finalConfiguration.end /* .getTime() + (3600000 * 7)) */ ]),
        y: yScale(data),
        ctx: xScale(dimensions.width, [finalConfiguration.ctxStart, finalConfiguration.ctxEnd]),
        cty: ctyScale(dimensions.ctxHeight, finalConfiguration.maxEvents)
      };

      const svg = d3.select(this).append('svg')
        .classed('pf-timeline-chart', true)
        .attr({
          width: outer_width,
          height: dimensions.outer_height,
        });
      const draw = drawer(svg, dimensions, scales, finalConfiguration).bind(selection);

      draw(data);

      if (finalConfiguration.zoomable) {
        zoomInstance.updateZoom(d3.select(this), dimensions, scales, finalConfiguration, data, draw);
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
