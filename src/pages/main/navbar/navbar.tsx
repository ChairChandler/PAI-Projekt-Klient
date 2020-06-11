import React from "react";
import LoginDialog from 'components/dialogs/login/login';
import RegisterDialog from 'components/dialogs/registration/registration';
import ForgotPasswd from 'components/dialogs/forgotPasswd/forgotpasswd';
import Navbar from 'components/navbar/navbar';
import LoginSubscriber from 'components/subscriber/login/login-subscriber'
import LoginService from 'services/user/login'

type VisibleDialog = 'login' | 'register' | 'forgotPassword'
type VisibleNavbar = 'unlogged' | 'logged'

interface Props {
    onManageClick: () => void
}

interface State {
    showDialog?: VisibleDialog
    visibleNavbar?: VisibleNavbar
}

export default class PageNavbar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            visibleNavbar: LoginService.isAccountLoggedIn() ? 'logged' : 'unlogged'
        }
    }

    componentDidMount = () => {
        function removeHash() {
            window.history.pushState('', document.title, window.location.pathname + window.location.search);
        }

        if (window.location.hash === '#login') {
            removeHash()
            this.openDialog('login')
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
        let navbar
        switch (this.state.visibleNavbar) {
            case 'unlogged':
                navbar =
                    <Navbar>
                        <button className='btn btn-primary' id="signIn" onClick={() => this.openDialog('login')}>Sign In</button>
                        <button className='btn btn-primary' id="signUp" onClick={() => this.openDialog('register')}>Sign Up</button>
                    </Navbar>
                break;

            case 'logged':
                navbar =
                    <Navbar>
                        <button className='btn btn-primary' id="logout" onClick={this.onLogoutButtonClicked}>Logout</button>
                        <button className='btn btn-primary' id="logout" onClick={this.props.onManageClick}>Manage tournaments</button>
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
                        onForgotPassword={() => { this.closeDialog(); this.openDialog('forgotPassword') }}>
                    </LoginDialog>
                break

            case 'register':
                dialog =
                    <RegisterDialog
                        onError={err => alert(err)}
                        onCancel={this.closeDialog}
                        onSuccess={this.closeDialog}>
                    </RegisterDialog>
                break

            case 'forgotPassword':
                dialog =
                    <ForgotPasswd
                        onError={err => alert(err)}
                        onCancel={() => { this.closeDialog(); this.openDialog('login') }}
                        onSuccess={this.closeDialog}>
                    </ForgotPasswd>
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