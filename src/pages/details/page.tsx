import React from "react";
import PageNavbar from './navbar/navbar'
import Logo from './logo/logo'
import './style.css';
import { Redirect } from "react-router-dom";
import InfoCard from './content/info/info'
import server_info from 'config/server.json'
import FadingAnimation from 'components/fading/fading'
import { TournamentInfo } from 'models/tournament'

interface Props {
    mainPagePath: string
    managePagePath: string
    location
}

interface State {
    logged: boolean
    data?: TournamentInfo
    redirectPath?: string
    tournamentID?: number
    backPath?: string
}

export default class DetailsPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        if (!this.props.location.state) {
            this.state = { logged: false, redirectPath: this.props.mainPagePath }
            return
        }

        const recvState = this.props.location.state
        if (recvState.data) {
            this.state = {
                logged: false,
                data: recvState.data,
                backPath: this.props.managePagePath
            }
        } else {
            this.state = {
                logged: false,
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
            console.log(this.state.data)
            return (
                <FadingAnimation>
                    <nav>
                        <PageNavbar
                            data={this.state.data}
                            onLogin={this.onLogin}
                            onLogout={this.onLogout}
                            onBack={() => this.onRedirect(this.state.backPath)}>
                        </PageNavbar>
                    </nav>

                    <Logo />

                    <section>
                        <InfoCard data={this.state.data} />
                    </section>
                </FadingAnimation>
            )
        } else {
            return null
        }
    }
}
