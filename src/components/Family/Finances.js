import React, { Component } from "react";
import ApiInstance from "../../js/utils/Api";
import "./css/main.css";
import {
  Button,
  Col,
  Navbar,
  Nav,
  NavItem,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";

const Api = ApiInstance.instance;

export default class Finances extends Component {
    constructor(props) {
    super(props);
    this.state = {
      userProfile: Api.userProfile,
      family:Api.user.family,
      charges:{},
      userCharges:[],
        loadingFinances:true,
    };
  }

  componentDidMount() {
        Promise.resolve(Api.getCharges()).then(response => {
            var userCharges = [];
            for(var i =0; i < response.length; i++) {
                if(response[i].created_by.id == this.state.userProfile.id) {
                    userCharges.push(response[i]);
                }
            }
            this.setState({
                charges: response,
                loadingFinances:false,
                userCharges:userCharges,
            })
        });
  }


  render() {
      const {charges,family,userProfile,userCharges,loadingFinances} = this.state;
    return (
      <div className="container">
          {loadingFinances ?
              <div
                  className="overlay"
                  style={{display: loadingFinances ? "block" : "none"}}
              >
                  <div className="loader"/>
              </div>
              :
              <div>
                  <br/>
                  <h1> Finances </h1>
                  <div className="row">
                      <div className="col col-sm-6">
                          <h3>{userProfile.first_name}'s Finances</h3>
                             {userCharges.map((charge)=>
                                 <h4>{charge.description}</h4>
                              )}
                      </div>
                      <div className="col col-sm-6">
                          <h3>{family.name}'s Finances</h3>
                           {charges.map((charge)=>
                                 <h4>{charge.description}</h4>
                              )}
                      </div>
                  </div>
              </div>
          }
      </div>
    );
  }
}
