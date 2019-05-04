import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { Card, Icon, Spin } from 'antd';
import { Redirect } from "react-router-dom";

import './LoginScreen.css';
import logo from '../Assets/logo.png';
import axios from 'axios';

import {MAIN_API_URL} from './Helpers/MainApiUrl';


class LoginScreen extends React.Component {

    state = {
        logged: false,
        loading: false,
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
            
            this.setState({loading : true})

            axios.post(MAIN_API_URL + "/api/externalauth/facebook",  json ).then( (response) => {
                if (response.status === 200) {
                    
                    localStorage.setItem('id', response.data.id );
                    localStorage.setItem('auth_token', response.data.auth_token);
                    localStorage.setItem('expires_in', response.data.expires_in);
                    this.setState({logged : true})
                    this.setState({loading: false})
                 
                }else {
                    this.setState({loading: false})
                    alert("error logeando");
                }
                
            })
            .catch((error) => {
                this.setState({loading: false})
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
        const antIcon = <Icon type="loading" style={{ fontSize: 30, color: 'white' }} spin />

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

                {this.state.loading === true &&
                    <Spin indicator={antIcon} size={"large"} style={{ textAlign: 'center', left: '50%', top: '80%', transform: 'translate(-50%, -10%) ',  position: 'fixed' }} />   
                }
              
               
                
            </div>
        )
    }
}

export default LoginScreen;