import React from 'react';
import '../styles/App.css';
import Main from "./Main";
import { Button } from "antd";

import cover from "../assets/Shields-entrance_Credit-Hector-Villicana_1924x1282-960x600-c-center.jpg";
import google from "../assets/google.jpg";
import logo from "../assets/Logo.png";
import {
    BrowserRouter as Router,
    Route
} from "react-router-dom";

class App extends React.Component {
  state = {
    loggedIn: false
  }

  onClick = () => {
    // TODO: google Oauth
    console.log("hello")

    // for test purpose set loggedIn true
    this.setState({
      loggedIn: true
    })
  }

  render() {
    return (
        <Router>
          <div className="App">
            {this.state.loggedIn ?
                (
                    <Main/>
                ):
                (
                    <div className="welcome-page">
                        <img id="welcome-img" src={cover} alt=""/>
                        <div className="login-page">
                          <img id="logo-img" src={logo} alt=""/>
                          <Button shape="round" onClick={this.onClick}>
                            <img id="login-img" src={google} alt=""/>
                            Login with Google
                          </Button>
                        </div>
                    </div>
                )
            }
          </div>

        </Router>
    )
  }
}

export default App;
