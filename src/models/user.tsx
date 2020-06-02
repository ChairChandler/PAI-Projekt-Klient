export class Register {
  constructor(
    public name: string,
    public lastname: string,
    public email: string,
    public password: string
  ) {}
}

export class Login {
  constructor(
    public email: string,
    public password: string
  ) {}
}


export class ForgotPasswd {
  constructor(
    public email: string
  ) {}
}