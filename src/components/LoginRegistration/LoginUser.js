import React, { Component } from "react";
import { Link } from "react-router";
import "./css/Login.css";
import {
    Col,
    Button,
    ButtonToolbar,
    FormGroup,
    FormControl,
    ControlLabel,
    HelpBlock,
    Alert
} from "react-bootstrap";
import ApiInstance from "../../js/utils/Api";

const Api = ApiInstance.instance;

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfiles:{},
            password: "",
            errors: "",
            family:"",
            error_display: "hide",
            loading: true,
            selectedUser:"",
            selectedPic:"",
            showPasswordInput:false,
        };
        this.selectedUser = this.selectedUser.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }


  componentDidMount() {
      if (Api.isAuthenticated()) {
          Promise.resolve(Api.getUser()).then(response=> {
              Api.setUser(response);
              this.setState({
                  family: response.family,
                  userProfiles: response.family.users,
                  loading:false,
              });
          });
      } else {
      this.props.router.push("/login");
    }
  }

    selectedUser(user) {
        this.setState({selectedUser:user.id});
        this.setState({selectedPic:user.pro_pic});
        this.setState({showPasswordInput:true});
    }

    handleInputChange(e, field) {
        const { state } = this;
        state[field] = e.target.value;
        this.setState(state);
    }

    handleOnSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ error_display: "hide"});
        this.setState({ loading: "overlay" });
        const { selectedUser, password } = this.state;
        const data = {
            "id":selectedUser,
            password
        };
        const onSuccess = response => {
            Api.store("upid",selectedUser);
            this.props.router.push("/app");
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

    render() {
        const { username, password, errors, loading,userProfiles,selectedUser,showPasswordInput,selectedPic } = this.state;
        return (
            <div className="App">
      {loading ?
        <div
            className="overlay"
            style={{ display: loading ? "block" : "none" }}
        >
            <div className="loader" />
        </div>
        :
          <div>
              <div className="row">
               <div className="left col col-sm-6">
                    <h1 style={{marginTop:200}}>Add Images and whatever of all the stuff the app can do here</h1>
                </div>
                  <div className="right col col-sm-6">
              <h1> Please Select A Profile </h1>
              <div className="row">
              {userProfiles.map((user)=>
                  <div className="col-md-2">
                     <div onClick={() => this.selectedUser(user)} className="ratio img-responsive img-circle" style={{backgroundImage : "url("+user.pro_pic+")"}}/>
                      <h4>{user.first_name}</h4>
                  </div>
              )}
              </div>
                      {showPasswordInput ?
                  <div className="col col-sm-2 col-md-offset-5">
                      <div className="ratio img-responsive img-circle" style={{backgroundImage : "url("+selectedPic+")"}}/>
                      <br/>
                    <form onSubmit={this.handleOnSubmit}>
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
                  </div>
          </div>
          </div>
      }
      </div>
        );
    }
}
