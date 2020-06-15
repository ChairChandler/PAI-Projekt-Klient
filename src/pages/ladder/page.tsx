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
    contestant_user_id?: number
    tournament_id?: number
    tournament_finished?: boolean
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

        this.state = {
            tournament_finished: this.props.location.state.tournament_finished,
            tournament_id: this.props.location.state.tournament_id,
            contestant_user_id: this.props.location.state.contestant_user_id,
            backPagePath: this.props.location.state.src
        }

        if (this.state.backPagePath !== pages.detailsPagePath) {
            this.state = { redirect: { path: pages.mainPagePath } }
        }
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
                        contestant_user_id={this.state.contestant_user_id}
                        tournament_finished={this.state.tournament_finished}
                        tournament_id={this.state.tournament_id}
                        onError={err => alert(err)}
                    />
                </section>
            </FadingAnimation>
        )
    }
}