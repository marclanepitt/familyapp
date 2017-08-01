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
const Api = ApiInstance.instance;

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      password2: "",
      firstName: "",
      lastName: "",
      institution: "",
      major: "",
      year: "",
      step: 1,
      institutions: null,
      majors: null,
      errors: {},
      loading: ""
    };
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.backStep = this.backStep.bind(this);
    this.getInstitutions = this.getInstitutions.bind(this);
    this.getMajors = this.getMajors.bind(this);
  }

  componentDidMount() {
    this.getInstitutions();
    this.getMajors();
  }

  handleInputChange(e, field) {
    const { state } = this;
    state[field] = e.target.value;
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

  getInstitutions() {
    Api.getInstitutions().then(response => {
      this.setState({ institutions: response.data });
    });
  }

  getMajors() {
    Api.getMajors().then(response => {
      this.setState({ majors: response.data });
    });
  }

  handleOnSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ loading: "overlay" });
    const {
      firstName,
      lastName,
      email,
      password,
      password2,
      institution,
      year,
      major
    } = this.state;
    const data = {
      email,
      password1: password,
      password2,
      first_name: firstName,
      last_name: lastName,
      user_profile: {
        institution: institution,
        year: year,
        major: [major]
      }
    };

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
    let response = Api.registerUser(data, onSuccess, onError);
    return false;
  }

  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      password2,
      institution,
      year,
      major,
      step,
      institutions,
      majors,
      loading
    } = this.state;
    return (
      <div>
        <div
          className="overlay"
          style={{ display: loading ? "block" : "none" }}
        >
          <div className="loader" />
        </div>
        <br />
        <div className="login-div">
          <div className="text-center">
            <br />
            <div className="title-div">
              <h1> Register </h1>
            </div>
          </div>
          <div className="inner-div">
            <br />
            <form className="login-form" onSubmit={this.handleOnSubmit}>

              {step === 1 &&
                <div id="step1">
                  <FormGroup
                    controlId="email"
                    validationState={this.validateEmail()}
                  >
                    <FormControl
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
                  <FormGroup
                    controlId="password"
                    validationState={this.validatePassword()}
                  >
                    <FormControl
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
                  <div className="text-center">
                    <Button
                      bsStyle="success"
                      onClick={() => {
                        this.nextStep();
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </div>}

              {step === 2 &&
                <div id="step2">
                  <FormGroup controlId="firstName" validationState={this.validateOthers('first_name')}>
                    <FormControl
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
                  <FormGroup controlId="institution" id="institution-group">
                    <FormControl
                      value={institution}
                      componentClass="select"
                      onChange={e => this.handleInputChange(e, "institution")}
                    >
                      <option value="">School</option>
                      {institutions.map(institution =>
                        <option value={institution.id}>
                          {institution.name}
                        </option>
                      )}
                    </FormControl>
                    <HelpBlock />
                  </FormGroup>
                  <FormGroup controlId="major" id="major-group">
                    <FormControl
                      value={major}
                      componentClass="select"
                      onChange={e => this.handleInputChange(e, "major")}
                    >
                      <option value="">Major</option>
                      {majors.map(major =>
                        <option value={major.id}>{major.major}</option>
                      )}
                    </FormControl>
                  </FormGroup>
                  <HelpBlock>
                    {/*this.state.errors.user_profile.major*/}
                  </HelpBlock>
                  <FormGroup controlId="year">
                    <FormControl
                      value={year}
                      componentClass="select"
                      onChange={e => this.handleInputChange(e, "year")}
                    >
                      <option value="">Year</option>
                      <option value="FR">Freshman</option>
                      <option value="SO">Sophomore</option>
                      <option value="JR">Junior</option>
                      <option value="SR">Senior</option>
                      <option value="GR">Graduate Student</option>
                      <option value="FC">Faculty</option>

                    </FormControl>
                    <HelpBlock>
                      {/*this.state.errors.user_profile.year*/}
                    </HelpBlock>
                  </FormGroup>
                  <ButtonToolbar>
                    <Button
                      bsStyle="warning"
                      onClick={() => {
                        this.backStep();
                      }}
                    >
                      Back
                    </Button>
                    <Button bsStyle="success" type="submit">Register</Button>
                  </ButtonToolbar>
                </div>}
            </form>
            <div className="text-center">
              <br />
              <p>
                {" "}Already have an account? Login{" "}
                <Link to="login"> here!</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
