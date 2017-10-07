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
  Popover,
  OverlayTrigger,

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
      const budgetPopover =   (<Popover id="popover-positioned-bottom" title="Budget Info">
          <div className="text-center">
          <p>Your budget is <strong>${userProfile.budget_amount}</strong> per <strong>{userProfile.budget_interval}</strong></p>
          <p> You've spent <strong>${userChargesTotal}</strong> this <strong>{userProfile.budget_interval}</strong></p>
              <p> You have <strong>${userProfile.budget_amount - userChargesTotal}</strong> left to spend!</p>
          </div>
                         </Popover>);
    return (
      <div className="container">
          {loadingFinances ?
                <div className="loader"
                >
                  <GridLoader
                  color={'#102C58'}
                  loading={loadingFinances}
                />
                </div>
              :
              <div>

                  <div className = "row">
                      <div className="panel panel-default panel-shadow">
					<div className="panel-heading">
						My Budget
                        {"  "}
                            <OverlayTrigger trigger="click" placement="bottom" overlay={budgetPopover}>
                        <i className="fa fa-info-circle clickable"/>
                            </OverlayTrigger>
                    </div>
					<div className="panel-body">
                              <ProgressBar bsStyle={"success"} now={budgetRatio} />
                    </div>
			    	</div>
                  </div>
                  <div className="row">
                      <div className="col col-sm-6">
                          <div className="panel panel-default panel-shadow charge-list">
                            <div className="panel-heading">
                                Recent Purchases <i className="fa fa-user"/>
                            </div>
                            <div className="panel-body">
                                {userCharges.map((charge)=>
                                        <div className="card-base">
                                            <div className="card-side">
                                                ${charge.amount}
                                            </div>
                                            <div className="card-body">
                                                <div className="card-body-header row">
                                                    <i className="fa fa-map-marker" style={{color:"#CC0000"}}/> {"  "}
                                                    {charge.location}
                                                </div>
                                                <div className="card-body-description row">
                                                    <i className="fa fa-info-circle"/> {"  "}
                                                    {charge.description}
                                                </div>

                                            </div>
                                        </div>
                                      )}
                            </div>
                          </div>
                      </div>
                      <div className="col col-sm-6">
                          <div className="panel panel-default panel-shadow charge-list">
                            <div className="panel-heading">
                                Family Purchases <i className="fa fa-users"/>

                            </div>
                            <div className="panel-body">
                                 {charges.map((charge)=>
                                        <div className="card-base">
                                            <div className="card-side">
                                                ${charge.amount}
                                            </div>
                                            <div className="card-body">
                                                <div className="card-body-header row">
                                                    <i className="fa fa-map-marker" style={{color:"#CC0000"}}/> {"  "}
                                                    {charge.location}
                                                </div>
                                                <div className="card-body-description row">
                                                    <i className="fa fa-info-circle"/> {"  "}
                                                    {charge.description}
                                                </div>

                                            </div>
                                        </div>
                                      )}
                            </div>
                          </div>
                      </div>
                  </div>
                  </div>
          }
      </div>
    );
  }
}
