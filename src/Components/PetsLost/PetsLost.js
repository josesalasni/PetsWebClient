import React from 'react';
import { Row, Col, Card, Icon, Avatar, Select, Button, BackTop} from 'antd';
import InsertBoxPetsLost from './InsertBox';
import Moment from 'react-moment';

import AxiosApi from '../Helpers/AxiosApi';
import NotificationBar from '../Helpers/NotificationBar';
import AccountControl from '../Helpers/AccountControl';

import {MAIN_API_URL} from '../Helpers/MainApiUrl';


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
            TypePet : '',
            TypePub : '',
            StatusPub : 'Pendiente',
            logged : true,
            compressed : true
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

        //Set bolean status 
        var status = this.state.StatusPub;
        var boolStatus = false;
        if (status === "Pendiente")
            boolStatus = false;
        else 
            boolStatus = true;

        //Get token and set param settings for the api call
        var token = localStorage.getItem('auth_token');
    
        var settings = {
            params: {
                'typePublication' : this.state.TypePub,
                'status' : boolStatus,
                'categoryName' : this.state.TypePet

            }, headers : {
                "Content-Type": "application/json",
                "Accept" : "application/json",
                "Authorization": 'Bearer ' + token
            }
        }

        //Api call
        AxiosApi.get("api/publication" , settings).then( (response) => {

            if(response.status === 200){
                
                var responseData = response.data;

                //var paging = this.state.Paging;
                var paging = JSON.parse(response.headers.pagingheader);

                //Clear list actual and push new elements at the start of array
                this.setState ( {ListPets : [] }, () => {
                    var listPets = this.state.ListPets;

                    responseData.forEach((Pet)=>{
                        listPets.push(Pet);
                    });

                    this.setState( {ListPets : listPets, loadingBtnSearch: false} );
                });
                
                //Set the paging headers
                this.setState( {Paging : paging}, () => {
                    if (this.state.Paging.nextPage === "Yes") {
                        this.setState ( {disabledBtn : false, loadMessage: 'Hay más publicaciones' } );
                    }
                    else {
                        this.setState ( {disabledBtn : true , loadMessage : "No hay más publicaciones disponibles"} );
                    }
                });
     
            }
            //Handle errors
            else {
                NotificationBar( response.status );
            }

		})
		.catch( (error) => {
            this.setState ({loadingBtnSearch : false})
            NotificationBar( );

            if (error.response.status === 401){
                this.setState({logged : false})
            }
        });
        
    }

    // Update the paging if the user clicks the button the end of the page 
    updatePaging = () => {
        //Update the scroll infinite        
        if (this.state.Paging.nextPage === "Yes"){

            var status = this.state.StatusPub;
            var boolStatus = false;
            if (status === "Pendiente")
                boolStatus = false;
            else 
                boolStatus = true;

            //Get settings and token
            this.setState({ loadingBtn: true });
            var currentPage = this.state.Paging.currentPage + 1;
            var token = localStorage.getItem('auth_token');

            var settings = {
                params: {
                    'pageNumber' : currentPage,
                    'typePublication' : this.state.TypePub,
                    'status' : boolStatus,
                    'categoryName' : this.state.TypePet
                }, headers : {
                    "Content-Type": "application/json",
                    "Accept" : "application/json",
                    "Authorization": 'Bearer ' + token
                }
            }

            //Call Api
            AxiosApi.get("api/publication", settings ).then( (response) => {
                if(response.status === 200){
                    var responseData = response.data;

                    //var paging = this.state.Paging;
                    var paging = JSON.parse(response.headers.pagingheader);
                    
                    var listPets = this.state.ListPets;

                    //Map to the list
                    responseData.forEach((Pet) => {
                        listPets.push(Pet);
                    });
                    
                    //Set the new list
                    this.setState( {ListPets: listPets, loadingBtn : false} );

                    //Set the paging headers
                    this.setState( {Paging : paging}, () => {
                        console.log(this.state.Paging);
                        if (this.state.Paging.nextPage === "Yes") {
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

    handleClickPublication = (id) => {
        this.props.history.push('publicaciones/'+id+'/detalle');
    }

    compressBtn = () => {
        
        if (this.state.compressed === true){
            this.setState ( {compressed : false})
        }else {
            this.setState ({ compressed : true});
        }

    }

    //Stop loop 
    componentDidUpdate() {
        if (this.state.logged === false) {
            this.setState({
                logged : true
            });
        }
    }  
      

    render() {
        return (
            <div className="container" id="PetsLostPage" >
                <Row>

                    { this.state.logged === false &&
                        <AccountControl/>
                    }

                    {/* Add box  */}
                    <Col lg={14} span={24} >
                        <div id="cardtitle" >
                            
                            <Card
                            type="inner"
                            title="Agregar una publicación"
                            extra={ 
                                <Button onClick={this.compressBtn} type="primary" >
                                    <div> <Icon style={{marginRight: '5px'}} type="message"/> 
                                    { this.state.compressed === false &&
                                        <div style={{display: 'inline'}}>Ocultar</div>
                                    }
                                    { this.state.compressed === true &&
                                        <div style={{display: 'inline'}}>Mostrar</div>
                                    }

                                    </div>
                                </Button>   
                            }
                            >
                                <div style={{height: '30px'}}>
                                    <InsertBoxPetsLost compress={this.state.compressed} onSubmitClick={this.fillData} />
                                </div>
                               
                          
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
                                        <Select size="small" style={{float: 'right'}} defaultValue="Todos" onChange={this.handleTypePetChange}>
                                            <Option value="">Todos</Option>
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
                                        <Select style={{float: 'right'}} size="small" defaultValue="Ambos" onChange={this.handleTypePubChange}>
                                            <Option value="">Ambos</Option>
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
                    <Col id="cardscol" lg={14} span={24}>    
                        <div id="cardsPetsLost">

                            {this.state.ListPets.map(pet =>
                                
                                <Card 
                                style={{marginTop: '30px'}}  key={pet.publicationId}
                                actions={[<Icon type="environment" />, <Icon onClick={() => this.handleClickPublication(pet.publicationId)} type="message" />, <Icon type="share-alt" />]}>
                                    <Meta
                                        key={"card-" + pet.publicationId}
                                        avatar={<Avatar src={pet.pictureUrl} />}
                                        title={[pet.firstName, " ", pet.lastName,  <div key={"div-" + pet.publicationId } style={{float: 'right'}}>  <Moment locale="es" fromNow>{pet.datePublish}</Moment> </div>   ] } 
                                        description={pet.description } 
                                        
                                    />

                                    { pet.path !== null &&
                                        <img onClick={() => this.handleClickPublication(pet.publicationId)} style={{width: '100%', marginTop: '30px' }}  alt="img-publication" src={ MAIN_API_URL +"/images/"+pet.path} />
                                    }
                                    
                                    
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