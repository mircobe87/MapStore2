/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = require('react');
var {Col, Row} = require('react-bootstrap');
var I18N = require('../../../components/I18N/I18N');

var MailingLists = React.createClass({
    contextTypes: {
        messages: React.PropTypes.object
    },
    render() {
        return (
            <div id="mailinglists" className="container">
                <Row>
                    <Col>
                        <h1 className="color2" style={{align: "center", fontWeight: "bold", margin: "10px"}} align="center"><I18N.Message msgId="home.ml.title"/></h1>
                    </Col>
                </Row>
                <Row>
                    <Col sm={1} md={2}/>
                    <Col sm={5} md={4}>
                        <table border="0" style={{backgroundColor: "#fff", padding: "5px", margin: "auto"}} cellSpacing="0">
                            <tr>
                                <td>
                                    <img src="examples/home/img/groups_logo_sm.gif" height="30" width="136" alt="Google Groups" />
                                </td>
                            </tr>
                            <tr>
                                <td style={{paddingLeft: "10px", paddingRight: "10px"}}>
                                    <b><I18N.Message msgId="home.ml.subscribe_users"/></b>
                                </td>
                            </tr>
                            <form action="http://groups.google.com/group/mapstore-users/boxsubscribe">
                            <tr>
                                <td style={{paddingLeft: "10px", paddingRight: "10px"}}>
                                    <I18N.Message msgId="home.ml.email"/> <input type="text" name="email" />
                                <input type="submit" name="sub" value={this.context.messages.home.ml.subscribe} />
                                </td>
                            </tr>
                            </form>
                            <tr>
                                <td align="right">
                                    <a className="link-white-bg" href="http://groups.google.com/group/mapstore-users"><I18N.Message msgId="home.ml.visit_group"/></a>
                                </td>
                            </tr>
                        </table>
                    </Col>
                    <Col sm={5} md={4}>
                        <table border="0" style={{backgroundColor: "#fff", padding: "5px", margin: "auto"}} cellSpacing="0">
                            <tr>
                                <td>
                                    <img src="examples/home/img/groups_logo_sm.gif" height="30" width="136" alt="Google Groups" />
                                </td>
                            </tr>
                            <tr>
                                <td style={{paddingLeft: "10px", paddingRight: "10px"}}>
                                    <b><I18N.Message msgId="home.ml.subscribe_devel"/></b>
                                </td>
                            </tr>
                            <form action="http://groups.google.com/group/mapstore-developers/boxsubscribe">
                            <tr>
                                <td style={{paddingLeft: "10px", paddingRight: "10px"}}>
                                    <I18N.Message msgId="home.ml.email"/> <input type="text" name="email" />
                                <input type="submit" name="sub" value={this.context.messages.home.ml.subscribe} />
                                </td>
                            </tr>
                            </form>
                            <tr>
                                <td align="right">
                                    <a className="link-white-bg" href="http://groups.google.com/group/mapstore-developers"><I18N.Message msgId="home.ml.visit_group"/></a>
                                </td>
                            </tr>
                        </table>
                    </Col>
                    <Col sm={1} md={2}/>
                </Row>
			</div>
        );
    }
});

module.exports = MailingLists;
