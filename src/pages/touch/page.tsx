import React from "react";
import PageNavbar from './navbar/navbar'
import Logo from './logo/logo'
import { Redirect } from "react-router-dom";
import FadingAnimation from 'components/fading/fading'
import { TournamentInfo } from 'models/tournament'
import EditPanel from "./content/edit-panel/edit-panel";
import LoginSubscriber from 'components/subscriber/login/login-subscriber'
import LoginService from 'services/login'
import * as pages from 'pages/pages'
import 'pages/style.css';

type Action = 'EDIT' | 'CREATE'

interface Props {
    location
}

interface State {
    redirect?: { path: string, data?}
    data?: TournamentInfo
    action?: Action
    backPagePath?: string
}

export default class TouchPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        if (!LoginService.isAccountLoggedIn()) {
            this.state = { redirect: { path: pages.mainPagePath } }
            return
        }

        let action: Action, data: TournamentInfo
        if (!this.props.location.data) {
            data = new TournamentInfo()
            data.owner_id = LoginService.getSelfID()
            action = 'CREATE'
        } else {
            data = this.props.location.state.data
            action = 'EDIT'
        }

        const backPagePath = this.props.location.state.src
        this.state = { data, action, backPagePath }
    }

    private onRedirectToPage = (path: string, data = {}) => {
        const state = { ...this.state }
        const cp = { ...data }

        if (path === pages.detailsPagePath) {
            cp["data"] = this.state.data
            cp["src"] = pages.touchPagePath
        }
        
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
                        <PageNavbar />
                    </nav>

                    <Logo type={this.state.action} />

                    <section>
                        <EditPanel
                            data={this.state.data}
                            action={this.state.action}
                            onSuccess={() => this.onRedirectToPage(this.state.backPagePath)}
                            onCancel={() => this.onRedirectToPage(this.state.backPagePath)}
                            onError={err => alert(err)}
                        />
                    </section>

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
