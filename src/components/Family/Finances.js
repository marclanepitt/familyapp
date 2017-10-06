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
  ControlLabel,
  ProgressBar,
} from "react-bootstrap";
import { GridLoader } from 'react-spinners';


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
      budgetRatio: 0,
      userChargesTotal:0,
    };

    }

  componentDidMount() {
        Promise.resolve(Api.getCharges()).then(response => {
            var userCharges = [];
            for(var i =0; i < response.length; i++) {
                if(response[i].created_by.id === this.state.userProfile.id) {
                    userCharges.push(response[i]);
                }
            }
            var total = 0;
            for(var i = 0; i < userCharges.length; i++) {
                total = total + Number(userCharges[0].amount);
            }
            this.setState({
                charges: response,
                loadingFinances:false,
                userCharges:userCharges,
                userChargesTotal: total,
                budgetRatio:(total/Number(this.state.userProfile.budget_amount))*100,
            })
        });
  }


  render() {
      const {charges,family,userProfile,userCharges,loadingFinances,budgetRatio, userChargesTotal} = this.state;
    return (
      <div className="container">
          {loadingFinances ?
                <div className="loader"
                >
                  <GridLoader
                  color={'#36d7b7'}
                  loading={loadingFinances}
                />
                </div>
              :
              <div>
                  <br/>
                  <h1> Finances </h1>
                  <h2>Your budget is ${userProfile.budget_amount} per {userProfile.budget_interval}</h2>
                  <h3> You've spent ${userChargesTotal} this {userProfile.budget_interval}</h3>
                  <ProgressBar bsStyle={"success"} now={budgetRatio} />
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
