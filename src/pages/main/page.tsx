import React from "react";
import PageNavbar from './navbar/navbar'
import UpcomingTournamentsTable from './content/upcomingTournaments/upcomingTournaments'
import Logo from './logo/logo'
import 'pages/style.css';
import { Redirect } from 'react-router-dom'
import FadingAnimation from 'components/fading/fading'

interface Props {
  detailsPagePath: string
  managePagePath: string
}

interface State {
  redirect?: {
    path: string
    data: any
  }
}

export default class MainPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
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
            onManageClick={() => this.onRedirect(this.props.managePagePath, {})}
          />
        </nav>

        <Logo />

        <section>
          <UpcomingTournamentsTable onTournamentClick={id => this.onRedirect(this.props.detailsPagePath, { id })} />
        </section>
      </FadingAnimation>
    )
  }
}
