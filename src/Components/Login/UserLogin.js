import { Modal, Form, Icon, Input, Button, Checkbox, } from 'antd';
import React, { Component } from 'react';
import Axios from 'axios';

class UserLogin extends React.Component {
    state = { visible: false }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
        /*      
		Axios.get("http://127.0.0.1:5000/api/petslost/pet1").then(function (response) {
            console.log(response);
		})
		.catch(function (error) {
			alert(error);
        });
        */
        }})}
    
		
		/*
                Axios.post("https://localhost:5001/api/account/login", values  ).then(function (response) {
                    console.log(response);
                    localStorage.setItem('auth_token', response.data.auth_token);
                })
                .catch(function (error) {
                    console.log(error);
                });
		
            }
            */
       // });
    //}

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Open Modal
                </Button>
                <Modal
                    title="User Login"
                    visible={this.state.visible}
                    onOk={this.handleSubmit} 
                    onCancel={this.handleCancel}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        
                        <Form.Item>
                        {getFieldDecorator('Email' , {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                        </Form.Item>
                        
                        <Form.Item>
                        {getFieldDecorator('PasswordHash', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                        </Form.Item>
                        <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}
                        
                        
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

const ViewUserLogin = Form.create({ name: 'normal_login' })(UserLogin);

export default ViewUserLogin;