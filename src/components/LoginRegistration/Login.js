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
import {GridLoader} from 'react-spinners';
import ApiInstance from "../../js/utils/Api";

const Api = ApiInstance.instance;

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            errors: "",
            error_display: "hide",
            loading: false

        };
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        if (Api.isAuthenticated()) {
            this.props.router.push("/profile");
        }
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
        this.setState({ loading: true });
        const { username, password } = this.state;
        const data = {
            username,
            password
        };
        const onSuccess = response => {
            const { token, user } = response.data;
            Api.store("uuid", token);
            this.props.router.push("/profile");
        };

        const onError = err => {
            this.setState({ loading: "" });
            this.setState({ errors: err.response.data.detail });
            this.setState({ error_display:""});
        };
        const response = Api.loginUser(data, onSuccess, onError);
        // Successful path
        // redirect to home page, store that token and the cookie

        // Error path
        // inactive account, invalid username pass
        // check if errors
        this.setState({ errors: response.data });
        return false;
    }

    render() {
        const { username, password, errors, loading } = this.state;
        return (
            <div>
                <br />
                <div className = "row">
                <div className="left col col-sm-6">
                    <h1 style={{marginTop:200}}>Add Images and whatever of all the stuff the app can do here</h1>
                </div>
                    <div className="col col-sm-6" style={{marginBottom:15}}>
                      <Alert bsStyle="danger" className = {this.state.error_display}>
                        <strong>Oops!</strong> {this.state.errors}
                      </Alert>
                        <br />

                        <div className="login-div col col-sm-4 col-md-offset-4 ">
                            {loading ?
                                <div
                                    className="loader"
                                >
                                    <GridLoader
                                       color={'#102C58'}
                                        loading={loading}
                                    />
                                </div> :
                                <div>
                                    <h2>Family App </h2>
                                    <h4>Sign Into Your Account</h4>
                                    <form
                                        onSubmit={this.handleOnSubmit}
                                    >
                                        <FormGroup
                                            controlId="username"
                                        >
                                            <FormControl
                                                type="text"
                                                placeholder="Enter Email"
                                                onChange={e =>
                                                    this.handleInputChange(e, "username")}
                                            />
                                            <FormControl.Feedback/>
                                        </FormGroup>
                                        <FormGroup
                                            controlId="password"
                                        >
                                            <FormControl
                                                type="password"
                                                placeholder="Enter Password"
                                                onChange={e =>
                                                    this.handleInputChange(e, "password")}
                                            />
                                            <FormControl.Feedback/>
                                        </FormGroup>
                                        <div className="text-center">
                                            <Button bsStyle={"primary"} type="submit">
                                                Login
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            }
                        </div>

                    </div>
                        <div className="text-center">
                            <p>
                                {" "}Don't have an account? Sign up{" "}
                                <Link to="register"> here!</Link>
                            </p>
                        </div>
            </div>
            </div>
        );
    }
}
