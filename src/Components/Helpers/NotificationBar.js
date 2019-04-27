import { notification } from 'antd';




const NotificationBar = (Code = null) => {

    var message = "";

    if (Code != null){

        switch(Code) {
            case "404" :
                message = "El contenido seleccionado no se ha encontrado, puede que se haya borrado o no exista.";
                break;
            case "401" : 
                message = "Hubo un error con la sesion de su cuenta, será redirigido a la pantalla de iniciar sesión nuevamente.";
                break;
            case "500" :
                message = "El servidor tuvo un problema para realizar la petición, por favor intente nuevamente en otro momento.";
                break;
            default:
                message = "Hubo un problema para ejecutar la función, el sistema puede que no este disponible en estos momentos.";
        }
    }

    notification.config({
        placement: 'bottomRight',
        bottom: 50,
        duration: 3,
    });

    notification["error"]({
        message: 'Error',
        description: message,
    });
};


export default NotificationBar;