/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var expect = require('expect');
var features = require('../features');

describe('Test the features reducer', () => {
    it('returns original state on unrecognized action', () => {
        var state = features(1, {type: 'UNKNOWN'});
        expect(state).toBe(1);
    });

    it('creates a general error ', () => {
        var state = features({}, {type: 'ERROR_FEATURE_INFO', error: {}});
        expect(state.error).toExist();
    });

    it('creates an wms feature info exception', () => {
        var state = features({}, {type: 'EXCEPTIONS_FEATURE_INFO', exceptions: [1]});
        expect(state.exceptions).toExist();
    });

    it('creates a feature info data from succesfull request', () => {
        var state = features({}, {type: 'LOAD_FEATURE_INFO', data: {
            crs: "1",
            features: [1],
            type: "1"
        }});
        expect(state.crs).toExist();
        expect(state.features).toExist();
        expect(state.type).toExist();
    });
});
