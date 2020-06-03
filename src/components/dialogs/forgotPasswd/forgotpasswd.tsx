import { ForgotPasswd } from "models/user";
import React from "react";
import server_info from 'config/server.json'
import * as vld from 'validation/user'
import './style.css';

interface Props {
  onError(error)
  onSuccess(data)
  onCancel()
}

export default class LoginDialog extends React.Component<Props, any> {
  private inputsRef = {
    email: undefined
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      inputsValidation: {
        email: true
      },
      first: true,
      show: true
    }
  }

  private onSubmit = async (event): Promise<void> => {
    event.preventDefault();

    const email = this.inputsRef.email.value;

    const validationFlags = {
      email: {
        flag: vld.validateEmail(email),
        ref: this.inputsRef.email
      }
    };

    const inVal = this.state.inputsValidation
    for (const input in validationFlags) {
      inVal[input] = validationFlags[input].flag
      this.changeValidationInfo(validationFlags[input].flag, validationFlags[input].ref)
    }
    this.setState({ ...this.state, ...inVal })
    const validated = Object.values(validationFlags).every(v => v.flag)

    if (validated) {
      const user = new ForgotPasswd(email);
      await this.sendData(user)
    }
  }

  private changeValidationInfo = (validated: boolean, input: HTMLInputElement) => {
    if (validated) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }
  }

  private sendData = async (payload: ForgotPasswd) => {
    try {
      const data = await $.ajax(`http://${server_info.ip}:${server_info.port}/user/login`, {
        method: 'GET',
        crossDomain: true,
        headers: { 'Content-Type': 'application/json' },
        data: $.param(payload)
      })
      this.close()
      this.props.onSuccess(data.responseJSON)
    } catch (err) {
      this.props.onError(err)
    }
  }

  private close = () => {
    this.setState({ ...this.state, show: false })
  }

  render = () => {
    return (
      this.state.show &&
      (<div className="container">
        <form id="register-form" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label className="form-check-label">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className="form-control"
              ref={r => this.inputsRef["email"] = r}
            />
            {!this.state.inputsValidation["email"] && (
              <div className="invalid-feedback">Wrong e-mail</div>
            )}
          </div>

          <div className="flex">
            <input
              type="submit"
              className="btn btn-primary"
              value="Remind password"
              id="submit"
            />

            <input
              type="button"
              className="btn btn-secondary"
              value="Cancel"
              onClick={() => { this.close(); this.props.onCancel() }}
            />
          </div>
        </form>
      </div>
      )
    );
  }
}
