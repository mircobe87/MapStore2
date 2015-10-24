/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var {Button, Panel, ButtonGroup, ButtonToolbar} = require('react-bootstrap');
var ToggleButton = require('../buttons/ToggleButton');
var {FormattedNumber} = require('react-intl');
var Glyphicon = require('../Glyphicon/Glyphicon');

var bearingRuleIcon = require('./img/bearing-ruler.png');

let MeasureComponent = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        name: React.PropTypes.string,
        columnProperties: React.PropTypes.object,
        propertiesChangeHandler: React.PropTypes.func,
        lengthButtonText: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        areaButtonText: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        resetButtonText: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        lengthLabel: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        areaLabel: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        bearingLabel: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        toggleMeasure: React.PropTypes.func,
        measurement: React.PropTypes.object,
        lineMeasureEnabled: React.PropTypes.bool,
        areaMeasureEnabled: React.PropTypes.bool,
        bearingMeasureEnabled: React.PropTypes.bool
    },
    getDefaultProps() {
        return {
            icon: <Glyphicon icon="mp2-tools"/>,
            columnProperties: {
                xs: 4,
                sm: 4,
                md: 4
            },
            id: "measure-result-panel"
        };
    },
    onLineClick: function() {
        var newMeasureState;
        if (this.props.lineMeasureEnabled === false) {
            newMeasureState = {
                lineMeasureEnabled: true,
                areaMeasureEnabled: false,
                bearingMeasureEnabled: false,
                geomType: 'LineString',
                // reset old measurements
                len: 0,
                area: 0,
                bearing: 0
            };
            this.props.toggleMeasure(newMeasureState);
        }
    },
    onAreaClick: function() {
        var newMeasureState;
        if (this.props.areaMeasureEnabled === false) {
            newMeasureState = {
                lineMeasureEnabled: false,
                areaMeasureEnabled: true,
                bearingMeasureEnabled: false,
                geomType: 'Polygon',
                // reset old measurements
                len: 0,
                area: 0,
                bearing: 0
            };
            this.props.toggleMeasure(newMeasureState);
        }
    },
    onBearingClick: function() {
        var newMeasureState;
        if (this.props.bearingMeasureEnabled === false) {
            newMeasureState = {
                lineMeasureEnabled: false,
                areaMeasureEnabled: false,
                bearingMeasureEnabled: true,
                geomType: 'Bearing',
                // reset old measurements
                len: 0,
                area: 0,
                bearing: 0
            };
            this.props.toggleMeasure(newMeasureState);
        }
    },
    onResetClick: function() {
        var resetMeasureState = {
            lineMeasureEnabled: false,
            areaMeasureEnabled: false,
            bearingMeasureEnabled: false,
            geomType: null,
            len: 0,
            area: 0,
            bearing: 0
        };
        this.props.toggleMeasure(resetMeasureState);
    },
    getFormattedBearingValue(azimuth) {
        var bearing = "";
        if (azimuth >= 0 && azimuth < 90) {
            bearing = "N " + this.degToDms(azimuth) + " E";

        } else if (azimuth > 90 && azimuth <= 180) {
            bearing = "S " + this.degToDms(180.0 - azimuth) + " E";
        } else if (azimuth > 180 && azimuth < 270) {
            bearing = "S " + this.degToDms(azimuth - 180.0 ) + " W";
        } else if (azimuth >= 270 && azimuth <= 360) {
            bearing = "N " + this.degToDms(360 - azimuth ) + " W";
        }

        return bearing;
    },
    render() {
        let decimalFormat = {style: "decimal", minimumIntegerDigits: 1, maximumFractionDigits: 2, minimumFractionDigits: 2};
        return (
            <Panel id={this.props.id}>
                <ButtonToolbar>
                    <ButtonGroup>
                        <ToggleButton
                            text={<Glyphicon icon="mp2-ruler"/>}
                            pressed={this.props.lineMeasureEnabled}
                            onClick={this.onLineClick} />
                        <ToggleButton
                            text={<Glyphicon icon="mp2-ruler2"/>}
                            pressed={this.props.areaMeasureEnabled}
                            onClick={this.onAreaClick} />
                        <ToggleButton
                            text={<img src={bearingRuleIcon}/>}
                            pressed={this.props.bearingMeasureEnabled}
                            onClick={this.onBearingClick} />
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button
                            bsStyle="primary"
                            onClick={this.onResetClick}>
                            {this.props.resetButtonText}
                        </Button>
                    </ButtonGroup>
                </ButtonToolbar>

                <div className="panel-body">
                    <p><span>{this.props.lengthLabel}: </span><span id="measure-len-res"><FormattedNumber key="len" {...decimalFormat} value={this.props.measurement.len} /> m</span></p>
                    <p><span>{this.props.areaLabel}: </span><span id="measure-area-res"><FormattedNumber key="area" {...decimalFormat} value={this.props.measurement.area} /> m²</span></p>
                    <p><span>{this.props.bearingLabel}: </span><span id="measure-bearing-res">{this.getFormattedBearingValue(this.props.measurement.bearing)}</span></p>
                </div>
            </Panel>
        );
    },
    degToDms: function(deg) {
        // convert decimal deg to minutes and seconds
        var d = Math.floor(deg);
        var minfloat = (deg - d) * 60;
        var m = Math.floor(minfloat);
        var secfloat = (minfloat - m) * 60;
        var s = Math.floor(secfloat);

        return ("" + d + "° " + m + "' " + s + "'' ");
    }
});

module.exports = MeasureComponent;
