import LoginService, { LoginSubject } from 'services/login'
import React from 'react'

interface Props {
    onLogin?: () => void
    onLogout?: () => void
    onError?: (error: string) => void
}

interface State {
    unsubscribe?: () => void
}

export default class LoginSubscriber extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    componentDidMount = () => {
        const { unsubscribe } = LoginService.subject.subscribe(this.onEvent)
        this.setState({ unsubscribe })
    }

    onEvent = (data: LoginSubject) => {
        if (data.isLogged) {
            this.props.onLogin?.()
        } else if (data.isLogged === false) {
            this.props.onLogout?.()
        }

        if (data.error) {
            this.props.onError?.(data.error)
        }
    }

    componentWillUnmount = () => this.state.unsubscribe()

        render = () => null
}
