/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = require('react');
var BootstrapReact = require('react-bootstrap');
var Badge = BootstrapReact.Badge;

/**
 * A badge to show that there is a help text available for the parent component.
 * Also updates the current help text (state) when the badge is clicked.
 *
 * Component's properies:
 *  - helpText: {string}      the text to be displayed when this badge is clicked
 *  - isVisible: {bool}       flag to steer visibility of the badge
 *  - changeHelpText (func)   action to change the current help text
 */
var HelpBadge = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        helpText: React.PropTypes.string,
        isVisible: React.PropTypes.bool,
        changeHelpText: React.PropTypes.func,
        changeHelpwinVisibility: React.PropTypes.func,
        className: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            helpText: '',
            isVisible: false
        };
    },
    onMouseOver() {
        this.props.changeHelpText({helpText: this.props.helpText});
        this.props.changeHelpwinVisibility({helpwinViz: true});
    },
    render() {
        return (
            <Badge
                id={this.props.id}
                onMouseOver={this.onMouseOver}
                className={(this.props.isVisible ? '' : 'hidden ') + (this.props.className ? this.props.className : '')}
            >?</Badge>
        );
    }
});

module.exports = HelpBadge;
