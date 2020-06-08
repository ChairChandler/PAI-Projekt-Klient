import React from "react";
import PageNavbar from './navbar/navbar'
import UpcomingTournamentsTable from './content/upcomingTournaments/upcomingTournaments'
import Logo from './logo/logo'
import './style.css';
import { Redirect } from 'react-router-dom'
import FadingAnimation from 'components/fading/fading'

interface Props {
  detailsPagePath: string
}

interface State {
  logged: boolean
  redirect?: {
    path: string
    data: any
  }
}

export default class MainPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      logged: false
    }
  }

  private onLogin = (email: string, tokenMaxAge: number) => {
    setTimeout(() => {
      const state = { ...this.state }
      state.logged = false
      this.setState(state);
    }, tokenMaxAge);

    const state = { ...this.state }
    state.logged = true
    this.setState(state);
  }

  private onLogout = () => {
    const state = { ...this.state }
    state.logged = false
    this.setState(state);
  }

  private onRedirect = (path: string, data) => {
    const state = { ...this.state }
    state.redirect = { path, data }
    this.setState(state);
  }

  render = () => {
    if (this.state.redirect) {
      return <Redirect to={{
        pathname: this.state.redirect.path,
        state: this.state.redirect.data
      }}></Redirect>
    }

    return (
      <FadingAnimation>
        <nav>
          <PageNavbar
            onLogin={this.onLogin}
            onLogout={this.onLogout}>
          </PageNavbar>
        </nav>

        <Logo />

        <section>
          <UpcomingTournamentsTable onTournamentClick={id => this.onRedirect(this.props.detailsPagePath, {id})} />
        </section>
      </FadingAnimation>
    )
  }
}
