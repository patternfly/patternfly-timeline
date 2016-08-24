patternfly-timeline
==========

A time based/event series interactive visualization using d3.js. Use drag and zoom to navigate in time.

## Usage

Include the `src/timeline.js` script in your page after d3:

```html
<script src="path/to/d3.js"></script>
<script src="src/timeline.js"></script>
```



In the HTML source, create a new timeline chart, bind data to a DOM element, then call the chart on the element.

```js
var timelineChart = d3.chart.timeline();
d3.select('#chart_placeholder')
  .datum(data)
  .call(timelineChart);
```

The data must be an array of named time series. For instance:

```js
var data = [
  { name: "http requests", dates: [new Date('2014/09/15 13:24:54'), new Date('2014/09/15 13:25:03'), new Date('2014/09/15 13:25:05'), ...] },
  { name: "SQL queries", dates: [new Date('2014/09/15 13:24:57'), new Date('2014/09/15 13:25:04'), new Date('2014/09/15 13:25:04'), ...] },
  { name: "cache invalidations", dates: [new Date('2014/09/15 13:25:12'), ...] }
];
```

## Configuration

Patternfly-timeline follows the [d3.js reusable charts pattern](http://bost.ocks.org/mike/chart/) to let you customize the chart at will:

```js
var timelineChart = d3.chart.timeline()
  .width(1200)
  .hasTopAxis(false);
```

Configurable values:

  - `start`: start date of the scale. Defaults to `new Date(0)`.
  - `end`: end date of the scale. Defaults to `new Date()`
  - `width`: width of the chart in pixels. Default to 1000px.
  - `padding`: paddings of the graph in pixels. Defaults to `{ top: 60, left: 200, bottom: 40, right: 50 }`
  - `locale`: locale used for the X axis labels. See [d3.locale](https://github.com/mbostock/d3/wiki/Localization#locale) for the expected format. Defaults to null (i.e. d3 default locale).
  - `axisFormat`: function receiving the d3 axis object, to customize tick number and size.
  - `tickFormat`: tickFormat for the X axis. See [d3.timeFormat.multi()](https://github.com/mbostock/d3/wiki/Time-Formatting#format_multi) for expected format.
  - `eventHover`: function to be called when hovering an event in the chart. Receives the DOM element hovered (uses event delegation).
  - `eventZoom`: function to be called when done zooming on the chart. Receives the d3 scale at the end of the zoom.
  - `eventClick`: function to be called on click event of data-point (circle). Receives the DOM element hovered (uses event delegation).
  - `hasDelimiter`: whether to draw time boundaries on top of the chart. Defaults to true.
  - `hasTopAxis`: whether the chart has a top X axis. Accepts both a boolean or a function receiving the data of the graph that returns a boolean.
  - `hasBottomAxis`: same as topAxis but for the bottom X axis
  - `eventLineColor`: The color of the event line. Accepts a color (color name or `#ffffff` notation), or a function receiving the eventData and returning a color. Defaults to 'black'.
  - `eventColor`: The color of the event. Accepts a color (color name or `#ffffff` notation), or a function receiving the eventData and returning a color. Defaults to null. EventLineColor will be ignored if this is used.
  - `eventShape`: The shape of the event. Accepts unicode characters, including icon fonts.
  - `eventTooltip`: The contents of the event's tooltip.
  - `minScale`: The minimum scaling (zoom out), default to 0.
  - `maxScale`: The maximum scaling (zoom in), default to Infinity.
  - `zoomable`: *true* by default. Enable zoom-in/zoom-out and dragging handlers.
  - `marker`: *true* by default. Enable current time/date marker under mouse pointer.

## Styling

You can style all elements of the chart in CSS. Check the source to see the available selectors.

## Extending / Hacking

First, install the dependencies:

```sh
npm install
```

For development purpose, you can use the following command:

``` sh
npm start
```

It serves the demo at http://localhost:8080. It also watches source files and live
reloads your browser as soon as a change is detected.

When your changes are done, ensure that all tests pass with:

``` sh
npm test
```

Finally, if everything is fine, you can rebuild the library using:

``` sh
npm run build
```

## License

EventDrops is released under the MIT License, courtesy of [marmelab](http://marmelab.com) and [Canal Plus](https://github.com/canalplus).
