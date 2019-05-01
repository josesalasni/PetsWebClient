import React from 'react';
import {Form, Spin, Input, Button, Select, Row, Col, Upload, Icon, Modal} from 'antd';
 
import AxiosApi from '../Helpers/AxiosApi';
import NotificationBar from '../Helpers/NotificationBar';
import SucessBar from '../Helpers/SucessBar';

const { TextArea } = Input; 
const {Option} =  Select;
  
class InsertBoxPetsLost extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            sending : false
        };
    }
   

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
  
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({sending : true});

                var token = localStorage.getItem('auth_token');

                var config = {
                    headers : {
                        "Content-Type": "application/json",
                        "Accept" : "application/json",
                        "Authorization": 'Bearer ' + token
                    }
                }

                AxiosApi.post("api/publication", values , config).then( (Response) => {

                    if (Response.status === 200){

                        //Pass the publication now created
                        if (this.state.fileList.length > 0 ){
                            this.handleSubmitPhoto(Response.data);
                        }
                        
                        //If the user not upload photos
                        else {
                            this.props.form.resetFields();      
                            SucessBar("publicación");
                            this.props.onSubmitClick();
                            this.setState({fileList: []})
                        }

                    }
                    else{
                        NotificationBar(Response.status);
                    }

                })
                .catch((error) => {
                    if (error.response.status != null)
                        NotificationBar(error.response.status);
                    else 
                        NotificationBar();
                });    
                
                this.setState({sending : false});
            }
        });
    }

    //Uploader controls
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    
    handleChange = ({ fileList }) => {  this.setState({ fileList }) }
    
    handleCancel = () => this.setState({ previewVisible: false })

    //Upload photos to the server
    handleSubmitPhoto = (id) => {
        var token = localStorage.getItem('auth_token');

        var config = {
            headers : {
                "Content-Type" : "multipart/form-data",
                "Accept" : "application/json",
                "Authorization": 'Bearer ' + token
            }
        }

        let formData = new FormData();
        // add one or more of your files in FormData
        // again, the original file is located at the `originFileObj` key

        this.state.fileList.forEach ( element => {
            formData.append("files", element.originFileObj);
        });

        //Send photos
        AxiosApi.post ("api/publication/"+id+"/picture", formData, config).then ( (response) =>{
            if (response.status === 200) {
                this.props.form.resetFields();
                SucessBar("publicación");
                this.props.onSubmitClick();
                this.setState({fileList: []})
            }
            else {
                NotificationBar(response.status);
            }
        })
        .catch((error) => {
            NotificationBar(error.response.status);
        }); 

    };


    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={24} >
                        <Form.Item
                            style={{width: '95%' , left: '50%', transform: 'translateX(-50%)'}}
                            required="true"  
                        >
                            {getFieldDecorator('Description', {
                                rules: [{ required: false, message: 'Escribe el contenido!' }],
                            })(
                                <TextArea rows={4} name="Description" />
                            )}         
                    </Form.Item>
                    </Col>
                    
                    { this.props.compress === false &&
                            <div id="compressElements">
                            <Col lg={12} span={24}>
                                <Form.Item
                                    required="true"
                                    label="Tipo de mascota"
                                    style={ { width: '90%', left: '50%', transform: 'translateX(-50%)'  }}
                                >
                                    {getFieldDecorator('Category', {
                                        rules: [{ required: false, message: 'Escribe el contenido!' }],
                                        })(
                                            <Select >
                                                <Option value="Perros">Perros</Option>
                                                <Option value="Gatos">Gatos</Option>
                                                <Option value="Caballos">Caballos</Option>
                                            </Select>
                                        )}
                                        
                                </Form.Item>
    
                            </Col>
    
                            <Col lg={12} span={24}>
                                <Form.Item
                                required="true"
                                label="Tipo de Publicación"
                                style={ { width: '90%',  left: '50%', transform: 'translateX(-50%)' }}
                                >
                                    {getFieldDecorator('TypePublication', {
                                        rules: [{ required: false, message: 'Escribe el contenido!' }],
                                            })(
                                                <Select>
                                                    <Option value="Desaparecido">Desaparecidos</Option>
                                                    <Option value="Donación">Donación</Option>
                                                </Select>
                                            )}
                                    
                            </Form.Item>
    
                            </Col>
    
                            <Col span={24}>
                                <Form.Item
                                    required="false"
                                    label="Fotografías"
                                    style={ { width: '95%',  left: '50%', transform: 'translateX(-50%)' }}
                                >
                                    {getFieldDecorator('Pictures', {
                                        rules: [{ required: false, message: 'Escribe el contenido!' }],
                                        })(
                                            <div className="clearfix">
                                                <Upload
                                                beforeUpload={() => false}
                                                listType="picture-card"
                                                fileList={fileList}
                                                onPreview={this.handlePreview}
                                                onChange={this.handleChange}
                                                >
                                                {fileList.length >= 3 ? null : uploadButton}
                                                </Upload>
                                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                                </Modal>
                                            </div>
                                        )}  
                                </Form.Item>
                            </Col>
    
                            <Col span={12}>
                                <Form.Item style={ { width: '95%',  left: '50%', transform: 'translateX(-50%)' }} >
                                    <Button htmlType="submit" type="primary">Submit</Button>
                                </Form.Item>
                            </Col>
                            
                            { this.state.sending === true &&
                                <Col span={12}>
                                    <Spin style={ { width: '95%',  left: '50%', transform: 'translateX(-50%)' }} />
                                </Col>
                            }
                        </div>
 
                    }

                </Row>
            </Form>
        );
    }
}
  
const InsertFormPetsLost = Form.create({ name: 'insert_box_pets_lost' })(InsertBoxPetsLost);

export default InsertFormPetsLost;