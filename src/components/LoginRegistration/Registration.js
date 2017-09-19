import React, { Component } from "react";
import { Link } from "react-router";
import "./css/Login.css";
import "../../css/index.css";
import ApiInstance from "../../js/utils/Api";
import {
  Col,
  Button,
  ButtonToolbar,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock
} from "react-bootstrap";
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import injectTapEventPlugin from 'react-tap-event-plugin';

const Api = ApiInstance.instance;
injectTapEventPlugin();


export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      password2: "",
      firstName: "",
      lastName: "",
      familyName: "",
      familyProPic: "",
      step: 1,
      errors: {},
      loading: "",
      stepIndex: 0
    };
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.backStep = this.backStep.bind(this);
  }


  handleInputChange(e, field) {
    const { state } = this;
    if(e.target.type === "file") {
      state[field] = e.target.files[0];
    } else {
      state[field] = e.target.value;
    }
    this.setState(state);
  }

  validateEmail() {
    if (this.state.errors.email) {
      return "error";
    }
    const input = this.state.email;
    if (input != "") {
      if (input[0] === "@") {
        return "error";
      } else {
        if (!input.includes("@")) {
          return "error";
        } else if (!input.includes(".edu")) {
          return "error";
        } else {
          return "success";
        }
      }
    }
  }

  validatePassword() {
    if (this.state.errors.password1) {
      return "error";
    }
    function hasNumber(myString) {
      return /\d/.test(myString);
    }
    const input = this.state.password;
    if (input != "") {
      if (input.length < 8) {
        return "error";
      } else {
        if (!hasNumber(input)) {
          return "warning";
        } else {
          return "success";
        }
      }
    }
  }

  validatePassword2() {
    if (this.state.errors.password2) {
      return "error";
    }
    const input = this.state.password2;
    const password = this.state.password;
    if (input != "" && password.length >= 8) {
      if (input != password) {
        return "error";
      } else {
        return "success";
      }
    }
  }

  validateOthers(field) {
    const { state } = this;
    if(this.state.errors[field]) {
      return "error";
    }
  }

  nextStep() {
    this.setState({ step: 2 });
  }
  backStep() {
    this.setState({ step: 1 });
  }

  handleOnSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    var formData = new FormData();
    this.setState({ loading: "overlay" });
    const {
      firstName,
      lastName,
      email,
      password,
      password2,
      familyName,
      familyProPic,
    } = this.state;
    const data = {
      email,
      password1: password,
      password2,
      first_name: firstName,
      last_name: lastName,
      family : {
        name: familyName,
        pro_pic: familyProPic,
      }
    };
    formData.append("email",email);
    formData.append("first_name",firstName);
    formData.append("last_name",lastName);
    formData.append("password1",password);
    formData.append("password2",password2);
    formData.append("family.pro_pic",familyProPic);
    formData.append("family.name",familyName);

    const onSuccess = response => {
      this.props.router.push("/email");
    };

    const onError = err => {
      this.setState({ loading: "" });
      this.setState({ errors: err.response.data });
      this.validatePassword2();
      this.validatePassword();
      this.validateEmail();
      this.validateOthers();
    };
    Api.registerUser(formData, onSuccess, onError);
    return false;
  }


  handleNext = () => {
    const {stepIndex} = this.state;
    if (stepIndex < 2) {
      this.setState({stepIndex: stepIndex + 1});
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  renderStepActions(step) {
    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label="Next"
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.handlePrev}
          />
        )}
      </div>
    );
  }

  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      password2,
      familyProPic,
      familyName,
      loading,
      stepIndex,
    } = this.state;
    return (
      <div>

        <div
          className="overlay"
          style={{ display: loading ? "block" : "none" }}
        >
          <div className="loader" />
        </div>
         <div style={{maxWidth: 500, maxHeight: 400, margin: 'auto'}}>
             <form id="form" className="login-form" onSubmit={this.handleOnSubmit}>
                <Stepper
                  activeStep={stepIndex}
                  linear={false}
                  orientation="vertical"
                >
                  <Step>
                    <StepButton onTouchTap={() => this.setState({stepIndex: 0})}>
                      Create Account
                    </StepButton>
                    <StepContent className="fixed-step-content">
                        <FormGroup
                        controlId="email"
                        validationState={this.validateEmail()}
                        >
                        <FormControl
                            name="email"
                          type="text"
                          value={email}
                          placeholder="Email"
                          onChange={e => this.handleInputChange(e, "email")}
                        />
                        <FormControl.Feedback />
                        <HelpBlock validationState={"error"}>
                          {this.state.errors.email}
                        </HelpBlock>
                      </FormGroup>
                      <FormGroup controlId="firstName" validationState={this.validateOthers('first_name')}>
                    <FormControl
                        name="first_name"
                      type="text"
                      value={firstName}
                      placeholder="First Name"
                      onChange={e => this.handleInputChange(e, "firstName")}
                    />
                    <FormControl.Feedback />
                    <HelpBlock validationState={"error"}>
                      {this.state.errors.first_name}
                    </HelpBlock>
                  </FormGroup>
                  <FormGroup controlId="lastName" validationState={this.validateOthers('last_name')}>
                    <FormControl
                        name="last_name"
                      type="text"
                      value={lastName}
                      placeholder="Last Name"
                      onChange={e => this.handleInputChange(e, "lastName")}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>
                      {this.state.errors.last_name}
                    </HelpBlock>
                  </FormGroup>
                      <FormGroup
                        controlId="password"
                        validationState={this.validatePassword()}
                      >
                        <FormControl
                            name="password1"
                          type="password"
                          value={password}
                          placeholder="Password"
                          onChange={e => this.handleInputChange(e, "password")}
                        />
                        <FormControl.Feedback />
                        <HelpBlock validationState={"error"}>
                          {this.state.errors.password1}
                        </HelpBlock>
                      </FormGroup>
                      <FormGroup
                        controlId="confirm_password"
                        validationState={this.validatePassword2()}
                      >
                        <FormControl
                            name="password2"
                          type="password"
                          value={password2}
                          placeholder="Confirm Password"
                          onChange={e => this.handleInputChange(e, "password2")}
                        />
                        <FormControl.Feedback />
                        <HelpBlock validationState={"error"}>
                          {this.state.errors.password2}
                        </HelpBlock>
                      </FormGroup>
                      {this.renderStepActions(0)}
                    </StepContent>
                  </Step>
                  <Step>
                    <StepButton onTouchTap={() => this.setState({stepIndex: 2})}>
                      Create Family
                    </StepButton>
                    <StepContent className="fixed-step-content">
                      <div style={{margin: '12px 0'}}>
                          <FormGroup
                        controlId="family_name"
                        validationState={this.validateOthers("family.name")}
                          >
                            <FormControl
                                name="family.name"
                              type="text"
                              value={familyName}
                              placeholder="Family Name"
                              onChange={e => this.handleInputChange(e, "familyName")}
                            />
                          </FormGroup>
                        <FormGroup
                        controlId="family_pic"
                        validationState={this.validateOthers("family.pro_pic")}
                          >
                            <FormControl
                                name="family.pro_pic"
                              type="file"
                              placeholder="Family Picture"
                              onChange={e => this.handleInputChange(e, "familyProPic")}
                            />
                          </FormGroup>
                        <div className = "row">
                        <RaisedButton
                          label="Register"
                          disableTouchRipple={true}
                          disableFocusRipple={true}
                          primary={true}
                          type="submit"
                        />
                        </div>
                        <br/>
                      </div>
                    </StepContent>
                  </Step>
                </Stepper>
             </form>
      </div>

            <div className="text-center">
              <br />
              <p>
                {" "}Already have an account? Login{" "}
                <Link to="login"> here!</Link>
              </p>
        </div>
      </div>
    );
  }
}
