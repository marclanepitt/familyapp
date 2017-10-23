import React, { Component } from "react";
import ApiInstance from "../../js/utils/Api";
import "./css/main.css";
import {
    Modal,
    DropdownButton,
    MenuItem,
    Image,
    ProgressBar,

} from "react-bootstrap";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {GridLoader} from "react-spinners";
import { isEmpty } from 'lodash';
import { bounce, slideInDown,swing,slideOutLeft } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import pinPic from "../../img/pin.png";

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
  }
}

const Api = ApiInstance.instance;

export default class Chores extends Component {

    constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      userProfilePoints:Api.userProfile.chore_points,
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
      leaderBoard:{},
      maxPointsLeaderBoard:1,
      showRedeemModal:false,
      choreRewards:[],
      showRedeemError:false,
      redeemErrorMessage:"",
      alertStyle:"",
      alertMessage:"",
      alertVisible:false,
      leaderboardIndex:0,
      leaderBoardLoading: false,
    };

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
    this.getTimeArray = this.getTimeArray.bind(this);
    this.showRedeemModal = this.showRedeemModal.bind(this);
    this.hideRedeemModal = this.hideRedeemModal.bind(this);
    this.redeemChore = this.redeemChore.bind(this);
    this.hideRedeemError = this.hideRedeemError.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.handleLeaderboardPaginate = this.handleLeaderboardPaginate.bind(this);

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
      });

      Promise.resolve(Api.getUsersChores()).then(response=>{
        this.setState({
            usersChores: response,
        });
      });

      Promise.resolve(Api.getAvailableChores()).then(response=> {
          this.setState({
              availableChores: response,
          });
      });

      Promise.resolve((Api.getChoreLeaderBoard())).then(response=> {
          this.setState({
              leaderBoard:response,
              maxPointsLeaderBoard:response.results[0].max_points,
          })
      })

      Promise.resolve((Api.getChoreRewards())).then(response=> {
        this.setState({
          choreRewards:response,
        })
      })

    } else {
      this.props.router.push("/login");
    }
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

  redeemChore(reward) {
    if(reward.num_points > this.state.userProfilePoints) {
      this.setState({
        showRedeemError:true,
        redeemErrorMessage:"You do not have enough points for this reward"
      })
      return
    }
    this.setState({
      loading:true,
      showRedeemModal:false,

    })
    let data = {
      "id":reward.id,
      "is_redeemed":true,
    }
    Promise.resolve(Api.redeemChoreReward(reward.id,data)).then(response=> {
      if("response" in response) {
        this.setState({
          loading:false,
          alertVisible: true,
          alertStyle:"danger",
          alertMessage: "This reward has already been claimed!"
        })
      } else {
        this.setState({
          loading:false,
          userProfile:response.rewarded_to,
          userProfilePoints:response.rewarded_to.chore_points,
          alertVisible: true,
          alertStyle:"success",
          alertMessage: "Congratulations on redeeming "+ response.reward + ", " + response.created_by.first_name + " has been notified!"
        })
      }
    });
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

  showRedeemModal() {
    this.setState({
      showRedeemModal:true,
    })
  }

  hideRedeemModal() {
    this.setState({
      showRedeemModal:false,
    })
  }

  setCompletedChore(chore) {
        this.setState({
            loading:true,
        });
        Promise.resolve(Api.completeChore(chore.id)).then(response=> {
          this.componentDidMount()
            this.setState({
                loading:false,
                userProfilePoints: response[0].chore_points
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

  hideRedeemError() {
    this.setState({
      showRedeemError:false,
      redeemErrorMessage:"",
    })
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

    getTimeArray(time) {
        let t = time.split(":");
        if(parseInt(t[0]) > 12) {
            t[2] = "PM";
        } else {
            t[2] = "AM";
        }
        t[0] = ((t[0] + 11) % 12 + 1);
        if(parseInt(t[0]) < 10) {
          t[0] = "0" + t[0];
        }
        return t;
    }

  
  handleMenuChange(type) {
        this.setState({
            historySelect:type,
        })
  }

  handleAlertDismiss() {
     this.setState({
         alertVisible:false,
         alertMessage:"",
         alertStyle:"",
     })
  }

  handleLeaderboardPaginate(direction) {
      this.setState({
        leaderBoardLoading:true,
      })
      let url = "";
      if(direction === "f") {
        if(this.state.leaderBoard.next === null) {
          return
        } else {
        url = this.state.leaderBoard.next;
        }
      } else {
        if(this.state.leaderBoard.previous === null) {
          return
        } else {
          url = this.state.leaderBoard.previous;
        }     
      }
      Promise.resolve(Api.getLeaderBoardPaginate(url)).then(response=> {
        console.log(response.next == null);
         this.setState({
                leaderBoard:response,
                leaderBoardLoading:false,
              })
      })

  }

  buttonFormatter(cell,row) {
      return (<button className="btn btn-success btn-sm" onClick={() => {this.setCompletedChore(row)}}>Completed?</button>)
  }
  buttonFormatterClaim(cell,row) {
      return (<button className="btn btn-warning btn-sm" onClick={() => {this.setClaimedChore(cell)}}>Claim</button>)
  }

  render() {

      const {loading,userProfile,family,chores,history, availableChores, showHistoryModal,historyData,historyDate,historySelect,maxPointsLeaderBoard,showRedeemModal, choreRewards,
        showRedeemError,redeemErrorMessage,alertMessage,alertStyle, alertVisible, userProfilePoints, leaderBoardLoading} = this.state;
      const leaderBoard = this.state.leaderBoard.results;
      var alertClass = "main-alert alert alert-" + alertStyle;
      var rewardCheck = false;
        for(let i = 0 ; i < this.state.choreRewards; i++) {
          if(choreRewards[i].is_redeemed = true) {
            rewardCheck = true;
            break;
          }
        }
    return (
     <StyleRoot>
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
                 {alertVisible ?
                        <div className={alertClass}>
                            {alertMessage}
                            <button type="button" className="close" onClick={this.handleAlertDismiss}>
                              <span aria-hidden="true">&times;</span>
                            </button>
                        </div> :
                        <div></div>
                    }
                   <div className="col col-sm-3">
                     <div className="row">
                       <div className="panel panel-default panel-shadow">
                         <div className="panel-heading">
                           Chore Points
                         </div>
                         <div className="panel-body">
                           <div className="point-display">
                               {userProfilePoints}
                           </div>
                           <button className="btn btn-sm btn-primary" onClick={this.showRedeemModal}>Redeem</button>
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
                          Overall Leaders
                         </div>
                         <div className="panel-body" >
                         {leaderBoardLoading ?
                          <div/>
                          :
                          <div>
                          {leaderBoard.map((user) =>
                              <div className="row"  style={{marginTop:5}}>
                                  <div className="col col-sm-3" style={{marginTop:-9}}>
                                    <Image src={user.user.pro_pic} circle responsive/>
                                  </div>
                                  <div className="col col-sm-6">
                                      <ProgressBar bsStyle={"success"} now={(user.num_points/maxPointsLeaderBoard)*100} />
                                  </div>
                                  <div className="col col-sm-2" style={{fontWeight:800}}>
                                      {user.num_points}
                                  </div>
                              </div>
                            )
                           }
                           {this.state.leaderBoard.previous == null ?
                          <div className="paginate-arrow-forward leaderboard-arrow-forward" onClick={() => this.handleLeaderboardPaginate('f')}/>
                          :
                          <div/>
                          }
                          {this.state.leaderBoard.next == null ?
                          <div className="paginate-arrow-back leaderboard-arrow-back" onClick={() => this.handleLeaderboardPaginate('b')}/>
                          :
                          <div/>
                        }
                         </div>
                       }
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
             {historyData.created_by !== undefined ?
                 <Modal show={showHistoryModal} onHide={this.closeHistoryModal}>
                     <Modal.Header closeButton>
                         <div className="text-center">
                             <Modal.Title><span style={{fontWeight: 900}}> {historyData.name} on {historyDate}</span></Modal.Title>
                             <p>Created by {historyData.created_by.first_name}</p>
                         </div>
                     </Modal.Header>
                     <Modal.Body>
                         <div className="row">
                             <div className="col col-sm-4">
                                 <div className="panel panel-default panel-shadow">
                                     <div className="panel-heading text-center">
                                         <DropdownButton title={historySelect} id="bg-nested-dropdown">
                                             <MenuItem eventKey="1"
                                                       onClick={() => this.handleMenuChange("Date Completed")}>Date
                                                 Completed</MenuItem>
                                             <MenuItem eventKey="2"
                                                       onClick={() => this.handleMenuChange("Date Redeemed")}>Date
                                                 Redeemed</MenuItem>
                                         </DropdownButton>
                                     </div>
                                     <div className="panel-body">
                                         {historySelect === "Date Completed" ?
                                             <div>
                                                 {historyData.completed_date === null ?
                                                     <div className="text-center" style={{fontWeight: 800}}>
                                                         <p>Not Completed</p>
                                                     </div>
                                                     :
                                                     <div>
                                                         {this.convertToDateReadable(historyData.completed_date.split("T")[0])}
                                                         <div className="text-center">
                                                         <div className="col col-sm-4 time-display time-display-hour">
                                                             <p className="time-hour">
                                                                 {this.getTimeArray(historyData.completed_date.split("T")[1])[0]}
                                                             </p>
                                                         </div>
                                                             <div className="col col-sm-1 colon-time">
                                                                 :
                                                             </div>
                                                         <div className="col col-sm-4 time-display time-display-minutes">
                                                             <p className="time-minutes">
                                                                 {this.getTimeArray(historyData.completed_date.split("T")[1])[1]}
                                                             </p>
                                                         </div>
                                                         <div className="col col-sm-1 ampm">
                                                                 {this.getTimeArray(historyData.completed_date.split("T")[1])[2]}
                                                         </div>
                                                     </div>
                                                     </div>
                                                 }
                                             </div>
                                             :
                                             <div>
                                                 {historyData.redeemed_date === null ?
                                                     <div className="text-center" style={{fontWeight: 800}}>
                                                         <p>Not Redeemed</p>
                                                     </div>
                                                     :
                                                     <div>
                                                         {this.convertToDateReadable(historyData.redeemed_date.split("T")[0])}
                                                         <div className="text-center">
                                                         <div className="col col-sm-4 time-display time-display-hour">
                                                             <p className="time-hour">
                                                                 {this.getTimeArray(historyData.redeemed_date.split("T")[1])[0]}
                                                             </p>
                                                         </div>
                                                             <div className="col col-sm-1 colon-time">
                                                                 :
                                                             </div>
                                                         <div className="col col-sm-4 time-display time-display-minutes">
                                                             <p className="time-minutes">
                                                                 {this.getTimeArray(historyData.redeemed_date.split("T")[1])[1]}
                                                             </p>
                                                         </div>
                                                         <div className="col col-sm-1 ampm">
                                                                 {this.getTimeArray(historyData.redeemed_date.split("T")[1])[2]}
                                                         </div>
                                                     </div>
                                                     </div>
                                                 }
                                             </div>
                                         }
                                     </div>
                                 </div>
                             </div>
                             <div className="col col-sm-4">
                                 <div className="panel panel-default panel-shadow">
                                     <div className="panel-heading text-center">
                                         Participants
                                     </div>
                                     <div className="panel-body text-center">
                                         {historyData.participants === undefined || historyData.participants === null || isEmpty(historyData.participants) ?
                                             <div>No Participants</div>
                                             :
                                             <div className="participants-display" style={{marginTop: -10}}>
                                                 {historyData.participants.map((user) =>
                                                     <div className="participant-wrapper row" style={{marginTop: 10}}>
                                                         <div className="col col-sm-5">
                                                             <Image src={user.pro_pic} circle responsive/>
                                                         </div>
                                                         <div className="col col-sm-5"
                                                              style={{paddingTop: 8, fontWeight: 700}}>
                                                             {user.first_name}
                                                         </div>
                                                     </div>
                                                 )}
                                             </div>
                                         }
                                     </div>
                                 </div>
                             </div>
                             <div className="col col-sm-4">
                                 <div className="panel panel-default panel-shadow">
                                     <div className="panel-heading text-center">
                                         Pets
                                     </div>
                                     <div className="panel-body text-center">
                                         {historyData.pets === undefined || historyData.pets === null || isEmpty(historyData.pets) ?
                                             <div>No Pets were involved in this chore</div>
                                             :
                                             <div className="participants-display" style={{marginTop: -10}}>
                                                 {historyData.pets.map((pet) =>
                                                     <div className="participant-wrapper row" style={{marginTop: 10}}>
                                                         <div className="col col-sm-5">
                                                             <Image src={pet.pro_pic} circle responsive/>
                                                         </div>
                                                         <div className="col col-sm-5"
                                                              style={{paddingTop: 8, fontWeight: 700}}>
                                                             {pet.name}
                                                         </div>
                                                     </div>
                                                 )}
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

                 :
                 <div/>
             }
              <Modal show={showRedeemModal} onHide={this.hideRedeemModal}>
                     <Modal.Body>
                     <i className="fa fa-sign-out exit-modal" onClick={this.hideRedeemModal}/>
                     <div className="shop-pin">
                        <Image src={pinPic} responsive/>
                     </div>
                     <div className="text-center shop-wrapper">
                     <div className="shop-title">The {family.name} Shop</div>
                     </div>
                     {showRedeemError ?
                        <div className="alert alert-danger">
                            {redeemErrorMessage}
                            <button type="button" className="close" onClick={this.hideRedeemError}>
                              <span aria-hidden="true">&times;</span>
                            </button>
                        </div> :
                        <div></div>
                      }
                       <div className="row">
                    {rewardCheck ?
                      <div>
                      {choreRewards.map((reward)=>
                        {!reward.is_redeemed ?
                          <div className="col col-sm-4">
                                 <div className="panel panel-default panel-shadow">
                                     <div className="panel-heading text-center">
                                         {reward.num_points} Points
                                     </div>
                                     <div className="panel-body text-center">
                                         <div className="point-display">
                                              {reward.reward}
                                         </div>
                                        <button className="btn btn-sm btn-warning" onClick={() => this.redeemChore(reward)}>Claim</button>
                                     </div>
                                 </div>
                             </div>
                             :
                             <div>
                             </div>
                           }
                        )}
                      </div>
                      :
                      <div className="no-rewards">
                        <div > There are no rewards currently <i className="fa fa-frown-o"/></div>
                        <div className="btn btn-sm btn-primary" style={{marginLeft:66,marginTop:7}}>Ask for Reward</div>
                      </div>  
                    }
                      </div>
                     </Modal.Body>

                 </Modal>
         </div>
         </StyleRoot>
    );
  }
}
