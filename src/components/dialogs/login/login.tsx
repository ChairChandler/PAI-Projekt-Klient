import { Login } from "models/user";
import React from "react";
import * as vld from 'validation/user'
import LoginService from "services/user/login"
import 'components/dialogs/style.css';

interface Props {
  onError?: (error) => void
  onSuccess?: () => void
  onCancel?: () => void
  onForgotPassword?: () => void
}

interface State {
  inputsValidation: {
    email: boolean
  },
  first: boolean
}

export default class LoginDialog extends React.Component<Props, State> {
  private inputsRef = {
    email: undefined,
    password: undefined
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      inputsValidation: {
        email: true
      },
      first: true
    }
  }

  private onSubmit = async (event) => {
    event.preventDefault();

    const email = this.inputsRef.email.value;
    const password = this.inputsRef.password.value;

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
      const user = new Login(email, password);
      const { isLogged, error } = await LoginService.login(user)
      if (isLogged) {
        this.props.onSuccess?.()
      }

      if (error) {
        this.props.onError?.(error)
      }
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

  render = () => {
    return (
      <div className="container">
        <form className="dialog-form" onSubmit={this.onSubmit}>
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


          <div className="form-group">
            <label className="form-check-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control"
              ref={r => this.inputsRef["password"] = r}
            />
            {!this.state.inputsValidation["password"] && (
              <div className="invalid-feedback">Wrong password</div>
            )}
            <small className="form-text text-muted">
              Your password must be 8-16 characters long.
              </small>
          </div>

          <div className="flex">
            <input
              type="submit"
              className="btn btn-primary"
              value="Sign In"
              id="submit"
            />

            <input
              type="button"
              className="btn btn-secondary"
              value="Forgot password"
              onClick={this.props.onForgotPassword}
            />

            <input
              type="button"
              className="btn btn-secondary"
              value="Cancel"
              onClick={this.props.onCancel}
            />
          </div>
        </form>
      </div>
    );
  }
}
