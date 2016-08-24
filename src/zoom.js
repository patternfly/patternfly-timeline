import d3 from 'd3';

export default (container, dimensions, scales, configuration, data, callback) => {
  const ONE_MINUTE = 60 * 1000;
  const ONE_HOUR = ONE_MINUTE * 60;
  const ONE_DAY = ONE_HOUR * 24;
  const ONE_WEEK = ONE_DAY * 7;
  const ONE_MONTH = ONE_DAY * 30;

  const grid = d3.select('.grid');

  const sliderScale = d3.scale.log()
    .domain([configuration.minScale, configuration.maxScale])
    .range([configuration.minScale, configuration.maxScale])
    .base(2);

  const dropdown = d3.selectAll('.zoom-filter > li > a')
    .on('click', zoomFilter);

  const datepicker = $('#datepicker')
    .on('changeDate', zoomFilter);

  const zoom = d3.behavior.zoom()
    .size([dimensions.width, dimensions.height])
    .scaleExtent([configuration.minScale, configuration.maxScale])
    .x(scales.x)
    .on('zoom', zoomed);

  if (configuration.eventZoom) {
    zoom.on('zoomend', configuration.eventZoom);
  }

  if (configuration.slider) {
    const zoomIn = container.append('button')
      .attr('type', 'button')
      .attr('class', 'btn btn-default pf-timeline-zoom')
      .attr('id', 'zoom-in')
      .style('top', `${configuration.padding.top}px`)
      .style('right', `${configuration.padding.right}px`)
      .on('click', zoomClick);
      zoomIn.append('i')
      .attr('class', 'fa fa-plus');

    const zoomOut = container.append('button')
      .attr('type', 'button')
      .attr('class', 'btn btn-default pf-timeline-zoom')
      .attr('id', 'zoom-out')
      .style('top', `${configuration.padding.top + dimensions.height - 26}px`)
      .style('right', `${configuration.padding.right}px`)
      .on('click', zoomClick);
      zoomOut.append('i')
      .attr('class', 'fa fa-minus');

    const zoomSlider = container.append('input')
      .attr('type', 'range')
      .attr('class', 'pf-timeline-zoom')
      .attr('id', 'pf-timeline-slider')
      .style('width', `${dimensions.height - (zoomIn.node().offsetHeight*2)}px`)
      .style('top', `${configuration.padding.top + ((dimensions.height - (zoomIn.node().offsetHeight)*2)/2) + zoomIn.node().offsetHeight - 7}px`)
      .style('right', `${configuration.padding.right - (dimensions.height - zoomIn.node().offsetHeight)/2 + zoomIn.node().offsetWidth}px`)
      .attr('value', sliderScale(zoom.scale()))
      .attr('min', configuration.minScale)
      .attr('max', configuration.maxScale)
      .attr('step', .1)
      .on('input', zoomClick);
  }

  // if(configuration.context) {
  //   const contextBrush = d3.select('.pf-timeline-brush');
  //   zoom.on('zoom', () => {
  //     requestAnimationFrame(() => callback(data));
  //     contextBrush.extent(scales.x.domain());
  //   })
  // }
  return grid.call(zoom)
    .on("dblclick.zoom", null);

  function zoomed() {
    requestAnimationFrame(() => callback(data));
    if(configuration.slider) {
      zoomSlider.property('value', sliderScale(zoom.scale()));
    }
    // if(configuration.context) {
    //   const contextBrush = d3.select('.pf-timeline-brush');
    //   zoom.on('zoom', () => {
    //     requestAnimationFrame(() => callback(data));
    //     contextBrush.extent(scales.x.domain());
    //   })
    // }
  }

  function zoomClick() {
    var factor = .5,
      target_zoom = 1,
      duration = 0,
      center = dimensions.width / 2,
      extent = zoom.scaleExtent(),
      translate0,
      l,
      view = {
        x: zoom.translate()[0],
        k: zoom.scale()
      };

    switch (this.id) {
      case 'zoom-in':
        target_zoom = zoom.scale() * (1 + factor);
        duration = 100;
        break;
      case 'zoom-out':
        target_zoom = zoom.scale() * (1 + factor * -1);
        duration = 100;
        break;
      case 'pf-timeline-slider':
        target_zoom = sliderScale.invert(this.value);
        break;
      default:
        target_zoom = zoom.scale();
    }

    if (target_zoom < extent[0]) {
      target_zoom = extent[0]
    } else if (target_zoom > extent[1]) {
      target_zoom = extent[1]
    }

    translate0 = (center - view.x) / view.k;
    view.k = target_zoom;
    l = translate0 * view.k + view.x;

    view.x += center - l;
    interpolateZoom([view.x, 0], view.k, duration);
  }



  function zoomFilter(time) {
    /*
                time = time || scales.x.domain()[0];
                console.log(time);
                console.log(datepicker.datepicker('getDate'));
    */
    time = datepicker.datepicker('getDate');

    var range = getRange(scales.x.domain()),
      relation = document.getElementById('position-dropdown').innerHTML,
      width = dimensions.width,
      extent = zoom.scaleExtent(),
      translate = zoom.translate()[0],
      target_zoom = zoom.scale();

    relation = relation.substr(0, relation.indexOf('<') - 1);
    switch (this.id) {
      case 'one_hour':
        range = ONE_HOUR;
        this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'one_day':
        range = ONE_DAY;
        this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'one_week':
        range = ONE_WEEK;
        this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'one_month':
        range = ONE_MONTH;
        this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'ending':
        relation = "ending";
        this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'starting':
        relation = "starting";
        this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'centered':
        relation = "centered";
        this.parentElement.parentElement.previousElementSibling.innerHTML = this.innerHTML + ' <span class="caret"></span>';
        break;

      case 'datepicker':
        //                 time = time.date;
        //                 relation = "same";
    }

    target_zoom = target_zoom * getScale(getRange(scales.x.domain()), range);

    if (target_zoom < extent[0]) {
      target_zoom = extent[0]
    } else if (target_zoom > extent[1]) {
      target_zoom = extent[1]
    }
    console.log(time);
    if (relation == "ending") {
      time = new Date(time - range);
      //             translate = width - (width * target_zoom);
    } else if (relation == "centered") {
      time = new Date(time - range / 2);
      //             translate = -1 * (width * target_zoom);
    }

    translate += (target_zoom * width * zoom.scale() / getRange(scales.x.domain())) * getRange([time, scales.x.domain()[0]]);

    interpolateZoom([translate, 0], target_zoom, 100);

  }

  function interpolateZoom(translate, scale, duration) {
    return d3.transition().duration(duration).tween("zoom", function() {
      var iTranslate = d3.interpolate(zoom.translate(), translate),
      iScale = d3.interpolate(zoom.scale(), scale);
      return function(t) {
        zoom
        .scale(iScale(t))
        .translate(iTranslate(t));
        zoom.event(grid);
      };
    });
  }

  function getRange(Extent) {
    return Extent[1].getTime() - Extent[0].getTime();
  }

  function getScale(oldRange, newRange) {
    return oldRange / newRange;
  }
};
