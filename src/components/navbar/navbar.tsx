import React from "react";
import './style.css';

interface State {
    children
}

export default class Navbar extends React.Component<any, State> {
    constructor(props) {
        super(props)
        this.state = { children: props.children }
    }

    componentDidUpdate = async (prevProps) => {
        if (!this.isEqualID(prevProps.children, this.props.children)) {
            await $('#nav').children().animate({opacity: 0}, 200).promise()
            
            this.setState({ children: this.props.children })
            this.forceUpdate()
            await $('#nav').children().css({opacity: 0}).animate({opacity: 1}, 200).promise()
        }
    }

    isEqualID = (a, b): boolean => a.length === b.length && a.every((o, i) => o === b[i] || o?.props.id === b[i]?.props.id)

    render = () => {
        return <div id="nav">{this.state.children}</div>
    }
}