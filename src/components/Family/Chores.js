import React, { Component } from "react";
import ApiInstance from "../../js/utils/Api";
import "./css/main.css";
import {
  Button,
  Col,
  Navbar,
  Nav,
  NavItem
} from "react-bootstrap";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {GridLoader} from "react-spinners";

const Api = ApiInstance.instance;

export default class Chores extends Component {

    constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      family:{},
      chores: {},
      usersChores:{},
      availableChores:{},
      loading: true,
      history:[],
    };

    this.getUserChorePoints = this.getUserChorePoints.bind(this);
    this.getAvailableChoreList = this.getAvailableChoreList.bind(this);
    this.getUsersChoreList = this.getUsersChoreList.bind(this);
    this.showHistory = this.showHistory.bind(this);
    this.buttonFormatter = this.buttonFormatter.bind(this);
    this.setCompletedChore = this.setCompletedChore.bind(this);
    this.buttonFormatterClaim = this.buttonFormatterClaim.bind(this);
    this.setClaimedChore = this.setClaimedChore.bind(this);
  }

  componentDidMount() {
    if (Api.isAuthenticated()) {
      Promise.resolve(Api.getChores()).then(response=>{
        this.setState({
          userProfile: Api.userProfile,
          family: Api.user.family,
          chores: response,
          loading: false,
        });
      })

      Promise.resolve(Api.getUsersChores()).then(response=>{
        this.setState({
            usersChores: response,
        });
      })

      Promise.resolve(Api.getAvailableChores()).then(response=> {
          this.setState({
              availableChores: response,
          });
      })

    } else {
      this.props.router.push("/login");
    }
  }

  getUserChorePoints() {
      let chores = this.state.usersChores;
      let points = 0;
      for(let i = 0; i < chores.length; i++) {
        if(chores[i].is_completed) {
          points = points + chores[i].num_points;
        }
      }
      return points;
  }

  getAvailableChoreList() {
        let chores_list = [];
        for(let i =0 ; i < this.state.availableChores.length; i++) {
            if(!this.state.availableChores[i].is_completed) {
                chores_list.push(this.state.availableChores[i]);
            }
        }
        return chores_list;
    }

  getUsersChoreList() {
        let chores_list = [];
        for(let i =0 ; i < this.state.usersChores.length; i++) {
            if(!this.state.usersChores[i].is_completed) {
                chores_list.push(this.state.usersChores[i]);
            }
        }
        return chores_list;
  }


  showHistory() {
      if(document.getElementById("caret").className.indexOf("down") !== -1) {
        document.getElementById("caret").className = "fa fa-caret-right";
        this.setState({
            history:[],
        })
      } else {
        let chores = this.state.usersChores;
        let chore_list = [];
          for(let i = 0; i < chores.length; i++) {
            if(chores[i].is_completed) {
              chore_list.push(chores[i]);
            }
          }
          document.getElementById("caret").className = "fa fa-caret-down";
          this.setState({
              history: chore_list,
          })
      }

  }

  setCompletedChore(chore) {
        this.setState({
            loading:true,
        });
        Promise.resolve(Api.updateChore(chore, {
            id:chore,
            is_completed:true
        })).then(response=> {
            this.componentDidMount();
            this.setState({
                loading:false
            })
        });
  }

  setClaimedChore(chore) {
      this.setState({
            loading:true,
        });
        Promise.resolve(Api.updateChore(chore, {
            id:chore,
            participants : [this.state.userProfile.id],
        })).then(response=> {
            this.componentDidMount();
            this.setState({
                loading:false
            })
        });
  }

  buttonFormatter(cell,row) {
      return (<button className="btn btn-success btn-sm" onClick={() => {this.setCompletedChore(cell)}}>Completed?</button>)
  }
  buttonFormatterClaim(cell,row) {
      return (<button className="btn btn-warning btn-sm" onClick={() => {this.setClaimedChore(cell)}}>Claim</button>)
  }

  render() {
      const {loading,userProfile,family,chores,history, availableChores} = this.state;

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
                   <div className="col col-sm-3">
                     <div className="row">
                       <div className="panel panel-default panel-shadow">
                         <div className="panel-heading">
                           Chore Points
                         </div>
                         <div className="panel-body">
                           <div className="point-display">
                               {this.getUserChorePoints()}
                           </div>
                           <button className="btn btn-sm btn-primary">Redeem</button>
                           <div className="history-bundle clickable" onClick={this.showHistory}>
                             <i id="caret" className="fa fa-caret-right" /> {"  "} History
                             <div>
                            {history.map((chore)=>
                                        <div style={{color:"grey",fontSize:12,textAlign:"left"}}>
                                            {chore.num_points} Points - {chore.name}
                                        </div>
                            )}
                            </div>
                           </div>
                         </div>
                       </div>
                     </div>
                     <div className="row">
                       <div className="panel panel-default panel-shadow chore-leaderboard">
                         <div className="panel-heading">
                           Leaderboard
                         </div>
                         <div className="panel-body">
                           <button className="btn btn-sm btn-primary">Redeem</button>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div className="col col-sm-4" style={{marginLeft: 45}}>
                     <div className="row">
                       <div className="panel panel-default panel-shadow">
                         <div className="panel-heading">
                           Available Chores
                         </div>
                         <div className="panel-body">
                           <div>
                            <BootstrapTable
                                      data={ this.getAvailableChoreList() }
                            >
                                      <TableHeaderColumn dataField='num_points' isKey>Points</TableHeaderColumn>
                                      <TableHeaderColumn dataField='name'>Chore</TableHeaderColumn>
                                      <TableHeaderColumn dataField='time'>Time</TableHeaderColumn>
                                      <TableHeaderColumn dataField="id" dataFormat={this.buttonFormatterClaim}>Action</TableHeaderColumn>
                            </BootstrapTable>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div className="col col-sm-4" style={{marginLeft: 45}}>
                     <div className="row">
                       <div className="panel panel-default panel-shadow">
                         <div className="panel-heading">
                             {userProfile.first_name}'s Chores
                         </div>
                         <div className="panel-body">
                             <BootstrapTable
                                      data={ this.getUsersChoreList() }
                            >
                                      <TableHeaderColumn dataField='num_points' isKey>Points</TableHeaderColumn>
                                      <TableHeaderColumn dataField='name'>Chore</TableHeaderColumn>
                                      <TableHeaderColumn dataField='time'>Time</TableHeaderColumn>
                                      <TableHeaderColumn dataField="id" dataFormat={this.buttonFormatter}>Action</TableHeaderColumn>
                            </BootstrapTable>
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
