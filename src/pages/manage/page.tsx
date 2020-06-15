import React from "react";
import PageNavbar from './navbar/navbar'
import Logo from './logo/logo'
import 'pages/style.css';
import { Redirect } from "react-router-dom";
import FadingAnimation from 'components/fading/fading'
import { TournamentInfo } from 'models/tournament'
import MyTournamentsTable, { TableHeaders } from './content/my-tournaments/my-tournaments'
import LoginSubscriber from 'components/subscriber/login/login-subscriber'
import LoginService from 'services/user/login'
import * as pages from 'pages/pages'
import TournamentService from 'services/tournament/tournament'
import ContestantService from 'services/contestant/contestant'

interface State {
    redirect?: { path: string, data?: any }
    data?: TournamentInfo[]
    tableShortData: TableHeaders[]
}

export default class ManagePage extends React.Component<{}, State> {
    constructor(props) {
        super(props)
        const isLogged = LoginService.isAccountLoggedIn()
        this.state = {
            tableShortData: [],
            redirect: isLogged ? null : { path: pages.mainPagePath }
        }

        if (isLogged) {
            this.prepareData()
        }
    }

    private retrieveCreatedTournamentsInformation = async (): Promise<TournamentInfo[]> => {
        const { error, data } = await TournamentService.retrieveClosestTournaments()
        if (error) {
            alert(error)
        } else {

            const info = await Promise.all(
                data.map(async (v): Promise<TournamentInfo> => {
                    const { error, data } = await TournamentService.retrieveTournamentInformation(v.id)
                    if (error) {
                        alert(error)
                    } else {
                        return data
                    }
                }))

            return info.filter(v => LoginService.isPerson(v.owner_id))
        }
    }

    private prepareData = async () => {
        const created = await this.retrieveCreatedTournamentsInformation()
        const { error, data } = await ContestantService.retrieveContestantTournaments()
        if (error) {
            alert(error)
        } else {

            const state = { ...this.state }
            state.data = [...created, ...data]

            const tmp: TableHeaders[] = []
            for (const id in state.data) {
                const o = state.data[id];
                tmp.push({
                    id: Number.parseInt(id),
                    name: o.tournament_name,
                    date: o.datetime,
                    take_part: !LoginService.isPerson(o.owner_id),
                    finished: o.finished
                })
            }

            state.tableShortData = tmp
            this.setState(state)
        }
    }

    private onRedirectToPage = (path: string, data = {}) => {
        const state = { ...this.state }
        const cp = data
        cp["src"] = pages.managePagePath
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

        if (this.state.data) {
            return (
                <FadingAnimation>
                    <nav>
                        <PageNavbar
                            onRouteToMainPage={() => this.onRedirectToPage(pages.mainPagePath)}>
                        </PageNavbar>
                    </nav>

                    <Logo />

                    <MyTournamentsTable
                        data={this.state.tableShortData}
                        onShow={(id: number) => this.onRedirectToPage(pages.detailsPagePath, { data: this.state.data[id] })}
                        onEdit={(id: number) => this.onRedirectToPage(pages.touchPagePath, { data: this.state.data[id] })}
                        onCreate={() => this.onRedirectToPage(pages.touchPagePath)}
                    />

                    <LoginSubscriber
                        onLogout={() => this.onRedirectToPage(pages.mainPagePath)}
                        onError={(err) => alert(err)}
                    />

                </FadingAnimation>
            )
        } else {
            return null
        }
    }
}
