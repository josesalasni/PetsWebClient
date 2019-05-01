import React from 'react';
import { Modal } from 'antd';
import { Redirect } from "react-router-dom";

class AccountControl extends React.Component {

    constructor (props){
        super(props);
        this.state = { redirection : false };
    }
    

    componentDidMount = () => {
        //Clear in case of expired token or edited
        if (localStorage.getItem('auth_token') != null) {
            localStorage.clear();
        } 

        this.info() ;
    }

    //Alert info to the user
    info = () => {
        Modal.info  ( {
            title: 'Información',
            content: (
                <div>
                <p>Hubo un error con la sesion de su cuenta, será redirigido a la pantalla de iniciar sesión nuevamente.</p>
                </div>
            ),
            onOk() { alert("hola") }
        });
    }

    test = () => {
        this.setState({redirection : true})
    }

    //Stop loop 
    componentDidUpdate() {
        if (this.state.redirection === true) {
            this.setState({
                redirection: false
            });
        }

    }  

    render () {
        return(
            <div>
                { this.state.redirection === true &&
                    <Redirect to="/"/>
                }
            </div>
        )
    }
}

export default AccountControl;