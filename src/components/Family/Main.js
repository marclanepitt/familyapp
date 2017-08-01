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
import user_placeholder from "../../img/user_placeholder.png";

const Api = ApiInstance.instance;

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    this.logout = this.logout.bind(this);
    this.greeting = this.greeting.bind(this);
  }

  componentDidMount() {
    if (Api.isAuthenticated()) {
      Promise.resolve(Api.getUser()).then(response => {
        this.setState({ user: response });
      });
    } else {
      this.props.router.push("/login");
    }
  }

  logout() {
    Api.logoutUser().then(response => {
      this.setState({ user: {} });
      this.props.router.push("/login");
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
    const { user } = this.state;
    const greeting = this.greeting;
    return (
      <div className="App">
        <div id="navbar-wrapper">
          <header>
            <nav
              className="navbar navbar-default navbar-fixed-top"
              role="navigation"
            >
              <div className="container-fluid">
                <div className="navbar-header">
                  <button
                    type="button"
                    className="navbar-toggle"
                    data-toggle="collapse"
                    data-target="#navbar-collapse"
                  >
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                  <a className="navbar-brand" href="#">Family</a>
                </div>
                <div id="navbar-collapse" className="collapse navbar-collapse">
                  <ul className="nav navbar-nav navbar-right">
                    <NavDropdown>
                      <MenuItem>
                        <a
                          id="user-profile"
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          <img
                            src={user_placeholder}
                            className="img-responsive img-thumbnail img-circle"
                          />{" "}
                        </a>
                      </MenuItem>
                      <MenuItem />
                      <MenuItem>
                        <Button onClick={this.logout} bsStyle={"danger"}>
                          Logout
                        </Button>
                      </MenuItem>
                    </NavDropdown>
                  </ul>
                </div>
              </div>
            </nav>
          </header>
        </div>
        <div id="wrapper">
          <div id="sidebar-wrapper">
            <aside id="sidebar">
              <ul id="sidemenu" className="sidebar-nav">
                <li>
                  <Link to="/app/">
                    <span className="sidebar-icon">
                      <i className="fa fa-dashboard" />
                    </span>
                    <span className="sidebar-title">Home</span>
                  </Link>
                </li>
                <li>
                  <a
                    className="accordion-toggle collapsed toggle-switch"
                    data-toggle="collapse"
                    href="#submenu-2"
                  >
                    <span className="sidebar-icon">
                      <i className="fa fa-users" />
                    </span>
                    <span className="sidebar-title">Management</span>
                    <b className="caret" />
                  </a>
                  <ul
                    id="submenu-2"
                    className="panel-collapse collapse panel-switch"
                    role="menu"
                  >
                    <li>
                      <a href="#"><i className="fa fa-caret-right" />Users</a>
                    </li>
                    <li>
                      <a href="#"><i className="fa fa-caret-right" />Roles</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    className="accordion-toggle collapsed toggle-switch"
                    data-toggle="collapse"
                    href="#submenu-3"
                  >
                    <span className="sidebar-icon">
                      <i className="fa fa-newspaper-o" />
                    </span>
                    <span className="sidebar-title">Blog</span>
                    <b className="caret" />
                  </a>
                  <ul
                    id="submenu-3"
                    className="panel-collapse collapse panel-switch"
                    role="menu"
                  >
                    <li>
                      <a href="#"><i className="fa fa-caret-right" />Posts</a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-caret-right" />Comments
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">
                    <span className="sidebar-icon">
                      <i className="fa fa-database" />
                    </span>
                    <span className="sidebar-title">Data</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="sidebar-icon">
                      <i className="fa fa-terminal" />
                    </span>
                    <span className="sidebar-title">Console</span>
                  </a>
                </li>
              </ul>
            </aside>
          </div>
          <main id="page-content-wrapper" role="main">
            {this.props.children}
          </main>
        </div>
      </div>
    );
  }
}
