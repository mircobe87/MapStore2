/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = require('react');

var {Provider} = require('react-redux');

var {loadMapConfig} = require('../../actions/config');
var {changeBrowserProperties} = require('../../actions/browser');
var {loadLocale} = require('../../actions/locale');

var ConfigUtils = require('../../utils/ConfigUtils');
var LocaleUtils = require('../../utils/LocaleUtils');

var Debug = require('../../components/development/Debug');

function startApp(plugins) {
    let store = require('./stores/viewerstore')(plugins.reducers);
    let Viewer = require('./containers/Viewer')(plugins.actions);

    /**
    * Detect Browser's properties and save in app state.
    **/
    store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));

    ConfigUtils.loadConfiguration().then(() => {
        const { configUrl, legacy } = ConfigUtils.getUserConfiguration('config', 'json');
        store.dispatch(loadMapConfig(configUrl, legacy));

        let locale = LocaleUtils.getUserLocale();
        store.dispatch(loadLocale('../../translations', locale));
    });


    React.render(
        <Debug store={store}>
            <Provider store={store}>
                {() =>
                    (<Viewer plugins={plugins.components} mapParams={{
                        overview: true,
                        scaleBar: true,
                        zoomControl: true
                    }}/>)

                }
            </Provider>
        </Debug>,
        document.getElementById('container')
    );

}
if (!global.Intl ) {
    require.ensure(['intl', 'intl/locale-data/jsonp/en.js', 'intl/locale-data/jsonp/it.js', './plugins'], (require) => {
        global.Intl = require('intl');
        require('intl/locale-data/jsonp/en.js');
        require('intl/locale-data/jsonp/it.js');
        let plugins = require('./plugins');
        startApp(plugins);
    });
}else {
    require.ensure(["./plugins"], (require) => {
        var plugins = require('./plugins');
        startApp(plugins);
    });
}
