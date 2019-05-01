import { create } from 'axios';

import {MAIN_API_URL} from './MainApiUrl';
//Set Base Url for api calls

var AxiosApi = create({
    baseURL: MAIN_API_URL
});

export default AxiosApi;