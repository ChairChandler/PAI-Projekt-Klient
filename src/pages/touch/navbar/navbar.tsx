import React from "react";
import Navbar from 'components/navbar/navbar';
import LoginService from 'services/login'

export default class PageNavbar extends React.Component {
    render = () => {
        return <Navbar>
            <button className='btn btn-primary' id="logout" onClick={() => LoginService.logout()}>Logout</button>
        </Navbar>
    }
}