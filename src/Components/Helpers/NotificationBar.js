import { notification } from 'antd';

const NotificationBar = (Code = null) => {

    var message = "";

    if (Code != null){

        switch(Code) {
            case 404 :
                message = "El contenido seleccionado no se ha encontrado, puede que se haya borrado o no exista.";
                break;
            case 500 :
                message = "El servidor tuvo un problema para realizar la petición, por favor intente nuevamente en otro momento.";
                break;
            case 400 : 
                message = "Hubo un error con los datos que envió, por favor revise que los haya ingresado correctamente";
                break;
            default:
                message = "Hubo un problema para ejecutar la función, el sistema puede que no este disponible en estos momentos.";
        }
    }

    if (Code !== null && Code !== 401)
        notification.config({
            placement: 'bottomRight',
            bottom: 50,
            duration: 5,
        });

        notification["error"]({
            message: 'Error',
            description: message,
        });
    
};


export default NotificationBar;