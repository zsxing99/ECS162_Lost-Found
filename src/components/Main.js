import React from 'react';
import { Button } from "antd";
import logo from "../assets/Logo.png";
import "../styles/Main.css";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    withRouter
} from "react-router-dom";
import FinderForum from "./FinderForum";
import SeekerForum from "./SeekerForum";

function Main() {
    const history = useHistory();

    const onClickHomePage = () => {
        history.push("/home");
        console.log("hello")
    }

    return (
        <div>
            <header>
                <div>
                    <img src={logo} alt="" onClick={onClickHomePage}/>
                </div>
            </header>
            <Router>
                <Switch>
                    <Route exact path="/finder" component={FinderForum}/>
                    <Route exact path="/seeker" component={SeekerForum}/>
                    <Route path="/home" component={Prompt} />
                </Switch>
            </Router>
        </div>
    )
}

function Prompt() {
    const history = useHistory();

    const onClickFinder = () => {
        history.push("/finder")
    }

    const onClickSeeker = () => {
        history.push("/seeker")
    }

    document.body.style.backgroundColor = "#b3c1d1";

    return (
        <div className="prompt">
            <div>
                <h2 className="prompt-text">
                    Did you find something?
                </h2>
                <Button onClick={onClickFinder} shape="round" id="finder-btn" type="text">
                    I'm a finder
                </Button>
            </div>
            <div>
                <h2 className="prompt-text">
                    Or are you looking for something?
                </h2>
                <Button onClick={onClickSeeker} shape="round" id="seeker-btn" type="text">
                    I'm a seeker
                </Button>
            </div>
        </div>
    );
}

export default Main;