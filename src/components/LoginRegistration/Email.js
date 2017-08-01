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

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: {}
    };
}

  render() {
    return (
      <div>
      <h1> A verification Email has been sent</h1>
      </div>
    );
  }
}
