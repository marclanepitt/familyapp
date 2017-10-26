import React, { Component } from "react";
import { Link } from "react-router";
import ApiInstance from "../../js/utils/Api";
import Cookies from "js-cookie";
import "./css/main.css";
import isEmpty from 'lodash';
import {
  Image,
  Alert,
  Modal,
  Button,
  FormGroup,
  FormControl,
} from "react-bootstrap";
import Dropzone from 'react-dropzone';

import logo from "../../img/kinly_logo.png";
import { GridLoader } from 'react-spinners';
import Icon from "../../../node_modules/react-fa/lib/Icon";
import { bounce, slideInDown,swing,slideOutLeft,fadeIn } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

const styles = {
  bounce: {
    animation: 'x 1s',
    animationName: Radium.keyframes(bounce, 'bounce')
  },
  slideIn: {
    animation: 'x 1s',
    animationName: Radium.keyframes(slideInDown,'slideInDown')
  },
  swing: {
    animation: '5 1s',
    animationName:Radium.keyframes(swing,'swing')
  },
  fadeIn: {
    animation: 'x 1s',
    animationName: Radium.keyframes(fadeIn,'fadeIn')
  }
}

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
    notificationDropDown:"none",
    alertStyle:"",
    alertMessage:"",
    alertVisible:false,
    picAlertMessage:"",
    picAlertVisible:false,
    showChangeUserProPic:false,
    showProPicModal:false,
    uploadedFile:"",
    imagePreviewUrl:"",
    showPreview:false,
    showProfileModal:false,
    showPasswordInput:false,
    selectedSwitchPic:"",
    selectedUser:{},
    showEditProfileModal:false,
    notifications:{},
    unreadCount:0,

    };
    this.logout = this.logout.bind(this);
    this.greeting = this.greeting.bind(this);
    this.closeLogoutModal =this.closeLogoutModal.bind(this);
    this.openLogoutModal=this.openLogoutModal.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.selectedMenu = this.selectedMenu.bind(this);
    this.showDropdown = this.showDropdown.bind(this);
    this.showNotificationDropdown = this.showNotificationDropdown.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.showChangeUserProPic = this.showChangeUserProPic.bind(this);
    this.hideChangeUserProPic = this.hideChangeUserProPic.bind(this);
    this.showProPicModal = this.showProPicModal.bind(this);
    this.hideProPicModal = this.hideProPicModal.bind(this);
    this.onImageDrop = this.onImageDrop.bind(this);
    this.handleProPicSubmit = this.handleProPicSubmit.bind(this);
    this.handlePicAlertDismiss = this.handlePicAlertDismiss.bind(this);
    this.hideProfileModal =this.hideProfileModal.bind(this);
    this.showProfileModal = this.showProfileModal.bind(this);
    this.handleProfileSwitchSubmit = this.handleProfileSwitchSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.selectedUser = this.selectedUser.bind(this);
    this.showEditProfileModal = this.showEditProfileModal.bind(this);
    this.hideEditProfileModal = this.hideEditProfileModal.bind(this);
    this.handleNotificationRead = this.handleNotificationRead.bind(this);
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
          Promise.resolve(Api.getNotifications(upid)).then(response=> {
            var count = 0;
            if(response[0] != undefined) {
              count =response[0].unread_count;
            }
            this.setState({
              notifications: response,
              unreadCount: count,
            })
          })
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

  showEditProfileModal() {
    this.setState({
      showEditProfileModal:true,
    })
  }

  hideEditProfileModal() {
    this.setState({
      showEditProfileModal:false,
    })
  }

  handleAlertDismiss() {
     this.setState({
         alertVisible:false,
         alertMessage:"",
         alertStyle:"",
     })
  }

  handlePicAlertDismiss() {
      this.setState({
         picAlertVisible:false,
         picAlertMessage:"",
     })
  }

  handleProfileSwitchSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ loading: true });
        const { selectedUser, password } = this.state;
        const data = {
            "id":selectedUser,
            password
        };
        const onSuccess = response => {
            Api.store("upid",selectedUser);
            this.setState({
              loading:false,
              showProfileModal:false,
              alertVisible:false,
            })
            this.componentDidMount();
        }

        const onError = err => {
            this.setState({ loading: "" });
            this.setState({ errors: err.response.data.detail });
            this.setState({ error_display:""});
        };
        const response = Api.loginUserProfile(data,onSuccess, onError,selectedUser);

        this.setState({ errors: response.data });
        return false;
  }

  selectedUser(user) {
      this.setState({
        selectedUser:user.id,
        selectedSwitchPic:user.pro_pic,
        showPasswordInput:true,
      });
  }

   handleInputChange(e, field) {
        const { state } = this;
        state[field] = e.target.value;
        this.setState(state);
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

  showNotificationDropdown() {
     if(this.state.notificationDropDown === "none") {
         this.setState({
             notificationDropDown: "block"
         })
     } else {
         this.setState({
             notificationDropDown: "none"
         })
     }
  }

  handleNotificationRead(notif) {
    Promise.resolve(Api.readNotification(notif, this.state.user.id)).then(response=> {
      this.componentDidMount();
    })
  }

  showChangeUserProPic() {
     this.setState({
         showChangeUserProPic:true,
     })
  }

  hideChangeUserProPic() {
     this.setState({
        showChangeUserProPic:false,
     })
  }

  showProPicModal() {
    this.setState({
      showProPicModal:true
    })
  }

  hideProPicModal() {
    this.setState({
      showProPicModal:false,
      uploadedFile:"",
      imagePreviewUrl:"",
      showPreview:false,
    })  
  }

  hideProfileModal() {
    this.setState({
      showProfileModal:false
    })
  }

  showProfileModal() {
    this.setState({
      showProfileModal:true
    })
  }

 onImageDrop(files) {
    let reader = new FileReader();
    let file = files[0];

    reader.onloadend = () => {
      this.setState({
        uploadedFile: file,
        imagePreviewUrl: reader.result,
        showPreview:true,
      });
    }
    try {
     reader.readAsDataURL(file)
    } catch(err) {
      this.setState({
        picAlertVisible:true,
        picAlertMessage:"Oops.  That is not a supported file type."
      })
    }
}

handleProPicSubmit() {
  this.setState({
      loading:true,
  })
  const {user, uploadedFile} = this.state;
  var formData = new FormData();
  formData.append("pro_pic",uploadedFile);
  formData.append("id",user.id);
  const onSuccess = response => {
    this.setState({
      loading:false,
      alertVisible:true,
      alertStyle:"success",
      alertMessage:"You have successfully updated your profile picture.",
      showProPicModal:false,
      user:response,
      uploadedFile:"",
      imagePreviewUrl:"",
      showPreview:false,
    })
  }
  const onError = err=> {
    this.setState({
      loading:false,
      alertVisible:true,
      alertStyle:"danger",
      alertMessage:"Oops. Something went wrong when trying to change your picture.  Please try again later.",
      showProPicModal:false,
      uploadedFile:"",
      imagePreviewUrl:"",
      showPreview:false,
    })
  }
  Api.updateUserProfile(formData,onSuccess,onError);
}


  render() {
    const { user,loading,family, dropDown, notificationDropDown, alertMessage,alertStyle, alertVisible, showChangeUserProPic, showProPicModal,uploadedFile,imagePreviewUrl,showPreview, picAlertMessage, picAlertVisible,
      showProfileModal ,showPasswordInput, selectedSwitchPic,showEditProfileModal,unreadCount,notifications} = this.state;
    const greeting = this.greeting;
    var alertClass = "main-alert alert alert-" + alertStyle;
    return (
      <StyleRoot>
      <div className="app">
          {loading ?
                <div className="loader" style={{marginLeft:610}}
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
                    <div className="c-header-icon has-dropdown" onClick={this.showNotificationDropdown}><i style={styles.swing} className="fa fa-bell"></i>
                    {unreadCount > 0 ? 
                    <span className="c-badge c-badge--header-icon" >{unreadCount}</span>
                    :
                    <div/>
                    }   
                    <div className="c-dropdown notification-dropdown" style={{display: notificationDropDown}}>
                        <div className="c-dropdown__header"/>
                        <div className="c-dropdown__content"/>
                        {notifications[0] != undefined ?
                          <div>
                            {notifications.map((n)=>
                              <div>
                              {n.is_read ? 
                              <div className="row notification-row n-read">
                                <div className="notification-icon col col-sm-2">
                                  <i className={"fa " + "fa-" + n.app}/>
                                </div>
                                <div className="notification-text col col-sm-8">
                                  {n.message}
                                  </div>
                                  <div className="notification-time">
                                  <i className="fa fa-clock-o"/> {n.time_ago} ago
                                  </div>    
                              </div>
                              :
                               <div  onClick = {() => this.handleNotificationRead(n.id)} className="row notification-row n-unread">
                                <div className="notification-icon col col-sm-2">
                                  <i className={"fa " + "fa-" + n.app}/>
                                </div>
                                <div className="notification-text col col-sm-8">
                                  {n.message}
                                  </div>     
                                  <div className="notification-time">
                                  <i className="fa fa-clock-o"/> {n.time_ago} ago
                                  </div>                     
                                </div>
                        }
                        </div>
                        )}
                            <div className="notifications-see-all">
                              See all
                            </div>
                      </div>
                      :
                      <div className="no-notifications">
                      No notifications at this time
                      </div>
                    }
                      </div>
                    </div>
                    <div className="family-txt">The {family.name} Family</div>
                    <div className="header-icons-group">
                      <div className="c-header-icon has-dropdown" onClick={this.showDropdown}><Image src={user.pro_pic} circle responsive/>
                          <div className="c-dropdown c-dropdown--notifications profile-dropdown" style={{display: dropDown}}>
                                <div className="row">
                                    <div className="col col-sm-6 col-md-offset-3 dropdown-img">
                                        {showChangeUserProPic ?
                                            <div onClick={this.showProPicModal} onMouseEnter={this.showChangeUserProPic}  onMouseLeave={this.hideChangeUserProPic} className="image-overlay">
                                                <button className="btn btn-default overlay-btn">Edit</button>
                                            </div>
                                            :
                                            <div/>
                                        }
                                        <Image onMouseEnter={this.showChangeUserProPic} onMouseLeave={this.hideChangeUserProPic} src={user.pro_pic} circle responsive/>
                                    </div>
                                </div>
                                        <div style={{fontWeight:800,marginLeft:77}}>{greeting()} {user.first_name}</div>
                                    <div className="row dropdown-actions">
                                        <div className="col col-sm-4 col-md-offset-2">
                                            <button className="btn btn-danger" onClick={this.logout}>Logout</button>
                                        </div>
                                        <div className="col col-sm-4">
                                            <button className="btn btn-primary" onClick={this.showEditProfileModal}>My Account</button>
                                        </div>
                                    </div>
                                <div className="row">
                                    <div >
                                        <button className="btn btn-warning dropdown-profile-btn" onClick={this.showProfileModal}> Switch Profile</button>
                                    </div>
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
                        <li className="c-menu__item" data-toggle="tooltip" title="Admin" id="admin" onClick={(e) => this.selectedMenu(e)}><i
                            className="fa fa-tasks"/>
                          <div className="c-menu-item__title"><span>Admin</span></div>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
                </div>
                <main className="l-main">
                  <div className="content-wrapper content-wrapper--with-bg">
                      {alertVisible ?
                        <div className={alertClass} style={styles.bounce}>
                            {alertMessage}
                            <button type="button" className="close" onClick={this.handleAlertDismiss}>
                              <span aria-hidden="true">&times;</span>
                            </button>
                        </div> :
                        <div></div>
                    }
                      {this.props.children}
                  </div>
                </main>
                <Modal show={showProPicModal} onHide={this.hideProPicModal}>
                        <Modal.Body> 
                        {picAlertVisible ?
                            <div className="alert alert-danger">
                                {picAlertMessage}
                                <button type="button" className="close" onClick={this.handlePicAlertDismiss}>
                                  <span aria-hidden="true">&times;</span>
                                </button>
                            </div> :
                            <div></div>
                          }
                            <Dropzone className="picture-drag"
                            multiple={false}
                            accept="image/*"
                            onDrop={this.onImageDrop}>
                            <div className="picture-drag-text">
                            <b>Choose</b> or <b>Drag</b> an image
                            <div style={{marginTop:18}}>
                             <i style={{fontSize:35,marginLeft:59}}className="fa fa-picture-o"/>
                             {showPreview ?
                             <div className="image-preview">
                               <Image className="previewed-image" src={imagePreviewUrl} responsive circle/>
                               <Button onClick={this.handleProPicSubmit} className = "preview-btn" bsStyle={"success"}><i className="fa fa-upload"/></Button>
                             </div>
                             :
                             <div/>
                           }
                            </div>
                          </div>
                          </Dropzone>
                              </Modal.Body>
                  </Modal>
                  <Modal show={showProfileModal} onHide={this.hideProfileModal}>
                        <Modal.Body> 
                        <div> Please Select A Profile </div>
                          <div className="row">
                          {family.users.map((user)=>
                              <div className="col-md-2">
                                 <div onClick={() => this.selectedUser(user)} className="ratio img-responsive img-circle" style={{backgroundImage : "url("+user.pro_pic+")"}}/>
                                  <h4>{user.first_name}</h4>
                              </div>
                          )}
                          </div>
                          </Modal.Body>
                          <Modal.Footer>
                                  {showPasswordInput ?
                              <div className="col col-sm-2 col-md-offset-5" style={styles.fadeIn}>
                                  <div className="ratio img-responsive img-circle" style={{backgroundImage : "url("+selectedSwitchPic+")"}}/>
                                  <br/>
                                <form onSubmit={this.handleProfileSwitchSubmit}>
                                     <FormGroup
                                            controlId="password"
                                        >
                                            <FormControl
                                                type="password"
                                                placeholder="Passcode"
                                                onChange={e =>
                                                    this.handleInputChange(e, "password")}
                                            />
                                            <FormControl.Feedback />
                                        </FormGroup>
                                    <div className="text-center">
                                            <Button bsStyle={"primary"} type="submit">
                                                Login
                                            </Button>
                                        </div>
                                </form>
                              </div>
                              :
                              <div></div>
                          }
                          </Modal.Footer>
                  </Modal>
                  <Modal show={showEditProfileModal} onHide={this.hideEditProfileModal}>
                          <Modal.Header style={{fontWeight:800}} className="text-center">
                          {user.first_name}'s Profile
                          </Modal.Header>
                          <form>
                          <Modal.Body>
                          <div className="row" style={{borderBottom:'1px dashed #dddddd'}}>
                          <div className="col col-sm-3 col-md-offset-3">
                            <div style={{marginTop:12,fontWeight:600}}>
                              First Name:
                            </div>
                          </div>
                          <div className="col col-sm-3">
                                <FormGroup style={{marginTop:5}}
                                          controlId="first_name"
                                      >
                                          <FormControl
                                              type="text"
                                              placeholder={user.first_name}
                                              onChange={e =>
                                                  this.handleInputChange(e, "userFirstName")}
                                          />
                                          <FormControl.Feedback/>
                                </FormGroup>
                              </div>
                            </div>
                            

                          </Modal.Body>
                          <Modal.Footer>
                          <div>
                            <button className="btn btn-danger">Cancel</button>
                            <button className="btn btn-primary">Save Changes</button>
                          </div>
                          </Modal.Footer>
                          </form>
                  </Modal>
              </div>
          }
      </div>
          </StyleRoot>
    );
  }
}
