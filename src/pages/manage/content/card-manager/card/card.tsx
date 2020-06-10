import React from 'react';

interface Props {
    header: string
    uniqueId
    show: boolean
    onClickTitle: (id: number) => void
}

export default class Card extends React.Component<Props, {}> {
    private onClickTitle = () => {
        this.props.onClickTitle(this.props.uniqueId)
    }

    render = () => {
        return <div className="container-context">
            <h1 onClick={this.onClickTitle}>{this.props.header}</h1>
            {this.props.show && this.props.children}
        </div>
    }
}