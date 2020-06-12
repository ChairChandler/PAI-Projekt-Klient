import React from "react";
import PageNavbar from './navbar/navbar'
import UpcomingTournamentsTable from './content/upcomingTournaments/upcomingTournaments'
import Logo from './logo/logo'
import 'pages/style.css';
import { Redirect } from 'react-router-dom'
import FadingAnimation from 'components/fading/fading'
import * as pages from 'pages/pages'

interface State {
  redirect?: {
    path: string
    data: any
  }
}

export default class MainPage extends React.Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = {}
  }
  private onRedirect = (path: string, data = {}) => {
    const state = { ...this.state }
    const cp = data
    cp["src"] = pages.mainPagePath
    state.redirect = { path, data: cp }
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
            onManageClick={() => this.onRedirect(pages.managePagePath)}
          />
        </nav>

        <Logo />

        <section>
          <UpcomingTournamentsTable onTournamentClick={id => this.onRedirect(pages.detailsPagePath, { id })} />
        </section>
      </FadingAnimation>
    )
  }
}
