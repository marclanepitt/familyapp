import React, { Component } from "react";
import ApiInstance from "../../js/utils/Api";
import "./css/main.css";
import {
  Button,
  Col,
  Navbar,
  Nav,
  NavItem
} from "react-bootstrap";

const Api = ApiInstance.instance;

export default class Profile extends Component {
  render() {
    return (
      <div>
        <h1>My Account</h1>
      </div>
    );
  }
}
