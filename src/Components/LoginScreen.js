import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { Card } from 'antd';
import { Redirect } from "react-router-dom";

import './LoginScreen.css';
import logo from '../Assets/logo.png';
import axios from 'axios';


class LoginScreen extends React.Component {

    state = {
        logged: false,
    }

    componentDidMount = () => {
        if (localStorage.getItem('auth_token') != null) {
            this.setState ({logged : true});
        } 
    }

    //Send token to the server for register client
    responseFacebook = (response) => {      
        var json = {"AccessToken": response.accessToken} 
    
        if (response != null){
            axios.post("http://127.0.0.1:5000/api/externalauth/facebook",  json ).then( (response) => {
                if (response.status === 200) {
                    
                    localStorage.setItem('id', response.data.id );
                    localStorage.setItem('auth_token', response.data.auth_token);
                    localStorage.setItem('expires_in', response.data.expires_in);
                    this.setState({logged : true})
                 
                }else {
                    alert("error logeando");
                }
                
            })
            .catch((error) => {
                console.log(error);
            });    
    
        }

        

    }

    componentDidUpdate() {
        if (this.state.logged === true) {
            this.setState({
                logged: false
            });
        }

    }  

    render() {
        return (
            <div>
                <div style={{ textAlign: 'center', left: '50%', top: '10%', transform: 'translate(-50%, -10%) ',  position: 'fixed' }}> 
                    <img alt="logo" width="auto" height="140px" style={{margin: '10px' }} src={logo} ></img> 
                </div>

                { this.state.logged === true &&
                    <Redirect to="/user"/>
                }


                <Card title="Inicia sesión para acceder" bordered={false} style={{ textAlign: 'center', left: '50%', top: '50%', transform: 'translate(-50%, -10%) ',  position: 'fixed' }}>
                    
                    <FacebookLogin
                    appId="802990273399180"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={this.responseFacebook} />

                </Card>
          
            </div>
        )
    }
}

export default LoginScreen;