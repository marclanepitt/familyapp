import React, { Component } from "react";
import ApiInstance from "../../js/utils/Api";
import "./css/main.css";
import { Button, Col, Navbar, Nav, NavItem, Row } from "react-bootstrap";

const Api = ApiInstance.instance;

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      family:{},
    };
  }

  componentDidMount() {
    this.setState({
        userProfile:Api.userProfile,
        family:Api.user.family,
    });
  }


  render() {
    const {family,userProfile} = this.state;
    return (
      <div>
         <div id="main">
              <div className="family-header">
                <div className = "row">
                  <div className="col-md-2 col-md-offset-5" style={{paddingTop:15}}>
                       <div className="ratio img-responsive img-circle" style={{backgroundImage : "url("+family.pro_pic+")"}}/>
                  </div>
                </div>
                <div className="row">
                    <h3 className="test">The {family.name} Family</h3>
                     <button className="btn btn-sm btn-primary">New Charge</button>
                    {'  '}
                     <button className="btn btn-sm btn-success">New Event</button>

                </div>
              </div>

              <div className = "board">
                <div className="inner-board col col-md-9 col-md-offset-1">
                  <div className="board-element">
                  </div>
                </div>
              </div>
            </div>
      </div>
    );
  }
}
