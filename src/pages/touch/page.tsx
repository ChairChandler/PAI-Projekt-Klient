import React from "react";
import PageNavbar from './navbar/navbar'
import Logo from './logo/logo'
import { Redirect } from "react-router-dom";
import FadingAnimation from 'components/fading/fading'
import { TournamentInfo } from 'models/tournament'
import * as CookiesFun from 'utils/cookies-functions'
import 'pages/style.css';
import EditPanel from "./content/edit-panel/edit-panel";

type Action = 'EDIT' | 'CREATE'

interface Props {
    backPagePath: string
    mainPagePath: string
    location
}

interface State {
    redirect?: { path: string }
    data?: TournamentInfo
    type?: Action
}

export default class TouchPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        let type: Action
        let data: TournamentInfo
        if (!this.props.location.state) {
            data = new TournamentInfo()
            data.owner_id = CookiesFun.getSelfID()
            type = 'CREATE'
        } else {
            data = this.props.location.state.data
            type = 'EDIT'
        }

        this.state = {
            redirect: CookiesFun.isLogged() ? null : { path: this.props.backPagePath },
            data,
            type
        }
    }

    private onRedirectToPage = (path: string) => {
        const state = { ...this.state }
        state.redirect = { path }
        this.setState(state)
    }

    render = () => {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect.path}></Redirect>
        }

        if (this.state.data) {
            return (
                <FadingAnimation>
                    <nav>
                        <PageNavbar
                            onLogout={() => this.onRedirectToPage(this.props.mainPagePath)}
                            onRouteToPrevPage={() => this.onRedirectToPage(this.props.backPagePath)}>
                        </PageNavbar>
                    </nav>

                    <Logo type={this.state.type} />

                    <section>
                        <EditPanel
                            data={this.state.data}
                            action={this.state.type}
                            onSuccess={() => this.onRedirectToPage(this.props.backPagePath)}
                            onCancel={() => this.onRedirectToPage(this.props.backPagePath)}
                            onError={err => alert(err)}
                        />
                    </section>

                </FadingAnimation>
            )
        } else {
            return null
        }
    }
}
