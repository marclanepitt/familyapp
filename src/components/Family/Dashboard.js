import React, { Component } from "react";
import ApiInstance from "../../js/utils/Api";
import "./css/main.css";
import { Button, Col, Row, Modal, FormGroup, FormControl, Image } from "react-bootstrap";
import financePic from "./img/finance.png";
import { GridLoader, ClipLoader } from 'react-spinners';
import Scroll from 'react-scroll';
import {scroller} from 'react-scroll';

const Api = ApiInstance.instance;

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      userProfile: {},
      family:{},
      showChargeModal:false,
      chargeDescription:"",
      chargeType:"",
      chargeAmount:"",
      chargeLocation:"",
      posts:{},
      postSubmitText:"",
      postsLoading:false,
    };
    this.openChargeModal = this.openChargeModal.bind(this);
    this.closeChargeModal = this.closeChargeModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChargeSubmit = this.handleChargeSubmit.bind(this);
    this.handlePostSubmit = this.handlePostSubmit.bind(this);
  }

  componentDidMount() {
    Promise.resolve(Api.getPosts()).then(response => {

        this.setState({
            userProfile:Api.userProfile,
            family:Api.user.family,
            posts:response,
            loading:false,
        });
    });
  }

  handleInputChange(e, field) {
        const { state } = this;
        state[field] = e.target.value;
        this.setState(state);
  }

  handleChargeSubmit(e) {
      this.setState({
          loading:true,
      });
      e.preventDefault();
      e.stopPropagation();
      const { userProfile,chargeDescription,chargeType,chargeAmount,chargeLocation} = this.state;
        const data = {
            created_by: userProfile.id,
            description: chargeDescription,
            charge_type: chargeType,
            amount: chargeAmount,
            location:chargeLocation,
        };
        const onSuccess = response => {
            Promise.resolve(Api.getPosts()).then(response => {
                this.setState({
                        posts:response,
                        loading:false,
                    });
                });
            this.closeChargeModal()
        };

        const onError = err => {
            this.setState({
                loading:false,
            })
        };
        const response = Api.createCharge(data, onSuccess, onError);
  }

  handlePostSubmit(e) {
    this.setState({
      postsLoading:true,
    });
    e.preventDefault();
    e.stopPropagation();
    const { postSubmitText, userProfile, family } = this.state;
    const data = {
      message : postSubmitText,
      family : [family.id,],
      posted_by : userProfile.id,
    }

    const onSuccess = response => {
      this.componentDidMount();
      this.setState({
        postsLoading: false,
      });
    }

    const onError = err => {
      this.setState({
        postsLoading:false,
      })
    }

    Api.createPost(data,onSuccess,onError);
  }

  closeChargeModal() {
      this.setState({
          showChargeModal:false
      })
  }

  openChargeModal() {
      this.setState({
          showChargeModal:true
      })
  }



  render() {
    const {family,userProfile,showChargeModal,posts,loading,postsLoading} = this.state;
    return (
      <div>
          {loading ?
                <div className="col-sm-2 col-sm-offset-5 loader"
                >
                  <GridLoader
                  color={'#102C58'}
                  loading={loading}
                />
                </div>
              :
              <div>
                      <div className=" row family-header" style={{backgroundImage: "url(" + family.cover_pic + ")",paddingBottom:20}}>
                          <div className="row">
                              <div className="col-md-2 family-header-pic" style={{paddingTop: 15}}>
                                  <div className="image-border">
                                    <Image id="family-pro-pic" src={family.pro_pic} circle responsive/>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="row" style={{paddingTop:16}}>
                        <div className="col col-sm-2">
                          <div className="panel panel-default panel-shadow">
                             <div className="panel-heading">
                               Toolbox <i className="fa fa-briefcase"/>
                             </div>
                             <div className="panel-body toolbox-body">
                             <div className="row">
                              <button className="btn btn-sm btn-primary">Chores <i className="fa fa-caret-right"/></button>
                              </div>
                            <div className="row">
                              <button className="btn btn-sm btn-primary">Finances  <i className="fa fa-caret-right"/></button>
                              </div>
                            <div className="row">
                              <button className="btn btn-sm btn-primary">Events  <i className="fa fa-caret-right"/></button>
                                  </div>
                                </div>
                               </div>
                          </div>
                    <div className="col col-sm-8">
                          <div className="panel panel-default panel-shadow">
                             <div className="panel-body posts-body">
                             <div className = "post-form row">
                              <div className="col col-sm-1">
                                <Image style={{marginTop:13}}src={userProfile.pro_pic} responsive circle/>
                              </div>
                            <form onSubmit = {this.handlePostSubmit}>
                                <input onChange={e => this.handleInputChange(e, "postSubmitText")} className="col col-sm-9 post-text-input" type="text" name="post-text" placeholder="Post to the family... (Pro Tip: You can tag a user using the @ key)"/>
                                <div className="col col-sm-1">
                                  <div className = "row form-icon">
                                    <i className="fa fa-picture-o"/>
                                  </div>
                                  <div className = "row form-icon">                                  
                                    <i className="fa fa-paperclip"/>
                                  </div>
                                </div>
                                <div className="col col-sm-1 post-btn-wrapper">
                                  <button className="btn post-btn btn-primary" type="submit">Post</button>
                                </div>
                            </form>
                             </div>
                            <div className="posts-wrapper">
                            {postsLoading ?
                                <div className="col-sm-2 col-sm-offset-5" style={{marginTop:45}}
                                >
                                  <ClipLoader
                                  color={'#102C58'}
                                  loading={postsLoading}
                                />
                                </div>
                              :
                              <div>
                             {posts.map((post) =>
                                      <div className="post-outer">
                                        {post.message}
                                      </div>
                                  )}
                             </div>
                           }
                            </div>
                            </div>
                      </div>
                      </div>
                      <div className = "col col-sm-2 ">
                          <div className="panel panel-default panel-shadow">
                             <div className="panel-heading">
                               Next Event
                             </div>
                             <div className="panel-body event-preview">
                                </div>
                              </div>
                        </div>
                      <div className = "col col-sm-2 ">
                          <div className="panel panel-default panel-shadow">
                             <div className="panel-body slideshow-body">
                                </div>
                              </div>
                        </div> 
                      </div>
                      <div className="row">
                      <div className="arrow-circle">
                        <i className="fa fa-arrow-down"/>
                      </div>
                      </div>                         
                  <Modal show={this.state.showChargeModal} onHide={this.closeChargeModal}>
                      <form onSubmit={this.handleChargeSubmit}>
                          <Modal.Header closeButton>
                              <div className="text-center">
                                  <Modal.Title>New Charge</Modal.Title>
                              </div>
                          </Modal.Header>
                          <Modal.Body>
                              <div className="text-center">
                                  <FormGroup
                                      controlId="description"
                                  >
                                      <FormControl
                                          type="text"
                                          placeholder="Enter Description"
                                          onChange={e =>
                                              this.handleInputChange(e, "chargeDescription")}
                                      />
                                      <FormControl.Feedback/>
                                  </FormGroup>
                                  <FormGroup controlId="type">
                                      <FormControl componentClass="select" placeholder="Select Type"
                                                   onChange={e => this.handleInputChange(e, "chargeType")}>
                                          <option value="select">Select Type</option>
                                          <option value="FO">Food</option>
                                          <option value="CL">Clothing</option>
                                          <option value="EN">Entertainment</option>
                                          <option value="O">Other</option>
                                      </FormControl>
                                  </FormGroup>
                                  <FormGroup
                                      controlId="amount"
                                  >
                                      <FormControl
                                          type="number"
                                          placeholder="Enter Amount"
                                          onChange={e =>
                                              this.handleInputChange(e, "chargeAmount")}
                                      />
                                      <FormControl.Feedback/>
                                  </FormGroup>
                                  <FormGroup
                                      controlId="location"
                                  >
                                      <FormControl
                                          type="text"
                                          placeholder="Enter Location"
                                          onChange={e =>
                                              this.handleInputChange(e, "chargeLocation")}
                                      />
                                      <FormControl.Feedback/>
                                  </FormGroup>
                              </div>
                          </Modal.Body>
                          <Modal.Footer>
                              <div className="text-center">
                                  <Button bsStyle={"success"} type="submit">Create</Button>
                                  <Button bsStyle={"primary"} onClick={this.closeChargeModal}>Cancel</Button>
                              </div>
                          </Modal.Footer>
                      </form>
                  </Modal>
              </div>
          }
      </div>
    );
  }
}
