import React, { Component } from "react";
import ApiInstance from "../../js/utils/Api";
import "./css/main.css";
import {
    Modal,
    DropdownButton,
    MenuItem

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
      historyData:{},
      historyDate:"",
      showHistoryModal:false,
      historySelect:"Date Completed",
    };

    this.getUserChorePoints = this.getUserChorePoints.bind(this);
    this.getAvailableChoreList = this.getAvailableChoreList.bind(this);
    this.getUsersChoreList = this.getUsersChoreList.bind(this);
    this.showHistory = this.showHistory.bind(this);
    this.buttonFormatter = this.buttonFormatter.bind(this);
    this.setCompletedChore = this.setCompletedChore.bind(this);
    this.buttonFormatterClaim = this.buttonFormatterClaim.bind(this);
    this.setClaimedChore = this.setClaimedChore.bind(this);
    this.showHistoryModal = this.showHistoryModal.bind(this);
    this.closeHistoryModal = this.closeHistoryModal.bind(this);
    this.convertToDateReadable = this.convertToDateReadable.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.convertTimeToClockDisplay = this.convertTimeToClockDisplay.bind(this);
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

  showHistoryModal(data) {
      let date = this.convertToDateReadable(data['date_start']);
      this.setState({
            historyData: data,
            historyDate: date,
            showHistoryModal:true,
        })
  }

  closeHistoryModal() {
        this.setState({
            historyData:{},
            showHistoryModal:false,
        })
  }

  setCompletedChore(chore) {
        this.setState({
            loading:true,
        });
        Promise.resolve(Api.updateChore(chore, {
            id:chore,
            is_completed:true,
            completed_date: new Date(),
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

  convertToDateReadable(date) {
        //date is in YYYY-MM-DD format
      let monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      let d = date.split("-");
      let month = monthNames[d[1]];
      return month+" " + d[2] + ", " +d[0];

  }

  convertTimeToClockDisplay() {
      let t = this.state.historyData.completed_date;
      let dt = t.split("T");
      var time_array = dt[1].split("-");
      var ampm = "";
      if(parseInt(time_array[0]) > 12) {
          ampm = "PM"
      } else {
          ampm = "AM"
      }
      return  (
      <div>
          <div className="clock-num col col-sm-2">
              {time_array[0]}
          </div>
          <div className="clock-num col-col-sm-2">
              {time_array[1]}
          </div>
          <div className="ampm">
              {ampm}
          </div>
      </div>
      )
  }
  
  handleMenuChange(type) {
        this.setState({
            historySelect:type,
        })
  }

  buttonFormatter(cell,row) {
      return (<button className="btn btn-success btn-sm" onClick={() => {this.setCompletedChore(cell)}}>Completed?</button>)
  }
  buttonFormatterClaim(cell,row) {
      return (<button className="btn btn-warning btn-sm" onClick={() => {this.setClaimedChore(cell)}}>Claim</button>)
  }

  render() {
      const {loading,userProfile,family,chores,history, availableChores, showHistoryModal,historyData,historyDate,historySelect} = this.state;
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
                                        <div className="history-chore" onClick={() => this.showHistoryModal(chore)}>
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
              <Modal show={showHistoryModal} onHide={this.closeHistoryModal}>
                          <Modal.Header closeButton>
                              <div className="text-center">
                                  <Modal.Title><span style={{fontWeight:900}}> {historyData.name} on {historyDate}</span></Modal.Title>
                              </div>
                          </Modal.Header>
                          <Modal.Body>
                              <div className="row">
                                  <div className="col col-sm-4">
                                    <div className="panel panel-default panel-shadow">
                                     <div className="panel-heading text-center">
                                    <DropdownButton title={historySelect} id="bg-nested-dropdown">
                                          <MenuItem eventKey="1" onClick={() => this.handleMenuChange("Date Completed")}>Date Completed</MenuItem>
                                          <MenuItem eventKey="2" onClick={() => this.handleMenuChange("Date Redeemed")}>Date Redeemed</MenuItem>
                                    </DropdownButton>
                                     </div>
                                     <div className="panel-body">
                                         {historySelect === "Date Completed" ?
                                             <div>
                                                 {historyData.completed_date === null ?
                                                     <div className="text-center" style={{fontWeight:800}}>
                                                         <p>Not Completed</p>
                                                     </div>
                                                     :
                                                     <div>
                                                         {historyData.completed_date}
                                                     </div>
                                                 }
                                             </div>
                                             :
                                             <div>
                                              {historyData.redeemed_date === null ?
                                                     <div className="text-center" style={{fontWeight:800}}>
                                                         <p>Not Redeemed</p>
                                                     </div>
                                                     :
                                                     <div>
                                                      {historyData.redeemed_date}
                                                     </div>
                                                 }
                                             </div>
                                         }
                                     </div>
                                   </div>
                                  </div>
                              </div>
                              <div className="row">
                                  <div className="col col-sm-4">
                                    <div className="panel panel-default panel-shadow">
                                     <div className="panel-heading text-center">
                                        Points
                                     </div>
                                     <div className="panel-body text-center">
                                        <div className="point-display">
                                            {historyData.num_points}
                                        </div>
                                     </div>
                                   </div>
                                  </div>
                              </div>
                          </Modal.Body>

                  </Modal>
         </div>
    );
  }
}
