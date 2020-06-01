import React from 'react';
import '../styles/App.css';
import Main from "./Main";

class App extends React.Component {
  state = {
    loggedIn: false
  }


  render() {
    return this.state ?
        <Main /> : (
            <div className="welcome-page">

            </div>
        );
  }
}

export default App;
