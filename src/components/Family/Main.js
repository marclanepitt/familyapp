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
  MenuItem,
  Image
} from "react-bootstrap";
import {Icon} from "react-fa";
import dashPic from "./img/home.png";
import choresPic from "./img/chores.png";
import calPic from "./img/cal.png";
import financePic from "./img/finance.png";
import { GridLoader } from 'react-spinners';

const Api = ApiInstance.instance;


export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      admin:"",
      family:{},
      loading: true,
        showLogoutModal:false,
        selectedMenu:0,
    };
    this.logout = this.logout.bind(this);
    this.greeting = this.greeting.bind(this);
    this.closeLogoutModal =this.closeLogoutModal.bind(this);
    this.openLogoutModal=this.openLogoutModal.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.selectedMenu = this.selectedMenu.bind(this);
  }

  componentDidMount() {
    var upid =  Cookies.get("upid");
    if (Api.isAuthenticated()) {
      Promise.resolve(Api.getUser()).then(fake_response=>{
          Promise.resolve(Api.getUserProfile(upid)).then(response => {
          this.setState({
              user: response,
              admin: response.admin,
              family: Api.user.family,
              loading: false,

          });
      });
    });
    } else {
      this.props.router.push("/login");
    }
  }

  logout() {
    this.setState({
        loading:true,
    });
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

 selectedMenu(e){
        var els = document.getElementsByClassName("is-active");
        while(els.length > 0) {
           els[0].className = 'c-menu__item';
        }
        e.target.parentElement.className = "c-menu__item is-active";
        console.log(e)
  }

  openMenu() {
   if(document.getElementById("body").className.indexOf("expanded") !== -1) {
       document.getElementById("body").className = "sidebar-is-reduced";
       document.getElementById("hamburger").className = "hamburger-toggle";
   } else {
       document.getElementById("body").className = "sidebar-is-reduced sidebar-is-expanded";
       document.getElementById("hamburger").className = "hamburger-toggle is-opened";
   }
  }



  render() {
    const { user,loading,family } = this.state;
    const greeting = this.greeting;
    return (
      <div className="app">
          {loading ?
              <div className="loader"
                >
                  <GridLoader
                  color={'#102C58'}
                />
                </div>
              :
              <div>
                <body id="body" className="sidebar-is-reduced">
                <header className="l-header">
                  <div className="l-header__inner clearfix">
                    <div className="c-header-icon js-hamburger">
                      <button onClick={this.openMenu} id="hamburger" className="hamburger-toggle"><span className="bar-top"/><span
                          className="bar-mid"/><span className="bar-bot"/></button>
                    </div>
                    <div className="c-header-icon has-dropdown"><span
                        className="c-badge c-badge--header-icon animated bounce">10</span><i className="fa fa-bell"></i>
                      <div className="c-dropdown c-dropdown--notifications">
                        <div className="c-dropdown__header"/>
                        <div className="c-dropdown__content"/>
                      </div>
                    </div>
                    <div className="family-txt">The {family.name} Family</div>
                    <div className="header-icons-group">
                      <div className="c-header-icon logout"><i className="fa fa-power-off"/></div>
                      <div className="c-header-icon"><Image src={user.pro_pic} circle responsive/></div>
                    </div>
                  </div>
                </header>
                <div className="l-sidebar">
                  <div className="logo">
                    <div className="logo__txt">F</div>
                  </div>
                  <div className="l-sidebar__content">
                    <nav className="c-menu js-menu">
                      <ul className="u-list">
                        <Link to="/app/"><li className="c-menu__item is-active" data-toggle="tooltip" title="Living Room" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-home"/>
                          <div className="c-menu-item__title"><span>Living Room</span></div>
                        </li></Link>
                        <Link to="/app/finances/"><li className="c-menu__item" data-toggle="tooltip" title="Finances" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-credit-card-alt"/>
                          <div className="c-menu-item__title"><span>Finances</span></div>
                        </li></Link>
                        <li className="c-menu__item" data-toggle="tooltip" title="Events" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-calendar-o"/>
                          <div className="c-menu-item__title"><span>Events</span></div>
                        </li>
                        <li className="c-menu__item" data-toggle="tooltip" title="Chores" onClick={(e) => this.selectedMenu(e)}><i className="fa fa-wrench"/>
                          <div className="c-menu-item__title"><span>Chores</span></div>
                        </li>
                        <li className="c-menu__item" data-toggle="tooltip" title="My Family" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-pagelines"/>
                          <div className="c-menu-item__title"><span>My Family</span></div>
                        </li>
                        <li className="c-menu__item" data-toggle="tooltip" title="Groups" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-users"/>
                          <div className="c-menu-item__title"><span>Groups</span></div>
                        </li>
                        <li className="c-menu__item" data-toggle="tooltip" title="Settings" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-cogs"/>
                          <div className="c-menu-item__title"><span>Settings</span></div>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
                </body>
                <main className="l-main">
                  <div className="content-wrapper content-wrapper--with-bg">
                      {this.props.children}
                  </div>
                </main>
              </div>
          }
      </div>
    );
  }
}
