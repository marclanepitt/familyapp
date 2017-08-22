import React, { Component } from "react";
import "./css/App.css";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';



export default class App extends Component {
  componentDidMount() {
    // ApiWrapper.getUser();
  }



  render() {
    return (

      <div className="App">
          <MuiThemeProvider>
             {this.props.children}
          </MuiThemeProvider>
      </div>
    );
  }
}
