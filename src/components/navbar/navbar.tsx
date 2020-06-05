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
        if (prevProps.children.toString() !== this.props.children.toString()) {
            await $('#nav').children().animate({opacity: 0}, 200).promise()
            
            this.setState({ children: this.props.children }) // setState in this lifecycle doesnt invokes render method
            this.forceUpdate()
            await $('#nav').children().css({opacity: 0}).animate({opacity: 1}, 200).promise()
        }
    }

    render = () => {
        return <div id="nav">{this.state.children}</div>
    }
}