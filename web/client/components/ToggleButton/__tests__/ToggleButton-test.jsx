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
        expect(tb.state).toExist();
        expect(tb.state.on).toBe(false);

        const tbNode = React.findDOMNode(tb);
        expect(tbNode).toExist();
        expect(tbNode.id).toNotExist();

        const button = tbNode.getElementsByTagName('button')[0];
        expect(button).toExist();
        expect(button.className.indexOf('default') >= 0).toBe(true);

        expect(button.innerHTML).toNotExist();
    });

    it('test initial bsStyle overriding', () => {
        const tb = React.render(<ToggleButton btnConfig={{bsStyle: 'error'}}/>, document.body);
        expect(tb).toExist();

        expect(tb.props.btnConfig.bsStyle).toNotExist();
    });

    it('test glyphicon property', () => {
        const tb = React.render(<ToggleButton glyphicon="info-sign"/>, document.body);
        expect(tb).toExist();

        const tbNode = React.findDOMNode(tb);
        expect(tbNode).toExist();

        const button = tbNode.getElementsByTagName('button')[0];
        expect(button).toExist();

        const icons = button.getElementsByTagName('span');
        expect(icons.length).toBe(1);
    });

    it('test toggle behaviour', () => {
        const tb = React.render(<ToggleButton/>, document.body);
        expect(tb).toExist();

        const tbNode = React.findDOMNode(tb);
        const button = tbNode.getElementsByTagName('button')[0];

        tbNode.click();
        expect(button.className.indexOf('default') >= 0).toBe(false);
        expect(button.className.indexOf('primary') >= 0).toBe(true);
        expect(tb.state.on).toBe(true);

        tbNode.click();
        expect(button.className.indexOf('default') >= 0).toBe(true);
        expect(button.className.indexOf('primary') >= 0).toBe(false);
        expect(tb.state.on).toBe(false);
    });
});
