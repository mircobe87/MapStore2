/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
// var React = require('react/addons');
var L = require('leaflet');
// let Locate = require('../Locate');
let expect = require('expect');


describe('leaflet Locate component', () => {
    document.body.innerHTML = '<div id="map"></div>';
    let map = L.map("map", {
            center: [51.505, -0.09],
            zoom: 13
        });

    afterEach((done) => {
        document.body.innerHTML = '<div id="map"></div>';
        map = L.map('map');
        setTimeout(done);
    });

    it('create Locate with defaults', () => {
        // const ov = React.render(<Locate map={map}/>, document.body);
        expect(map).toExist();
    });
});
