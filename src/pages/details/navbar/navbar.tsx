import React from "react";
import LoginDialog from 'components/dialogs/login/login';
import RegisterDialog from 'components/dialogs/registration/registration';
import ForgotPasswd from 'components/dialogs/forgotPasswd/forgotpasswd';
import JoinDialog from 'components/dialogs/join/join';
import Navbar from 'components/navbar/navbar';
import { TournamentInfo } from 'models/tournament';
import LoginSubscriber from 'components/subscriber/login/login-subscriber'
import LoginService from 'services/user/login'
import ContestantService from 'services/contestant/contestant'

type VisibleDialog = 'login' | 'register' | 'forgotPassword' | 'join'
type VisibleNavbar = 'unlogged' | 'logged'

interface Props {
    data: TournamentInfo
    onBack?: () => void
    onModify?: () => void
}

interface State {
    showDialog?: VisibleDialog
    visibleNavbar?: VisibleNavbar
    taking_part_in_tournament?: boolean
    isOwner?: boolean
}

export default class PageNavbar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            visibleNavbar: LoginService.isAccountLoggedIn() ? 'logged' : 'unlogged'
        }

        this.componentDidUpdate()
    }

    componentDidUpdate = async () => {
        const isOwner = LoginService.isPerson(this.props.data.owner_id)
        const state = { ...this.state }
        state.isOwner = isOwner
        this.state = state

        if (!this.state.isOwner && this.state.visibleNavbar === 'logged') {
            const id = this.props.data.tournament_id
            const { error, contestant } = await ContestantService.isContestant(id)
            if (error) {
                alert(error)
            } else if (this.state.taking_part_in_tournament !== contestant) {
                const state = { ...this.state }
                state.taking_part_in_tournament = contestant
                this.setState(state)
            }
        }
    }

    private onLogoutButtonClicked = async () => {
        const { error } = await LoginService.logout()
        if (error) {
            alert(error)
        }
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
                                <button className='btn btn-primary' id="modify" onClick={this.props.onModify}>Modify</button>
                                :
                                isMaxParticipants || this.state.taking_part_in_tournament ?
                                    null
                                    :
                                    <button className='btn btn-primary' id="join" onClick={() => this.openDialog('join')}>Join</button>
                        }
                    </Navbar>
                break

            default:
                navbar = null
        }

        let dialog
        switch (this.state.showDialog) {
            case 'login':
                dialog =
                    <LoginDialog
                        onError={err => alert(err)}
                        onCancel={this.closeDialog}
                        onSuccess={this.closeDialog}
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

        return <>
            {navbar}
            {dialog}
            <LoginSubscriber
                onLogin={() => this.changeNavbar('logged')}
                onLogout={() => this.changeNavbar('unlogged')}
                onError={(err) => alert(err)}
            />
        </>
    }
}