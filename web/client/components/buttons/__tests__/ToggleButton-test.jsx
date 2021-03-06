/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var expect = require('expect');

var React = require('react/addons');
var ToggleButton = require('../ToggleButton');

describe("test the ToggleButton", () => {
    afterEach((done) => {
        React.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('test default properties', () => {
        const tb = React.render(<ToggleButton/>, document.body);
        expect(tb).toExist();

        const tbNode = React.findDOMNode(tb);
        expect(tbNode).toExist();
        expect(tbNode.id).toNotExist();

        expect(tbNode).toExist();
        expect(tbNode.className.indexOf('default') >= 0).toBe(true);
        expect(tbNode.innerHTML).toNotExist();
    });

    it('test glyphicon property', () => {
        const tb = React.render(<ToggleButton glyphicon="info-sign"/>, document.body);
        expect(tb).toExist();

        const tbNode = React.findDOMNode(tb);
        expect(tbNode).toExist();
        expect(tbNode).toExist();
        const icons = tbNode.getElementsByTagName('span');
        expect(icons.length).toBe(1);
    });

    it('test glyphicon property with text', () => {
        const tb = React.render(<ToggleButton glyphicon="info-sign" text="button"/>, document.body);
        expect(tb).toExist();

        const tbNode = React.findDOMNode(tb);
        expect(tbNode).toExist();
        expect(tbNode).toExist();

        const btnItems = tbNode.getElementsByTagName('span');
        expect(btnItems.length).toBe(3);

        expect(btnItems[0].innerHTML).toBe("");
        expect(btnItems[1].innerHTML).toBe("&nbsp;");
        expect(btnItems[2].innerHTML).toBe("button");
    });

    it('test button state', () => {
        const tb = React.render(<ToggleButton pressed/>, document.body);
        expect(tb).toExist();

        const tbNode = React.findDOMNode(tb);

        expect(tbNode.className.indexOf('primary') >= 0).toBe(true);
    });

    it('test click handler', () => {

        let genericTest = function(btnType) {
            const testHandlers = {
                onClick: (pressed) => {return pressed; }
            };
            const spy = expect.spyOn(testHandlers, 'onClick');
            const tb = React.render(<ToggleButton pressed onClick={testHandlers.onClick} btnType={btnType}/>, document.body);

            const tbNode = React.findDOMNode(tb);
            tbNode.click();

            expect(spy.calls.length).toEqual(1);
            expect(spy.calls[0].arguments).toEqual([false]);
        };

        genericTest('normal');
        genericTest('image');
    });

    it('test image button', () => {
        const tb = React.render(<ToggleButton btnType={'image'}/>, document.body);
        expect(tb).toExist();
        const tbNode = React.findDOMNode(tb);
        expect(tbNode.localName).toBe("img");
    });
});
