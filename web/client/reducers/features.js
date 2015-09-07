/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var {LOAD_FEATURE_INFO, EXCEPTIONS_FEATURE_INFO, ERROR_FEATURE_INFO} = require('../actions/map');

function features(state = null, action) {
    switch (action.type) {
        case LOAD_FEATURE_INFO:
            /* action.data (if a JSON has been requested) is an object like this:
             * {
             *     crs: [object],
             *     features: [array],
             *     type: [string]
             * }
             * else is a [string] (for eg. if HTML data has been requested)
             */
            return action.data;
        case EXCEPTIONS_FEATURE_INFO:
            /* action.data.exceptions, an array of exceptions like this:
             * [{
             *     code: [string],
             *     locator: [string],
             *     text: [string]
             * }, ...]
             */
            return {
                exceptions: action.exceptions
            };
        case ERROR_FEATURE_INFO:
            /* action.error, an Object like this:
             * {
             *     config: [Object],
             *     data: [string],
             *     headers: [Object],
             *     status: [number],
             *     statusText: [string]
             * }
             */
            return {
                error: action.error
            };
        default:
            return state;
    }
}

module.exports = features;
