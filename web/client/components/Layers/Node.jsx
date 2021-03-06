/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var assign = require('object-assign');
var SortableMixin = require('react-sortable-items/SortableItemMixin');

var Node = React.createClass({
    propTypes: {
        node: React.PropTypes.object,
        style: React.PropTypes.object,
        styler: React.PropTypes.func,
        type: React.PropTypes.string,
        onSort: React.PropTypes.func,
        isDraggable: React.PropTypes.bool
    },
    mixins: [SortableMixin],
    getDefaultProps() {
        return {
            node: null,
            style: {},
            styler: () => {},
            type: 'node',
            onSort: null
        };
    },
    renderChildren(filter = () => true) {
        return React.Children.map(this.props.children, (child) => {
            if (filter(child)) {
                let props = (child.type.inheritedPropTypes || ['node']).reduce((previous, propName) => {
                    return this.props[propName] ? assign(previous, {[propName]: this.props[propName]}) : previous;
                }, {});
                return React.cloneElement(child, props);
            }
        });
    },
    render() {
        let expanded = (this.props.node.expanded !== undefined) ? this.props.node.expanded : true;
        let prefix = this.props.type;
        const nodeStyle = assign({}, this.props.style, this.props.styler(this.props.node));
        let content = (<div key={this.props.node.name} className={expanded ? prefix + "-expanded" : prefix + "-collapsed"} style={nodeStyle} >
            {this.renderChildren((child) => child.props.position !== 'collapsible')}
            {expanded ? this.renderChildren((child) => child.props.position === 'collapsible') : []}
        </div>);
        return this.props.isDraggable ? this.renderWithSortable(content) : content;
    }
});

module.exports = Node;
