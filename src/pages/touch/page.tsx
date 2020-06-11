import React from "react";
import PageNavbar from './navbar/navbar'
import Logo from './logo/logo'
import { Redirect } from "react-router-dom";
import FadingAnimation from 'components/fading/fading'
import { TournamentInfo } from 'models/tournament'
import EditPanel from "./content/edit-panel/edit-panel";
import LoginSubscriber from 'components/subscriber/login/login-subscriber'
import LoginService from 'services/login'
import 'pages/style.css';

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

        if (!LoginService.isAccountLoggedIn()) {
            this.state = { redirect: { path: this.props.mainPagePath } }
            return
        }

        let type: Action
        let data: TournamentInfo
        if (!this.props.location.state) {
            data = new TournamentInfo()
            data.owner_id = LoginService.getSelfID()
            type = 'CREATE'
        } else {
            data = this.props.location.state.data
            type = 'EDIT'
        }

        this.state = { data, type }
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

                    <LoginSubscriber
                        onLogout={() => this.onRedirectToPage(this.props.backPagePath)}
                        onError={(err) => alert(err)}
                    />

                </FadingAnimation>
            )
        } else {
            return null
        }
    }
}
