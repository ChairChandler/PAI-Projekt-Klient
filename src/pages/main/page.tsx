import React from "react";
import Navbar from './navbar/pageNavbar'
import UpcomingTournamentsTable from './upcomingTournaments/upcomingTournaments'
import Logo from './logo/logo'
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

  private onLogout = () => {
    this.setState({ logged: false });
  }

  render = () => {
    return (
      <div>
        <nav>
          <Navbar
            onLogin={this.onLogin}
            onLogout={this.onLogout}>
          </Navbar>
        </nav>

        <Logo/>

        <section>
          <UpcomingTournamentsTable onTournamentClick={id => { alert(id)}}/>
        </section>
      </div>
    )
  }
}
