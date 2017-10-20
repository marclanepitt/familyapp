import React, { Component } from "react";
import ApiInstance from "../../js/utils/Api";
import "./css/main.css";
import {
  Button,
  Col,
  Navbar,
  Nav,
  NavItem,
    Modal,
    FormGroup,
    FormControl,
    Image,
} from "react-bootstrap";
import {GridLoader} from 'react-spinners';

const Api = ApiInstance.instance;

export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
          userProfile: Api.userProfile,
          family:Api.user.family,
          nonAdmins:[],
          loading: false,
          showPetModal: false,
          petName:"",
          petType:"",
          petBday:"",
          petPic:"",
        };
        this.openPetModal = this.openPetModal.bind(this);
        this.closePetModal = this.closePetModal.bind(this);
        this.handlePetSubmit = this.handlePetSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        if(this.state.userProfile.admin.indexOf("DE") !== -1) {
            this.props.router.push("/app/");
        }
        let nonAdmins = [];
        for(let i = 0; i < this.state.family.users.length; i++) {
            if(this.state.family.users[i].admin.indexOf("DE") !== -1) {
                nonAdmins.push(this.state.family.users[i])
            }
        }
        this.setState({
            nonAdmins: nonAdmins,
        })
    }

    openPetModal() {
        this.setState({
            showPetModal:true,
        })
    }
    closePetModal() {
        this.setState({
            showPetModal:false,
        })
    }

    handleInputChange(e, field) {
        const { state } = this;
        state[field] = e.target.value;
        this.setState(state);
    }

    handlePetSubmit(e) {
          this.setState({
              loading:true,
          });
          e.preventDefault();
          e.stopPropagation();
          const formData = new FormData();

          const { petName,petType,petBday,petPic,family} = this.state;

          formData.append("name",petName);
          formData.append("pet_choice",petType);
          formData.append("pro_pic",petPic);
          formData.append("date_of_birth",petBday);
          formData.append("family",family);

            const onSuccess = response => {
                    this.setState({
                            loading:false,
                        });
                this.closePetModal();
            };

            const onError = err => {
                this.setState({
                    loading:false,
                })
            };
            const response = Api.createPet(formData, onSuccess, onError);
      }

  render() {
      const {showPetModal, loading, family, nonAdmins} = this.state;

    return (

      <div>
          {loading ?
              <div className="loader"
              >
                  <GridLoader
                      color={'#36d7b7'}
                      loading={loading}
                  />
              </div>
              :
              <div>
                  <div className="row">
                                     <div className="panel panel-default panel-shadow">
                         <div className="panel-heading">
                            Admin Actions
                         </div>
                         <div className="panel-body">
                             <button className="btn btn-lg btn-success" onClick={this.openPetModal}>Add Pet</button>
                             <button className="btn btn-lg btn-success" onClick={this.openPetModal}>Add Pet</button>
                             <button className="btn btn-lg btn-success" onClick={this.openPetModal}>Add Pet</button>
                             <button className="btn btn-lg btn-success" onClick={this.openPetModal}>Add Pet</button>
                             <button className="btn btn-lg btn-success" onClick={this.openPetModal}>Add Pet</button>

                         </div></div>
                  </div>
                  <div className="row">
                      {nonAdmins.map((user)=>
                                <div className="col col-sm-3">
                                     <div className="panel panel-default panel-shadow">
                         <div className="panel-heading" style={{maxHeight:60,overflowY:"hidden"}}>
                             <div className="row">
                                 <div className="col col-sm-3">
                                     <Image src={user.pro_pic} circle responsive/>
                                 </div>
                                 <div className="col col-sm-6 text-center" style={{fontSize:26,fontWeight:800}}>
                                 {user.first_name}
                                 </div>
                             </div>
                         </div>
                         <div className="panel-body">
                            <div className="admin-panel-header">
                                Finances
                            </div>
                             <div className="user-attribute">
                                 Budget: {user.budget_amount}
                             </div>
                         </div>
                            </div>
                                </div>
                      )}
                  </div>



                  <Modal show={showPetModal} onHide={this.closePetModal}>
                      <form onSubmit={this.handlePetSubmit}>
                          <Modal.Header closeButton>
                              <div className="text-center">
                                  <Modal.Title>Add Your Furry Friend</Modal.Title>
                              </div>
                          </Modal.Header>
                          <Modal.Body>
                              <div className="text-center">
                                  <FormGroup
                                      controlId="name"
                                  >
                                      <FormControl
                                          type="text"
                                          placeholder="Enter Name"
                                          onChange={e =>
                                              this.handleInputChange(e, "petName")}
                                      />
                                      <FormControl.Feedback/>
                                  </FormGroup>
                                  <FormGroup controlId="type">
                                      <FormControl componentClass="select" placeholder="Select Type"
                                                   onChange={e => this.handleInputChange(e, "petType")}>
                                          <option value="select">Select Type</option>
                                          <option value="DO">Dog</option>
                                          <option value="CA">Cat</option>
                                      </FormControl>
                                  </FormGroup>
                                  <FormGroup
                                      controlId="bday"
                                  >
                                      <FormControl
                                          type="date"
                                          placeholder="Enter Birthday"
                                          onChange={e =>
                                              this.handleInputChange(e, "petBday")}
                                      />
                                      <FormControl.Feedback/>
                                  </FormGroup>
                                  <FormGroup
                                      controlId="pro_pic"
                                  >
                                      <FormControl
                                          type="file"
                                          placeholder="Select Pro Pic"
                                          onChange={e =>
                                              this.handleInputChange(e, "petPic")}
                                      />
                                      <FormControl.Feedback/>
                                  </FormGroup>
                              </div>
                          </Modal.Body>
                          <Modal.Footer>
                              <div className="text-center">
                                  <Button bsStyle={"success"} type="submit">Create</Button>
                                  <Button bsStyle={"primary"} onClick={this.closePetModal}>Cancel</Button>
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
