import { Register } from "models/user";
import React from "react";
import server_info from 'config/server.json'
import * as vld from 'validation/user'
import 'components/dialogs/style.css';

interface Props {
  onError?: (error) => void
  onSuccess?: (data) => void
  onCancel?: () => void
}

interface State {
  inputsValidation: {
    name: boolean
    lastname: boolean
    email: boolean
    password: boolean
  }
  first: boolean
  show: boolean
}

export default class RegisterDialog extends React.Component<Props, State> {
  private inputsRef = {
    name: undefined,
    lastname: undefined,
    email: undefined,
    password: undefined
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      inputsValidation: {
        name: true,
        lastname: true,
        email: true,
        password: true,
      },
      first: true,
      show: true
    }
  }

  private onSubmit = async (event): Promise<void> => {
    event.preventDefault();

    const name = this.inputsRef.name.value;
    const lastname = this.inputsRef.lastname.value;
    const email = this.inputsRef.email.value;
    const password = this.inputsRef.password.value;

    const validationFlags = {
      name: {
        flag: vld.validateName(name),
        ref: this.inputsRef.name
      },
      lastName: {
        flag: vld.validateLastName(lastname),
        ref: this.inputsRef.lastname
      },
      email: {
        flag: vld.validateEmail(email),
        ref: this.inputsRef.email
      },
      password: {
        flag: vld.validatePassword(password),
        ref: this.inputsRef.password
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
      const user = new Register(name, lastname, email, password);
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

  private sendData = (payload: Register) => {
    $.post(`http://${server_info.ip}:${server_info.port}/user/register`, payload, data => {
      this.close()
      this.props.onSuccess?.(data)
    }).fail(err => this.props.onError?.(err.responseText))
  }

  private close = () => {
    this.setState({ ...this.state, show: false })
  }

  render = () => {
    if (this.state.show) {
      return (
        <div className="container">
          <form className="dialog-form" onSubmit={this.onSubmit}>
            <div className="form-group">
              <label className="form-check-label">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="form-control"
                ref={r => this.inputsRef["name"] = r}
              />
              {!this.state.inputsValidation["name"] && (
                <div className="invalid-feedback">Wrong name</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-check-label">Lastname</label>
              <input
                type="text"
                name="lastname"
                placeholder="Lastname"
                className="form-control"
                ref={r => this.inputsRef["lastname"] = r}
              />
              {!this.state.inputsValidation["lastname"] && (
                <div className="invalid-feedback">Wrong lastname</div>
              )}
            </div>

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
                value="Sign Up"
                id="submit"
              />

              <input
                type="button"
                className="btn btn-secondary"
                value="Cancel"
                onClick={() => { this.close(); this.props.onCancel?.() }}
              />
            </div>
          </form>
        </div>
      );
    } else {
      return null
    }
  }
}
