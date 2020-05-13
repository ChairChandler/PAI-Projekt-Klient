import User from "../../data-models/user";
import React, { ReactNode } from "react";

interface State {
  inputsValidation: {
    name: boolean,
    lastname: boolean,
    email: boolean,
    password: boolean,
  },
  first: boolean
}

export default class Registration extends React.Component<any, State> { 
  private inputsRef: any = {
    name: undefined,
    lastname: undefined,
    email: undefined,
    password: undefined
  }
  
  constructor(props: Readonly<{}>) {
    super(props);
    
    this.state = {
      inputsValidation: {
        name: true,
        lastname: true,
        email: true,
        password: true,
      },
      first: true
    }
  }

  testName(name: string): boolean {
    if(name === undefined) {
      return false;
    }
    
    const regex = /^[\p{L}]+$/u;
    if (!regex.test(name)) {
      this.state.inputsValidation["name"] = false;
      this.setState(this.state);
      return false;
    } else {
      this.state.inputsValidation["name"] = true;
      this.setState(this.state);
      return true;
    }
  }

  testLastname(lastName: string): boolean {
    if(lastName === undefined) {
      return false;
    }

    const regex = /^[a-z\p{L}]+$/iu;
    if (!regex.test(lastName)) {
      this.state.inputsValidation["lastname"] = false;
      this.setState(this.state);
      return false;
    } else {
      this.state.inputsValidation["lastname"] = true;
      this.setState(this.state);
      return true;
    }
  }

  testEmail(email: string): boolean {
    if(email === undefined) {
      return false;
    }

    const regex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    if (!regex.test(email)) {
      this.state.inputsValidation["email"] = false;
      this.setState(this.state);
      return false;
    } else {
      this.state.inputsValidation["email"] = true;
      this.setState(this.state);
      return true;
    }
  }

  testPassword(password: string): boolean {
    if(password === undefined) {
      return false;
    }

    if (password.length >= 8 && password.length <= 16) {
      this.state.inputsValidation["password"] = true;
      this.setState(this.state);
      return true;
    } else {
      this.state.inputsValidation["password"] = false;
      this.setState(this.state);
      return false;
    }
  }

  changeValidationInfo = (validated: boolean, input: HTMLInputElement): boolean => {
    if(validated) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }
    return validated
  }

  onSubmit = (event: any): void => {
    const name = this.inputsRef["name"].value;
    const lastname = this.inputsRef["lastname"].value;
    const email = this.inputsRef["email"].value;
    const password = this.inputsRef["password"].value;

    const ok = [
      this.changeValidationInfo(this.testName(name), this.inputsRef["name"]),
      this.changeValidationInfo(this.testLastname(lastname), this.inputsRef["lastname"]),
      this.changeValidationInfo(this.testEmail(email), this.inputsRef["email"]),
      this.changeValidationInfo(this.testPassword(password), this.inputsRef["password"]),
    ].every((v) => v);
    
    if (ok) {
        const user = new User(name, lastname, email, password);
        fetch('http://localhost:2000/user/register', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
          alert(data);
        })
        .catch(error => alert(error))
    }

    event.preventDefault();
  };

  render(): ReactNode {
    return (
      <form id="register-form" onSubmit={this.onSubmit}>
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

        <input
          type="submit"
          className="btn btn-primary"
        />
      </form>
    );
  }
}
