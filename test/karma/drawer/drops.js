describe('Drops drawer', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    it('should add click handler if specified in configuration', () => {
        const data = [{ name: 'foo', data: [{date: new Date('2014-04-03')}] }];

        const clickSpy = jasmine.createSpy();
        const chart = d3.chart.timeline().eventClick(clickSpy);
        d3.select(wrapper).datum(data).call(chart);

        const drop = d3.select('.timeline-pf-drop');

        const event = document.createEvent('UIEvents');
        event.initUIEvent('click', true, true, null, null);
        drop.node().dispatchEvent(event);

        expect(clickSpy.calls.any()).toBe(true);
    });

    it('should add hover handler if specified in configuration', () => {
        const data = [{ name: 'foo', data: [{date: new Date('2014-04-03')}] }];

        const hoverSpy = jasmine.createSpy();
        const chart = d3.chart.timeline().eventHover(hoverSpy);
        d3.select(wrapper).datum(data).call(chart);

        const drop = d3.select('.timeline-pf-drop');

        const event = document.createEvent('UIEvents');
        event.initUIEvent('mouseover', true, true, null, null);
        drop.node().dispatchEvent(event);

        expect(hoverSpy.calls.any()).toBe(true);
    });

    afterEach(() => {
        document.body.removeChild(wrapper);
    });
});
