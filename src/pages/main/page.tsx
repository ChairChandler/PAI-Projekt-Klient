import React from "react";
import LoginDialog from 'components/dialogs/login/login';
import RegisterDialog from 'components/dialogs/registration/registration';
import ForgotPasswd from 'components/dialogs/forgotPasswd/forgotpasswd';
import './style.css';

export default class MainPage extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      dialogs: {
        login: 'off',
        register: 'off',
        forgotPassword: 'off'
      },
    }
  }

  private toggleDialog = (dialog, val?) => {
    let state
    if (val) {
      state = val
    } else {
      state = this.state.dialogs[dialog] === 'on' ? 'off' : 'on'
    }
    this.setState({ ...this.state, ...{ dialogs: { [dialog]: state } } })
  }

  render = () => {
    return (
      <div>
        <div className="button-nav">
          <button className='btn btn-primary' onClick={() => this.toggleDialog('login', 'on')}>Sign In</button>
          <button className='btn btn-primary' onClick={() => this.toggleDialog('register', 'on')}>Sign Up</button>
        </div>

        <div className='logo-container'>
          <div className="logo"></div>
        </div>

        {this.state.dialogs.login === 'on' && (
          <LoginDialog
            onError={err => { this.toggleDialog('login'); console.error(err) }}
            onCancel={() => this.toggleDialog('login')}
            onSuccess={data => { console.log(`DATA: ${data}`); this.toggleDialog('login') }}  //do testow
            onForgotPassword={() => { this.toggleDialog('login'); this.toggleDialog('forgotPassword') }}>
          </LoginDialog>
        )}

        {this.state.dialogs.register === 'on' && (
          <RegisterDialog
            onError={err => { this.toggleDialog('register'); console.error(err) }}
            onCancel={() => this.toggleDialog('register')}
            onSuccess={data => { console.log(`DATA: ${data}`); this.toggleDialog('register') }}>
          </RegisterDialog>
        )}

        {this.state.dialogs.forgotPassword === 'on' && (
          <ForgotPasswd
            onError={err => { this.toggleDialog('forgotPassword'); console.error(err) }}
            onCancel={() => { this.toggleDialog('forgotPassword'); this.toggleDialog('login') }}
            onSuccess={data => { console.log(`DATA: ${data}`); this.toggleDialog('forgotPassword') }}>
          </ForgotPasswd>
        )}

      </div>
    )
  }
}
