import React from "react";
import PageNavbar from './navbar/navbar'
import Logo from './logo/logo'
import 'pages/style.css';
import { Redirect } from "react-router-dom";
import InfoCard from './content/info/info'
import server_info from 'config/server.json'
import FadingAnimation from 'components/fading/fading'
import { TournamentInfo } from 'models/tournament'
import LoginSubscriber from 'components/subscriber/login/login-subscriber'


interface Props {
    mainPagePath: string
    managePagePath: string
    location
}

interface State {
    data?: TournamentInfo
    redirectPath?: string
    tournamentID?: number
    backPath?: string
    loginSubscriber?
}

export default class DetailsPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        if (!this.props.location.state) {
            this.state = { redirectPath: this.props.mainPagePath }
            return
        }

        const recvState = this.props.location.state
        if (recvState.data) {
            this.state = {
                data: recvState.data,
                backPath: this.props.managePagePath,
                loginSubscriber:
                    <LoginSubscriber
                        onLogout={() => this.onRedirect(this.props.mainPagePath)}
                        onError={(err) => alert(err)}
                    />
            }
        } else {
            this.state = {
                tournamentID: recvState.id,
                backPath: this.props.mainPagePath
            }
            this.retrieveTournamentInformation()
        }
    }

    private retrieveTournamentInformation = async () => {
        const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/info?tournament_id=${this.state.tournamentID}`)
        if (!data.ok) {
            console.warn('Failed to retrieve tourament informations')
        }

        const info: TournamentInfo = await data.json()
        const state = { ...this.state }
        state.data = info
        this.setState(state)
    }

    private onRedirect = (path: string) => {
        const state = { ...this.state }
        state.redirectPath = path
        this.setState(state)
    }

    render = () => {
        if (this.state.redirectPath) {
            return <Redirect to={this.state.redirectPath}></Redirect>
        }

        if (this.state.data) {
            return (
                <FadingAnimation>
                    <nav>
                        <PageNavbar
                            data={this.state.data}
                            onBack={() => this.onRedirect(this.state.backPath)}>
                        </PageNavbar>
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
