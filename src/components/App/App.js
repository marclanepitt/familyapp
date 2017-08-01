import React, { Component } from "react";
import "./css/App.css";

export default class App extends Component {
  componentDidMount() {
    // ApiWrapper.getUser();
  }
  
  render() {
    return (
      <div className="App">
        {this.props.children}
      </div>
    );
  }
}
