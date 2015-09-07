/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var expect = require('expect');
var {CHANGE_MAP_VIEW, ERROR_FEATURE_INFO, EXCEPTIONS_FEATURE_INFO, LOAD_FEATURE_INFO, getFeatureInfo, changeMapView} = require('../map');

describe('Test correctness of the map actions', () => {

    it('changeMapVeiw', () => {
        const testCenter = 0;
        const testZoom = 9;
        var retval = changeMapView(testCenter, testZoom);

        expect(retval).toExist();
        expect(retval.type).toBe(CHANGE_MAP_VIEW);
        expect(retval.center).toBe(testCenter);
        expect(retval.zoom).toBe(testZoom);
    });

    it('get feature info data', (done) => {
        getFeatureInfo('base/web/client/test-resources/featureInfo-response.json', {})((e) => {
            try {
                expect(e).toExist();
                expect(e.type).toBe(LOAD_FEATURE_INFO);
                done();
            } catch(ex) {
                done(ex);
            }
        });
    });

    it('get feature info exception', (done) => {
        getFeatureInfo('base/web/client/test-resources/featureInfo-exception.json', {})((e) => {
            try {
                expect(e).toExist();
                expect(e.type).toBe(EXCEPTIONS_FEATURE_INFO);
                done();
            } catch(ex) {
                done(ex);
            }
        });
    });

    it('get feature info error', (done) => {
        getFeatureInfo('requestError.json', {})((e) => {
            try {
                expect(e).toExist();
                expect(e.type).toBe(ERROR_FEATURE_INFO);
                done();
            } catch(ex) {
                done(ex);
            }
        });
    });
});
