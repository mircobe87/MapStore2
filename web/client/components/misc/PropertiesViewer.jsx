/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

var PropertiesViewer = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        data: React.PropTypes.object,
        titleStyle: React.PropTypes.object,
        listStyle: React.PropTypes.object,
        componentStyle: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            data: {},
            titleStyle: {
                height: "100%",
                width: "100%",
                padding: "4px 0px",
                background: "rgb(240,240,240)",
                borderRadius: "4px",
                textAlign: "center"
            },
            listStyle: {
                margin: "0px 0px 4px 0px"
            },
            componentStyle: {
                padding: "0"
            }
        };
    },
    getBodyItems() {
        return Object.keys(this.props.data).map((key) => {
            return (
                <p style={this.props.listStyle}><b>{key}</b> {this.props.data[key]}</p>
            );
        });
    },
    renderHeader() {
        if (!this.props.title) {
            return null;
        }
        return (
            <div key={this.props.title} style={this.props.titleStyle}>
                {this.props.title}
            </div>
        );
    },
    renderBody() {
        var items = this.getBodyItems();
        return (
            <div style={{
                padding: "4px",
                margin: 0
            }}>
                {items}
            </div>
        );
    },
    render() {
        return (
            <div>
                {this.renderHeader()}
                {this.renderBody()}
            </div>
        );
    }
});

module.exports = PropertiesViewer;
