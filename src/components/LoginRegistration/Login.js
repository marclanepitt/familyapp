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
            username: "",
            password: "",
            errors: "",
            error_display: "hide",
            loading: ""

        };
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        if (Api.isAuthenticated()) {
            this.props.router.push("/app");
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
        this.setState({ loading: "overlay" });
        const { username, password } = this.state;
        const data = {
            username,
            password
        };
        const onSuccess = response => {
            const { token, user } = response.data;
            Api.store("uuid", token);
            this.props.router.push("/app");
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
                            <h1> Login </h1>
                        </div>
                    </div>
                    <div className="inner-div">
                      <Alert bsStyle="danger" className = {this.state.error_display}>
                        <strong>Oops!</strong> {this.state.errors}
                      </Alert>
                        <br />
                        <form
                            className="login-form"
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
                                <FormControl.Feedback />
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
                                <FormControl.Feedback />
                            </FormGroup>
                            <div className="text-center">
                                <Button bsStyle={"primary"} type="submit">
                                    Login
                                </Button>
                            </div>
                        </form>
                        <div className="text-center">
                            <br />
                            <br />
                            <p>
                                {" "}Don't have an account? Sign up{" "}
                                <Link to="register"> here!</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
