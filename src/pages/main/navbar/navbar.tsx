import React from "react";
import LoginDialog from 'components/dialogs/login/login';
import RegisterDialog from 'components/dialogs/registration/registration';
import ForgotPasswd from 'components/dialogs/forgotPasswd/forgotpasswd';
import server_info from 'config/server.json';
import Navbar from 'components/navbar/navbar';
import isLogged from 'utils/is-logged';

type VisibleDialog = 'login' | 'register' | 'forgotPassword'
type VisibleNavbar = 'unlogged' | 'logged'

interface Props {
    onLogin: (email: string, tokenMaxAge: number) => void
    onLogout: () => void
}

interface State {
    showDialog?: VisibleDialog
    visibleNavbar: VisibleNavbar
}

export default class PageNavbar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        
        this.state = {
            showDialog: null,
            visibleNavbar: isLogged() ? 'logged' : 'unlogged'
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

        return <>{navbar}{dialog}</>
    }
}