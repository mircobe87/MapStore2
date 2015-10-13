/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var {Modal, Tabs, Tab} = require('react-bootstrap');

var I18N = require('../../../components/I18N/I18N');
var HtmlRenderer = require('../../../components/misc/HtmlRenderer');
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
                          bounds.maxy,
                    info_format: "application/json"
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
        var content = "";
        var title = "";
        var style = "";
        const getFeatureProps = (feature) => {
            var retval = feature.properties;
            delete retval.bbox;
            return retval;
        };
        const getFormattedContent = (feature) => {
            return (
                <ApplyTemplate data={feature} template={getFeatureProps}>
                    <PropertiesViewer title={feature.id}/>
                </ApplyTemplate>
            );
        };
        const regexpBody = /^[\s\S]*<body>([\s\S]*)<\/body>[\s\S]*$/i;
        const regexpStyle = /(<style[\s\=\w\/\"]*>[^<]*<\/style>)/i;
        const regexpException = /<ServiceException[\s]?[\s\w\=\"]*>([^<]*)<\/ServiceException>/i;

        for (let i = 0; i < responses.length; i++) {
            const {response, layerMetadata} = responses[i];

            title = (
                <div key={i} style={{
                        maxWidth: "96px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}>
                    {layerMetadata.title}
                </div>
            );

            if (typeof response === "string") {
                // response can be a JSON feature info or XML exception
                if (response.indexOf('<?xml') === 0) { // XML exception
                    let match = regexpException.exec(response);
                    let exceptionMsg = match && match.length === 2 ? match[1].trim() : "";
                    content = (<div><h3>Exception</h3><p style={{margin: "16px"}}>{exceptionMsg}</p></div>);
                } else { // HTML feature info
                    // gets css rules from the response and removes which are related to body tag.
                    let styleMatch = regexpStyle.exec(response);
                    style = styleMatch && styleMatch.length === 2 ? regexpStyle.exec(response)[1] : "";
                    style = style.replace(/body[,]+/g, '');
                    // gets feature info managing an eventually empty response
                    content = response.replace(regexpBody, '$1').trim();
                    if (content.length === 0) {
                        content = <p style={{margin: "16px"}}><I18N.Message msgId="noFeatureInfo"/></p>;
                    } else {
                        content = <HtmlRenderer key={i} html={style + content} />;
                    }
                }
                output.push(
                    <Tab eventKey={i} key={i} title={title}>
                        <div style={{overflow: "auto"}}>
                            {content}
                        </div>
                    </Tab>
                );
            } else if (response.length !== undefined) {
                // response is an array of exceptions
                const exArray = response;
                for (let j = 0; j < exArray.length; j++) {
                    output.push(
                        <Tab eventKey={i} key={i} title={title}>
                            <div style={{overflow: "auto"}}>
                                <HtmlRenderer key={i} html={
                                    '<h3>Exception: ' + j + '</h3>' +
                                    '<p>' + exArray[j].text + '</p>'
                                }/>
                            </div>
                        </Tab>
                    );
                }
            } else {
                if (response.features) {
                    content = response.features.map(getFormattedContent);
                    output.push(
                        <Tab eventKey={i} key={i} title={title}>
                            <div style={{overflow: "auto"}}>
                                {content}
                            </div>
                        </Tab>
                    );
                } else {
                    let match = regexpBody.exec(response.data);
                    if (match && match.length === 2) {
                        content = match[1];
                    } else {
                        content = '<p>' + response.data + '</p>';
                    }
                    output.push(
                        <Tab eventKey={i} title={title}>
                            <div style={{overflow: "auto"}}>
                                <HtmlRenderer key={i} html={content}/>
                            </div>
                        </Tab>
                    );
                }
            }
        }
        return output;
    },
    render() {
        let missingRequests = this.props.htmlRequests.length - this.props.htmlResponses.length;
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

                        <Tabs defaultActiveKey={0}>
                            {this.getModalContent(this.props.htmlResponses)}
                        </Tabs>
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
