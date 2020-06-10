import React from "react";
import PageNavbar from './navbar/navbar'
import Logo from './logo/logo'
import './style.css';
import { Redirect } from "react-router-dom";
import FadingAnimation from 'components/fading/fading'
import { TournamentInfo } from 'models/tournament'
import server_info from 'config/server.json'
import CardTable from './content/info/info'
import * as CookiesFun from 'utils/cookies-functions'

type TournamentShortInfo = { id: number, name: string, date: Date }

interface Props {
    mainPagePath: string
}

interface State {
    redirectPath?: string
    data?: {data: TournamentInfo, show: boolean}[]
}

export default class ManagePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            redirectPath: CookiesFun.isLogged() ? null : this.props.mainPagePath,
        }

        this.retrieveTournamentsInformation()
    }

    private retrieveTournamentsList = async (): Promise<TournamentShortInfo[]> => {
        const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/list/general`)
        if (!data.ok) {
            console.warn('Failed to retrieve touraments list')
        }

        return data.json()
    }

    private retrieveTournamentsInformation = async () => {
        const list = await this.retrieveTournamentsList()

        const info = await Promise.all(
            list.map(async (v): Promise<TournamentInfo> => {
                const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/info?tournament_id=${v.id}`)
                if (!data.ok) {
                    console.warn('Failed to retrieve tourament informations')
                }

                return await data.json()
            }))


        const state = { ...this.state }
        state.data = info.filter(v => CookiesFun.isPerson(v.owner_id)).map(v => ({data: v, show: false}))
        this.setState(state)
    }

    private onRedirectToMainPage = () => {
        const state = { ...this.state }
        state.redirectPath = this.props.mainPagePath
        this.setState(state)
    }

    private handleCards = (id) => {
        const state = { ...this.state }
        if(state.data[id].show) {
            state.data[id].show = false
        } else {
            for(const i in state.data) {
                state.data[i].show = false
            }
            state.data[id].show = true
        }

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
                            onLogout={this.onRedirectToMainPage}
                            onRouteToMainPage={this.onRedirectToMainPage}>
                        </PageNavbar>
                    </nav>

                    <Logo />

                    {
                        this.state.data.map((v,i) =>
                            <section key={i}>
                                <CardTable uniqueId={i} data={v.data} show={v.show} onClickTitle={this.handleCards}/>
                            </section>
                        )
                    }

                </FadingAnimation>
            )
        } else {
            return null
        }
    }
}
