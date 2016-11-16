require('../../src/timeline');

describe('d3.chart.timeline', () => {
    it('should append a SVG element to given selection', () => {
        const div = document.createElement('div');
        const data = [{ name: 'foo', data: [{date: new Date()}] }];

        const chart = d3.chart.timeline();
        d3.select(div).datum(data).call(chart);

        expect(div.querySelectorAll('svg.timeline-pf-chart').length).toBe(1);
    });

    it('should remove all previously created charts in current selection to prevent duplicates', () => {
        const div = document.createElement('div');
        const data = [{ name: 'foo', data: [{date: new Date()}] }];

        const chart = d3.chart.timeline();
        d3.select(div).datum(data).call(chart);
        d3.select(div).datum(data).call(chart);

        expect(div.querySelectorAll('svg.timeline-pf-chart').length).toBe(1);
    });

    it('should have as many lines as events', () => {
        const div = document.createElement('div');
        const data = [
            { name: 'foo', data: [{date: new Date()}] },
            { name: 'bar', data: [{date: new Date()}] },
            { name: 'quz', data: [{date: new Date()}] },
        ];

        const chart = d3.chart.timeline().start(new Date('2010-01-25'));
        d3.select(div).datum(data).call(chart);

        expect(div.querySelectorAll('.timeline-pf-drop-line').length).toBe(3);
    });

    it('should have as many drops as given dates', () => {
        const div = document.createElement('div');
        const data = [
            { name: 'foo', data: [ {date: new Date('2010-01-01')} ] },
            { name: 'bar', data: [] },
            { name: 'quz', data: [ { date: new Date('2011-01-04')},{date: new Date('2012-08-09')}] },
        ];

        const chart = d3.chart.timeline().start(new Date('2010-01-25'));
        d3.select(div).datum(data).call(chart);

        expect(div.querySelectorAll('.timeline-pf-drop').length).toBe(3);
    });
});
