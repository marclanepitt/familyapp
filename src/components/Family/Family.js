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

export default class Family extends Component {
  render() {
    return (
      <div>
        <h1>My Family</h1>
      </div>
    );
  }
}
