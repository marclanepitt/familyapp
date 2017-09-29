import React, { Component } from "react";
import ApiInstance from "../../js/utils/Api";
import "./css/main.css";
import { Button, Col, Navbar, Nav, NavItem, Row, Modal, FormGroup, FormControl } from "react-bootstrap";
import financePic from "./img/finance.png";

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
    };
    this.openChargeModal = this.openChargeModal.bind(this);
    this.closeChargeModal = this.closeChargeModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChargeSubmit = this.handleChargeSubmit.bind(this);
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
    const {family,userProfile,showChargeModal,posts,loading} = this.state;
    return (
      <div>
          {loading ?
              <div
                  className="overlay"
                  style={{display: loading ? "block" : "none"}}
              >
                  <div className="loader"/>
              </div>
              :
              <div>
                  <div id="main">
                      <div className="family-header" style={{backgroundImage: "url(" + family.cover_pic + ")"}}>
                          <div className="row">
                              <div className="col-md-2 col-md-offset-5" style={{paddingTop: 15}}>
                                  <div className="ratio img-responsive img-circle"
                                       style={{backgroundImage: "url(" + family.pro_pic + ")"}}/>
                              </div>
                          </div>
                          <div className="row" style={{marginBottom:10}}>
                              <h3 className="test">The {family.name} Family</h3>
                              <button onClick={this.openChargeModal} className="btn btn-sm btn-primary">New Charge
                              </button>
                              {'  '}
                              <button className="btn btn-sm btn-success">New Event</button>

                          </div>
                      </div>

                      <div className="board">
                          <div className="inner-board col col-md-9 col-md-offset-1">
                              <div className="board-element">
                                  {posts.map((post) =>
                                      <div className="post-background">
                                          <div>
                                              <div className="col col-sm-1">
                                               <div className="ratio img-responsive img-circle post-image"
                                                style={{backgroundImage: "url(" + post.charge.created_by.pro_pic + ")"}}/>
                                              </div>
                                              <div className="post-text">
                                              {post.charge.created_by.first_name} spent ${post.charge.amount} at {post.charge.location}
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
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
