/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var {Modal, Alert} = require('react-bootstrap');
var Book = require('../../../components/misc/Book');

var I18N = require('../../../components/I18N/I18N');

var ApplyTemplate = require('../../../components/misc/ApplyTemplate');
var PropertiesViewer = require('../../../components/misc/PropertiesViewer');

var CoordinatesUtils = require('../../../utils/CoordinatesUtils');
var assign = require('object-assign');


var Spinner = require('../../../components/spinners/BasicSpinner/BasicSpinner');

var GetFeatureInfoV2 = React.createClass({
    propTypes: {
        htmlResponses: React.PropTypes.array,
        htmlRequests: React.PropTypes.object,
        btnConfig: React.PropTypes.object,
        enabled: React.PropTypes.bool,
        mapConfig: React.PropTypes.object,
        layerFilter: React.PropTypes.func,
        actions: React.PropTypes.shape({
            getFeatureInfo: React.PropTypes.func,
            purgeMapInfoResults: React.PropTypes.func,
            changeMousePointer: React.PropTypes.func
        }),
        clickedMapPoint: React.PropTypes.shape({
            x: React.PropTypes.number,
            y: React.PropTypes.number
        })
    },
    getDefaultProps() {
        return {
            enabled: false,
            htmlResponses: [],
            htmlRequests: {length: 0},
            mapConfig: {layers: []},
            layerFilter(l) {
                return l.visibility &&
                    l.type === 'wms' &&
                    (l.queryable === undefined || l.queryable) &&
                    l.group !== "background"
                ;
            },
            actions: {
                getFeatureInfo() {},
                purgeMapInfoResults() {},
                changeMousePointer() {}
            }
        };
    },
    getInitialState() {
        return { showModal: true };
    },
    componentWillReceiveProps(newProps) {
        // if there's a new clicked point on map and GetFeatureInfo is active
        // it composes and sends a getFeatureInfo action.
        if (newProps.enabled && newProps.clickedMapPoint && (!this.props.clickedMapPoint || this.props.clickedMapPoint.x !== newProps.clickedMapPoint.x ||
                this.props.clickedMapPoint.y !== newProps.clickedMapPoint.y)) {
            const wmsVisibleLayers = newProps.mapConfig.layers.filter(newProps.layerFilter);
            const {bounds, crs} = this.reprojectBbox(newProps.mapConfig.bbox, newProps.mapConfig.projection);
            for (let l = 0; l < wmsVisibleLayers.length; l++) {
                const layer = wmsVisibleLayers[l];
                const requestConf = {
                    layers: layer.name,
                    query_layers: layer.name,
                    x: newProps.clickedMapPoint.x,
                    y: newProps.clickedMapPoint.y,
                    height: newProps.mapConfig.size.height,
                    width: newProps.mapConfig.size.width,
                    srs: crs,
                    bbox: bounds.minx + "," +
                          bounds.miny + "," +
                          bounds.maxx + "," +
                          bounds.maxy
                };
                const layerMetadata = {
                    title: layer.title
                };
                const url = layer.url.replace(/[?].*$/g, '');
                this.props.actions.getFeatureInfo(url, requestConf, layerMetadata);
            }
        }

        if (newProps.enabled && !this.props.enabled) {
            this.props.actions.changeMousePointer('pointer');
        } else if (!newProps.enabled && this.props.enabled) {
            this.props.actions.changeMousePointer('auto');
        }
    },
    onModalHiding() {
        this.props.actions.purgeMapInfoResults();
    },
    // returns a array of tabs where each one contains feature info for
    // a specific layer.
    getModalContent(responses) {
        var output = [];
        const getFeatureProps = feature => feature.properties;
        const getFormattedContent = (feature, i) => {
            return (
                <ApplyTemplate key={i} data={feature} template={getFeatureProps}>
                    <PropertiesViewer title={feature.id} exclude={["bbox"]}/>
                </ApplyTemplate>
            );
        };

        output = responses.map((res, i) => {
            let content = "";
            const {response, layerMetadata} = res;

            if (response.features) {
                content = <div key={i}>{response.features.map(getFormattedContent)}</div>;
            } else {
                content = (
                    <Alert bsStyle={"danger"} key={i}>
                        <h4><I18N.HTML msgId={"getFeatureInfoError.title"}/></h4>
                        <p><I18N.HTML msgId={"getFeatureInfoError.text"}/></p>
                    </Alert>
                );
            }

            return {component: content, title: layerMetadata.title};
        });
        return output.reduce((prev, item) => {
            prev.titles.push(item.title);
            prev.pages.push(item.component);
            return prev;
        }, {titles: [], pages: []});
    },
    render() {
        let missingRequests = this.props.htmlRequests.length - this.props.htmlResponses.length;
        let {titles, pages} = this.getModalContent(this.props.htmlResponses);
        return (
                <Modal
                    show={this.props.htmlRequests.length !== 0}
                    onHide={this.onModalHiding}
                    bsStyle="info"
                    dialogClassName="getFeatureInfo">
                    <Modal.Header closeButton>
                        <Modal.Title>
                        { (missingRequests !== 0 ) ? <Spinner value={missingRequests} sSize="sp-small" /> : null }
                        <I18N.Message msgId="getFeatureInfoTitle" />
                       </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Book pageTitles={titles}>
                            {pages}
                        </Book>
                    </Modal.Body>
                </Modal>

        );
    },
    reprojectBbox(bbox, destSRS) {
        let newBbox = CoordinatesUtils.reprojectBbox([
            bbox.bounds.minx,
            bbox.bounds.miny,
            bbox.bounds.maxx,
            bbox.bounds.maxy
        ], bbox.crs, destSRS);
        return assign({}, {
            crs: destSRS,
            bounds: {
                minx: newBbox[0],
                miny: newBbox[1],
                maxx: newBbox[2],
                maxy: newBbox[3]
            }
        });
    }
});

module.exports = GetFeatureInfoV2;
