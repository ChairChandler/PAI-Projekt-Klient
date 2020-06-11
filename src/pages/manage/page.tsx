import React from "react";
import PageNavbar from './navbar/navbar'
import Logo from './logo/logo'
import 'pages/style.css';
import { Redirect } from "react-router-dom";
import FadingAnimation from 'components/fading/fading'
import { TournamentInfo } from 'models/tournament'
import server_info from 'config/server.json'
import MyTournamentsTable, { TableHeaders } from './content/my-tournaments/my-tournaments'
import LoginSubscriber from 'components/subscriber/login/login-subscriber'
import LoginService from 'services/login'
import * as pages from 'pages/pages'


type TournamentShortInfo = { id: number, name: string, date: Date }

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

    private retrieveTournamentsList = async (): Promise<TournamentShortInfo[]> => {
        const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/list/general`)
        if (!data.ok) {
            console.warn('Failed to retrieve touraments list')
        }

        return data.json()
    }

    private retrieveCreatedTournamentsInformation = async (): Promise<TournamentInfo[]> => {
        const list = await this.retrieveTournamentsList()

        const info = await Promise.all(
            list.map(async (v): Promise<TournamentInfo> => {
                try {
                    const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/info?tournament_id=${v.id}`)
                    if (!data.ok) {
                        throw Error('Failed to retrieve tourament informations')
                    }
                    return await data.json()
                } catch (err) {
                    console.error(err)
                }
            }))

        return info.filter(v => LoginService.isPerson(v.owner_id))
    }

    private retrieveContestantTournaments = async (): Promise<TournamentInfo[]> => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/list/contestant`, {
                credentials: 'include'
            })
            if (!data.ok) {
                new Error('Failed to retrieve contestant touraments list')
            }

            return data.json()
        } catch (err) {
            console.error(err)
        }
    }

    private prepareData = async () => {
        const created = await this.retrieveCreatedTournamentsInformation()
        const activities = await this.retrieveContestantTournaments()

        const state = { ...this.state }
        state.data = [...created, ...activities]

        const tmp: TableHeaders[] = []
        for (const id in state.data) {
            const o = state.data[id];
            tmp.push({
                id: Number.parseInt(id),
                name: o.tournament_name,
                date: o.datetime,
                take_part: !LoginService.isPerson(o.owner_id),
                finished: new Date(o.datetime).getTime() < new Date().getTime()
            })
        }

        state.tableShortData = tmp
        this.setState(state)
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
