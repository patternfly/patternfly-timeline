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

const ONE_HOUR = 60 * 60 * 1000,
      ONE_DAY = 24 * ONE_HOUR,
      ONE_WEEK = 7 * ONE_DAY,
      ONE_MONTH = 30 * ONE_DAY,
      SIX_MONTHS = 6 * ONE_MONTH;

var data = [],
  start = new Date('2016-04-14T04:25:27.663Z'),
  today = new Date('2016-05-03T04:00:00Z');

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
  .start(today - ONE_WEEK)
  .minScale(ONE_WEEK / ONE_MONTH)
  .maxScale(ONE_WEEK / ONE_HOUR)
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
  todayBtn: "linked",
  todayHighlight: true
});

$('#datepicker').datepicker('setDate', today);

$('#datepicker').on('changeDate', zoomFilter);

$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {

  var $target = $( event.currentTarget );
    $target.closest( '.dropdown' )
      .find( '[data-bind="label"]' ).text( $target.text() )
        .end()
      .children( '.dropdown-toggle' ).dropdown( 'toggle' );

    zoomFilter();

    return false;

  });

function zoomFilter() {
  var range = $('#range-dropdown').find('[data-bind="label"]' ).text(),
      position = $('#position-dropdown').find('[data-bind="label"]' ).text(),
      date = $('#datepicker').datepicker('getDate'),
      startDate,
      endDate;

  switch (range) {
    case '1 hour':
      range = ONE_HOUR;
      break;

    case '1 day':
      range = ONE_DAY;
      break;

    case '1 week':
      range = ONE_WEEK;
      break;

    case '1 month':
      range = ONE_MONTH;
      break;
  }
  switch (position) {
    case 'centered on':
      startDate = new Date(date.getTime() - range/2);
      endDate = new Date(date.getTime() + range/2);
      break;

    case 'starting':
      startDate = date;
      endDate = new Date(date.getTime() + range);
      break;

    case 'ending':
      startDate =  new Date(date.getTime() - range);
      endDate = date;
      break;
  }
  timeline.Zoom.zoomFilter(startDate, endDate);
}
