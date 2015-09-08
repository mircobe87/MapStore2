/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var BootstrapReact = require('react-bootstrap');
var Glyphicon = BootstrapReact.Glyphicon;
var Button = BootstrapReact.Button;

var ToggleButton = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        btnConfig: React.PropTypes.object,
        text: React.PropTypes.string,
        glyphicon: React.PropTypes.string
    },
    getInitialState() {
        return {
            on: false
        };
    },
    componentWillMount() {
        if (this.props.btnConfig) {
            delete this.props.btnConfig.bsStyle;
        }
    },
    render() {
        return (
            <div id={this.props.id} onClick={this.toggle}>
                <Button {...this.props.btnConfig} bsStyle={this.state.on ? 'primary' : 'default'}>
                    {this.props.glyphicon ? <Glyphicon glyph={this.props.glyphicon}/> : null}
                    {this.props.glyphicon && this.props.text ? "\u00A0" : null}
                    {this.props.text}
                </Button>
            </div>
        );
    },
    toggle() {
        this.setState({
            on: !this.state.on
        });
    }
});

module.exports = ToggleButton;
