import React, { useState } from 'react';
import '../styles/App.css';
import Main from "./Main";
import { Button } from "antd";
import { IconFont } from "./Icons";

import cover from "../assets/images/Shields-entrance_Credit-Hector-Villicana_1924x1282-960x600-c-center.jpg";
import logo from "../assets/images/Logo.png";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useHistory
} from "react-router-dom";
import { loginService, prefix, proxyUrl, useProxy } from "../config";

function App() {
    const [loggedIn, setLogin] = useState(false);

    const onClick = () => {
        fetch(useProxy ? proxyUrl + prefix + loginService : prefix + loginService).then(
            res => {
                console.log(res);
            }
        )

        // for test purpose set loggedIn true
        setLogin(true)
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
                            <Button id="login-btn" shape="round" onClick={onClick} icon={<IconFont id="login-img" type="icon-google"/>}>
                                Login with Google
                            </Button>
                        </div>
                    </div>
                </Route>
                <Route exact path="/finder/post" component={Main}/>
                <Route exact path="/finder/search" component={Main}/>
                <Route exact path="/seeker/post" component={Main}/>
                <Route exact path="/seeker/search" component={Main}/>
                <Route exact path="/results" component={Main} />
                <Route exact path="/home" component={Main} />
            </Switch>
        </Router>
    )
}

export default App;
