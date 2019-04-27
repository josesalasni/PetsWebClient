import React, { Component } from 'react';
import { Row, Col, Card, Icon, Avatar, Select,  Form, Input, Button, Upload, Modal, BackTop } from 'antd';
import Axios from 'axios';
import InsertBoxPetsLost from './InsertBox';

import AxiosApi from '../Helpers/AxiosApi';
import NotificationBar from '../Helpers/NotificationBar';

import './PetsLost.css';

const { Meta } = Card;
const Option = Select.Option;


class PetsLost extends React.Component {
    
    constructor (props){
        super(props);
        
        //Default values
        this.state = {
            ListPets : [],
            loadMessage : "No hay más publicaciones disponibles",
            loadingBtn: false,
            loadingBtnSearch : false,
            disabledBtn: true,
            Paging : {},
            TypePet : 'Perros',
            TypePub : 'Desaparecido',
            StatusPub : 'Pendiente'
        };
      
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    /* Call initial */
    componentDidMount() {
        this.fillData();
    }

    
    // Initial load of api  
    fillData = () => {
        //Api call
        this.setState ({loadingBtnSearch : true});

        var status = this.state.StatusPub;
        var boolStatus = false;
        if (status === "Pendiente")
            boolStatus = false;
        else 
            boolStatus = true;

        AxiosApi.get("api/publication" , 
            {  params: {
                'typePublication' : this.state.TypePub,
                'status' : boolStatus,
                'categoryName' : this.state.TypePet

            }}).then( (response) => {
            if(response.status == "200"){
                
                var responseData = response.data;

                //var paging = this.state.Paging;
                var paging = JSON.parse(response.headers.pagingheader);

                //Clear list actual and push new elements at the start of array
                this.setState ( {ListPets : [] }, () => {
                    var listPets = this.state.ListPets;

                    responseData.map((Pet)=>{
                        listPets.push(Pet);
                    });

                    this.setState( {ListPets : listPets, loadingBtnSearch: false} );
                });
                
                //Set the paging headers
                this.setState( {Paging : paging}, () => {
                    if (this.state.Paging.nextPage == "Yes") {
                        this.setState ( {disabledBtn : false, loadMessage: 'Hay más publicaciones' } );
                    }
                    else {
                        this.setState ( {loadMessage : "No hay más publicaciones disponibles"} );
                    }
                });
     
            }

		})
		.catch( (error) => {
            this.setState ({loadingBtnSearch : false})

            NotificationBar( error);

            console.log(error);
        });
        
    }

    // Update the paging if the user clicks the button the end of the page 
    updatePaging = () => {
        //Update the scroll infinite        
        if (this.state.Paging.nextPage = "Yes"){

            var status = this.state.StatusPub;
            var boolStatus = false;
            if (status == "Pendiente")
                boolStatus = false;
            else 
                boolStatus = true;

            this.setState({ loadingBtn: true });
            var currentPage = this.state.Paging.currentPage + 1;

            AxiosApi.get("api/publication", {  
                params: {
                    'pageNumber' : currentPage,
                    'typePublication' : this.state.TypePub,
                    'status' : boolStatus,
                    'categoryName' : this.state.TypePet
            }}).then( (response) => {
                if(response.status == "200"){
                    var responseData = response.data;
                    console.log(response);

                    //var paging = this.state.Paging;
                    var paging = JSON.parse(response.headers.pagingheader);
                    
                    var listPets = this.state.ListPets;

                    //Map to the list
                    responseData.map((Pet)=>{
                        listPets.push(Pet);
                    });
                    
                    //Set the new list
                    this.setState( {ListPets: listPets, loadingBtn : false} );

                    //Set the paging headers
                    this.setState( {Paging : paging}, () => {
                        console.log(this.state.Paging);
                        if (this.state.Paging.nextPage == "Yes") {
                            this.setState ( {disabledBtn : false, loadMessage: "Hay más publicaciones" } );
                        }else {
                            this.setState ( {disabledBtn : true, loadMessage : 'No hay más publicaciones disponibles'} );
                        }
                    });
                }
    
            })
            .catch( (error) => {
                alert(error);
            });            
        }
        else {
            console.log("This is the last page");
        }

    }

    // Handle clicks 

    loadBtn = () => {        
        this.updatePaging();
    }

    searchBtn = () => {
        this.fillData();
    }

    handleTypePetChange = (value) => {
        this.setState ( {TypePet : value} )
    }

    handleStatePubChange = (value) => {
        this.setState ( {StatusPub : value })
    }

    handleTypePubChange = (value) => {
        this.setState ( {TypePub : value })
    }
      

    render() {
        return (
            <div id="PetsLostPage" style={{marginLeft: '50px', marginRight: '50px'}}>
                <Row>
                    {/* Add box  */}
                    <Col lg={14} span={24} >
                        <div id="cardtitle" >
                        
                            <Card
                            type="inner"
                            title="Agregar una publicación"
                            extra={<Icon type="message" />}
                            >
                                <InsertBoxPetsLost onSubmitClick={this.fillData} />
                          
                            </Card>
                        
                        </div>

                    </Col>
                    {/*  Search Box  */ }
                    <Col lg={10} span={24}>
                        <div id="searching" style={{ marginLeft: '66px', background: 'white'}} >
                            <Card
                            type="inner"
                            title="Filtro de búsqueda"
                            >
                                <Row>
                                    <Col span={24}>
                                    <Col span={12} >
                                        Tipo de mascota
                                    </Col>
                                    <Col span={12}>
                                        <Select size="small" style={{float: 'right'}} defaultValue="Perros" onChange={this.handleTypePetChange}>
                                            <Option value="Perros">Perros</Option>
                                            <Option value="Gatos">Gatos</Option>
                                            <Option value="Caballos" >Caballos</Option>
                                        </Select>
                                    </Col>
                                    </Col>

                                    <Col style={{marginTop: '30px'}} span={12} >
                                        Tipo de Publicación
                                    </Col>
                                    <Col style={{float: 'right', marginTop: '30px'}} span={12}>
                                        <Select style={{float: 'right'}} size="small" defaultValue="Desaparecido" onChange={this.handleTypePubChange}>
                                            <Option value="Desaparecido">Desaparecidos</Option>
                                            <Option value="Donaciones">Donaciones</Option>
                                        </Select>
                                    </Col>

                                    <Col style={{marginTop: '30px'}} span={12} >
                                        Estado 
                                    </Col>
                                    <Col style={{marginTop: '30px'}} span={12}>
                                        <Select style={{float: 'right'}} size="small" defaultValue="Pendiente" onChange={this.handleStatePubChange}>
                                            <Option value="Completado">Completado</Option>
                                            <Option value="Pendiente">Pendiente</Option>
                                        </Select>
                                    </Col>

                                    <Col style={{textAlign: 'center', marginTop:'15px' }} span={24}>
                                        <Button type="primary" loading={this.state.loadingBtnSearch} onClick={this.searchBtn}>
                                            Buscar
                                        </Button>  
                                    </Col>

                                </Row>

                            </Card>
                        </div>

                    </Col>

                    {/* Main Content where render cards */}
                    <Col lg={14} span={24}>    
                        <div id="cardsPetsLost">

                            {this.state.ListPets.map(pet =>
                                
                                <Card 
                                style={{marginTop: '30px'}}  key={pet.publicationId}
                                actions={[<Icon type="environment" />, <Icon type="message" />, <Icon type="share-alt" />]}>
                                    <Meta
                                        key={"card-" + pet.publicationId}
                                        avatar={<Avatar src={pet.pictureUrl} />}
                                        title={[pet.firstName, " ", pet.lastName,  <div key={"div-" + pet.publicationId } style={{float: 'right'}}> {pet.datePublish} </div>   ] } 
                                        description={pet.description } 
                                        
                                    />
                                    <img style={{width: '100%', marginTop: '30px' }} alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
                                </Card>
                                
                            )} 
                        </div>
                        
                        {/* Paging card */}
                        <div style={{marginTop: '30px'}} id="cardEnd">
                        <Card
                        >
                            <div>
                                {this.state.loadMessage} 
                                <Button style={{float : 'right'}} disabled={this.state.disabledBtn} size="small" type="primary" loading={this.state.loadingBtn} onClick={this.loadBtn}>
                                    Cargar
                                </Button>  
                            </div>
                        </Card>

                       </div>
                        
                    </Col>

                    

                    <BackTop/>

                </Row>          
            </div>
        )
    }
}

export default PetsLost;