import React from 'react';
import { Button } from "antd";
import logo from "../assets/Logo.png";
import "../styles/Main.css";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory
} from "react-router-dom";
import FinderForum from "./FinderForum";
import SeekerForum from "./SeekerForum";
import SearchForum from "./SearchForum";

function Main() {


    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path="/finder/post" component={FinderForum}/>
                <Route exact path="/finder/search">
                    <SearchForum type="F" />
                </Route>
                <Route exact path="/seeker/post" component={SeekerForum}/>
                <Route exact path="/seeker/search">
                    <SearchForum type="S" />
                </Route>
                <Route exact path="/home" component={Prompt} />
            </Switch>
        </Router>
    )
}


function Header() {
    const history = useHistory();

    const onClickHomePage = () => {
        history.push("/home");
    }

    return (
        <header>
            <div>
                <img src={logo} alt="" onClick={onClickHomePage}/>
            </div>
        </header>
    )
}

function Prompt() {
    const history = useHistory();

    const onClickFinder = () => {
        history.push("/finder/post")
    }

    const onClickSeeker = () => {
        history.push("/seeker/post")
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