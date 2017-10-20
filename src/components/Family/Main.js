import React, { Component } from "react";
import { Link } from "react-router";
import ApiInstance from "../../js/utils/Api";
import Cookies from "js-cookie";
import "./css/main.css";
import {
  Image,
  Alert
} from "react-bootstrap";

import logo from "../../img/kinly_logo.png";
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
        dropDown:"none",
    alertStyle:"",
    alertMessage:"",
    alertVsiible:false,
    };
    this.logout = this.logout.bind(this);
    this.greeting = this.greeting.bind(this);
    this.closeLogoutModal =this.closeLogoutModal.bind(this);
    this.openLogoutModal=this.openLogoutModal.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.selectedMenu = this.selectedMenu.bind(this);
    this.showDropdown = this.showDropdown.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
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
        if(e.target.parentElement.id === "admin" && this.state.user.admin.indexOf("DE") !== -1) {
            this.setState({
                alertVisible:true,
                alertMessage:"You are not permitted to access this feature.",
                alertStyle: "warning",
            })
        }
        if(e.target.parentElement.id !== "dashboard") {
            this.props.router.push("/app/" + e.target.parentElement.id + "/");
        } else {
             this.props.router.push("/app/");
        }
        var els = document.getElementsByClassName("is-active");
        while(els.length > 0) {
           els[0].className = 'c-menu__item';
        }
        document.getElementById(e.target.parentElement.id).className = "c-menu__item is-active";
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

  handleAlertDismiss() {
     this.setState({
         alertVisible:false,
         alertMessage:"",
         alertStyle:"",
     })
  }

  showDropdown() {
     if(this.state.dropDown === "none") {
         this.setState({
             dropDown: "block"
         })
     } else {
         this.setState({
             dropDown: "none"
         })
     }
  }



  render() {
    const { user,loading,family, dropDown, alertMessage,alertStyle, alertVisible } = this.state;
    const greeting = this.greeting;
    return (
      <div className="app">
          {loading ?
                <div className="col-sm-2 col-sm-offset-5 loader"
                >
                  <GridLoader
                  color={'#102C58'}
                />
                </div>
              :
              <div>
                <div id="body" className="sidebar-is-reduced">
                <header className="l-header">
                  <div className="l-header__inner clearfix">
                    <div className="c-header-icon js-hamburger">
                      <button onClick={this.openMenu} id="hamburger" className="hamburger-toggle"><span className="bar-top"/><span
                          className="bar-mid"/><span className="bar-bot"/></button>
                    </div>
                    <div className="c-header-icon has-dropdown"><span
                        className="c-badge c-badge--header-icon animated bounce">10</span><i className="fa fa-bell"></i>
                      <div className="c-dropdown">
                        <div className="c-dropdown__header"/>
                        <div className="c-dropdown__content"/>
                      </div>
                    </div>
                    <div className="family-txt">The {family.name} Family</div>
                    <div className="header-icons-group">
                      <div className="c-header-icon has-dropdown" onClick={this.showDropdown}><Image src={user.pro_pic} circle responsive/>
                          <div className="c-dropdown c-dropdown--notifications" style={{display: dropDown}}>
                                <div>{this.greeting()} {user.first_name}</div>
                                <div>
                                    <button className="btn btn-lg btn-danger" onClick={this.logout}>Logout</button>
                                </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>
                <div className="l-sidebar">
                  <div className="logo">
                    <div className="logo__txt"><Image src={logo} responsive style={{maxWidth:130,marginLeft:6,marginBottom:8}}/></div>
                  </div>
                  <div className="l-sidebar__content">
                    <nav className="c-menu js-menu">
                      <ul className="u-list">
                        <li className="c-menu__item" data-toggle="tooltip" title="Living Room" id="dashboard" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-home"/>
                          <div className="c-menu-item__title"><span>Living Room</span></div>
                        </li>
                          <li className="c-menu__item" data-toggle="tooltip" title="Groups" id="groups" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-users"/>
                          <div className="c-menu-item__title"><span>Groups</span></div>
                        </li>
                       <li className="c-menu__item" data-toggle="tooltip" title="Finances" id="finances" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-credit-card-alt"/>
                          <div className="c-menu-item__title"><span>Finances</span></div>
                        </li>
                      <li className="c-menu__item" data-toggle="tooltip" title="Chores" id="chores" onClick={(e) => this.selectedMenu(e)}><i className="fa fa-wrench"/>
                          <div className="c-menu-item__title"><span>Chores</span></div>
                       </li>
                       <li className="c-menu__item" data-toggle="tooltip" title="Events" id="events" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-calendar-o"/>
                          <div className="c-menu-item__title"><span>Events</span></div>
                       </li>
                         <li className="c-menu__item" data-toggle="tooltip" title="My Family" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-pagelines"/>
                          <div className="c-menu-item__title"><span>My Family</span></div>
                         </li>
                        <li className="c-menu__item" data-toggle="tooltip" title="Settings" id="admin" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-tasks"/>
                          <div className="c-menu-item__title"><span>Settings</span></div>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
                </div>
                <main className="l-main">
                  <div className="content-wrapper content-wrapper--with-bg">
                      {alertVisible ?
                        <Alert bsStyle={alertStyle} onDismiss={this.handleAlertDismiss}>
                            {alertMessage}
                        </Alert> :
                        <div></div>
                    }
                      {this.props.children}
                  </div>
                </main>
              </div>
          }
      </div>
    );
  }
}
