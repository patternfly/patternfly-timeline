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

    this.grid = d3.select('.grid');
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

    if (configuration.slider) {
      const zoomIn = container.append('button')
          .attr('type', 'button')
          .attr('class', 'btn btn-default pf-timeline-zoom')
          .attr('id', 'zoom-in')
          .style('top', `${configuration.padding.top}px`)
          .style('right', `${configuration.padding.right}px`)
          .on('click', this.zoomClick(this));
      zoomIn.append('i')
          .attr('class', 'fa fa-plus');

      const zoomOut = container.append('button')
          .attr('type', 'button')
          .attr('class', 'btn btn-default pf-timeline-zoom')
          .attr('id', 'zoom-out')
          .style('top', `${configuration.padding.top + dimensions.height - 26}px`)
          .style('right', `${configuration.padding.right}px`)
          .on('click', this.zoomClick(this));
      zoomOut.append('i')
        .attr('class', 'fa fa-minus');

      const zoomSlider = container.append('input')
          .attr('type', 'range')
          .attr('class', 'pf-timeline-zoom')
          .attr('id', 'pf-timeline-slider')
          .style('width', `${dimensions.height - (zoomIn.node().offsetHeight * 2)}px`)
          .style('top', `${configuration.padding.top + ((dimensions.height - (zoomIn.node().offsetHeight) * 2) / 2) + zoomIn.node().offsetHeight - 7}px`)
          .style('right', `${configuration.padding.right - (dimensions.height - zoomIn.node().offsetHeight) / 2 + zoomIn.node().offsetWidth}px`)
          .attr('value', this.sliderScale(this.zoom.scale()))
          .attr('min', configuration.minScale)
          .attr('max', configuration.maxScale)
          .attr('step', 0.1)
          .on('input', this.zoomClick(this));
    }


    if (configuration.eventZoom) {
      this.zoom.on('zoomend', configuration.eventZoom);
    }

    this.zoom.on('zoom', () => {
      requestAnimationFrame(() => callback(data));
      if(configuration.slider) {
        zoomSlider.property('value', this.sliderScale(zoom.scale()));
      }
      if(configuration.context) {
        const contextBrush = d3.select('.pf-timeline-brush');
        zoom.on('zoom', () => {
          requestAnimationFrame(() => callback(data));
          contextBrush.extent(scales.x.domain());
        });
      }
    });
    return this.grid.call(this.zoom)
      .on("dblclick.zoom", null);
  }

  zoomClick(that) {
    let factor = 0.5,
      target_zoom = 1,
      duration = 0,
      center = that.dimensions.width / 2,
      extent = that.zoom.scaleExtent(),
      translate0,
      l,
      view = {
        x: that.zoom.translate()[0],
        k: that.zoom.scale()
      };

    switch (this.id) {
      case 'zoom-in':
        target_zoom = that.zoom.scale() * (1 + factor);
        duration = 100;
        break;
      case 'zoom-out':
        target_zoom = that.zoom.scale() * (1 + factor * -1);
        duration = 100;
        break;
      case 'pf-timeline-slider':
        target_zoom = that.sliderScale.invert(this.value);
        break;
      default:
        target_zoom = that.zoom.scale();
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
    interpolateZoom([view.x, 0], view.k, 0);
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

  zoomFilter(time, timeframe) {
    /*
     time = time || scales.x.domain()[0];
     console.log(time);
     console.log(datepicker.datepicker('getDate'));
     */
    let range = this.getRange(this.scales.x.domain()),
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
    }

    translate += (target_zoom * width * this.zoom.scale() / this.getRange(this.scales.x.domain())) * this.getRange([time, this.scales.x.domain()[0]]);
    this.interpolateZoom([translate, 0], target_zoom, 100);
  }
}
