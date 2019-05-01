import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Route, Link, Redirect } from "react-router-dom";
import './Dashboard.css';
import logo from '../Assets/logo.png';

import PetsLost from './PetsLost/PetsLost';
import InsertCommentPetsDetail from './PetsLost/PetsDetail';
import {MapsAll} from './Maps/MapsAll';

const {
    Header, Content, Footer, Sider,
} = Layout;

class Dashboard extends React.Component {
    state = {
        current: 'mail',
        collapsed: false,
        paddingContent : '216px',
        mobile : false
    }

    //Only collapse on mobile
    toggle = () => {
        //this.props.history.push('/dashboard')

        if (this.state.mobile === true){
            
            this.setState({
                collapsed: !this.state.collapsed,
            });
        }
    }


    handleClick = (e) => {
        this.setState({
            current: e.key,
        });

    }

    //When the sider is in mobiles hide it , and show it in pc
    handleBreakPoint = (broken) => {
        if (broken === true){
            if (this.state.collapsed === false) {
                this.setState ({
                    collapsed : true
                })
            }
            this.setState ({
                mobile : true
            })
        }
        else {
            //Show the sider if pass from mobile view to pc
            if (this.state.collapsed === true) {
                this.setState ({
                    collapsed : false
                })
            }
            

            this.setState ({
                mobile : false
            })
        }
    }

    handleLogout = () => {
        
        //Remove token and link to login screen
        localStorage.clear();

        this.props.history.push('/');
        
    }

    render() {
        return (
            <Layout>
                <Layout>   
                    {/*  Menu Sider  */}
                    <Sider
                        breakpoint="lg"
                        collapsedWidth="0"
                        trigger={null}
                        onBreakpoint={(broken) => { this.handleBreakPoint(broken) }}
                        theme="dark"
                        width="200"
                        collapsed={this.state.collapsed}
                        style={{
                            overflow: 'auto', height: '100vh', zIndex: '4', position: 'fixed', top: '64px',  left: 0
                        }}
                    >
                        <div style={{height: 'auto', padding:'4px', background: '#388e3c', textAlign: 'center'}} className="logo" > 
                            <img alt="logo" width="auto" height="110px" style={{margin: '10px' }} src={logo} ></img>
                            <h1 style={{fontSize: '1.7em', color: 'white'  }}> Pets Nicaragua</h1>
                        </div>

                        {/* Menu Items */}
                        <Menu theme="dark" style={{marginTop: '24px'}} mode="inline" defaultSelectedKeys={['1']}>
                            
                            
                            <Menu.Item key="1">
                                <Icon type="exclamation" />
                                <span className="nav-text">Publicaciones</span>
                                <Link to="/user/publicaciones">Publicaciones</Link>
                            </Menu.Item>
                                
                            <Menu.Item key="2">
                                <Icon type="smile" />
                                <span className="nav-text">Mapa</span>
                                <Link to="/user/map">Mapa</Link>
                            </Menu.Item>
                            
                            {this.props.location.pathname === '/user' &&
                                <h2>
                                    <Redirect to="/user/publicaciones"/>
                                </h2>
                            }
        
                        </Menu>
                    </Sider>
                    {/* Main Layout */}
                    <Layout id="mainlayout" >
                        <Header id="header" style={{ zIndex: '4',  background: '#66BB6A', padding: 0 , width: '100%', lineHeight: 0, position: 'fixed' }}>

                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['1']}
                            style={{ lineHeight: '64px', background: '#66BB6A' }}
                        >
                            <Menu.Item id="logoName" style={{ fontSize: '1.2em',  width: '200px'}} onClick={this.toggle} key="1">
                           
                                    <Icon
                                        className="trigger"
                                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                    />
                                Pepega clap
                            </Menu.Item> 
                            
                            <Menu.Item onClick={this.handleLogout} style={{ fontSize: '1.2em',  float: 'right'}} key="2">
                                <Icon type="user" />
                                Cerrar sesion
                            </Menu.Item>
                        </Menu>
                        
                        
                        </Header>
                        
                        {/* Main Content where render sub components */}
                        <Content id="mainContent" style={{marginLeft: '200px', marginTop: '116px', marginRight: '16px' }}>
                            <div  style={{ minHeight: 760 }}>

                                <Route exact path="/user/publicaciones" component={PetsLost} />
                                <Route path="/user/map" component={MapsAll} />
                                <Route exact path="/user/publicaciones/:id/detalle/" component={InsertCommentPetsDetail} />
                            </div>
                        </Content>
                        
                        <Footer style={{ textAlign: 'center' }}>
                            Ant Design ©2018 Created by Ant UED
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

export default Dashboard;
