/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var Group = require('./Group');
var LayersTool = require('./LayersTool');
var Node = require('../../../components/Layers/Node');

var VisibilityCheck = require('../../../components/Layers/fragments/VisibilityCheck');
var Title = require('../../../components/Layers/fragments/Title');
var WMSLegend = require('../../../components/Layers/fragments/WMSLegend');

var LayerOrGroup = React.createClass({
    propTypes: {
        node: React.PropTypes.object,
        propertiesChangeHandler: React.PropTypes.func,
        groupPropertiesChangeHandler: React.PropTypes.func,
        onToggleGroup: React.PropTypes.func,
        onSortGroup: React.PropTypes.func,
        onRemoveGroup: React.PropTypes.func,
        onLegend: React.PropTypes.func,
        onSettings: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            onSortGroup: () => {},
            onRemoveGroup: () => {},
            onToggleGroup: () => {},
            onLegend: () => {},
            onSettings: () => {},
            propertiesChangeHandler: () => {},
            groupPropertiesChangeHandler: () => {}
        };
    },
    render() {
        if (this.props.node) {
            let {children, onSettings, ...props} = this.props;
            let LayerChildren = [
                <VisibilityCheck propertiesChangeHandler={this.props.propertiesChangeHandler}
                    checkType={(node) => node.group === 'background' ? 'radio' : 'checkbox'}/>,
                <Title/>].concat(this.props.node.group !== 'background' ?
                    [<LayersTool style={{"float": "right", marginTop: "5px", marginRight: "10px", cursor: "pointer"}} glyph="adjust"
                        onClick={(node) => this.props.onSettings(node, "layers", {opacity: parseFloat(node.opacity) || 1.0})}/>,
                    <LayersTool ref="target" style={{"float": "right", marginTop: "5px", marginRight: "10px", cursor: "pointer"}} glyph="list"
                    onClick={(node) => this.props.onLegend(node)}/>,
                <WMSLegend position="collapsible"/>] : [])
            ;
            if (this.props.node.type === 'group') {
                return (
                    <Group {...props} onToggle={this.props.onToggleGroup} onSort={this.props.onSortGroup}
                        onRemove={this.props.onRemoveGroup}
                        onSettings={this.props.onSettings}
                        propertiesChangeHandler={this.props.groupPropertiesChangeHandler}>
                        <Node type="layer" style={{marginLeft: "9px"}}>
                            {LayerChildren}
                        </Node>
                    </Group>
                );
            }
            return (<Node type="layer" style={{marginLeft: "9px"}} {...props}>
                {LayerChildren}
            </Node>);
        }
        return null;
    }
});

module.exports = LayerOrGroup;
