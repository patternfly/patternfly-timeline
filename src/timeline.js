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

      let ungroupedData = data;
      data = groupEvents(data, finalConfiguration.eventGrouping);

      finalConfiguration.lineHeight = (data.length <= 3) ? 80 : 40;
      finalConfiguration.contextStart = finalConfiguration.contextStart || d3.min(getDates(data));
      finalConfiguration.contextEnd = finalConfiguration.contextEnd || finalConfiguration.end;

      d3.select(this).select('.timeline-pf-chart').remove();
      d3.select(this).selectAll('.timeline-pf-zoom').remove();

      const SCALEHEIGHT = 40;
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
        ctx: xScale(dimensions.width, [finalConfiguration.contextStart, finalConfiguration.contextEnd]),
        cty: d3.scale.linear().range([dimensions.ctxHeight, 0])
      };

      const svg = d3.select(this).append('svg')
        .classed('timeline-pf-chart', true)
        .attr({
          width: outer_width,
          height: dimensions.outer_height,
        });
      const draw = drawer(svg, dimensions, scales, finalConfiguration).bind(selection);

      draw(data);

      if (finalConfiguration.context) {
        context(svg, scales, dimensions, finalConfiguration, ungroupedData);
      }

      zoomInstance.updateZoom(d3.select(this), dimensions, scales, finalConfiguration, data, draw);

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

function groupEvents(data, toRoundTo) {
  let rounded,
      temp = {},
      toReturn = [];

  for (let i = 0; i < data.length; i++) {
    toReturn[i] = {};
    toReturn[i].name = data[i].name;
    toReturn[i].data = [];
    for (let j = 0; j < data[i].data.length; j++) {
      rounded = Math.round(data[i].data[j].date / toRoundTo) * toRoundTo;
      if (temp[rounded] === undefined) {
        temp[rounded] = [];
      }
      temp[rounded].push(data[i].data[j]);
    }
    for (let k in temp) {
      if (temp[k].length === 1) {
        toReturn[i].data.push(temp[k][0]);
      } else {
        let tempDate = new Date();
        tempDate.setTime(+k);
        toReturn[i].data.push({'date': tempDate,'events': temp[k]});
      }
    }
    temp = {};
  }
  return toReturn;
}
