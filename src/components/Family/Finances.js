import React, { Component } from "react";
import ApiInstance from "../../js/utils/Api";
import "./css/main.css";
import {
  Button,
  Col,
  Navbar,
  Nav,
  NavItem,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";

const Api = ApiInstance.instance;

export default class Finances extends Component {
    constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      family:{},
    };
  }

  componentDidMount() {
    this.setState({
      family:Api.user.family,
      userProfile:Api.userProfile,
    });
  }

  render() {
      const {family,userProfile} = this.state;
    return (
      <div className="container">
        <br/>
        <h1> Finances </h1>
        <div className="row">
          <div className="col col-sm-6">
          <h3>{userProfile.first_name}'s Finances</h3>
        </div>
          <div className="col col-sm-6">
            <h3>{family.name}'s Finances</h3>
          </div>
        </div>
      </div>
    );
  }
}
