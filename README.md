patternfly-timeline
==========

A time based/event series interactive visualization using d3.js. Use drag and zoom to navigate in time. [View the demo here.](https://rawgit.com/patternfly/patternfly-timeline/master-dist/demo/)

## Usage

Include the `src/timeline.js` script in your page after d3:

```html
<script src="path/to/d3.js"></script>
<script src="src/timeline.js"></script>
```



In the HTML source, create a new timeline chart, bind data to a DOM element, then call the chart on the element. **Important:** In order for the zoom slider to work correctly, the placeholder element must have `position: relative` or `position: absolute` styling.

```js
var timelineChart = d3.chart.timeline();
d3.select('#chart_placeholder')
  .datum(data)
  .call(timelineChart);
```

The data must be an array of named time series with an optional details payload. For instance:

```js
var json = [
  {
    "name":"Power Activity",
    "data":[
      {"date": "2016-04-08T15:07:37.374Z", "details": {"event": "vmPowerOn", "object": "vmName"}},
      {"date": "2016-04-08T15:07:37.374Z", "details": {"event": "vmPowerOn", "object": "vmName"}},
      {"date": "2016-04-15T21:04:16.247Z", "details": {"event": "vmPowerOn", "object": "vmName"}}
    ]
  },
  {
    "name":"Alarm/Error",
    "data":[
      {"date": "2016-04-21T01:06:19.126Z", "details": {"event": "vmPowerOn", "object": "vmName"}},
      {"date": "2016-04-16T13:07:15.205Z", "details": {"event": "vmPowerOff", "object": "hostName"}},
      {"date": "2016-04-07T22:35:41.145Z", "details": {"event": "vmPowerOff", "object": "hostName"}}
    ]
  }
];
```

## Configuration

Patternfly-timeline follows the [d3.js reusable charts pattern](http://bost.ocks.org/mike/chart/) to let you customize the chart at will:

```js
var timelineChart = d3.chart.timeline()
  .width(1200)
  .context(false)
```

Configurable values:

  - `start`: start date of the scale. Defaults to `new Date(0)`.
  - `end`: end date of the scale. Defaults to `new Date()`
  - `minScale`: The minimum scaling (zoom out), default to `0`.
  - `maxScale`: The maximum scaling (zoom in), default to `Infinity`.
  - `width`: width of the chart in pixels. Responsive by default.
  - `padding`: paddings of the graph in pixels. Defaults to `{ top: 30, left: 40, bottom: 40, right: 40 }`
  - `lineHeight`: The height of each row in the chart, default to `40`.
  - `contextHeight`: The height of the context viewport below the char, default to `50`.
  - `locale`: locale used for the X axis labels. See [d3.locale](https://github.com/mbostock/d3/wiki/Localization#locale) for the expected format. Defaults to `null` (i.e. d3 default locale).
  - `axisFormat`: function receiving the d3 axis object, to customize tick number and size.
  - `tickFormat`: tickFormat for the X axis. See [d3.timeFormat.multi()](https://github.com/mbostock/d3/wiki/Time-Formatting#format_multi) for expected format.
  - `eventHover`: function to be called when hovering an event in the chart. Receives the DOM element hovered (uses event delegation).
  - `eventZoom`: function to be called when done zooming on the chart. Receives the d3 scale at the end of the zoom.
  - `eventClick`: function to be called on click event of data-point (circle). Receives the DOM element hovered (uses event delegation).
  - `eventLineColor`: The color of the event line. Accepts a color (color name or `#ffffff` notation), or a function receiving the eventData and returning a color.
  - `eventColor`: The color of the event. Accepts a color (color name or `#ffffff` notation), or a function receiving the eventData and returning a color. Defaults to null. EventLineColor will be ignored if this is used.
  - `eventShape`: The shape of the event. Accepts unicode characters, including icon fonts.
  - `eventPopover`: The contents of the event's popover.
  - `marker`: `true` by default. Enable current time/date marker under mouse pointer.
  - `context`: `true` by default. Enable context viewport beneath chart.
  - `slider`: `true` by default. Enable zoom slider and buttons to right of chart.

## Styling

You can style all elements of the chart in CSS. Check the source to see the available selectors.

## Extending / Development

First, install the dependencies:

```sh
npm install
```

For development purpose, you can use the following command:

``` sh
npm start
```

It serves the demo at http://localhost:8080.

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
