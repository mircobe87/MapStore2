/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

require('./assets/styles.css');
const React = require('react');
const BSicon = require('react-bootstrap').Glyphicon;

const Glyphicon = React.createClass({
    propTypes: {
        icon: React.PropTypes.string,
        type: React.PropTypes.oneOf(['native', 'bootstrap'])
    },
    getDefaultProps() {
        return {
            type: 'native'
        };
    },
    renderIcon() {
        let retval;
        switch (this.props.type) {
            case "native":
                retval = <span className={this.props.icon}></span>;
                break;
            case "bootstrap":
                retval = <BSicon glyph={this.props.icon}/>;
                break;
            default:
                retval = null;
        }
        return retval;
    },
    render() {
        return !this.props.icon ? null : this.renderIcon();
    }
});

module.exports = Glyphicon;
