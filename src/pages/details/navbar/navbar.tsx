import React from "react";
import LoginDialog from 'components/dialogs/login/login';
import RegisterDialog from 'components/dialogs/registration/registration';
import ForgotPasswd from 'components/dialogs/forgotPasswd/forgotpasswd';
import JoinDialog from 'components/dialogs/join/join';
import server_info from 'config/server.json';
import Navbar from 'components/navbar/navbar';
import * as CookiesFunc from 'utils/cookies-functions';
import { TournamentInfo } from 'models/tournament';

type VisibleDialog = 'login' | 'register' | 'forgotPassword' | 'join'
type VisibleNavbar = 'unlogged' | 'logged'

interface Props {
    data: TournamentInfo
    onLogin: (email: string, tokenMaxAge: number) => void
    onLogout: () => void
    onBack: () => void
}

interface State {
    showDialog?: VisibleDialog
    visibleNavbar: VisibleNavbar
    taking_part_in_tournament?: boolean
    isOwner: boolean
}

export default class PageNavbar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        const isOwner = CookiesFunc.isPerson(this.props.data.owner_id)

        this.state = {
            showDialog: null,
            visibleNavbar: CookiesFunc.isLogged() ? 'logged' : 'unlogged',
            isOwner
        }

        this.componentDidUpdate()
    }

    componentDidUpdate = async () => {
        const isOwner = CookiesFunc.isPerson(this.props.data.owner_id)
        const state = { ...this.state }
        state.isOwner = isOwner
        this.state = state

        if (!this.state.isOwner && this.state.visibleNavbar === 'logged') {
            await this.checkIsTakingPart()
        }
    }

    private onLogoutButtonClicked = async () => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/user/login`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (!data.ok) {
                throw Error(await data.text())
            }

            this.changeNavbar('unlogged')
            this.props.onLogout()
        } catch (err) {
            alert(err.responseText)
        }
    }

    private onSuccededLogin = (email: string, tokenMaxAge: number) => {
        this.closeDialog();
        this.changeNavbar('logged')
        this.props.onLogin(email, tokenMaxAge)
    }

    private changeNavbar = (navbar: VisibleNavbar) => {
        const state = { ...this.state }
        state.visibleNavbar = navbar
        this.setState(state)
    }

    private openDialog = (dialog: VisibleDialog) => {
        const state = { ...this.state }
        state.showDialog = dialog
        this.setState(state)
    }

    private closeDialog = () => {
        const state = { ...this.state }
        state.showDialog = null
        this.setState(state)
    }

    private checkIsTakingPart = async () => {
        try {
            const id = this.props.data.tournament_id
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/contestants?tournament_id=${id}`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!data.ok) {
                throw Error(await data.text())
            }

            const json = await data.json()
            if (this.state.taking_part_in_tournament !== json.taking_part) {
                const state = { ...this.state }
                state.taking_part_in_tournament = json.taking_part
                this.setState(state)
            }
        } catch (err) {
            alert(err.message)
            return false
        }
    }

    render = () => {
        const { current_contestants_amount, participants_limit } = this.props.data
        const isMaxParticipants = current_contestants_amount === (participants_limit ?? Infinity)

        let navbar
        switch (this.state.visibleNavbar) {
            case 'unlogged':
                navbar =
                    <Navbar>
                        <button className='btn btn-primary' id="mainPage" onClick={this.props.onBack}>Back</button>
                        <button className='btn btn-primary' id="signIn" onClick={() => this.openDialog('login')}>Sign In</button>
                        <button className='btn btn-primary' id="signUp" onClick={() => this.openDialog('register')}>Sign Up</button>
                        {
                            isMaxParticipants ?
                                null
                                :
                                <button className='btn btn-primary' id="join" onClick={() => this.openDialog('login')}>Join</button>
                        }
                    </Navbar>
                break;

            case 'logged':
                navbar =
                    <Navbar>
                        <button className='btn btn-primary' id="mainPage" onClick={this.props.onBack}>Back</button>
                        <button className='btn btn-primary' id="logout" onClick={this.onLogoutButtonClicked}>Logout</button>
                        {
                            this.state.isOwner ?
                                <button className='btn btn-primary' id="modify" onClick={() => alert('not implemented')}>Modify</button>
                                :
                                isMaxParticipants || this.state.taking_part_in_tournament ?
                                    null
                                    :
                                    <button className='btn btn-primary' id="join" onClick={() => this.openDialog('join')}>Join</button>
                        }

                    </Navbar>
        }

        let dialog
        switch (this.state.showDialog) {
            case 'login':
                dialog =
                    <LoginDialog
                        onError={err => alert(err)}
                        onCancel={this.closeDialog}
                        onSuccess={this.onSuccededLogin}
                        onForgotPassword={() => { this.closeDialog(); this.openDialog('forgotPassword') }} />
                break

            case 'register':
                dialog =
                    <RegisterDialog
                        onError={err => alert(err)}
                        onCancel={this.closeDialog}
                        onSuccess={this.closeDialog} />
                break

            case 'forgotPassword':
                dialog =
                    <ForgotPasswd
                        onError={err => alert(err)}
                        onCancel={() => { this.closeDialog(); this.openDialog('login') }}
                        onSuccess={this.closeDialog} />
                break

            case 'join':
                dialog =
                    <JoinDialog
                        onError={err => alert(err)}
                        onCancel={this.closeDialog}
                        onSuccess={this.closeDialog}
                        tournament_id={this.props.data.tournament_id}
                    />

                break

            default:
                dialog = null
        }

        return <>{navbar}{dialog}</>
    }
}