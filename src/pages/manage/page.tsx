import React from "react";
import PageNavbar from './navbar/navbar'
import Logo from './logo/logo'
import './style.css';
import { Redirect } from "react-router-dom";
import FadingAnimation from 'components/fading/fading'
import { TournamentInfo } from 'models/tournament'
import server_info from 'config/server.json'
import * as CookiesFun from 'utils/cookies-functions'
import MyTournamentsTable, { TableHeaders } from './content/my-tournaments/my-tournaments'

type TournamentShortInfo = { id: number, name: string, date: Date }

interface Props {
    mainPagePath: string
    detailsPagePath: string
    touchPagePath: string //touch = create or modify
}

interface State {
    redirect?: { path: string, data?: any }
    data?: TournamentInfo[]
    tableShortData: TableHeaders[]
}

export default class ManagePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            redirect: CookiesFun.isLogged() ? null : { path: this.props.mainPagePath },
            tableShortData: []
        }

        this.prepareData()
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

        return info.filter(v => CookiesFun.isPerson(v.owner_id))
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
            const o = state.data[id]
            tmp.push({
                id: Number.parseInt(id),
                name: o.tournament_name,
                date: o.datetime,
                take_part: !CookiesFun.isPerson(o.owner_id),
                finished: new Date(o.datetime).getTime() < new Date().getTime()
            })
        }

        state.tableShortData = tmp
        this.setState(state)
    }

    private onRedirectToPage = (path: string, data?: any) => {
        const state = { ...this.state }
        state.redirect = { path, data }
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
                            onLogout={() => this.onRedirectToPage(this.props.mainPagePath)}
                            onRouteToMainPage={() => this.onRedirectToPage(this.props.mainPagePath)}>
                        </PageNavbar>
                    </nav>

                    <Logo />

                    <MyTournamentsTable
                        data={this.state.tableShortData}
                        onShow={(id: number) => this.onRedirectToPage(this.props.detailsPagePath, { data: this.state.data[id] })}
                        onEdit={(id: number) => this.onRedirectToPage(this.props.touchPagePath, { data: this.state.data[id] })}
                        onCreate={() => this.onRedirectToPage(this.props.touchPagePath)}
                    />

                </FadingAnimation>
            )
        } else {
            return null
        }
    }
}
