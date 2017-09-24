import React, { Component } from "react";
import { Link } from "react-router";
import ApiInstance from "../../js/utils/Api";
import Cookies from "js-cookie";
import "./css/main.css";
import {
  Modal,
  Button,
  Col,
  Row,
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from "react-bootstrap";
import dashPic from "./img/home.png";
import choresPic from "./img/chores.png";
import calPic from "./img/cal.png";
import financePic from "./img/finance.png";

const Api = ApiInstance.instance;


export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      family:{},
      loading: true,
        showLogoutModal:false,
    };
    this.logout = this.logout.bind(this);
    this.greeting = this.greeting.bind(this);
    this.closeLogoutModal =this.closeLogoutModal.bind(this);
    this.openLogoutModal=this.openLogoutModal.bind(this);
  }

  componentWillMount() {
      Promise.resolve(Api.getUser()).then(response=> {
        Api.setUser(response);
        this.setState({
            loading:false,
        })
      });
  }

  componentDidMount() {
    var upid =  Cookies.get("upid");
    if (Api.isAuthenticated()) {
      Promise.resolve(Api.getUserProfile(upid)).then(response => {
        this.setState({
          user: response,
          family: Api.user.family,
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

  closeLogoutModal() {
    this.setState({
        showLogoutModal:false,
    })
  }

  openLogoutModal() {
    this.setState({
        showLogoutModal:true,
    })
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
    const { user,loading,family } = this.state;
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
            {/*<li>*/}
                {/*<Link to="/app/myprofile/">My Profile</Link>*/}
            {/*</li>*/}
            {/*<li>*/}
                {/*<a href="#">My Family</a>*/}
            {/*</li>*/}
          {/*<li style={{marginTop:15,marginLeft:697}}>*/}
              {/*{greeting()} {user.first_name}*/}
      {/*</li>*/}
        </ul>


        <ul className="nav navbar-nav pull-right">
          <li>
            <button className="btn btn-sm btn-danger" style={{marginTop:10, marginRight:20}} onClick={this.openLogoutModal}>Logout</button>
          </li>
        </ul>
    </nav>
</div>
<div id="wrapper">
  <div id="sidebar-wrapper" className="col-md-1">
            <div id="sidebar">
                <ul className="nav list-group">
                  <li>
                    <div className="small-img ratio img-responsive img-circle" style={{marginTop:10, backgroundImage : "url("+user.pro_pic+")"}}/>
                  </li>
                  <br/>
                    <li>
                      <Link to="/app/" className="list-group-item" href="#"><i className="icon-home icon-1x"></i><img src={dashPic}/> Living Room </Link>
                    </li>
                    <li>
                      <Link className="list-group-item" to="/app/finances/"><i className="icon-home icon-1x"></i><img src={financePic}/>Finances </Link>
                    </li>
                    <li>
                        <a className="list-group-item" href="#"><i className="icon-home icon-1x"></i><img src={choresPic}/>Chores</a>
                    </li>
                    <li>
                        <a className="list-group-item" href="#"><i className="icon-home icon-1x"></i><img src={calPic}/>Events</a>
                    </li>
                </ul>
            </div>
        </div>
        <div id="main-wrapper" className="col-md-11 pull-right">
          <Modal show={this.state.showLogoutModal} onHide={this.closeLogoutModal}>
          <Modal.Header closeButton>
            <div className="text-center">
            <Modal.Title>Confirmation</Modal.Title>
            </div>
          </Modal.Header>
            <Modal.Body>
              <div className="text-center">
              Are you sure you want to log out?
              </div>
            </Modal.Body>
          <Modal.Footer>
            <div className="text-center">
              <Button bsStyle={"danger"} onClick={this.logout}>Yes</Button>
              <Button bsStyle={"primary"} onClick={this.closeLogoutModal}>No</Button>
            </div>
          </Modal.Footer>
        </Modal>
            {this.props.children}
        </div>
</div>
          </div>
      }
      </div>
    );
  }
}
