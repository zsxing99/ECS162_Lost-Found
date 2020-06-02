import React from 'react';
import '../styles/App.css';
import Main from "./Main";
import { Button } from "antd";

import cover from "../assets/Shields-entrance_Credit-Hector-Villicana_1924x1282-960x600-c-center.jpg";
import google from "../assets/google.jpg";
import logo from "../assets/Logo.png";

class App extends React.Component {
  state = {
    loggedIn: false
  }

  render() {
    return (
        <div className="App">
            {this.state.loggedIn ?
                <Main /> :
                (
                    <div className="welcome-page">
                        <img id="welcome-img" src={cover} alt=""/>
                        <div className="login-page">
                            <img id="logo-img" src={logo} alt=""/>
                            <Button shape="round">
                              <img id="login-img" src={google} alt=""/>
                              Login with Google
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    )
  }
}

export default App;
