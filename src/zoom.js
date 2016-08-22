import d3 from 'd3';

export default (container, dimensions, scales, configuration, data, callback) => {
  const ONE_MINUTE = 60 * 1000;
  const ONE_HOUR = ONE_MINUTE * 60;
  const ONE_DAY = ONE_HOUR * 24;
  const ONE_WEEK = ONE_DAY * 7;
  const ONE_MONTH = ONE_DAY * 30;

  const grid = d3.select('.grid');

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
      .attr('value', 1)
      .attr('min', 1)
      .attr('max', 720)
      .attr('step', .5)
      .on('input', slided);
  }

  const dropdown = d3.selectAll('.zoom-filter > li > a')
    .on('click', zoomFilter);

  // const datepicker = $('#datepicker')
  //         .on('changeDate', zoomFilter);

  const zoom = d3.behavior.zoom()
    .size([dimensions.width, dimensions.height])
    .scaleExtent([configuration.minScale, configuration.maxScale])
    .x(scales.x)
    .on('zoom', () => {
      requestAnimationFrame(() => callback(data));
      // zoomSlider.property('value', zoom.scale());
    });

  if (configuration.eventZoom) {
    zoom.on('zoomend', configuration.eventZoom);
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
  return grid.call(zoom)
    .on("dblclick.zoom", null);
    // .on('mousemove', () => {
    //   var m = d3.mouse(grid[0][0]);
    //   var pt = [m[0] - 205, m[1]];
    //   zoom.center(pt);
    // });


  function slided(d) {
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
    interpolateZoom([view.x, 0], view.k, 0);
  }



  function zoomClick(factor = .5) {
    var clicked = d3.event.target,
      direction = 1,
      target_zoom = 1,
      center = [dimensions.width / 2, dimensions.height / 2],
      extent = zoom.scaleExtent(),
      translate = zoom.translate(),
      translate0 = [],
      l = [],
      view = {
        x: translate[0],
        y: translate[1],
        k: zoom.scale()
      };

    d3.event.preventDefault();
    direction = (this.id === 'zoom-in') ? 1 : -1;
    target_zoom = zoom.scale() * (1 + factor * direction);

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
    interpolateZoom([view.x, view.y], view.k, 100);
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
    } else if (relation == "starting") {
      //             translate = (width / 2) - (width * target_zoom);
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
