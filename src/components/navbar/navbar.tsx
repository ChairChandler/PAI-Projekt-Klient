import React from "react";
import LoginDialog from 'components/dialogs/login/login';
import RegisterDialog from 'components/dialogs/registration/registration';
import ForgotPasswd from 'components/dialogs/forgotPasswd/forgotpasswd';
import './style.css';

interface Props {
    onLogin: () => void
    onLogout: () => void
}

interface State {
    show: {
        buttons: {
            signIn: boolean
            signUp: boolean
            logout: boolean
        }
        dialogs: {
            login: boolean
            register: boolean
            forgotPassword: boolean
        }
    }
}

export default class Navbar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            show: {
                buttons: {
                    signIn: true,
                    signUp: true,
                    logout: false
                },
                dialogs: {
                    login: false,
                    register: false,
                    forgotPassword: false
                }
            }
        }

        $('#logout').hide()
        this.animateButtons()
    }

    componentDidMount = () => {
        this.animateButtons()
    }

    componentDidUpdate = () => {
        this.animateButtons()
    }

    private animateButtons = () => {
        for(const button in this.state.show.buttons) {
            if(this.state.show.buttons[button]) {
                $(`#${button}`).css('visiblity', 'visible').fadeIn('slow')
            } else {
                $(`#${button}`).fadeOut('slow', function() {
                    $(this).css('visibility', 'hidden')
                })
            }
        }
    }

    private onLoginButtonClicked = () => {
        this.openDialog('login')
    }

    private onRegisterButtonClicked = () => {
        this.openDialog('register')
    }

    private onLogoutButtonClicked = () => {
        const state = { ...this.state }
        state.show.buttons = { signIn: true, signUp: true, logout: false }
        this.setState(state)
        this.props.onLogout()
    }

    private onSuccededLogin = () => {
        this.closeDialog('login');
        const state = { ...this.state }
        state.show.buttons = { signIn: false, signUp: false, logout: true }
        this.setState(state)
        this.props.onLogin()
    }

    private openDialog = (dialog: 'login' | 'register' | 'forgotPassword') => {
        const state = { ...this.state }
        state.show.dialogs[dialog] = true
        this.setState(state)
    }

    private closeDialog = (dialog: 'login' | 'register' | 'forgotPassword') => {
        const state = { ...this.state }
        state.show.dialogs[dialog] = false
        this.setState(state)
    }

    render = () => {
        return (
            <div>
                <div id="nav">
                    <button className='btn btn-primary' id="signIn" onClick={this.onLoginButtonClicked}>Sign In</button>
                    <button className='btn btn-primary' id="signUp" onClick={this.onRegisterButtonClicked}>Sign Up</button>
                    <button className='btn btn-primary' id="logout" onClick={this.onLogoutButtonClicked}>Logout</button>
                </div>

                {this.state.show.dialogs.login && (
                    <LoginDialog
                        onError={err => alert(err)}
                        onCancel={() => this.closeDialog('login')}
                        onSuccess={this.onSuccededLogin}
                        onForgotPassword={() => { this.closeDialog('login'); this.openDialog('forgotPassword') }}>
                    </LoginDialog>
                )}

                {this.state.show.dialogs.register && (
                    <RegisterDialog
                        onError={err => alert(err)}
                        onCancel={() => this.closeDialog('register')}
                        onSuccess={() => this.closeDialog('register')}>
                    </RegisterDialog>
                )}

                {this.state.show.dialogs.forgotPassword && (
                    <ForgotPasswd
                        onError={err => alert(err)}
                        onCancel={() => { this.closeDialog('forgotPassword'); this.openDialog('login') }}
                        onSuccess={() => this.closeDialog('forgotPassword')}>
                    </ForgotPasswd>
                )}
            </div>
        )
    }
}