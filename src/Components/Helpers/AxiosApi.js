import { create } from 'axios';

//Set Base Url for api calls


var AxiosApi = create({
    baseURL: 'http://127.0.0.1:5000/'
});

export default AxiosApi;