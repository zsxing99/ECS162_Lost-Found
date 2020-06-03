import React, { useState } from 'react';
import '../styles/App.css';
import Main from "./Main";
import { Button } from "antd";

import cover from "../assets/Shields-entrance_Credit-Hector-Villicana_1924x1282-960x600-c-center.jpg";
import google from "../assets/google.jpg";
import logo from "../assets/Logo.png";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useHistory
} from "react-router-dom";

function App() {
    const [loggedIn, setLogin] = useState(false);
    const history = useHistory();
    const onClick = () => {
        // history.push("/auth/google")

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
                            <Button shape="round" onClick={onClick}>
                                <img id="login-img" src={google} alt=""/>
                                Login with Google
                            </Button>
                        </div>
                    </div>
                </Route>
                <Route exact path="/finder/post" component={Main}/>
                <Route exact path="/seeker/post" component={Main}/>
                <Route exact path="/home" component={Main} />
            </Switch>
        </Router>
    )
}

export default App;
