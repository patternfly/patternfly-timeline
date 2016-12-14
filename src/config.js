import d3 from 'd3';

const config = {
  start: new Date(0),
  end: new Date(),
  contextStart: null,
  contextEnd: null,
  minScale: 0,
  maxScale: Infinity,
  width: null,
  padding: {
    top: 30, //must be at least 24 for marker to display properly
    left: 40,
    bottom: 40,
    right: 40
  },
  lineHeight: 40,
  labelWidth: 140,
  sliderWidth: 30,
  contextHeight: 50,
  locale: null,
  axisFormat: null,
  tickFormat: [
    ['.%L', (d) => d.getMilliseconds()],
    [':%S', (d) => d.getSeconds()],
    ['%I:%M', (d) => d.getMinutes()],
    ['%I %p', (d) => d.getHours()],
    ['%b %d', (d) => d.getMonth() && d.getDate()],
    ['%b', (d) => d.getMonth()],
    ['%Y', () => true]
  ],
  eventHover: null,
  eventZoom: null,
  eventClick: null,
  eventLineColor: (d, i) => {
    switch (i % 5) {
      case 0:
        return "#00659c";
      case 1:
        return "#0088ce";
      case 2:
        return "#3f9c35";
      case 3:
        return "#ec7a08";
      case 4:
        return "#cc0000";
    }
  },
  eventColor: null,
  eventShape: (d) => {
    if(d.hasOwnProperty("events")) {
      return '\uf140';
    } else {
      return '\uf111';
    }
  },
  eventPopover: (d) => {
    var popover = '';
    if(d.hasOwnProperty("events")) {
      popover = `Group of ${d.events.length} events`
    } else {
      for (var i in d.details) {
        popover = popover + i.charAt(0).toUpperCase() + i.slice(1) + ': ' + d.details[i] + '<br>';
      }
      popover = popover + 'Date: ' + d.date;
    }
    return popover;
  },
  marker: true,
  context: true,
  slider: true,
  eventGrouping: 60000, //one minute
};

config.dateFormat = config.locale ? config.locale.timeFormat('%a %x %I:%M %p') : d3.time.format('%a %x %I:%M %p');

module.exports = config;
