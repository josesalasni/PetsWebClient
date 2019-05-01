import { notification } from 'antd';

const SucessBar = (Module = null) => {

    var message = "";

    if (Module != null)
        message = "Se ha ingresado la " + Module + " correctamente."
    else 
        message = "Se ha realizado la operación correctamente."

    notification.config({
        placement: 'bottomRight',
        bottom: 50,
        duration: 5,
    });

    notification['success']({
        message: 'Notificación',
        description: message,
    });
};


export default SucessBar;