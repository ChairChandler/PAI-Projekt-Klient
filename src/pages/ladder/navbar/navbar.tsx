import React from "react";
import Navbar from 'components/navbar/navbar';

interface Props {
    onRouteBack: () => void
}

export default class PageNavbar extends React.Component<Props, {}> {
    render = () => {
        return <Navbar>
            <button className='btn btn-primary' id="mainPage" onClick={this.props.onRouteBack}>Back</button>
        </Navbar>
    }
}