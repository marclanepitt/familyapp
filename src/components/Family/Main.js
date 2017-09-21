import React, { Component } from "react";
import { Link } from "react-router";
import ApiInstance from "../../js/utils/Api";
import Profile from "./Profile.js";
import "./css/main.css";
import {
  Button,
  Col,
  Row,
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from "react-bootstrap";
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {blue500, yellow600} from 'material-ui/styles/colors';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';

const Api = ApiInstance.instance;


export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      loading: true
    };
    this.logout = this.logout.bind(this);
    this.greeting = this.greeting.bind(this);
  }

  componentDidMount() {
    if (Api.isAuthenticated()) {
      Promise.resolve(Api.getUser()).then(response => {
        this.setState({ 
          user: response,
          loading: false
        });

      });
    } else {
      this.props.router.push("/login");
    }
  }

  logout() {
    Api.logoutUser().then(response => {
      this.props.router.push("/login");
      this.setState({ user: {} });

    });
  }

  greeting() {
    var currentHour = new Date().getHours();
    var greeting = "Hello ";
    if (currentHour > 3 && currentHour <= 10) {
      greeting = "Good Morning ";
    } else if (currentHour > 10 && currentHour <= 16) {
      greeting = "Good Afternoon ";
    } else if (currentHour > 16 || currentHour <= 3) {
      greeting = "Good Evening ";
    }
    return greeting;
  }

  render() {
    const { user,loading } = this.state;
    const greeting = this.greeting;

    return (
      <div className="App">
      {loading ?
        <div
            className="overlay"
            style={{ display: loading ? "block" : "none" }}
        >
            <div className="loader" />
        </div>
        :
          <div>
<div id="header" className="navbar navbar-default navbar-fixed-top">
    <div className="navbar-header">
        <button className="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".navbar-collapse">
            <i className="icon-reorder"></i>
        </button>
        <a className="navbar-brand" href="#">
            Family
        </a>
    </div>
    <nav className="collapse navbar-collapse">
        <ul className="nav navbar-nav">
            <li>
                <a href="#">Navbar Item 1</a>
            </li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">Navbar Item 2<b className="caret"></b></a>
                <ul className="dropdown-menu">
                    <li><a href="#">Navbar Item2 - Sub Item 1</a></li>
                </ul>
            </li>
            <li>
                <a href="#">Navbar Item 3</a>
            </li>
        </ul>
        <ul className="nav navbar-nav pull-right">
        </ul>
    </nav>
</div>
<div id="wrapper">
  <div id="sidebar-wrapper" className="col-md-1">
            <div id="sidebar">
                <ul className="nav list-group">
                    <li>
                      <a className="list-group-item" href="#"><i className="icon-home icon-1x"></i>Sidebar Item 1</a>
                    </li>
                    <li>
                        <a className="list-group-item" href="#"><i className="icon-home icon-1x"></i>Sidebar Item 2</a>
                    </li>
                    <li>
                        <a className="list-group-item" href="#"><i className="icon-home icon-1x"></i>Sidebar Item 9</a>
                    </li>
                    <li>
                        <a className="list-group-item" href="#"><i className="icon-home icon-1x"></i>Sidebar Item 10</a>
                    </li>
                    <li>
                        <a className="list-group-item" href="#"><i className="icon-home icon-1x"></i>Sidebar Item 11</a>
                    </li>
                </ul>
            </div>
        </div>
        <div id="main-wrapper" className="col-md-11 pull-right">
            <div id="main">
              <div className="family-header">
                  {user.first_name}
                <button onClick={this.logout}>Logout</button>
              </div>
            </div>
          
        </div>
</div>
          </div>
      }
      </div>
    );
  }
}
