import React, { Component } from "react";
import { Link } from "react-router";
import "./css/Login.css";
import {
  Col,
  Button,
  ButtonToolbar,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock
} from "react-bootstrap";
import ApiInstance from "../../js/utils/Api";

export default class UserEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      family:'',
      firstName:'',
      password:'',
      dateOfBirth:'',
      proPic:'',
      status:'',
      admin:'',
      errors: {}
    };
  }



  render() {
    return (
      <div>
      <h3> A verification Email has been sent</h3>
        <h1>Time to make your profile</h1>
        <h4>This profile will be the Super User of the Family</h4>

      </div>
    );
  }
}
