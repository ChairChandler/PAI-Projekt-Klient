import React from "react";
import PageNavbar from './navbar/navbar'
import Logo from './logo/logo'
import { Redirect } from "react-router-dom";
import FadingAnimation from 'components/fading/fading'
import * as pages from 'pages/pages'
import Ladder from './content/ladder/ladder'
import 'pages/style.css';

interface Props {
    location
}

interface State {
    tournament_id?: number
    redirect?: { path: string, data?}
    backPagePath?: string
}

export default class LadderPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        if(!this.props.location.state) {
            this.state = { redirect: { path: pages.mainPagePath } }
            return
        }

        const tournament_id = this.props.location.state.id
        const backPagePath = this.props.location.state.src

        if (backPagePath !== pages.detailsPagePath) {
            this.state = { redirect: { path: pages.mainPagePath } }
            return
        }

        this.state = { tournament_id, backPagePath }
    }

    private onRedirectToPage = (path: string, data = {}) => {
        const state = { ...this.state }
        const cp = { ...data }
        cp["src"] = pages.ladderPagePath
        state.redirect = { path, data: cp }
        this.setState(state)
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
                        onRouteBack={() => this.onRedirectToPage(this.state.backPagePath, { tournamentID: this.state.tournament_id })}
                    />
                </nav>

                <Logo />

                <section>
                    <Ladder
                        tournament_id={this.state.tournament_id}
                        onError={err => alert(err)}
                    />
                </section>
            </FadingAnimation>
        )
    }
}