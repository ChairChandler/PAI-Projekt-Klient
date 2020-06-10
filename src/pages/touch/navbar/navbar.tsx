import React from "react";
import server_info from 'config/server.json';
import Navbar from 'components/navbar/navbar';

interface Props {
    onLogout: () => void
    onRouteToPrevPage: () => void
}

export default class PageNavbar extends React.Component<Props, {}> {
    private onLogoutButtonClicked = async () => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/user/login`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (!data.ok) {
                throw Error(await data.text())
            }

            this.props.onLogout()
        } catch (err) {
            alert(err.responseText)
        }
    }

    render = () => {
        return <Navbar>
            <button className='btn btn-primary' id="mainPage" onClick={this.props.onRouteToPrevPage}>Back</button>
            <button className='btn btn-primary' id="logout" onClick={this.onLogoutButtonClicked}>Logout</button>
        </Navbar>
    }
}