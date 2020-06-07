import React from "react";
import PageNavbar from './navbar/navbar'
import Logo from './logo/logo'
import './style.css';
import { Redirect } from "react-router-dom";
import InfoTable, { TournamentInfo } from './content/info/info'
import server_info from 'config/server.json'

interface Props {
    mainPagePath: string
    location
}

interface State {
    logged: boolean
    data?: TournamentInfo
    redirectPath?: string
}

export default class DetailsPage extends React.Component<Props, State> {
    private tournamentID: number

    constructor(props: Props) {
        super(props)
        
        this.tournamentID = this.props.location.state.id
        this.state = {
            logged: false,
        }

        this.retrieveTournamentInformation()
    }

    private retrieveTournamentInformation = async () => {
        const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/info?tournament_id=${this.tournamentID}`)
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

        return (
            <div>
                <nav>
                    <PageNavbar
                        onLogin={this.onLogin}
                        onLogout={this.onLogout}
                        onRouteToMainPage={() => this.onRedirect(this.props.mainPagePath)}>
                    </PageNavbar>
                </nav>

                <Logo />

                <section>
                    <InfoTable data={this.state.data}/>
                </section>
            </div>
        )
    }
}
