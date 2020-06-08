import React from "react";

export default class FadingAnimation extends React.Component {
    componentDidMount = async () => {
        await $('#page-reload').css({opacity: 0}).animate({opacity: 1}).promise()
    }

    render = () => <div id="page-reload">{this.props.children}</div>
}