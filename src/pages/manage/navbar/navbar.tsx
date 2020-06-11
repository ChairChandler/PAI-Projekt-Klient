import React from "react";
import Navbar from 'components/navbar/navbar';
import LoginService from 'services/login'

interface Props {
    onRouteToMainPage: () => void
}

export default class PageNavbar extends React.Component<Props, {}> {
    render = () => {
        return <Navbar>
            <button className='btn btn-primary' id="mainPage" onClick={this.props.onRouteToMainPage}>Main Page</button>
            <button className='btn btn-primary' id="logout" onClick={() => LoginService.logout()}>Logout</button>
        </Navbar>
    }
}