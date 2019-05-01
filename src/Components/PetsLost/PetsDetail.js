import React from 'react';
import { Row, Col, Card, Comment, Form, List, Icon, Carousel, Avatar, Input, Button} from 'antd';
import AxiosApi from '../Helpers/AxiosApi';
import NotificationBar from '../Helpers/NotificationBar';
import Moment from 'react-moment';


import {MAIN_API_URL} from '../Helpers/MainApiUrl';

const { Meta } = Card;
const TextArea = Input.TextArea;


class PetsDetail extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            publication : {},
            comments : [],
            pictures : []
        }

        this.carousel = React.createRef();
    }

    handleSubmit = (e) => {
        e.preventDefault();

        var id = this.props.match.params.id;

        this.props.form.validateFields((err, values) => {
            //Get token and set param settings for the api call
            var token = localStorage.getItem('auth_token');

            var config = {
                headers : {
                    "Content-Type": "application/json",
                    "Accept" : "application/json",
                    "Authorization": 'Bearer ' + token                
                }
            }

            AxiosApi.post('api/publication/'+id+'/comment', values, config).then( (Response) => {
                if (Response.status === 200){
                    this.props.form.resetFields();    
                    this.fillComments();
                }
                
            })
            .catch((error) => {
                if (error.response.status != null)
                    NotificationBar(error.response.status);
                else 
                    NotificationBar();
            });    
            

        });
    }

    handleChange = (e) => {
        this.setState({
          value: e.target.value,
        });
    }
    
    componentDidMount() {
        this.props.form.validateFields();
        this.fillData();
    }


    fillComments = () => {

        var id = this.props.match.params.id;
        //Get token and set param settings for the api call
        var token = localStorage.getItem('auth_token');

        var settings = {
            headers : {
                "Content-Type": "application/json",
                "Accept" : "application/json",
                "Authorization": 'Bearer ' + token                
            }
        }

        AxiosApi.get('api/publication/'+id+'/comment',settings).then ( (response ) => {
            if (response.status === 200) {
                this.setState ({comments : response.data })
            }
            else {
                NotificationBar(response.status);
            }
        }).catch ( (error) => {
            NotificationBar(error.response.status);
        });
    }
    
    fillData = () => {
        var id = this.props.match.params.id;

        //Get token and set param settings for the api call
        var token = localStorage.getItem('auth_token');

        var settings = {
            headers : {
                "Content-Type": "application/json",
                "Accept" : "application/json",
                "Authorization": 'Bearer ' + token
                
            }
        }

        //Api call
        AxiosApi.get("api/publication/"+id , settings).then( (response) => {
            if(response.status === 200){
                //Set the data to show
                                       
                if (response.data.pictures.length > 0)
                    this.setState ({pictures : response.data.pictures })

                this.setState ({publication: response.data});

                this.fillComments();
            }
        }).catch ( (error) => {
            NotificationBar (error.response.status);
        });

    }
    
    handleNext = () => {
        this.carousel.next();
    }

    handlePrevious = () => {
        this.carousel.prev();
    }
    
    render() {

        const {
            getFieldDecorator,
        } = this.props.form;
        
        return(
            <div className="containerdetail">
                {this.state.publication !== null &&
                    <Row>
                    
                    <Col span={24} >
                        <div id="cardcontent" >    
                            <Card
                            
                            >

                            {this.state.publication !== null && 
                                <Meta
                                    key={"card-" + this.state.publication.publicationId}
                                    avatar={<Avatar src={this.state.publication.pictureUrl} />}
                                    title={[this.state.publication.firstName, " ", this.state.publication.lastName,  <div key={"div-" + this.state.publication.publicationId } style={{float: 'right'}}> <Moment locale="es" fromNow>{this.state.publication.datePublish}</Moment>  </div>   ] } 
                                    description={this.state.publication.description }     
                                />   
                            }

                            <div style={{marginTop:'24px'}}>  
                                
                                <Carousel ref={node => (this.carousel = node)} autoplay>
                                    {this.state.pictures.map(pet => 
                                    
                                        <div>   
                                            <img alt="imgPublication" src={ MAIN_API_URL + "/images/" + pet.path} />
                                        </div>
                                    )}
                                </Carousel>
                                
                                <div style={{marginTop: '24px', textAlign: 'center'}}>
                                    <Button.Group style={{display : 'inline-block'}} size={"large"}>
                                    <Button onClick={this.handlePrevious} type="primary">
                                        <Icon type="left" />Retroceder
                                    </Button>
                                    <Button onClick={this.handleNext} type="primary">
                                        Siguiente<Icon type="right" />
                                    </Button>
                                    </Button.Group>
                                </div>
                            </div>     
                      
                            </Card>
                        
                        </div>
                    </Col>
                
                    <Col style={{marginTop : '24px'}} span={24} >
                        <div id="cardcomments">
                            <Card
                            
                            >
                            
                            <div className="contentcardcomment">
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Item
                                required="true"  
                                >
                                    {getFieldDecorator('Message', {
                                        rules: [{ required: false, message: 'Escribe el comentario!' }],
                                    })(
                                        <TextArea rows={4} name="Comment" />
                                    )}         
                                </Form.Item>       

                                <Form.Item>
                                <Button
                                    htmlType="submit"
                                    style={{float: 'right'}}
                                    onClick={this.handleSubmit}
                                    type="primary"
                                >
                                    Agregar un comentario
                                </Button>
                                </Form.Item>
                                
                            </Form>
                            
                                
                            </div>

                          

                            <List
                                className="comment-list"
                                //header={`${this.state.publication.comments.length} replies`}
                                itemLayout="horizontal"
                                dataSource={this.state.comments}
                                renderItem={item => (
                                
                                <Comment
                                    key={item.commentId}
                                    author={item.firstName}
                                    avatar={item.pictureUrl}
                                    content={item.message}
                                    datetime={<Moment locale="es" fromNow>{item.dateComment}</Moment>}
                                    /> 
                                )} />
                            </Card>
                        </div>
                    </Col>
                </Row>
                }
                
            </div>
        )
    }
}

const InsertCommentPetsDetail = Form.create({ name: 'insert_comment_pets_detail' })(PetsDetail);
export default InsertCommentPetsDetail;