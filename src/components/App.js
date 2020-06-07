import React, { useState } from 'react';
import '../styles/App.css';
import Main from "./Main";
import { Button, message } from "antd";
import { IconFont } from "./Icons";
import GoogleLogin from 'react-google-login';

import cover from "../assets/images/Shields-entrance_Credit-Hector-Villicana_1924x1282-960x600-c-center.jpg";
import logo from "../assets/images/Logo.png";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

function App() {
    const [loggedIn, setLogin] = useState(false);
    const handleLoginSuccess = (res) => {
        const profile = {...res.profileObj};
        if (profile.email.split("@")[1] !== "ucdavis.edu") {
            message.warning("Internal use. Please login with your UC Davis email");
            return;
        }

        setLogin(true);
    }

    return (
        <Router>
            {
                loggedIn ? <Redirect to="/home" /> : null
            }
            <Switch>
                <Route exact path="/">
                    <div className="welcome-page">
                        <img id="welcome-img" src={cover} alt=""/>
                        <div className="login-page">
                            <img id="logo-img" src={logo} alt=""/>
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                onFailure={(res) => {
                                    console.log(res);
                                    message.error("Login failed")
                                }}
                                clientId="986589100702-6t5vpb5d9v6aglpgedpn4d12hirmi785.apps.googleusercontent.com"
                                render={renderProps => (
                                    <Button id="login-btn" shape="round" onClick={renderProps.onClick} icon={<IconFont id="login-img" type="icon-google"/>}>
                                        Login with Google
                                    </Button>
                                )}
                                         />
                        </div>
                    </div>
                </Route>
                <Route exact path="/finder/post">
                    <Main loggedIn={loggedIn}/>
                </Route>
                <Route exact path="/finder/search">
                    <Main loggedIn={loggedIn}/>
                </Route>
                <Route exact path="/seeker/post">
                    <Main loggedIn={loggedIn}/>
                </Route>
                <Route exact path="/seeker/search">
                    <Main loggedIn={loggedIn}/>
                </Route>
                <Route exact path="/results">
                    <Main loggedIn={loggedIn}/>
                </Route>
                <Route exact path="/home">
                    <Main loggedIn={loggedIn}/>
                </Route>
            </Switch>
        </Router>
    )
}

export default App;
