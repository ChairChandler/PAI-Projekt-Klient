import React from "react";
import Navbar from 'components/navbar/navbar'
import './style.css';

interface State {
  logged: boolean
}

export default class MainPage extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      logged: false
    }
  }

  private onLogin = () => {
    this.setState({logged: true});
  }

  private onLogout = () => {
    this.setState({logged: true});
  }

  render = () => {
    return (
      <div>
        <Navbar
          onLogin={this.onLogin}
          onLogout={this.onLogout}>
        </Navbar>

        <div className='logo-container'>
          <div className="logo"></div>
        </div>
      </div>
    )
  }
}
