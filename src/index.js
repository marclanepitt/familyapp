import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import App from "./components/App/App";
import Home from "./components/Home/Home";
import Email from "./components/LoginRegistration/UserEmail";
import Login from "./components/LoginRegistration/Login";
import LoginUser from "./components/LoginRegistration/LoginUser";
import Registration from "./components/LoginRegistration/Registration";
import Main from "./components/Family/Main";
import Dashboard from "./components/Family/Dashboard";
import Profile from "./components/Family/Profile";
import Finances from "./components/Family/Finances";
import Events from "./components/Family/Events";
import Admin from "./components/Family/Admin";
import Family from "./components/Family/Family";
import Chores from "./components/Family/Chores";
import registerServiceWorker from "./js/registerServiceWorker";
import "./css/index.css";
import "bootstrap/dist/css/bootstrap.css";

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path = "/" component = {App}>
            <IndexRoute component={Home} />
            <Route path="login" component={Login} />
            <Route path="profile" component={LoginUser}/>
            <Route path="register" component={Registration} />
            <Route path = "email" component={Email}/>
            <Route path = "app" component={Main}>
                <IndexRoute component={Dashboard}/>
                <Route path = "myprofile" component={Profile}/>
                <Route path = "finances" component={Finances}/>
                <Route path = "admin" component={Admin}/>
                <Route path = "events" component={Events}/>
                <Route path = "chores" component={Chores}/>
            </Route>
        </Route>
    </Router>,
    document.getElementById("root")
);
registerServiceWorker();
