import d3 from 'd3';

const config = {
  lineHeight: 40,
  start: new Date(0),
  end: new Date(),
  minScale: 0,
  maxScale: Infinity,
  width: null,
  padding: {
    top: 30, //must be at least 24 for marker to display properly
    left: 40,
    bottom: 40,
    right: 40
  },
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
    ['%a %d', (d) => d.getDay() && d.getDate() !== 1],
    ['%b %d', (d) => d.getDate() !== 1],
    ['%B', (d) => d.getMonth()],
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
  eventShape: '\uf111',
  eventTooltip: (d) => {
    var tooltip = '';
    for (var i in d.details) {
      tooltip = tooltip + i.charAt(0).toUpperCase() + i.slice(1) + ': ' + d.details[i] + '\n';
    }
    tooltip = tooltip + 'Date: ' + d.date;
    return tooltip;
  },
  marker: true,
  context: true,
  slider: false
};

config.dateFormat = config.locale ? config.locale.timeFormat('%x %I:%M %p') : d3.time.format('%x %I:%M %p');

module.exports = config;
