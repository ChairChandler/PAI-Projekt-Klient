import React from "react";
import Navbar from 'pages/main/navbar/pageNavbar'
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

  private onLogin = (email: string, tokenMaxAge: number) => {
    setTimeout(() => {
      this.setState({ logged: false });
    }, tokenMaxAge);
    this.setState({ logged: true });
  }

  private onLogout = async () => {
    this.setState({ logged: false });
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
