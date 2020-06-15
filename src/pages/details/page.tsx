import React from "react";
import PageNavbar from './navbar/navbar'
import Logo from './logo/logo'
import 'pages/style.css';
import { Redirect } from "react-router-dom";
import InfoCard from './content/info/info'
import FadingAnimation from 'components/fading/fading'
import { TournamentInfo } from 'models/tournament'
import LoginSubscriber from 'components/subscriber/login/login-subscriber'
import * as pages from 'pages/pages'
import TournamentService from 'services/tournament/tournament'
import LoginService from 'services/user/login'
import ContestantService from 'services/contestant/contestant'

interface Props {
    location
}

interface State {
    user_take_part?: boolean
    data?: TournamentInfo
    redirect?: { path: string, data?}
    tournamentID?: number
    backPath?: string
    loginSubscriber?
}

export default class DetailsPage extends React.Component<Props, State> {
    static prevPagePath?: string

    constructor(props: Props) {
        super(props)

        if (!this.props.location.state) {
            this.state = { redirect: { path: pages.mainPagePath } }
            return
        }

        const recvState = this.props.location.state

        switch (recvState.src) {
            case pages.managePagePath:

                this.state = {
                    user_take_part: recvState.take_part,
                    data: recvState.data,
                    backPath: pages.managePagePath,
                    loginSubscriber:
                        <LoginSubscriber
                            onLogout={() => this.onRedirect(pages.mainPagePath)}
                            onError={(err) => alert(err)}
                        />
                }

                break

            case pages.mainPagePath:

                this.state = {
                    tournamentID: recvState.id,
                    backPath: pages.mainPagePath
                }
                this.retrieveTournamentInformation()

                break


            case pages.touchPagePath:

                this.state = {
                    tournamentID: recvState.id,
                    backPath: pages.mainPagePath,
                    loginSubscriber:
                        <LoginSubscriber
                            onLogout={() => this.onRedirect(pages.mainPagePath)}
                            onError={(err) => alert(err)}
                        />
                }
                this.retrieveTournamentInformation()

                break

            case pages.ladderPagePath:

                this.state = {
                    user_take_part: recvState.user_take_part,
                    tournamentID: recvState.tournamentID,
                    backPath: DetailsPage.prevPagePath,
                    loginSubscriber: DetailsPage.prevPagePath === pages.managePagePath ?
                        <LoginSubscriber
                            onLogout={() => this.onRedirect(pages.mainPagePath)}
                            onError={(err) => alert(err)}
                        />
                        :
                        null
                }
                this.retrieveTournamentInformation()
        }

        DetailsPage.prevPagePath = this.state.backPath
    }

    private retrieveTournamentInformation = async () => {
        const { error, data } = await TournamentService.retrieveTournamentInformation(this.state.tournamentID)
        if (error) {
            alert(error)
        } else {
            const state = { ...this.state }
            state.data = data
            this.setState(state)
        }
    }

    private onRedirect = (path: string, data = {}) => {
        const state = { ...this.state }
        const cp = { ...data }

        cp["src"] = pages.detailsPagePath
        if (path === pages.touchPagePath) {
            cp["data"] = this.state.data
        }

        state.redirect = { path, data: cp }
        this.setState(state)
    }

    private checkIfContestant = async () => {
        const { error, contestant } = await ContestantService.isContestant(this.state.tournamentID)
        if (error) {
            alert(error)
        } else {
            return contestant
        }
    }

    render = () => {
        if (this.state.redirect) {
            return <Redirect to={{
                pathname: this.state.redirect.path,
                state: this.state.redirect.data
            }}></Redirect>
        }

        if (this.state.data) {
            return (
                <FadingAnimation>
                    <nav>
                        <PageNavbar
                            data={this.state.data}
                            onModify={() => this.onRedirect(pages.touchPagePath, { data: this.state.data })}
                            onBack={() => this.onRedirect(this.state.backPath)}
                            onShowLadder={() => this.onRedirect(pages.ladderPagePath, {
                                tournament_id: this.state.data.tournament_id,
                                tournament_finished: this.state.data.finished,
                                contestant_user_id: this.state.user_take_part || this.checkIfContestant() ? LoginService.getSelfID() : null
                            })} />
                    </nav>

                    <Logo />

                    <section>
                        <InfoCard data={this.state.data} />
                    </section>

                    {this.state.loginSubscriber}

                </FadingAnimation>
            )
        } else {
            return null
        }
    }
}
