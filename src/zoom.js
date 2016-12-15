import d3 from 'd3';

export default class zoom {

  constructor() {
  }

  updateZoom(container, dimensions, scales, configuration, data, callback) {
    this.ONE_MINUTE = 60 * 1000;
    this.ONE_HOUR = this.ONE_MINUTE * 60;
    this.ONE_DAY = this.ONE_HOUR * 24;
    this.ONE_WEEK = this.ONE_DAY * 7;
    this.ONE_MONTH = this.ONE_DAY * 30;

    this.grid = d3.select('.timeline-pf-grid');
    this.dimensions = dimensions;
    this.scales = scales;
    this.configuration = configuration;
    this.data = data;
    this.callback = callback;
    this.sliderScale = d3.scale.log()
        .domain([configuration.minScale, configuration.maxScale])
        .range([configuration.minScale, configuration.maxScale])
        .base(2);
    this.zoom = d3.behavior.zoom()
        .size([dimensions.width, dimensions.height])
        .scaleExtent([configuration.minScale, configuration.maxScale])
        .x(scales.x);
    this.brush = null;

    if (configuration.slider) {
      const zoomIn = container.append('button')
          .attr('type', 'button')
          .attr('class', 'btn btn-default timeline-pf-zoom timeline-pf-zoom-in')
          .attr('id', 'timeline-pf-zoom-in')
          .style('top', `${configuration.padding.top}px`)
          .on('click', () => {this.zoomClick()});
      zoomIn
        .style('left', `${configuration.padding.left + configuration.labelWidth + dimensions.width + (configuration.sliderWidth - zoomIn.node().offsetWidth)}px`)
        .append('i')
            .attr('class', 'fa fa-plus')
            .attr('id', 'timeline-pf-zoom-in-icon');

      const zoomOut = container.append('button')
          .attr('type', 'button')
          .attr('class', 'btn btn-default timeline-pf-zoom')
          .attr('id', 'timeline-pf-zoom-out')
          .style('top', `${configuration.padding.top + dimensions.height - 26}px`)
          .on('click', () => {this.zoomClick()});
          console.log(zoomIn.node().offsetWidth);
      zoomOut
        .style('left', `${configuration.padding.left + configuration.labelWidth + dimensions.width + (configuration.sliderWidth - zoomOut.node().offsetWidth)}px`)
        .append('i')
          .attr('class', 'fa fa-minus')
          .attr('id', 'timeline-pf-zoom-out-icon');

      const zoomSlider = container.append('input')
          .attr('type', 'range')
          .attr('class', 'timeline-pf-zoom timeline-pf-slider')
          .attr('id', 'timeline-pf-slider')
          .style('width', `${dimensions.height - (zoomIn.node().offsetHeight * 2)}px`)
          .attr('value', this.sliderScale(this.zoom.scale()))
          .attr('min', configuration.minScale)
          .attr('max', configuration.maxScale)
          .attr('step', 0.1)
          .on('input', () => {this.zoomClick()});
      zoomSlider
        .style('top', `${configuration.padding.top + ((dimensions.height - (zoomIn.node().offsetHeight) * 2) / 2) + zoomIn.node().offsetHeight - (zoomSlider.node().offsetHeight / 2)}px`)
        .style('left', `${configuration.padding.left + configuration.labelWidth + dimensions.width +
                          configuration.sliderWidth - ((zoomIn.node().offsetWidth - zoomSlider.node().offsetHeight) / 2) - (zoomSlider.node().offsetWidth / 2)}px`);
    }

    if(configuration.context) {
      this.brush = d3.svg.brush()
        .x(scales.ctx)
        .extent(scales.x.domain())
        .on("brush", () => {this.brushed()});

      container.select('.timeline-pf-brush')
        .call(this.brush)
        .selectAll("rect")
          .attr("height", dimensions.ctxHeight);
    }


    if (configuration.eventZoom) {
      this.zoom.on('zoomend', configuration.eventZoom);
    }

    this.zoom.on('zoom', () => {
      requestAnimationFrame(() => callback(data));
      if(configuration.slider) {
        container.select('#timeline-pf-slider').property('value', this.sliderScale(this.zoom.scale()));
      }
      if(configuration.context) {
        this.brush.extent(this.scales.x.domain());
        container.select('.timeline-pf-brush').call(this.brush);
      }
    });
    return this.grid.call(this.zoom)
      .on("dblclick.zoom", null);
  }

  brushed() {
    if(this.brush.empty() !== true) {
      let extent = this.brush.extent();
      this.zoomFilter(extent[0], extent[1], 0);
    }
  }

  zoomClick() {
    let factor = 0.5,
      target_zoom = 1,
      duration = 0,
      center = this.dimensions.width / 2,
      extent = this.zoom.scaleExtent(),
      translate0,
      l,
      view = {
        x: this.zoom.translate()[0],
        k: this.zoom.scale()
      };
    switch (d3.event.target.id) {
      case 'timeline-pf-zoom-in-icon':
      case 'timeline-pf-zoom-in':
        target_zoom = this.zoom.scale() * (1 + factor);
        duration = 100;
        break;
      case 'timeline-pf-zoom-out-icon':
      case 'timeline-pf-zoom-out':
        target_zoom = this.zoom.scale() * (1 + factor * -1);
        duration = 100;
        break;
      case 'timeline-pf-slider':
        target_zoom = this.sliderScale.invert(d3.event.target.value);
        break;
      default:
        target_zoom = this.zoom.scale();
    }

    if (target_zoom < extent[0]) {
      target_zoom = extent[0];
    } else if (target_zoom > extent[1]) {
      target_zoom = extent[1];
    }

    translate0 = (center - view.x) / view.k;
    view.k = target_zoom;
    l = translate0 * view.k + view.x;

    view.x += center - l;
    this.interpolateZoom([view.x, 0], view.k, duration);
  }

  interpolateZoom(translate, scale, duration) {
    return d3.transition().duration(duration).tween("zoom", () => {
      if(this.zoom) {
        let iTranslate = d3.interpolate(this.zoom.translate(), translate),
          iScale = d3.interpolate(this.zoom.scale(), scale);
        return (t) => {
          this.zoom
            .scale(iScale(t))
            .translate(iTranslate(t));
          this.zoom.event(this.grid);
        };
      }
    });
  }

  getRange(Extent) {
    return Extent[1].getTime() - Extent[0].getTime();
  }

  getScale(oldRange, newRange) {
    return oldRange / newRange;
  }

  zoomFilter(fromTime, toTime, duration = 100) {
    let range = toTime - fromTime,
        width = this.dimensions.width,
        extent = this.zoom.scaleExtent(),
        translate = this.zoom.translate()[0],
        curZoom = this.zoom.scale(),
        target_zoom = this.zoom.scale(),
        cur_width = this.getRange(this.scales.x.domain()),
        startDiff;

    target_zoom = target_zoom * this.getScale(this.getRange(this.scales.x.domain()), range); // new scale is ratio between old and new date ranges

    if (target_zoom < extent[0]) {
      target_zoom = extent[0];
    } else if (target_zoom > extent[1]) {
      target_zoom = extent[1];
    }

    startDiff = (this.scales.x.domain()[0] - fromTime) * (width / cur_width); // difference between leftmost dates in px

    translate += startDiff;

    translate  = translate * (target_zoom / curZoom); // scale translate value (in px) to new zoom scale

    this.interpolateZoom([translate, 0], target_zoom, duration)
  }
}
