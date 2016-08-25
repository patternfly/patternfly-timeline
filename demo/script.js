$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip({
    'container': 'body',
    'placement': 'top',
    'delay': {
      "show": 500,
      "hide": 100
    }
  });
});

var data = [],
  start = new Date('2016-04-14T04:25:27.663Z'),
  today = new Date('2016-05-03T04:00:00Z'),
  one_hour = 60 * 60 * 1000,
  one_day = 24 * 60 * 60 * 1000,
  one_week = one_day * 7,
  one_month = one_day * 30,
  six_months = one_month * 6;

for (var x in json) { //json lives in external file for testing
  data[x] = {};
  data[x].name = json[x].name;
  data[x].data = [];
  for (var y in json[x].data) {
    data[x].data.push({});
    data[x].data[y].date = new Date(json[x].data[y].date);
    data[x].data[y].details = json[x].data[y].details;
  }
  $('#timeline-selectpicker').append("<option>" + data[x].name + "</option>");
  data[x].display = true;
}
$('#timeline-selectpicker').selectpicker('selectAll');

var timeline = d3.chart.timeline()
  .end(today)
  .start(today - one_week)
  .minScale(one_week / one_month)
  .maxScale(one_week / one_hour)
  .eventColor(function(data, index) {
    if (data.details.event === "vmPowerOff") {
      return "#cc0000";
    }
  })
  .eventShape(function(data, index) {
    if (data.details.object === "vmName") {
      return '\uf111';
    }
    return '\uf05c';
  })
  .eventClick(function(el) {
      $('#legend').html('Clicked on ' + el.details.object);
  });

var element = d3.select('#pf-timeline').append('div').datum(data.filter(function(eventGroup) {
  return eventGroup.display === true;
}));
timeline(element);

$('#timeline-selectpicker').on('changed.bs.select', function(event, clickedIndex, newValue, oldValue) {
  data[clickedIndex].display = !data[clickedIndex].display;
  element.datum(data.filter(function(eventGroup) {
    return eventGroup.display === true;
  }));
  timeline(element);
  $('[data-toggle="tooltip"]').tooltip({
    'container': 'body',
    'placement': 'top',
    'delay': {
      "show": 500,
      "hide": 100
    }
  });
});

$(window).on('resize', function() {
  timeline(element);
  $('[data-toggle="tooltip"]').tooltip({
    'container': 'body',
    'placement': 'top',
    'delay': {
      "show": 500,
      "hide": 100
    }
  });
});

$('#datepicker').datepicker({
  autoclose: true,
  orientation: "top auto",
  todayBtn: "linked",
  todayHighlight: true
});

d3.selectAll('.zoom-filter > li > a').on('click', function() {
  var time = $('#datepicker').datepicker('getDate');
  timeline.Zoom.zoomFilter(time, this.id.toLowerCase());
});

$('#datepicker').on('changeDate', function() {
  var time = $('#datepicker').datepicker('getDate');
  timeline.Zoom.zoomFilter(time);
});

startdate = new Date(today.getTime() - one_month);
$('#datepicker').datepicker('setDate', today);
