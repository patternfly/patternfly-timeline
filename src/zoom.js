import d3 from 'd3';

export default class zoomer {

  constructor() {
  }

  updateZoom (container, dimensions, scales, configuration, data, callback) {
    this.ONE_MINUTE = 60 * 1000;
    this.ONE_HOUR = this.ONE_MINUTE * 60;
    this.ONE_DAY = this.ONE_HOUR * 24;
    this.ONE_WEEK = this.ONE_DAY * 7;
    this.ONE_MONTH = this.ONE_DAY * 30;

    this.grid = d3.select('.grid');
    this.dimensions = dimensions;
    this.scales = scales;
    this.configuration = configuration;
    this.data = data;

    if (configuration.slider) {

      const zoomIn = container.append('button')
          .attr('type', 'button')
          .attr('class', 'btn btn-default pf-timeline-zoom')
          .attr('id', 'zoom-in')
          .style('top', `${configuration.padding.top}px`)
          .style('right', `${configuration.padding.right}px`)
          .on('click', this.zoomClick);
      zoomIn.append('i')
          .attr('class', 'fa fa-plus');

      const zoomOut = container.append('button')
          .attr('type', 'button')
          .attr('class', 'btn btn-default pf-timeline-zoom')
          .attr('id', 'zoom-out')
          .style('top', `${configuration.padding.top + dimensions.height - 26}px`)
          .style('right', `${configuration.padding.right}px`)
          .on('click', this.zoomClick);
      zoomOut.append('i')
          .attr('class', 'fa fa-minus');

      const zoomSlider = container.append('input')
          .attr('type', 'range')
          .attr('class', 'pf-timeline-zoom')
          .attr('id', 'pf-timeline-slider')
          .style('width', `${dimensions.height - (zoomIn.node().offsetHeight * 2)}px`)
          .style('top', `${configuration.padding.top + ((dimensions.height - (zoomIn.node().offsetHeight) * 2) / 2) + zoomIn.node().offsetHeight - 7}px`)
          .style('right', `${configuration.padding.right - (dimensions.height - zoomIn.node().offsetHeight) / 2 + zoomIn.node().offsetWidth}px`)
          .attr('value', 1)
          .attr('min', 1)
          .attr('max', 720)
          .attr('step', .5)
          .on('input', this.slided);
    }

    this.zoom = d3.behavior.zoom()
      .size([dimensions.width, dimensions.height])
      .scaleExtent([configuration.minScale, configuration.maxScale])
      .x(scales.x)
      .on('zoom', () => {
        requestAnimationFrame(() => callback(data));
        // zoomSlider.property('value', zoom.scale());
      });

    if (configuration.eventZoom) {
      this.zoom.on('zoomend', configuration.eventZoom);
    }

    // if (configuration.brushZoom) {
    //   return container.call(zoom)
    //     .on("dblclick.zoom", null)
    //     .on('mousemove', () => {
    //       var m = d3.mouse(container[0][0]);
    //       var pt = [m[0] - 205, m[1]];
    //       zoom.center(pt);
    //     })
    //     .on("mousedown.zoom", null);
    // }

    return this.grid.call(this.zoom)
      .on("dblclick.zoom", null);

    // .on('mousemove', () => {
    //   var m = d3.mouse(grid[0][0]);
    //   var pt = [m[0] - 205, m[1]];
    //   zoom.center(pt);
    // });
  }

  slided(d) {
    var center = dimensions.width / 2,
        translate0,
        l,
        view = {
          x: zoom.translate()[0],
          k: zoom.scale()
        };

    d3.event.preventDefault();

    translate0 = (center - view.x) / view.k;
    view.k = d3.select(this).property("value");
    l = translate0 * view.k + view.x;

    view.x += center - l;
    this.interpolateZoom([view.x, 0], view.k, 0);
  }


  zoomClick(factor = .5) {
    var clicked = d3.event.target,
        direction = 1,
        target_zoom = 1,
        center = [dimensions.width / 2, dimensions.height / 2],
        extent = this.zoom.scaleExtent(),
        translate = this.zoom.translate(),
        translate0 = [],
        l = [],
        view = {
          x: translate[0],
          y: translate[1],
          k: this.zoom.scale()
        };

    d3.event.preventDefault();
    direction = (this.id === 'zoom-in') ? 1 : -1;
    target_zoom = this.zoom.scale() * (1 + factor * direction);

    if (target_zoom < extent[0]) {
      target_zoom = extent[0]
    } else if (target_zoom > extent[1]) {
      target_zoom = extent[1]
    }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];
    this.interpolateZoom([view.x, view.y], view.k, 100);
  }


  interpolateZoom(translate, scale, duration) {
    return d3.transition().duration(duration).tween("zoom", () => {
      if(this.zoom) {
        var iTranslate = d3.interpolate(this.zoom.translate(), translate),
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

  zoomFilter(time, timeframe) {
    /*
     time = time || scales.x.domain()[0];
     console.log(time);
     console.log(datepicker.datepicker('getDate'));
     */
    var range = this.getRange(this.scales.x.domain()),
        relation = document.getElementById('position-dropdown').innerHTML,
        width = this.dimensions.width,
        extent = this.zoom.scaleExtent(),
        translate = this.zoom.translate()[0],
        target_zoom = this.zoom.scale();

    relation = relation.substr(0, relation.indexOf('<') - 1);
    switch (timeframe) {
      case 'one_hour':
        range = this.ONE_HOUR;
        //this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'one_day':
        range = this.ONE_DAY;
        //this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'one_week':
        range = this.ONE_WEEK;
        //this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'one_month':
        range = this.ONE_MONTH;
        //this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'ending':
        relation = "ending";
        //this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'starting':
        relation = "starting";
        //this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'centered':
        relation = "centered";
        //this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'datepicker':
        //                 time = time.date;
        //                 relation = "same";
    }

    target_zoom = target_zoom * this.getScale(this.getRange(this.scales.x.domain()), range);

    if (target_zoom < extent[0]) {
      target_zoom = extent[0];
    } else if (target_zoom > extent[1]) {
      target_zoom = extent[1];
    }
    console.log(time);
    if (relation == "ending") {
      time = new Date(time - range);
      //             translate = width - (width * target_zoom);
    } else if (relation == "centered") {
      time = new Date(time - range / 2);
      //             translate = -1 * (width * target_zoom);
    } else if (relation == "starting") {
      //             translate = (width / 2) - (width * target_zoom);
    }

    translate += (target_zoom * width * this.zoom.scale() / this.getRange(this.scales.x.domain())) * this.getRange([time, this.scales.x.domain()[0]]);
    this.interpolateZoom([translate, 0], target_zoom, 100);
  }
}
