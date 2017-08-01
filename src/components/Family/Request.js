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

export default class Request extends Component {
  render() {
    return (
      <div>
        <h1>Make a Request</h1>
        <div className="panel">
          <br />
          <form>
            <FormGroup controlId="">
              <FormControl
                type="text"
                placeholder="Type of Help"
                onChange={e => this.handleInputChange(e, "username")}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="">
              <FormControl
                type="text"
                placeholder="Subject"
                onChange={e => this.handleInputChange(e, "username")}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="">
              <FormControl
                type="text"
                placeholder="Description"
                onChange={e => this.handleInputChange(e, "username")}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="">
              <FormControl
                type="text"
                placeholder="Building"
                onChange={e => this.handleInputChange(e, "username")}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="">
              <FormControl
                type="text"
                placeholder="Location"
                onChange={e => this.handleInputChange(e, "username")}
              />
              <FormControl.Feedback />
            </FormGroup>
          </form>
        </div>
      </div>
    );
  }
}
