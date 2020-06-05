import React from 'react';
import './style.css'

interface Props {
    img: string
    headerTitle: string
}

export default class Logo extends React.Component<Props, {}> {
    constructor(props) {
        super(props)

        $(document).resize(this.renderLogoHeader)
    }

    componentDidMount = () => {
        this.renderLogoImg()
        this.renderLogoHeader()
    }

    private renderLogoImg = () => {
        $('.logo').css('background-image', `url(${this.props.img})`)
    }

    private renderLogoHeader = () => {
        const logo = $('.logo')
        const { left: offsetX, top: offsetY } = logo.position()

        const text = $('.logo-header')
        text.css({
            'text-align': 'center',
            position: 'absolute',
            width: '100%',
            left: offsetX,
            top: offsetY + 0.5 * logo.height() - 0.5 * text.height()
        })
    }


    render = () => {
        return (
            <div className='logo-container'>
                <div className="logo"></div>
                <div className="logo-header">{this.props.headerTitle}</div>
            </div>
        )
    }
}