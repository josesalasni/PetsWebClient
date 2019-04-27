import React from 'react';
import {Form, Input, Button,} from 'antd';
import Axios from 'axios';
 
import AxiosApi from '../Helpers/AxiosApi';
const { TextArea } = Input; 
  
class InsertBoxPetsLost extends React.Component {

    constructor (props){
        super(props);
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
  
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                AxiosApi.post("api/petslost", values ).then( (response) => {
                    console.log(response);
                    this.props.onSubmitClick();
                })
                .catch((error) => {
                    console.log(error);
                });    

            }
        });
    }
  
    render() {
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;
    
        
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item
                    required="true"  
                    >
                    {getFieldDecorator('Description', {
                    rules: [{

                    message: 'Please input your nickname',
                    }],
                    })(
                        <TextArea rows={4} name="Description" />
                    )}
                    
                </Form.Item>
              
                <Form.Item >
                    <Button htmlType="submit" type="primary">Submit</Button>
                </Form.Item>

            
            </Form>
        );
    }
}
  
const InsertFormPetsLost = Form.create({ name: 'insert_box_pets_lost' })(InsertBoxPetsLost);

export default InsertFormPetsLost;