import { ForgotPasswd } from "models/user";
import React from "react";
import * as vld from 'validation/user'
import 'components/dialogs/style.css';
import ResetPasswordService from 'services/user/reset-password'

interface Props {
  onError?: (error) => void
  onSuccess?: () => void
  onCancel?: () => void
}

interface State {
  inputsValidation: {
    email: boolean
  },
  first: boolean
}

export default class LoginDialog extends React.Component<Props, State> {
  private inputsRef = {
    email: undefined
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

  private onSubmit = async (event): Promise<void> => {
    event.preventDefault();

    const email = this.inputsRef.email.value;

    const validationFlags = {
      email: {
        flag: vld.validateEmail(email),
        ref: this.inputsRef.email
      }
    };

    const state = { ...this.state }
    for (const input in validationFlags) {
      state.inputsValidation[input] = validationFlags[input].flag
      this.changeValidationInfo(validationFlags[input].flag, validationFlags[input].ref)
    }
    this.setState(state)
    const validated = Object.values(validationFlags).every(v => v.flag)

    if (validated) {
      const user = new ForgotPasswd(email);
      const { error } = await ResetPasswordService.reset(user)
      if (error) {
        this.props.onError?.(error)
      } else {
        this.props.onSuccess?.()
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
        <form onSubmit={this.onSubmit} className="dialog-form">
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
              onClick={this.props.onCancel}
            />
          </div>
        </form>
      </div>
    );
  }
}
